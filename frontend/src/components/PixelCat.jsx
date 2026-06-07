import React, { useState, useEffect, useRef } from 'react';

const colors = {
  '1': '#000000', // Black outline
  '2': '#f97316', // Orange Cat
  '3': '#ffffff', // White eye
  '4': '#f472b6', // Pink Nose
  '5': '#ef4444', // Red Yarn
  '6': '#fca5a5', // Light Red Yarn highlight
};

// True feline side-profile with pointed ears, long straight tail, four legs, and cute nose.
const catWalk1 = [
  "                   1 ",
  "    1    1        121",
  "   121  121       121",
  "  1222112221      121",
  "  1322222211      121",
  " 124222222221   1121 ",
  "  12222222222111221  ",
  "  1222222222222221   ",
  "   12222222222221    ",
  "   121 121  121 121  ",
  "   11  11   11  11   "
];

const catWalk2 = [
  "                   1 ",
  "    1    1        121",
  "   121  121       121",
  "  1222112221      121",
  "  1322222211      121",
  " 124222222221   1121 ",
  "  12222222222111221  ",
  "  1222222222222221   ",
  "   12222222222221    ",
  "    121      121     ",
  "    11       11      "
];

const catSit = [
  "                     ",
  "    1    1           ",
  "   121  121          ",
  "  1222112221         ",
  "  1322222211         ",
  " 124222222221        ",
  "  122222222221       ",
  "  1222222222221      ",
  "   122222222221      ",
  "  1222222222221      ",
  " 11111111111111      "
];

const yarnSprite = [
  "   1111   ",
  "  155651  ",
  " 15565551 ",
  " 15655551 ",
  " 15555551 ",
  "  155551  ",
  "   1111   "
];

const renderSprite = (sprite) => {
  return sprite.map((row, y) => 
    row.split('').map((char, x) => {
      if (char === ' ') return null;
      return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colors[char]} />
    })
  );
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export default function PixelCat() {
  const [frame, setFrame] = useState(0);
  const [isSitting, setIsSitting] = useState(false);
  const [catState, setCatState] = useState({ x: '120%', y: 0, scaleX: 1, duration: 0 });
  const [yarnState, setYarnState] = useState({ x: '120%', rot: 0, visible: false, duration: 0 });
  
  const isPlaying = useRef(false);
  const activeRef = useRef(true);

  // Walk cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f === 0 ? 1 : 0));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // State Machine for random behaviors (Strictly End-to-End & Corners)
  useEffect(() => {
    if (isPlaying.current) return;
    isPlaying.current = true;
    activeRef.current = true;

    const actions = [
      async () => {
        // 1. Chase Yarn across screen (Right to Left)
        if (!activeRef.current) return;
        setCatState({ x: '110%', y: 0, scaleX: 1, duration: 0 });
        setYarnState({ x: '100%', rot: 0, visible: true, duration: 0 });
        setIsSitting(false);
        await sleep(100);
        
        setCatState({ x: '50%', y: 0, scaleX: 1, duration: 4 });
        setYarnState({ x: '40%', rot: -720, visible: true, duration: 4 });
        await sleep(4000);
        
        setIsSitting(true);
        await sleep(1200);
        
        // Bat the yarn
        setYarnState({ x: '-20%', rot: -2000, visible: true, duration: 2 });
        await sleep(200);
        
        // Run after it
        setIsSitting(false);
        setCatState({ x: '-30%', y: 0, scaleX: 1, duration: 3 });
        await sleep(3000);
        setYarnState(prev => ({ ...prev, visible: false }));
      },
      async () => {
        // 2. Peek from Right corner
        if (!activeRef.current) return;
        setCatState({ x: '110%', y: 0, scaleX: 1, duration: 0 });
        await sleep(100);
        setCatState({ x: 'calc(100% - 100px)', y: 0, scaleX: 1, duration: 2.5 });
        await sleep(2500);
        setIsSitting(true);
        await sleep(3000);
        setIsSitting(false);
        setCatState({ x: '110%', y: 0, scaleX: -1, duration: 2 }); // Turn and leave
        await sleep(2000);
      },
      async () => {
        // 3. Peek from Left corner
        if (!activeRef.current) return;
        setCatState({ x: '-30%', y: 0, scaleX: -1, duration: 0 });
        await sleep(100);
        setCatState({ x: '-10px', y: 0, scaleX: -1, duration: 2.5 });
        await sleep(2500);
        setIsSitting(true);
        await sleep(3000);
        setIsSitting(false);
        setCatState({ x: '-30%', y: 0, scaleX: 1, duration: 2 }); // Turn and leave
        await sleep(2000);
      },
      async () => {
        // 4. Sprint Left to Right fast!
        if (!activeRef.current) return;
        setCatState({ x: '-30%', y: 0, scaleX: -1, duration: 0 });
        setIsSitting(false);
        await sleep(100);
        setCatState({ x: '110%', y: 0, scaleX: -1, duration: 2 }); 
        await sleep(2200);
      },
      async () => {
        // 5. Walk Right to Left slowly (End to End)
        if (!activeRef.current) return;
        setCatState({ x: '110%', y: 0, scaleX: 1, duration: 0 });
        setIsSitting(false);
        await sleep(100);
        setCatState({ x: '-30%', y: 0, scaleX: 1, duration: 8 }); 
        await sleep(8200);
      }
    ];

    const run = async () => {
      await sleep(1000); // Initial start delay
      while (activeRef.current) {
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        await randomAction();
        if (activeRef.current) {
          await sleep(Math.random() * 3000 + 1500); // Wait 1.5 to 4.5 seconds
        }
      }
    };

    run();

    return () => {
      activeRef.current = false;
      isPlaying.current = false;
    };
  }, []);

  const currentSprite = isSitting ? catSit : (frame === 0 ? catWalk1 : catWalk2);

  return (
    <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none overflow-hidden z-[5]">
      <div className="relative w-full h-full opacity-90">
        
        {/* Yarn */}
        <div 
          className="absolute bottom-4 w-10 h-10 origin-center drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]"
          style={{
            left: yarnState.x,
            transform: `rotate(${yarnState.rot}deg)`,
            transition: `left ${yarnState.duration}s linear, transform ${yarnState.duration}s linear`,
            display: yarnState.visible ? 'block' : 'none'
          }}
        >
          <svg viewBox="0 0 10 7" className="w-full h-full">
            {renderSprite(yarnSprite)}
          </svg>
        </div>

        {/* Cat Container */}
        <div 
          className="absolute bottom-4 w-32 h-16 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          style={{
            left: catState.x,
            transform: `translateY(${catState.y}px)`,
            transition: `left ${catState.duration}s linear, transform ${catState.duration}s cubic-bezier(0.4, 0, 0.2, 1)`
          }}
        >
          {/* Inner wrapper for instant flipping */}
          <div className="w-full h-full" style={{ transform: `scaleX(${catState.scaleX})` }}>
            <svg viewBox="0 0 21 11" className="w-full h-full">
              {renderSprite(currentSprite)}
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
