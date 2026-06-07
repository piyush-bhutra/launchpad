import React from 'react';

export default function MailScanner() {
  return (
    <div className="relative w-full max-w-[450px] aspect-square mx-auto drop-shadow-[16px_16px_0px_#000] hover:-translate-y-2 transition-transform duration-300 cursor-default">
      {/* 8-bit Monitor Frame */}
      <svg viewBox="0 0 100 100" className="w-full h-full block" style={{ shapeRendering: 'crispEdges' }}>
        {/* Outer Bezel */}
        <rect x="5" y="10" width="90" height="70" fill="#e5e7eb" stroke="#000" strokeWidth="2" />
        {/* Inner Bezel */}
        <rect x="10" y="15" width="80" height="55" fill="#9ca3af" stroke="#000" strokeWidth="2" />
        {/* Screen */}
        <rect x="15" y="20" width="70" height="45" fill="#022c22" stroke="#000" strokeWidth="2" />
        
        {/* Computer Base */}
        <rect x="35" y="80" width="30" height="10" fill="#e5e7eb" stroke="#000" strokeWidth="2" />
        <rect x="25" y="90" width="50" height="5" fill="#d1d5db" stroke="#000" strokeWidth="2" />
        
        {/* Floppy Drive Detail */}
        <rect x="65" y="83" width="15" height="3" fill="#1f2937" />
        <rect x="66" y="84" width="2" height="1" fill="#ef4444" className="animate-pulse" />

        {/* Screen Content - Radar/Scanner line */}
        <g style={{ clipPath: 'polygon(15px 20px, 85px 20px, 85px 65px, 15px 65px)' }}>
          {/* A few static "blips" or envelopes on the screen */}
          <rect x="30" y="35" width="6" height="4" fill="#4ade80" className="animate-pulse" />
          <rect x="60" y="45" width="6" height="4" fill="#4ade80" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          <rect x="75" y="25" width="6" height="4" fill="#4ade80" className="animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Warning Red Blip (the 3-pointer) */}
          <rect x="25" y="55" width="6" height="4" fill="#ef4444" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
          
          {/* Animated Scanline */}
          <rect x="15" y="20" width="70" height="45" fill="url(#scanline-grad)" className="animate-scan" />
        </g>
        
        <defs>
          <linearGradient id="scanline-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0" />
            <stop offset="90%" stopColor="#4ade80" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* CSS Animation for the scanline */}
      <style>
        {`
          .animate-scan {
            animation: scan 2s linear infinite;
          }
          @keyframes scan {
            0% { transform: translateY(-45px); }
            100% { transform: translateY(45px); }
          }
        `}
      </style>
    </div>
  );
}
