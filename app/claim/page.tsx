'use client';

/**
 * 🔑 TREASURE CLAIM PAGE
 * 
 * Use Master Key NFT to unlock and claim treasure from Atlas Mines
 * Anchored via IPFS, SKYNET, and Arbitrum
 * 
 * When the end finds its beginning, we are already anchored.
 */

import TreasureClaim from '@/components/TreasureClaim';
import Navigation from '@/components/Navigation';

export default function ClaimPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🔑 Claim Your Treasure
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Use the Master Key NFT to unlock the Atlas Mines and claim your treasure.
              The Covenant is anchored via IPFS, SKYNET, and Arbitrum.
            </p>
          </div>

          {/* Claim Component */}
          <TreasureClaim />

          {/* Covenant Story */}
          <div className="mt-8 p-6 bg-gray-800/30 rounded-lg border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-4">📜 The Covenant Anchors</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-purple-400">IPFS:</strong> The Master Key image is permanently anchored 
                at CID <code className="text-amber-400">vQSMpXuEy9NrcjDsoQK2RxHxGKTyvCWsqFjzqSnPMck</code>. 
                This cryptographic hash ensures the key cannot be altered.
              </p>
              <p>
                <strong className="text-purple-400">SKYNET (Sei):</strong> The NFT marketplace on Sei Network 
                provides a secondary anchor point, ensuring the Master Key exists across multiple chains.
              </p>
              <p>
                <strong className="text-purple-400">Arbitrum:</strong> The TreasureDAO contracts on Arbitrum One 
                contain the Atlas Mines, Legions, Treasures, and all Bridgeworld assets. These contracts 
                remain active and accessible.
              </p>
              <p>
                <strong className="text-purple-400">bridgeworld.lol:</strong> This domain, owned by the Covenant, 
                serves as the gateway to claim treasure. The Wayback Machine preserves the historical state 
                of the original Bridgeworld interface.
              </p>
              <p>
                <strong className="text-purple-400">ENS (θεός°•.eth):</strong> The Ethereum Name Service provides 
                human-readable identity verification, linking all anchors to a single sovereign identity.
              </p>
            </div>
          </div>

          {/* Technical Details */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800/30 rounded-lg border border-amber-500/20">
              <h3 className="text-lg font-bold text-white mb-3">🔐 Master Key OCR</h3>
              <pre className="text-xs text-gray-400 overflow-x-auto">
{`IPFS CID: vQSMpXuEy9NrcjDsoQK2RxHxGKTyvCWsqFjzqSnPMck
SHA-256: c4aa73faa55c35e2096a63c6db96cb0bc4af672759f4e980072dfd7ce13b9bbf

Extracted Text:
- "Se:"
- "BB aoe"
- "5 Rha"
- "che"
- "Res"

Note: Visual/symbolic patterns encode
the key to unlock Atlas Mines.`}
              </pre>
            </div>

            <div className="p-6 bg-gray-800/30 rounded-lg border border-green-500/20">
              <h3 className="text-lg font-bold text-white mb-3">📊 Contract Registry</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">MAGIC Token:</span>
                  <span className="text-green-400">0x539b...0342</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Treasure NFT:</span>
                  <span className="text-green-400">0xf3dF...8326</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Legion:</span>
                  <span className="text-green-400">0xfE8c...70A1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Marketplace:</span>
                  <span className="text-green-400">0x0998...31c2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Oracle:</span>
                  <span className="text-green-400">0xfa05...24DC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500">
            <p className="text-lg">🔮 As Above, So Below. As Within, So Without.</p>
            <p className="mt-2 text-sm">
              When the end finds its beginning, we are already anchored within the Arbitrum 
              via IPFS and SKYNET. The Master Key unlocks the Atlas Mines.
            </p>
            <p className="mt-4 text-xs">
              Θεός°•⟐•Σ℧ΛΘ | θεός°•.eth | bridgeworld.lol
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
