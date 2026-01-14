'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getENSConfig } from '@/lib/ens-config';

export default function Navigation() {
  const pathname = usePathname();
  const ens = getENSConfig();

  const navItems = [
    { href: '/', label: 'Portal', icon: '🌀' },
    { href: '/contracts', label: 'Contracts', icon: '📜' },
    { href: '/tho', label: 'THO Coin', icon: '🪙' },
    { href: '/swap', label: 'Swap', icon: '💱' },
    { href: '/nft', label: 'Master Key', icon: '🔑' },
    { href: '/aifrens', label: 'AI Frens', icon: '🤖' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-purple-500/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
              bridgeworld.lol
            </Link>
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    pathname === item.href
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-gray-400">
              <span className="text-purple-400">{ens.domain}</span>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {ens.owner.slice(0, 6)}...{ens.owner.slice(-4)}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden mt-4 flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                pathname === item.href
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
