'use client';

import THOCoinDisplay from '@/components/THOCoinDisplay';
import { getTHOCoin } from '@/lib/tho-coin';

export default function THOPage() {
  const tho = getTHOCoin();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🪙 {tho.name}
          </h1>
          <p className="text-gray-400">
            .x402 Contract on Base Network
          </p>
        </div>

        <THOCoinDisplay />

        <div className="mt-8 bg-black/30 rounded-lg p-6 border border-purple-500">
          <h2 className="text-xl font-bold text-white mb-4">Quick Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Ticker</p>
              <p className="text-white font-semibold text-lg">{tho.ticker}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Network</p>
              <p className="text-white font-semibold">{tho.network}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Chain ID</p>
              <p className="text-white font-semibold">{tho.chainId}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-green-400 font-semibold capitalize">{tho.status}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-black/30 rounded-lg p-6 border border-purple-500">
          <h2 className="text-xl font-bold text-white mb-4">Code Example</h2>
          <pre className="bg-black rounded p-4 overflow-x-auto">
            <code className="text-green-400 text-sm">
{`import { getTHOCoin, getTHOPool } from '@/lib/tho-coin';

const tho = getTHOCoin();
console.log(tho.ticker); // ${tho.ticker}
console.log(tho.contract); // ${tho.contract}`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
