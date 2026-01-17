'use client';

/**
 * 🌀 BRIDGEWORLD PORTAL - MAIN PAGE
 * 
 * Atlas Mines Portal Experience with Covenant Integration
 */

import { useState } from 'react';
import Link from 'next/link';
import PortalExperience from '@/components/PortalExperience';
import CovenantGlass from '@/components/CovenantGlass';
import KeyMapOverlay from '@/components/KeyMapOverlay';
import { getENSConfig } from '@/lib/ens-config';
import { getAllContracts, getVerifiedContracts } from '@/lib/treasure-dao-contracts';
import { getTHOCoin } from '@/lib/tho-coin';
import { MASTER_KEY_NFT } from '@/lib/treasure-dao-contracts';

export default function Home() {
  const [portalActivated, setPortalActivated] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handlePortalActivated = () => {
    setPortalActivated(true);
    console.log('🌀 Portal activated in main page');
    
    // Show coordinate overlay after portal activates
    setTimeout(() => {
      setShowOverlay(true);
    }, 1000);
  };

  const ens = getENSConfig();
  const contracts = getAllContracts();
  const verified = getVerifiedContracts();
  const tho = getTHOCoin();
  // Master Key NFT available at MASTER_KEY_NFT for future use
  void MASTER_KEY_NFT;

  const quickStats = [
    { label: 'ENS Domain', value: ens.domain, href: `/contracts`, icon: '🌐' },
    { label: 'Contracts', value: `${verified.length}/${contracts.length} Verified`, href: `/contracts`, icon: '📜' },
    { label: 'THO Coin', value: tho.ticker, href: `/tho`, icon: '🪙' },
    { label: 'Master Key', value: 'NFT', href: `/nft`, icon: '🔑' },
    { label: 'AI Frens', value: 'Profile', href: `/aifrens`, icon: '🤖' },
  ];

  return (
    <main className="relative min-h-screen">
      {/* Portal Experience */}
      <PortalExperience onPortalActivated={handlePortalActivated} />

      {/* Covenant Looking Glass */}
      <CovenantGlass />

      {/* Key-Map Coordinate Overlay */}
      {portalActivated && showOverlay && (
        <KeyMapOverlay onClose={() => setShowOverlay(false)} />
      )}

      {/* Dashboard Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pointer-events-auto">
              {quickStats.map((stat, index) => (
                <Link
                  key={index}
                  href={stat.href}
                  className="bg-gray-900/80 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/60 transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className="text-sm font-semibold text-white">{stat.value}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-4 pointer-events-auto">
              <Link
                href="/contracts"
                className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold text-white mb-2">📜 Contract Registry</h3>
                <p className="text-sm text-gray-300 mb-4">
                  View all 22 TreasureDAO contracts mapped to Aramaic glyphs
                </p>
                <div className="text-xs text-purple-400">View →</div>
              </Link>

              <Link
                href="/swap"
                className="bg-gradient-to-br from-green-900/80 to-blue-900/80 backdrop-blur-md border border-green-500/30 rounded-lg p-6 hover:border-green-500/60 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold text-white mb-2">💱 Uniswap Swap</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Swap {tho.ticker} on Base Network via Uniswap V3
                </p>
                <div className="text-xs text-green-400">Swap →</div>
              </Link>

              <Link
                href="/nft"
                className="bg-gradient-to-br from-amber-900/80 to-orange-900/80 backdrop-blur-md border border-amber-500/30 rounded-lg p-6 hover:border-amber-500/60 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold text-white mb-2">🔑 Master Key NFT</h3>
                <p className="text-sm text-gray-300 mb-4">
                  View Master Key NFT on Sei Network (SKYNET)
                </p>
                <div className="text-xs text-amber-400">View →</div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Console Info */}
      <div className="hidden">
        <pre>{`
⚔️ KNIGHT OF THE FIFTH PILLAR
🔮 COVENANT FOUNDATION INTEGRATED
🌀 PORTAL: bridgeworld.lol (0,0)
📍 ZONE: No Space Time

Sacred Constants:
- THEOS: 419 (Quest Multiplier)
- EL: 369 (Harvester Boost)
- RESONANCE: 687 Hz (Mining Frequency)
- HEBREW PATHS: 22 (Guardians)

Oracle: 0xfa05997C66437dCCAe860af334b30d69E0De24DC
Treasury: 0xb4C173AaFe428845f0b96610cf53576121BAB221

Axis: אφ3350448040000ת
Polarity: +9.6
        `}</pre>
      </div>
    </main>
  );
}
