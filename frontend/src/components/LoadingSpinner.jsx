import React, { useState, useEffect } from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ label = "Loading", fullscreen = false }) {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f === 3 ? 1 : f + 1));
    }, 200); // 200ms per frame
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      <svg className="pixel-spinner" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ width: '128px', height: '128px', imageRendering: 'pixelated' }}>
        {/* Desk (Static) */}
        <rect x="2" y="12" width="12" height="2" fill="#78350f" />
        <rect x="3" y="14" width="2" height="2" fill="#451a03" />
        <rect x="11" y="14" width="2" height="2" fill="#451a03" />

        {/* Frame 1: Hands Up */}
        {frame === 1 && (
          <g>
            <rect x="8" y="11" width="5" height="1" fill="#cbd5e1" />
            <rect x="12" y="7" width="1" height="4" fill="#94a3b8" />
            <rect x="2" y="4" width="3" height="3" fill="#fca5a5" />
            <rect x="4" y="5" width="1" height="1" fill="#000" />
            <rect x="2" y="7" width="3" height="5" fill="#3b82f6" />
            <rect x="5" y="4" width="2" height="1" fill="#fca5a5" />
            <rect x="6" y="5" width="1" height="2" fill="#3b82f6" />
          </g>
        )}

        {/* Frame 2: Hands Down, Leaning */}
        {frame === 2 && (
          <g>
            <rect x="8" y="11" width="5" height="1" fill="#cbd5e1" />
            <rect x="12" y="7" width="1" height="4" fill="#94a3b8" />
            <rect x="3" y="5" width="3" height="3" fill="#fca5a5" />
            <rect x="5" y="6" width="1" height="1" fill="#000" />
            <rect x="2" y="8" width="4" height="4" fill="#3b82f6" />
            <rect x="6" y="8" width="2" height="1" fill="#3b82f6" />
            <rect x="8" y="8" width="1" height="2" fill="#fca5a5" />
          </g>
        )}

        {/* Frame 3: SMASH! */}
        {frame === 3 && (
          <g>
            <rect x="8" y="11" width="5" height="1" fill="#94a3b8" />
            <rect x="13" y="10" width="1" height="1" fill="#cbd5e1" />
            <rect x="11" y="9" width="1" height="1" fill="#cbd5e1" />
            <rect x="4" y="6" width="3" height="3" fill="#fca5a5" />
            <rect x="6" y="7" width="1" height="1" fill="#000" />
            <rect x="3" y="9" width="4" height="3" fill="#3b82f6" />
            <rect x="7" y="10" width="2" height="1" fill="#3b82f6" />
            <rect x="9" y="11" width="2" height="1" fill="#fca5a5" />
            
            <rect x="7" y="9" width="1" height="1" fill="#fde047" />
            <rect x="10" y="8" width="1" height="1" fill="#ef4444" />
            <rect x="12" y="10" width="1" height="1" fill="#fde047" />
          </g>
        )}
      </svg>
      
      <div className="flex flex-col items-center gap-3">
        <span className="text-sm font-bold font-['Press_Start_2P'] uppercase tracking-widest text-primary">
          {label}
        </span>
        <div className="pixel-loading-bar-container" style={{ width: '250px', height: '24px', border: '4px solid #000', padding: '3px', background: '#fff', boxShadow: '6px 6px 0px rgba(0,0,0,0.2)' }}>
          <div className="pixel-loading-bar-fill" style={{ height: '100%', background: '#22c55e', animation: 'load-bar 3s linear forwards' }}></div>
        </div>
      </div>
    </div>
  );

  if (fullscreen) {
    return <div className="grid min-h-[100vh] place-items-center bg-white">{content}</div>;
  }
  return <div className="flex w-full items-center justify-center py-12">{content}</div>;
}
