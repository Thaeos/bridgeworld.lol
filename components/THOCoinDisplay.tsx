'use client';

import { getTHOCoin, getTHOPool, getTHOExplorer, verifyTHOOwner } from '@/lib/tho-coin';
import { useEffect, useState } from 'react';

/**
 * THO Coin Display Component
 * Shows THO coin information and pool details
 */
export default function THOCoinDisplay() {
  const [tho, setTho] = useState<ReturnType<typeof getTHOCoin> | null>(null);
  const [pool, setPool] = useState<ReturnType<typeof getTHOPool> | null>(null);

  useEffect(() => {
    const thoData = getTHOCoin();
    const poolData = getTHOPool();
    
    setTho(thoData);
    setPool(poolData);
  }, []);

  if (!tho) return null;

  return (
    <div className="tho-coin-display p-6 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg shadow-xl border border-purple-500">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-white">🪙 {tho.ticker} Coin</h2>
        <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
          {tho.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-black/30 rounded p-4">
          <p className="text-gray-300 text-sm mb-1">Contract Address</p>
          <p className="text-white font-mono text-sm break-all">{tho.contract}</p>
        </div>

        <div className="bg-black/30 rounded p-4">
          <p className="text-gray-300 text-sm mb-1">Network</p>
          <p className="text-white font-semibold">{tho.network}</p>
          <p className="text-gray-400 text-xs">Chain ID: {tho.chainId}</p>
        </div>
      </div>

      {pool && (
        <div className="bg-black/30 rounded p-4 mb-4">
          <p className="text-gray-300 text-sm mb-2">💧 Liquidity Pool</p>
          <p className="text-white font-mono text-sm break-all mb-2">{pool.address}</p>
          <a
            href={pool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 text-sm underline"
          >
            View on DEX Screener →
          </a>
        </div>
      )}

      <div className="flex gap-3">
        <a
          href={getTHOExplorer()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
        >
          View on Explorer
        </a>
        <div className="px-4 py-2 bg-gray-700 text-gray-300 rounded">
          Creator: {tho.creator.slice(0, 10)}...{tho.creator.slice(-8)}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-500">
        <p className="text-gray-400 text-xs">
          THO Coin is part of the .x402 ecosystem on Base network
        </p>
      </div>
    </div>
  );
}
