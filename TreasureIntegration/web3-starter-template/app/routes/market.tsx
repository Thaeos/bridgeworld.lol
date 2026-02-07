import { ConnectKitButton } from 'connectkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { formatEther, parseEther, type Address } from 'viem';
import { useState, useEffect } from 'react';
import {
  TREASURE_MARKETPLACE_ADDRESS,
  TREASURE_MARKETPLACE_ABI,
  MAGIC_ADDRESS,
  ERC20_ABI,
  type BuyItemParams,
} from '~/lib/marketplace';
import { isBraveWallet } from '~/lib/wagmi';
import {
  onDiamondActivation,
  detectBraveWallet,
  getDiamondAddress,
  isDiamondDeployed,
  HIVE_ADDRESS,
  DIAMOND_ADDRESSES,
  LUCY_GATEWAY,
  IPFS_GLYPHS,
} from '~/lib/diamond-activation';
import {
  activateThroughCIDs,
  getGlyphString,
  emitActivationEvent,
  GLYPHS,
  type ActivationState,
} from '~/lib/cid-activation';

export default function Market() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [nftAddress, setNftAddress] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const [diamondActivated, setDiamondActivated] = useState(false);
  const [activationStatus, setActivationStatus] = useState<string>('');
  const [cidState, setCidState] = useState<ActivationState | null>(null);
  
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Diamond activation on wallet connect
  useEffect(() => {
    if (isConnected && address && !diamondActivated) {
      const activate = async () => {
        try {
          setActivationStatus('Checking wallet authorization...');
          
          // Trigger Diamond activation
          await onDiamondActivation(address, chainId);
          
          const isBrave = detectBraveWallet();
          const diamondAddr = getDiamondAddress(chainId);
          const deployed = isDiamondDeployed(chainId);
          
          // Activate through CID hashes via Lucy IPFS gateway
          setActivationStatus('Verifying CID hashes...');
          const state = await activateThroughCIDs(address, LUCY_GATEWAY.ipfs);
          setCidState(state);
          
          // Emit activation event for Diamond proc
          emitActivationEvent(address);
          
          setActivationStatus(
            `Diamond ${state.activated ? 'ACTIVE' : (deployed ? 'ready' : 'pending')} | ` +
            `${isBrave ? 'Brave Wallet' : 'Web3 Wallet'} | ` +
            `Chain: ${chainId}`
          );
          
          setDiamondActivated(true);
          
          console.log('[Market] Diamond activation complete:', {
            address,
            chainId,
            isBrave,
            diamondAddr,
            deployed,
            hive: HIVE_ADDRESS,
            cidState: state,
          });
        } catch (err) {
          console.error('[Market] Diamond activation error:', err);
          setActivationStatus('Activation error');
        }
      };
      
      activate();
    }
  }, [isConnected, address, chainId, diamondActivated]);

  // Read listing data
  const { data: listing } = useReadContract({
    address: TREASURE_MARKETPLACE_ADDRESS,
    abi: TREASURE_MARKETPLACE_ABI,
    functionName: 'listings',
    args: nftAddress && tokenId && ownerAddress 
      ? [nftAddress as Address, BigInt(tokenId), ownerAddress as Address] 
      : undefined,
    query: { enabled: !!(nftAddress && tokenId && ownerAddress) },
  });

  // Read MAGIC balance
  const { data: magicBalance } = useReadContract({
    address: MAGIC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const handleBuyItem = async () => {
    if (!nftAddress || !tokenId || !ownerAddress || !listing) return;
    
    const buyParams: BuyItemParams[] = [{
      nftAddress: nftAddress as Address,
      tokenId: BigInt(tokenId),
      owner: ownerAddress as Address,
      quantity: listing[0], // quantity from listing
      maxPricePerItem: listing[1], // pricePerItem from listing
      paymentToken: MAGIC_ADDRESS,
      usingEth: false,
    }];

    writeContract({
      address: TREASURE_MARKETPLACE_ADDRESS,
      abi: TREASURE_MARKETPLACE_ABI,
      functionName: 'buyItems',
      args: [buyParams],
    });
  };

  const handleApproveMagic = async () => {
    writeContract({
      address: MAGIC_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [TREASURE_MARKETPLACE_ADDRESS, parseEther('1000000')], // Approve 1M MAGIC
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black text-white">
      <header className="border-b border-purple-500/20 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Bridgeworld Market
          </h1>
          <div className="flex items-center gap-4">
            {isBraveWallet() && (
              <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
                Brave Wallet Detected
              </span>
            )}
            {diamondActivated && (
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                <span className="font-mono">{IPFS_GLYPHS[419]}</span> Diamond Active
              </span>
            )}
            <ConnectKitButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">Connect with Brave Wallet or any Web3 wallet to access the marketplace</p>
            <ConnectKitButton />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Wallet Info */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold mb-4">Wallet Info</h2>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">Address:</span> {address?.slice(0, 6)}...{address?.slice(-4)}</p>
                <p><span className="text-gray-400">MAGIC Balance:</span> {magicBalance ? formatEther(magicBalance) : '0'} MAGIC</p>
                <p><span className="text-gray-400">Chain:</span> {chainId}</p>
              </div>
              
              {/* Diamond System Status */}
              {diamondActivated && (
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <h3 className="text-sm font-semibold text-purple-300 mb-2">Diamond System</h3>
                  <div className="space-y-1 text-xs">
                    <p className="text-gray-400">{activationStatus}</p>
                    <p>
                      <span className="text-gray-400">Diamond:</span>{' '}
                      <span className="font-mono text-purple-400">
                        {getDiamondAddress(chainId)?.slice(0, 10)}...
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-400">Hive:</span>{' '}
                      <span className="font-mono text-purple-400">
                        {HIVE_ADDRESS.slice(0, 10)}...
                      </span>
                    </p>
                    
                    {/* CID Activation Chain Status */}
                    {cidState && (
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-400">Chain Facets:</p>
                        {cidState.chains.map((chain) => (
                          <div key={chain.chainId} className="flex items-center gap-2">
                            <span className="font-mono text-lg">{chain.glyph}</span>
                            <span className="text-gray-500">Chain {chain.chainId}:</span>
                            <span className={chain.cidVerified ? 'text-green-400' : 'text-yellow-400'}>
                              {chain.cidVerified ? '✓ Verified' : '○ Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-2">
                      <span className="text-gray-400">Glyphs:</span>
                      <span className="font-mono text-lg tracking-wider">
                        {getGlyphString()}
                      </span>
                    </div>
                    
                    {cidState?.activated && (
                      <div className="mt-2 p-2 bg-purple-500/10 rounded border border-purple-500/30">
                        <span className="font-mono text-lg">{GLYPHS.THEOS}</span>
                        <span className="text-purple-300 ml-2">Diamond Activated!</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      Lucy Gateway: {LUCY_GATEWAY.ethereum}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleApproveMagic}
                disabled={isPending}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-2 rounded-lg transition"
              >
                {isPending ? 'Approving...' : 'Approve MAGIC for Trading'}
              </button>
            </div>

            {/* Lookup Listing */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold mb-4">Lookup Listing</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="NFT Contract Address"
                  value={nftAddress}
                  onChange={(e) => setNftAddress(e.target.value)}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Token ID"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Owner Address"
                  value={ownerAddress}
                  onChange={(e) => setOwnerAddress(e.target.value)}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              {listing && listing[0] > 0n && (
                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Listing Found</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-400">Quantity:</span> {listing[0].toString()}</p>
                    <p><span className="text-gray-400">Price:</span> {formatEther(listing[1])} MAGIC</p>
                    <p><span className="text-gray-400">Expires:</span> {new Date(Number(listing[2]) * 1000).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={handleBuyItem}
                    disabled={isPending || isConfirming}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 py-2 rounded-lg transition"
                  >
                    {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
              )}

              {isSuccess && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400">Transaction successful!</p>
                  <a 
                    href={`https://arbiscan.io/tx/${hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-purple-400 hover:underline"
                  >
                    View on Arbiscan
                  </a>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error.message}</p>
                </div>
              )}
            </div>

            {/* Marketplace Info */}
            <div className="md:col-span-2 bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold mb-4">Marketplace Contract</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">TreasureMarketplace (Arbitrum)</p>
                  <code className="text-purple-400 text-xs">{TREASURE_MARKETPLACE_ADDRESS}</code>
                </div>
                <div>
                  <p className="text-gray-400">MAGIC Token</p>
                  <code className="text-purple-400 text-xs">{MAGIC_ADDRESS}</code>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-purple-500/20 p-4 mt-auto">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>Powered by Treasure Protocol | Bridgeworld.lol</p>
          <p className="mt-1">
            <a href="https://arbiscan.io/address/0x09986B4e255B3c548041a30A2Ee312Fe176731c2" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-purple-400 hover:underline">
              Verify Contract on Arbiscan
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
