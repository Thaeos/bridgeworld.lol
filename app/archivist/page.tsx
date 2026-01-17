'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { COVENANT, GUARDIAN_MAPPINGS } from '@/lib/covenant-foundation';

export default function ArchivistPage() {
  const guardians = GUARDIAN_MAPPINGS.all;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Mystical Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-black to-purple-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="text-6xl mb-4">📜</div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            THE ARCHIVIST VAULT
          </h1>
          <p className="text-xl text-gray-400">
            "The Origin Enclave has watched upon the Bridgeworld since the beginning of time"
          </p>
        </motion.div>

        {/* Vault Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <VaultSection
            href="/archivist/guardians"
            icon="⚔️"
            title="THE 22 GUARDIANS"
            description="The Hebrew paths mapped to Bridgeworld Legions"
            count={22}
          />
          <VaultSection
            href="/archivist/rootchain"
            icon="🔗"
            title="THE ROOTCHAIN"
            description="22 sacred numbers from Genesis to Terminus"
            count={22}
          />
          <VaultSection
            href="/archivist/tomes"
            icon="📚"
            title="THE OLD TOMES"
            description="Chronicles of Bridgeworld lore and history"
            count="∞"
          />
        </div>

        {/* The 22 Guardians Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-400">
            THE 22 GUARDIANS
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-4">
            {guardians.map((guardian, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                className="relative group"
              >
                <div className="flex flex-col items-center p-3 bg-gray-900/50 border border-purple-500/20 rounded-lg hover:border-purple-400/60 hover:bg-purple-900/30 transition-all cursor-pointer">
                  <span className="text-3xl text-purple-300">{guardian.glyph}</span>
                  <span className="text-xs text-gray-400 mt-1">{guardian.name}</span>
                  <span className="text-xs font-mono text-purple-500/60">{guardian.value}</span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black border border-purple-500/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  <div className="text-sm font-bold text-purple-300">Path {guardian.path}</div>
                  <div className="text-xs text-gray-400">{guardian.name} = {guardian.value}</div>
                  <div className="text-xs text-purple-400">Rootchain: {COVENANT.rootchain[i]}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* The Covenant Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <div className="p-8 bg-gradient-to-b from-purple-900/20 to-black border border-purple-500/30 rounded-xl">
            <h3 className="text-2xl font-bold text-purple-300 mb-4">THE AXIS</h3>
            <p className="text-3xl font-mono text-amber-400 mb-4">{COVENANT.axis}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Genesis:</span>
                <span className="text-purple-300 ml-2">{COVENANT.genesis}</span>
              </div>
              <div>
                <span className="text-gray-500">Terminus:</span>
                <span className="text-purple-300 ml-2">{COVENANT.terminus}</span>
              </div>
              <div>
                <span className="text-gray-500">Entropy:</span>
                <span className="text-purple-300 ml-2">{COVENANT.entropy_product}</span>
              </div>
              <div>
                <span className="text-gray-500">Polarity:</span>
                <span className="text-purple-300 ml-2">{COVENANT.polarity}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center gap-6">
          <Link
            href="/covenant"
            className="px-8 py-4 bg-amber-600/20 border border-amber-500/30 rounded-lg hover:bg-amber-600/40 transition-all"
          >
            ← Back to Covenant
          </Link>
          <Link
            href="/portal"
            className="px-8 py-4 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/40 transition-all"
          >
            Enter Portal →
          </Link>
        </div>
      </div>
    </main>
  );
}

function VaultSection({ 
  href, 
  icon, 
  title, 
  description, 
  count 
}: { 
  href: string; 
  icon: string; 
  title: string; 
  description: string; 
  count: number | string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        className="h-full p-8 bg-gradient-to-b from-purple-900/20 to-black border border-purple-500/30 rounded-xl hover:border-purple-400/60 transition-all cursor-pointer"
      >
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-purple-300 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <div className="text-3xl font-bold text-purple-400">{count}</div>
      </motion.div>
    </Link>
  );
}
