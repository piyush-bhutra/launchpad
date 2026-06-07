import React, { useState } from 'react';

const idleQuotes = [
  "psst... come here...",
  "heh, you want sum??",
  "i know you want it...",
  "don't tell VTOP...",
  "i got the good stuff...",
  "fresh placements..."
];

export default function ShadyDealer() {
  const [isOpen, setIsOpen] = useState(false);
  const [quote, setQuote] = useState(idleQuotes[0]);
  const [isResponse, setIsResponse] = useState(false);
  const [highRewardAlt, setHighRewardAlt] = useState(false);

  const handleHover = () => {
    if (!isOpen && !isResponse) {
      let nextQuote = idleQuotes[Math.floor(Math.random() * idleQuotes.length)];
      if (nextQuote === quote && idleQuotes.length > 1) {
        nextQuote = idleQuotes[(idleQuotes.indexOf(quote) + 1) % idleQuotes.length];
      }
      setQuote(nextQuote);
    }
  };

  const handleMouseLeave = () => {
    if (isOpen) {
      const leaveResponses = [
        "sheesh npc ahh behaviour",
        "stop your 20+ and still no brain cells",
        "bro is actually terrified of success",
        "you gonna buy or just stare??"
      ];
      setQuote(leaveResponses[Math.floor(Math.random() * leaveResponses.length)]);
      setIsResponse(true);
      setIsOpen(false);
    }
  };

  const handleOptionClick = (option) => {
    if (option === 'THRILL') {
      setQuote("more?? you're already in vit...");
    } else if (option === 'HIGH_REWARD') {
      if (!highRewardAlt) {
        setQuote("sure mr wayne...");
      } else {
        const responses = ["ye gotcha...", "good choice...", "i'll hook you up..."];
        setQuote(responses[Math.floor(Math.random() * responses.length)]);
      }
      setHighRewardAlt(!highRewardAlt);
    } else {
      const responses = ["ye gotcha...", "good choice...", "i'll hook you up..."];
      setQuote(responses[Math.floor(Math.random() * responses.length)]);
    }
    setIsResponse(true);
    setIsOpen(false);
  };

  return (
    <div 
      className="relative w-full max-w-[500px] aspect-square mx-auto lg:mr-0 lg:ml-auto flex items-end justify-center"
      onMouseLeave={handleMouseLeave}
    >
      
      {/* Standing Street Lamp */}
      <div className="absolute bottom-10 right-[5%] w-full h-[calc(100%+120px)] pointer-events-none z-0">
        {/* Base */}
        <div className="absolute bottom-0 right-0 w-8 md:w-10 h-10 bg-[#1f2937] border-[3px] border-black"></div>
        {/* Vertical Pole */}
        <div className="absolute bottom-10 right-2 md:right-3 w-4 h-full bg-[#374151] border-l-[3px] border-r-[3px] border-black"></div>
        
        {/* Horizontal Arm */}
        <div className="absolute top-0 right-2 md:right-3 w-[45%] h-4 bg-[#374151] border-t-[3px] border-b-[3px] border-black border-l-[3px]"></div>

        {/* Diagonal Brace */}
        <div className="absolute top-4 right-6 md:right-7 w-4 h-4 bg-[#374151] border-[3px] border-black"></div>
        <div className="absolute top-8 right-2 md:right-3 w-4 h-4 bg-[#374151] border-[3px] border-black"></div>

        {/* Lamp Assembly (Hood, Bulb, Glow) */}
        <div className="absolute top-[4px] right-[calc(45%+10px)] translate-x-1/2 flex flex-col items-center z-10">
          {/* Hood */}
          <div className="w-16 md:w-20 h-6 bg-[#1f2937] border-[3px] border-black relative z-10"></div>
          {/* Bulb */}
          <div className="w-8 md:w-10 h-4 bg-yellow-200 border-[3px] border-t-0 border-black animate-flicker relative z-10 shadow-[0_10px_40px_20px_rgba(253,224,71,0.5)]"></div>
        </div>

        {/* Light Cone (Responsive clip-path) */}
        <div 
          className="absolute top-[32px] right-[calc(45%+10px)] translate-x-1/2 w-[250px] md:w-[300px] bottom-0 bg-yellow-400/20 opacity-60 animate-flicker pointer-events-none z-0" 
          style={{ clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)' }}
        ></div>
      </div>

      {/* Pixelated Pavement */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-[#374151] border-t-[4px] border-black z-0 flex items-center shadow-[inset_0_4px_0_rgba(255,255,255,0.1)]">
        {/* Pavement details */}
        <div className="w-12 h-full bg-[#1f2937] ml-12 border-r-4 border-l-4 border-black"></div>
        <div className="w-8 h-full bg-[#1f2937] ml-16 border-r-4 border-l-4 border-black"></div>
        <div className="w-16 h-full bg-[#1f2937] ml-auto mr-12 border-r-4 border-l-4 border-black"></div>
      </div>

      {/* Idle Speech Bubble */}
      {!isOpen && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap bg-white border-4 border-black px-4 py-3 text-black text-xs z-30 shadow-[4px_4px_0px_#000] pointer-events-none" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          <p>{quote}</p>
          <div className="absolute -bottom-3 left-1/2 w-4 h-4 bg-white border-r-4 border-b-4 border-black rotate-45 -translate-x-1/2"></div>
        </div>
      )}

      {/* Open Speech Bubble */}
      {isOpen && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[400px] bg-white border-4 border-black p-6 text-black text-xs leading-relaxed z-30 shadow-[6px_6px_0px_#000]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          <p className="mb-6 leading-loose">"ye ye i got the stuff. what do you want?"</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleOptionClick('HIGH_REWARD')}
              className="text-left hover:bg-[#eab308] hover:text-black p-2 border-2 border-transparent hover:border-black uppercase transition-all flex items-center justify-between"
            >
              <span>&gt; HIGH REWARD</span>
              <span className="text-[10px] text-gray-500">[$]</span>
            </button>
            <button 
              onClick={() => handleOptionClick('SAFE')}
              className="text-left hover:bg-[#4ade80] hover:text-black p-2 border-2 border-transparent hover:border-black uppercase transition-all flex items-center justify-between"
            >
              <span>&gt; SAFE</span>
              <span className="text-[10px] text-gray-500">[shield]</span>
            </button>
            <button 
              onClick={() => handleOptionClick('THRILL')}
              className="text-left hover:bg-[#ef4444] hover:text-white p-2 border-2 border-transparent hover:border-black uppercase transition-all flex items-center justify-between"
            >
              <span>&gt; THRILL OPPORTUNITY</span>
              <span className="text-[10px] text-gray-500">[!]</span>
            </button>
          </div>
          <div className="absolute -bottom-3 left-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-black rotate-45 -translate-x-1/2"></div>
        </div>
      )}

      {/* 8-bit Character SVG (Envelope Dealer) */}
      <svg 
        viewBox="0 0 140 120" 
        className={`w-[400px] h-[350px] cursor-pointer drop-shadow-[16px_4px_0px_#000] origin-bottom transition-transform z-10 mb-[12px] ${!isOpen ? 'animate-shrug hover:scale-105' : 'scale-110'}`}
        style={{ shapeRendering: 'crispEdges' }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setIsResponse(false);
        }}
        onMouseEnter={handleHover}
      >
        {/* Legs (Solid Black) */}
        <rect x="45" y="90" width="12" height="15" fill="#111827" />
        <rect x="40" y="105" width="20" height="5" fill="#111827" />
        <rect x="83" y="90" width="12" height="15" fill="#111827" />
        <rect x="83" y="105" width="20" height="5" fill="#111827" />

        {/* FULL Envelope Body - Wider Rectangle for Gmail Style */}
        <rect x="25" y="25" width="90" height="65" fill="#ffffff" />
        
        {/* Gmail 'M' Flap */}
        {/* Inner V flap filled with light gray for detail */}
        <polygon points="25,25 70,55 115,25" fill="#f3f4f6" />
        <path d="M 25 25 L 70 55 L 115 25" fill="none" stroke="#ea4335" strokeWidth="8" strokeLinejoin="miter" />
        {/* Vertical Red Lines */}
        <path d="M 25 25 L 25 90" fill="none" stroke="#ea4335" strokeWidth="8" />
        <path d="M 115 25 L 115 90" fill="none" stroke="#ea4335" strokeWidth="8" />

        {/* Sunglasses */}
        <rect x="45" y="42" width="18" height="10" fill="#111827" />
        <rect x="77" y="42" width="18" height="10" fill="#111827" />
        <rect x="63" y="45" width="14" height="3" fill="#111827" />
        {/* Sunglasses Glare */}
        <rect x="48" y="44" width="6" height="3" fill="#ffffff" />
        <rect x="80" y="44" width="6" height="3" fill="#ffffff" />

        {/* Hat (Fedora) */}
        <rect x="35" y="0" width="70" height="20" fill="#374151" />
        {/* Hat Band */}
        <rect x="35" y="15" width="70" height="5" fill="#991b1b" />
        {/* Hat Brim */}
        <rect x="10" y="20" width="120" height="6" fill="#374151" />

        {/* Coat */}
        {isOpen ? (
          <g>
            {/* Left Flap */}
            <polygon points="21,50 -9,95 21,95" fill="#78350f" />
            <polygon points="21,50 6,95 21,95" fill="#92400e" />
            
            {/* Right Flap */}
            <polygon points="119,50 149,95 119,95" fill="#78350f" />
            <polygon points="119,50 134,95 119,95" fill="#92400e" />
            
            {/* The Goods (Emails inside coat flaps) */}
            {/* Left side emails */}
            <g transform="rotate(-15 5 65)">
              <rect x="5" y="65" width="14" height="10" fill="#ffffff" stroke="#d1d5db" strokeWidth="1" />
              <rect x="7" y="68" width="10" height="2" fill="#3b82f6" />
              <rect x="7" y="71" width="6" height="2" fill="#3b82f6" />
            </g>
            <g transform="rotate(-5 12 80)">
              <rect x="12" y="80" width="14" height="10" fill="#ffffff" stroke="#d1d5db" strokeWidth="1" />
              <rect x="14" y="83" width="10" height="2" fill="#10b981" />
              <rect x="14" y="86" width="6" height="2" fill="#10b981" />
            </g>

            {/* Right side emails */}
            <g transform="rotate(15 120 65)">
              <rect x="120" y="65" width="14" height="10" fill="#ffffff" stroke="#d1d5db" strokeWidth="1" />
              <rect x="122" y="68" width="10" height="2" fill="#ef4444" />
              <rect x="122" y="71" width="6" height="2" fill="#ef4444" />
            </g>
            <g transform="rotate(5 115 80)">
              <rect x="115" y="80" width="14" height="10" fill="#ffffff" stroke="#d1d5db" strokeWidth="1" />
              <rect x="117" y="83" width="10" height="2" fill="#eab308" />
              <rect x="117" y="86" width="6" height="2" fill="#eab308" />
            </g>

            {/* Hands holding coat open */}
            <rect x="-14" y="75" width="10" height="6" rx="2" fill="#ffffff" stroke="#111827" strokeWidth="2" />
            <rect x="144" y="75" width="10" height="6" rx="2" fill="#ffffff" stroke="#111827" strokeWidth="2" />
          </g>
        ) : (
          <g>
            {/* Closed Coat Base */}
            <rect x="21" y="50" width="98" height="45" fill="#92400e" />
            <rect x="65" y="50" width="10" height="45" fill="#78350f" />
            {/* Pockets */}
            <rect x="28" y="75" width="16" height="3" fill="#78350f" />
            <rect x="96" y="75" width="16" height="3" fill="#78350f" />
            {/* Collar Fold */}
            <polygon points="40,50 70,70 100,50" fill="#78350f" />
            <polygon points="55,50 70,65 85,50" fill="#451a03" />
            {/* Envelope Hands in pockets */}
            <rect x="31" y="73" width="10" height="6" rx="2" fill="#ffffff" stroke="#111827" strokeWidth="2" />
            <rect x="99" y="73" width="10" height="6" rx="2" fill="#ffffff" stroke="#111827" strokeWidth="2" />
          </g>
        )}
      </svg>
      
      <style>
        {`
          .animate-shrug {
            animation: shrug 1.2s infinite;
          }
          @keyframes shrug {
            0%, 49.9% { transform: scaleY(1); }
            50%, 99.9% { transform: scaleY(0.98); }
            100% { transform: scaleY(1); }
          }
        `}
      </style>
    </div>
  );
}
