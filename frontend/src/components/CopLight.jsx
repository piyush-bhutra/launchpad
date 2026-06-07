import React from 'react';

export default function CopLight() {
  return (
    <div className="group relative inline-block mx-2 align-middle cursor-pointer">
      {/* Red Light Beams (Hover State) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none z-[-1]">
        {/* Left Beam */}
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-transparent to-red-500/60 animate-pulse" style={{ clipPath: 'polygon(0 20%, 100% 40%, 100% 60%, 0 80%)' }}></div>
        {/* Right Beam */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-transparent to-red-500/60 animate-pulse" style={{ clipPath: 'polygon(100% 20%, 0 40%, 0 60%, 100% 80%)' }}></div>
      </div>
      
      {/* 8-Bit Pixel Art Siren */}
      <svg width="32" height="32" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="block drop-shadow-[2px_2px_0px_#000]" style={{ shapeRendering: 'crispEdges' }}>
        <style>
          {`
            .siren-glass { fill: #ef4444; }
            .siren-base { fill: #1f2937; }
            .siren-highlight { fill: #fca5a5; }
            .reflector { 
              animation: siren-spin 0.4s steps(4) infinite;
              transform-origin: 8px 8px;
            }
          `}
        </style>
        
        {/* Base */}
        <rect x="3" y="12" width="10" height="2" className="siren-base" />
        <rect x="2" y="14" width="12" height="2" className="siren-base" />
        
        {/* Glass Dome */}
        <rect x="4" y="6" width="8" height="6" className="siren-glass" />
        <rect x="5" y="4" width="6" height="2" className="siren-glass" />
        <rect x="5" y="4" width="6" height="2" className="siren-highlight" opacity="0.6" />
        
        {/* Rotating Reflector */}
        <g className="reflector">
          <rect x="7" y="6" width="2" height="6" fill="#ffffff" />
          <rect x="6" y="7" width="1" height="4" fill="#7f1d1d" />
          <rect x="9" y="7" width="1" height="4" fill="#7f1d1d" />
        </g>
      </svg>
    </div>
  );
}
