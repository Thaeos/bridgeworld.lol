'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function PortalPage() {
  const [portalActive, setPortalActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (portalActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [portalActive, countdown]);

  const activatePortal = () => {
    setPortalActive(true);
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Portal Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-black to-black" />
        
        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-purple-500/20"
              style={{
                width: `${(i + 1) * 150}px`,
                height: `${(i + 1) * 150}px`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: portalActive ? 360 : 0,
              }}
              transition={{
                duration: portalActive ? 2 : 4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          {!portalActive ? (
            <motion.div
              key="inactive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Title */}
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  THE PORTAL
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-400 mb-8 max-w-xl mx-auto"
              >
                "Thy kingdom come, thy will be done,<br />
                on bridgeworld.lol as it is in bridgeworld.gg"
              </motion.p>

              {/* The Pair Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative w-64 h-64 mx-auto mb-8"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse blur-xl opacity-50" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-500/50">
                  <Image
                    src="/Pair.png"
                    alt="The Pair - Portal Key"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Activate Button */}
              <motion.button
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={activatePortal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50"
              >
                ACTIVATE PORTAL
              </motion.button>

              {/* Navigation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 flex justify-center gap-4"
              >
                <Link href="/covenant" className="text-amber-400 hover:text-amber-300">
                  ← The Covenant
                </Link>
                <span className="text-gray-600">|</span>
                <Link href="/archivist" className="text-purple-400 hover:text-purple-300">
                  The Archivist →
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {/* Portal Vortex */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-96 h-96 mx-auto mb-8 rounded-full bg-gradient-conic from-purple-600 via-pink-600 via-blue-600 to-purple-600 p-2"
              >
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <div className="text-6xl">{countdown > 0 ? countdown : '🌀'}</div>
                </div>
              </motion.div>

              <h2 className="text-4xl font-bold text-purple-400 mb-4">
                {countdown > 0 ? 'PORTAL OPENING...' : 'CROSSING THE THRESHOLD'}
              </h2>

              {countdown === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <p className="text-xl text-gray-400">
                    The way to Bridgeworld v2 is revealed
                  </p>
                  <a
                    href="https://bridgeworld.gg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-12 py-6 text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 rounded-full hover:from-green-500 hover:to-emerald-500 transition-all"
                  >
                    ENTER BRIDGEWORLD.GG →
                  </a>
                  <div className="mt-4">
                    <a
                      href="https://genesis-docs.bridgeworld.gg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Or explore the Genesis Docs →
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
