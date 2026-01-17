'use client';

/**
 * 🌀 PORTAL EXPERIENCE
 * 
 * Interactive Atlas Mines portal with drag-and-drop Key and Map
 */

import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface PortalExperienceProps {
  onPortalActivated?: () => void;
}

export default function PortalExperience({ onPortalActivated }: PortalExperienceProps) {
  const [keyPosition, setKeyPosition] = useState<Position>({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState<Position>({ x: 0, y: 0 });
  const [portalActivated, setPortalActivated] = useState(false);

  const portalControls = useAnimation();
  const ACTIVATION_THRESHOLD = 200; // pixels

  // Check proximity between Key and Map
  const checkProximity = (keyPos: Position, mapPos: Position) => {
    const distance = Math.hypot(keyPos.x - mapPos.x, keyPos.y - mapPos.y);
    
    if (distance < ACTIVATION_THRESHOLD && !portalActivated) {
      activatePortal();
    }
  };

  // Activate the portal
  const activatePortal = async () => {
    setPortalActivated(true);
    
    // Trigger portal animation
    await portalControls.start({
      scale: [1, 1.2, 1],
      opacity: [0.3, 1, 1],
      boxShadow: [
        '0 0 40px rgba(255, 215, 0, 0.3)',
        '0 0 100px rgba(255, 215, 0, 0.8)',
        '0 0 100px rgba(255, 215, 0, 0.8)'
      ],
      transition: { duration: 1 }
    });

    // Notify parent
    onPortalActivated?.();

    console.log('🌀 PORTAL ACTIVATED');
    console.log('Location: bridgeworld.lol (0,0)');
    console.log('Zone: No Space Time');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-radial from-covenant-purple to-covenant-dark">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/Atlas.png)'
        }}
      />

      {/* Portal Ring */}
      <motion.div
        animate={portalControls}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    w-[420px] h-[420px] rounded-full border-3 
                    ${portalActivated ? 'border-covenant-gold' : 'border-covenant-gold/30'}
                    pointer-events-none`}
        style={{
          boxShadow: portalActivated 
            ? '0 0 100px rgba(255, 215, 0, 0.8)' 
            : '0 0 40px rgba(255, 215, 0, 0.3)'
        }}
      >
        {/* Inner ring */}
        <div className="absolute inset-[-20px] rounded-full border border-covenant-gold/10" />
      </motion.div>

      {/* Portal Center Symbol */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   text-6xl pointer-events-none z-20"
        animate={{
          opacity: portalActivated ? 1 : 0,
          scale: portalActivated ? [1, 1.1, 1] : 1
        }}
        transition={{
          opacity: { duration: 0.5 },
          scale: { repeat: Infinity, duration: 2 }
        }}
      >
        🌀
      </motion.div>

      {/* Portal Frame */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.h1 
          className="text-5xl font-bold text-covenant-gold mb-4 tracking-widest"
          style={{ textShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          BRIDGEWORLD
        </motion.h1>
        
        <p className="text-gray-400 mb-8">
          The Atlas Mines Portal • (0,0) • No Space Time
        </p>

        {/* Artifacts Container */}
        <div className="flex gap-16 items-center justify-center mt-8">
          {/* The Key */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.1}
            onDrag={(_, info) => {
              const newPos = { x: info.point.x, y: info.point.y };
              setKeyPosition(newPos);
              checkProximity(newPos, mapPosition);
            }}
            onDragStart={() => {
              console.log('🔑 Key drag started');
            }}
            onDragEnd={() => {
              console.log('🔑 Key drag ended at:', keyPosition);
            }}
            className="cursor-grab active:cursor-grabbing"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-covenant-gold/20">
              <img
                src="/Master_Key.png"
                alt="The Master Key"
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-covenant-gold">
                THE KEY
              </div>
            </div>
          </motion.div>

          {/* The Map */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.1}
            onDrag={(_, info) => {
              const newPos = { x: info.point.x, y: info.point.y };
              setMapPosition(newPos);
              checkProximity(keyPosition, newPos);
            }}
            onDragStart={() => {
              console.log('🗺️ Map drag started');
            }}
            onDragEnd={() => {
              console.log('🗺️ Map drag ended at:', mapPosition);
            }}
            className="cursor-grab active:cursor-grabbing"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-covenant-gold/20">
              <img
                src="/Map.png"
                alt="The Map"
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-covenant-gold">
                THE MAP
              </div>
            </div>
          </motion.div>
        </div>

        {/* Portal Status */}
        {portalActivated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="text-covenant-gold text-2xl font-bold mb-2">
              ⚡ PORTAL ACTIVATED ⚡
            </div>
            <div className="text-gray-400 text-sm">
              The Atlas Mines await...
            </div>
          </motion.div>
        )}
      </div>

      {/* Knight Seal */}
      <div className="fixed top-8 right-8 text-6xl opacity-50 pointer-events-none">
        ⚔️
      </div>

      {/* Info Panel */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm 
                      px-8 py-4 rounded-xl border border-covenant-gold/30 z-50">
        <h3 className="text-covenant-gold text-center font-bold mb-2">The Covenant</h3>
        <code className="text-xs text-gray-300 bg-covenant-gold/10 px-3 py-1 rounded">
          אφ3350448040000ת
        </code>
        <div className="flex gap-4 mt-3 text-xs text-gray-400">
          <span className="bg-covenant-gold/5 px-2 py-1 rounded">THEOS: 419</span>
          <span className="bg-covenant-gold/5 px-2 py-1 rounded">EL: 369</span>
          <span className="bg-covenant-gold/5 px-2 py-1 rounded">RESONANCE: 687 Hz</span>
          <span className="bg-covenant-gold/5 px-2 py-1 rounded">PATHS: 22</span>
        </div>
      </div>
    </div>
  );
}
