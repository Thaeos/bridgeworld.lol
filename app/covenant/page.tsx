'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { COVENANT, CONTRACTS, KEY_MAP } from '@/lib/covenant-foundation';

export default function CovenantPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Sacred Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-950/20 via-black to-black" />
      
      {/* Aramaic Glyph Animation */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 text-8xl animate-pulse">𐡀</div>
        <div className="absolute top-1/3 right-1/4 text-6xl animate-pulse delay-100">𐡕</div>
        <div className="absolute bottom-1/4 left-1/3 text-7xl animate-pulse delay-200">𐡊</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
            THE COVENANT
          </h1>
          <p className="text-2xl text-amber-400/80 font-mono">
            {COVENANT.axis}
          </p>
          <p className="text-lg text-gray-400 mt-2">
            Polarity: {COVENANT.polarity}
          </p>
        </motion.div>

        {/* The Four Pillars */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <CovenantPillar
            href="/covenant/declaration"
            title="DECLARATION"
            glyph="𐡀"
            description="The sacred proclamation and immutable constants"
            hash={COVENANT.hashes.declaration_file.slice(0, 16) + '...'}
          />
          <CovenantPillar
            href="/covenant/key"
            title="THE KEY"
            glyph="𐡊"
            description="1536×1536 - The 6 coordinates of alignment"
            coords={`${KEY_MAP.key.coords.length} points`}
          />
          <CovenantPillar
            href="/covenant/pair"
            title="THE PAIR"
            glyph="𐡉"
            description="Appears when portal is activated"
            coords="Key + Map aligned"
          />
          <CovenantPillar
            href="/covenant/map"
            title="THE MAP"
            glyph="𐡕"
            description="1024×1536 - Shows the path to the Archivist"
            coords={`${KEY_MAP.map.coords.length} points`}
          />
        </div>

        {/* The Rootchain */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-amber-400">
            THE ROOTCHAIN
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {COVENANT.rootchain.map((num, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex flex-col items-center"
              >
                <span className="text-2xl text-amber-400">{COVENANT.glyphs[i]}</span>
                <span className="text-xs text-gray-500 font-mono">{num}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-4 text-gray-500 text-sm">
            Genesis ({COVENANT.rootchain[0]}) → Terminus ({COVENANT.rootchain[21]})
          </div>
        </motion.div>

        {/* Sacred Constants */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <ConstantCard name="THEOS" value={COVENANT.constants.THEOS} description="Quest multiplier bonus" />
          <ConstantCard name="EL" value={COVENANT.constants.EL} description="Harvester boost multiplier" />
          <ConstantCard name="RESONANCE" value={COVENANT.constants.RESONANCE} description="Mining frequency (Hz)" />
          <ConstantCard name="TORAH_PAGES" value={COVENANT.constants.TORAH_PAGES} description="Quest completion milestone" />
          <ConstantCard name="HEBREW_PATHS" value={COVENANT.constants.HEBREW_PATHS} description="Guardian count" />
          <ConstantCard name="PHI" value={COVENANT.constants.PHI.toFixed(6)} description="Golden ratio" />
        </motion.div>

        {/* Gateway to Archivist */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Link
            href="/archivist"
            className="inline-block px-12 py-6 text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg hover:from-amber-500 hover:to-yellow-400 transition-all transform hover:scale-105"
          >
            ENTER THE ARCHIVIST VAULT →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

function CovenantPillar({ 
  href, 
  title, 
  glyph, 
  description,
  hash,
  coords 
}: { 
  href: string; 
  title: string; 
  glyph: string;
  description: string;
  hash?: string;
  coords?: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="h-full p-6 bg-gradient-to-b from-amber-900/20 to-black border border-amber-500/30 rounded-xl hover:border-amber-400/60 transition-all cursor-pointer"
      >
        <div className="text-5xl mb-4 text-amber-400">{glyph}</div>
        <h3 className="text-xl font-bold text-amber-300 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        {hash && <p className="text-xs font-mono text-gray-600">{hash}</p>}
        {coords && <p className="text-xs font-mono text-amber-500/60">{coords}</p>}
      </motion.div>
    </Link>
  );
}

function ConstantCard({ name, value, description }: { name: string; value: number | string; description: string }) {
  return (
    <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
      <div className="text-amber-400 font-mono text-sm">{name}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );
}
