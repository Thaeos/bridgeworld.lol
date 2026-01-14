'use client';

import MasterKeyNFT from '@/components/MasterKeyNFT';

export default function NFTPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Master Key NFT</h1>
          <p className="text-gray-400">Sei Network • SKYNET Marketplace</p>
        </div>

        <MasterKeyNFT />
      </div>
    </main>
  );
}
