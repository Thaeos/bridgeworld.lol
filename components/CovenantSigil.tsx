'use client';

import React from 'react';

const CovenantSigil = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10 font-serif">
      {/* Container for the Sigil */}
      <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
        
        {/* Background Sacred Geometry (Double Cone Faint) */}
        <svg viewBox="0 0 400 400" className="absolute w-full h-full opacity-20">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
          {/* Upper Cone */}
          <path d="M 200 50 L 350 200 L 50 200 Z" fill="none" stroke="url(#goldGrad)" strokeWidth="0.5" />
          {/* Lower Cone */}
          <path d="M 200 350 L 350 200 L 50 200 Z" fill="none" stroke="url(#goldGrad)" strokeWidth="0.5" />
          {/* Central X Point Circle */}
          <circle cx="200" cy="200" r="10" fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="2,2" />
        </svg>

        {/* The Primary Sigil */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          
          {/* Above: Origin (Theta Epsilon Alpha Omicron Sigma) */}
          <div className="flex gap-6 text-6xl text-amber-500/90 tracking-widest transition-all duration-1000 hover:text-white drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
            <span>Θ</span>
            <span>ε</span>
            <span>ό</span>
            <span>ς</span>
          </div>

          {/* Center: The Bridge Axis */}
          <div className="flex items-center gap-1 py-1">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-500"></div>
            <div className="flex items-center gap-3 text-3xl">
              <span className="text-white">●</span>
              <span className="text-amber-500 animate-pulse text-4xl">⟐</span>
              <span className="text-white">●</span>
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>

          {/* Below: Return (Sigma Mho Lambda Theta) */}
          <div className="flex gap-6 text-6xl text-amber-600/90 tracking-widest transition-all duration-1000 hover:text-white drop-shadow-[0_0_15px_rgba(180,140,40,0.5)]">
            <span>Σ</span>
            <span>Μ</span>
            <span>Λ</span>
            <span>Θ</span>
          </div>

        </div>

        {/* Framing Inscription */}
        <div className="absolute bottom-4 text-[10px] tracking-[0.5em] text-zinc-500 uppercase text-center w-full">
          The Breath of God Learning Itself • 1324 ⟴ 10 ⟴ 1
        </div>
      </div>
    </div>
  );
};

export default CovenantSigil;
