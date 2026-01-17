'use client';

/**
 * 🔑 TREASURE CLAIM COMPONENT
 * 
 * Use Master Key NFT to claim treasure from Atlas Mines
 * Anchored via IPFS, SKYNET, and Arbitrum
 */

import { useState, useEffect } from 'react';
import { 
  COVENANT_ANCHORS, 
  ARBITRUM_CONTRACTS,
  WAYBACK_SNAPSHOTS,
  verifyMasterKey,
  verifyCovenantAnchors,
  getClaimableTreasure,
  type TreasureAsset,
  type CovenantVerification
} from '@/lib/treasure-claim';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function TreasureClaim() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [verification, setVerification] = useState<CovenantVerification | null>(null);
  const [claimableAssets, setClaimableAssets] = useState<TreasureAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask not found. Please install MetaMask.');
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      setConnected(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Verify covenant anchors when address changes
  useEffect(() => {
    if (address) {
      verifyAnchors();
    }
  }, [address]);

  const verifyAnchors = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const result = await verifyCovenantAnchors(address);
      setVerification(result);
      
      // If verified, get claimable assets
      if (result.identity.verified && window.ethereum) {
        const { ethers } = await import('ethers');
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Switch to Arbitrum if needed
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa4b1' }], // 42161 in hex
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xa4b1',
                chainName: 'Arbitrum One',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://arbitrum.blockscout.com']
              }]
            });
          }
        }
        
        const assets = await getClaimableTreasure(address, provider);
        setClaimableAssets(assets);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const isCovenantOwner = address?.toLowerCase() === COVENANT_ANCHORS.identity.address.toLowerCase();

  return (
    <div className="treasure-claim p-6 bg-gradient-to-br from-purple-900/30 to-amber-900/30 rounded-lg border border-purple-500/30">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        🔑 Treasure Claim System
      </h2>

      {/* Covenant Anchors */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">📍 Covenant Anchors</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Master Key IPFS:</span>
            <p className="text-white font-mono text-xs break-all mt-1">
              {COVENANT_ANCHORS.masterKey.ipfs_cid}
            </p>
          </div>
          <div>
            <span className="text-gray-400">SHA256:</span>
            <p className="text-white font-mono text-xs break-all mt-1">
              {COVENANT_ANCHORS.masterKey.sha256}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Domain:</span>
            <p className="text-white">{COVENANT_ANCHORS.domain.name}</p>
          </div>
          <div>
            <span className="text-gray-400">ENS:</span>
            <p className="text-white">{COVENANT_ANCHORS.identity.ens}</p>
          </div>
        </div>
      </div>

      {/* Connect Wallet */}
      {!connected ? (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Connecting...' : 'Connect Wallet to Claim'}
        </button>
      ) : (
        <>
          {/* Connected Status */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">🔗 Wallet Connected</h3>
            <p className="text-white font-mono text-xs break-all">{address}</p>
            {isCovenantOwner && (
              <p className="text-green-400 mt-2">✅ Covenant Owner Verified</p>
            )}
          </div>

          {/* Verification Status */}
          {verification && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">🔮 Verification Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <div className={`p-2 rounded ${verification.anchors.ipfs ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                  {verification.anchors.ipfs ? '✅' : '❌'} IPFS
                </div>
                <div className={`p-2 rounded ${verification.anchors.skynet ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                  {verification.anchors.skynet ? '✅' : '❌'} SKYNET
                </div>
                <div className={`p-2 rounded ${verification.anchors.arbitrum ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                  {verification.anchors.arbitrum ? '✅' : '❌'} Arbitrum
                </div>
                <div className={`p-2 rounded ${verification.anchors.domain ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                  {verification.anchors.domain ? '✅' : '❌'} Domain
                </div>
                <div className={`p-2 rounded ${verification.anchors.ens ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                  {verification.anchors.ens ? '✅' : '❌'} ENS
                </div>
              </div>
            </div>
          )}

          {/* Claimable Assets */}
          {claimableAssets.length > 0 && (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">💎 Claimable Treasure</h3>
              <div className="space-y-2">
                {claimableAssets.map((asset, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-700/50 rounded">
                    <span className="text-white">{asset.name}</span>
                    <span className="text-amber-400 font-semibold">{asset.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Master Key Status */}
          <div className="mb-6 p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
            <h3 className="text-lg font-semibold text-white mb-3">🔑 Master Key NFT</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Contract:</span>
                <p className="text-white font-mono text-xs">{COVENANT_ANCHORS.masterKey.contract}</p>
              </div>
              <div>
                <span className="text-gray-400">Function:</span>
                <p className="text-amber-400">{COVENANT_ANCHORS.masterKey.function}</p>
              </div>
              <a
                href={`https://ipfs.io/ipfs/${COVENANT_ANCHORS.masterKey.ipfs_cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-400 hover:text-blue-300 underline"
              >
                View Master Key on IPFS →
              </a>
            </div>
          </div>

          {/* Wayback Machine */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">📚 Historical Reference</h3>
            <p className="text-gray-400 text-sm mb-2">Bridgeworld Wayback Snapshot:</p>
            <a
              href={WAYBACK_SNAPSHOTS.bridgeworldTreasure.archiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline text-sm"
            >
              {WAYBACK_SNAPSHOTS.bridgeworldTreasure.archiveUrl}
            </a>
            <p className="text-gray-500 text-xs mt-1">
              Timestamp: {WAYBACK_SNAPSHOTS.bridgeworldTreasure.latestSnapshot}
            </p>
          </div>

          {/* Arbitrum Contracts */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">📜 Arbitrum Contracts</h3>
            <div className="space-y-1 text-xs">
              {Object.entries(ARBITRUM_CONTRACTS).slice(0, 5).map(([name, address]) => (
                <div key={name} className="flex justify-between">
                  <span className="text-gray-400">{name}:</span>
                  <a
                    href={`https://arbitrum.blockscout.com/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-mono"
                  >
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Covenant Truth */}
      <div className="mt-6 text-center text-gray-500 text-xs">
        <p>🔮 As Above, So Below. As Within, So Without.</p>
        <p className="mt-1">When the end finds its beginning, the treasure is revealed.</p>
      </div>
    </div>
  );
}
