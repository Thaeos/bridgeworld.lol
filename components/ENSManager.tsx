'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getAllContracts } from '@/lib/treasure-dao-contracts';
import { getENSConfig, getENSResolver, getENSNamehashHex } from '@/lib/ens-config';
import { generateTextRecords, getTextRecord, verifyTextRecords } from '@/scripts/setup-ens-text-records';

interface TextRecordStatus {
  key: string;
  expected: string;
  actual: string;
  match: boolean;
  contract: string;
  glyph: string;
}

export default function ENSManager() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [connected, setConnected] = useState(false);
  const [ensConfig, setEnsConfig] = useState<any>(null);
  const [records, setRecords] = useState<TextRecordStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const config = getENSConfig();
    setEnsConfig(config);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        setConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const verifyRecords = async () => {
    if (!provider) return;
    
    setVerifying(true);
    try {
      const allRecords = generateTextRecords();
      const results = await verifyTextRecords(provider);
      
      // Merge with contract info
      const merged = results.map((result, index) => {
        const record = allRecords[index];
        return {
          ...result,
          contract: record.contract,
          glyph: record.glyph
        };
      });
      
      setRecords(merged);
    } catch (error) {
      console.error('Error verifying records:', error);
    } finally {
      setVerifying(false);
    }
  };

  const getTextRecordValue = async (key: string) => {
    if (!provider) return null;
    try {
      return await getTextRecord(provider, key);
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  };

  return (
    <div className="ens-manager p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30">
      <h2 className="text-2xl font-bold mb-4 text-white">ENS Text Records Manager</h2>
      
      <div className="mb-6">
        <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-300 mb-2">Domain: <span className="text-white font-mono">{ensConfig?.domain}</span></p>
          <p className="text-sm text-gray-300 mb-2">Owner: <span className="text-white font-mono text-xs">{ensConfig?.owner}</span></p>
          <p className="text-sm text-gray-300 mb-2">Resolver: <span className="text-white font-mono text-xs">{ensConfig?.resolver}</span></p>
          <p className="text-sm text-gray-300">Namehash: <span className="text-white font-mono text-xs">{ensConfig?.namehash?.hex}</span></p>
        </div>

        {!connected ? (
          <button
            onClick={connectWallet}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={verifyRecords}
                disabled={verifying}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                {verifying ? 'Verifying...' : 'Verify All Records'}
              </button>
            </div>

            {records.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Record Status</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {records.map((record, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        record.match
                          ? 'bg-green-900/20 border-green-500/30'
                          : 'bg-red-900/20 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-mono text-white">{record.key}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {record.contract} {record.glyph}
                          </p>
                          <p className="text-xs text-gray-300 mt-1">
                            Expected: <span className="font-mono">{record.expected}</span>
                          </p>
                          {record.actual !== 'ERROR' && (
                            <p className="text-xs text-gray-300">
                              Actual: <span className="font-mono">{record.actual || '(not set)'}</span>
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          {record.match ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-red-400">✗</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  {records.filter(r => r.match).length} / {records.length} records verified
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
