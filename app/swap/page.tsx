'use client';

import UniswapIntegration from '@/components/UniswapIntegration';
import { getTHOCoin } from '@/lib/tho-coin';

export default function SwapPage() {
  const tho = getTHOCoin();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Uniswap V3 Swap</h1>
          <p className="text-gray-400">Swap {tho.ticker} on Base Network</p>
        </div>

        <UniswapIntegration />
      </div>
    </main>
  );
}
