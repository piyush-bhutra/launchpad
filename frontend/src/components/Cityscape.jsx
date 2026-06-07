import React, { useEffect, useState, useRef, useMemo } from 'react';
import './Cityscape.css';
import { getBuildingSVG, COLOR_MAP } from '../lib/cityEngine';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const TILE_DX = 110;
const TILE_DY = 55;
const ISLAND_SPACING = 3500;

export default function Cityscape({ opportunities, onClose }) {
  const [currentIslandIndex, setCurrentIslandIndex] = useState(0);
  const [hoveredData, setHoveredData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedData, setSelectedData] = useState(null);
  const [baseScale, setBaseScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const parallaxOriginRef = useRef(null);
  const edgeNavCooldown = useRef(false);

  // Parse and map opportunities to isometric 3D models
  const mappedData = useMemo(() => {
    return opportunities.map((opp, idx) => {
      // Scale matchScore to capital (0-100 -> 0-1000)
      const capital = opp.matchScore * 10 || (Math.random() * 800 + 100);
      const packageValue = opp.matchScore * 2 + (Math.random() * 50); // Just for visualization
      const isMatch = opp.matchScore >= 80;
      const isSuspicious = opp.status === 'Rejected' || opp.status === 'Ignored';
      
      let colorKey = 'green';
      if (isSuspicious) colorKey = 'black';
      else if (opp.status === 'Applied') colorKey = 'yellow';
      else if (opp.status === 'Interested') colorKey = 'orange';

      return {
        id: opp.id || idx,
        company: opp.organization || 'Unknown',
        person: opp.title || 'Role',
        email: opp.type || 'Type',
        date: opp.deadline || 'No deadline',
        mailCount: opp.skills?.length || 3,
        capital: capital / 10,
        packageValue: Math.round(packageValue),
        isMatch,
        isSuspicious,
        colorKey,
        statusLabel: opp.status || 'New',
        original: opp
      };
    });
  }, [opportunities]);

  // Group into Islands
  const islands = useMemo(() => {
    const statuses = [...new Set(mappedData.map(d => d.statusLabel))];
    if (statuses.length === 0) return [];
    
    return statuses.map(status => ({
      title: status.toUpperCase(),
      desc: 'OPPORTUNITIES',
      data: mappedData.filter(d => d.statusLabel === status)
    })).sort((a, b) => b.data.length - a.data.length);
  }, [mappedData]);

  useEffect(() => {
    if (islands.length === 0) return;
    let maxBaseW = 0;
    let maxBaseH = 0;
    
    islands.forEach(island => {
      const minLen = Math.max(9, island.data.length);
      const c = Math.ceil(Math.sqrt(minLen));
      const r = Math.ceil(minLen / c);
      const w = (c + r) * TILE_DX + 1.6 * TILE_DX + 100;
      const h = (c + r) * TILE_DY + 1.6 * TILE_DY + 40 + 450;
      if (w > maxBaseW) maxBaseW = w;
      if (h > maxBaseH) maxBaseH = h;
    });
    
    const scaleX = (window.innerWidth * 0.9) / (maxBaseW || 1000);
    const scaleY = (window.innerHeight * 0.85) / (maxBaseH || 1000);
    setBaseScale(Math.min(1, Math.min(scaleX, scaleY)));
  }, [islands]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!selectedData) {
        const x = (window.innerWidth / 2 - e.clientX) * 0.05;
        const y = (window.innerHeight / 2 - e.clientY) * 0.05;
        setPan({ x, y });
        
        // Edge Navigation
        if (!edgeNavCooldown.current && !selectedData) {
          if (e.clientX < 40 && currentIslandIndex > 0) {
            setCurrentIslandIndex(p => p - 1);
            triggerEdgeCooldown();
          } else if (e.clientX > window.innerWidth - 40 && currentIslandIndex < islands.length - 1) {
            setCurrentIslandIndex(p => p + 1);
            triggerEdgeCooldown();
          }
        }
      } else {
        setPan({ x: 0, y: 0 }); // Reset pan in details view
      }
    };
    
    const handleKeyDown = (e) => {
      if (selectedData) return;
      if (e.key === 'ArrowLeft' && currentIslandIndex > 0) {
        setCurrentIslandIndex(p => p - 1);
        triggerEdgeCooldown();
      } else if (e.key === 'ArrowRight' && currentIslandIndex < islands.length - 1) {
        setCurrentIslandIndex(p => p + 1);
        triggerEdgeCooldown();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIslandIndex, islands.length, selectedData]);

  const triggerEdgeCooldown = () => {
    edgeNavCooldown.current = true;
    setTimeout(() => { edgeNavCooldown.current = false; }, 600);
  };

  const renderMasterBase = (islandData, c, r, sX, sY) => {
    const depth = 40;
    const topX = r * TILE_DX; 
    const p = 0.8;
    const pTopX = topX; 
    const pTopY = -2 * p * TILE_DY; 
    const pRightX = topX + (c + 2*p) * TILE_DX; 
    const pRightY = c * TILE_DY; 
    const pBottomX = topX + (c - r) * TILE_DX; 
    const pBottomY = (c + r + 2*p) * TILE_DY; 
    const pLeftX = topX + (-r - 2*p) * TILE_DX; 
    const pLeftY = r * TILE_DY; 
    
    const ptTop = `${pTopX},${pTopY}`;
    const ptRight = `${pRightX},${pRightY}`;
    const ptBottom = `${pBottomX},${pBottomY}`;
    const ptLeft = `${pLeftX},${pLeftY}`;
    const topFace = `<polygon points="${ptTop} ${ptRight} ${ptBottom} ${ptLeft}" fill="#e2e8f0" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`;
    
    let gridStr = '';
    for(let row=0; row<r; row++) {
      for(let col=0; col<c; col++) {
        const pX = topX + (col - row) * TILE_DX;
        const pY = (col + row) * TILE_DY;
        const pts = `${pX},${pY} ${pX + TILE_DX},${pY + TILE_DY} ${pX},${pY + 2*TILE_DY} ${pX - TILE_DX},${pY + TILE_DY}`;
        gridStr += `<polygon points="${pts}" fill="none" stroke="#cbd5e1" stroke-width="2"/>`;
      }
    }
    
    const ptLeftBot = `${pLeftX},${pLeftY + depth}`;
    const ptBottomBot = `${pBottomX},${pBottomY + depth}`;
    const leftFace = `<polygon points="${ptLeft} ${ptBottom} ${ptBottomBot} ${ptLeftBot}" fill="#94a3b8" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`;
    
    const ptRightBot = `${pRightX},${pRightY + depth}`;
    const rightFace = `<polygon points="${ptBottom} ${ptRight} ${ptRightBot} ${ptBottomBot}" fill="#64748b" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`;
    
    const textX = (pLeftX + pBottomX) / 2;
    const textYTop = (pLeftY + pBottomY) / 2; 
    const textY = textYTop + depth / 2; 
    const textStr = `<text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-family="'Press Start 2P', monospace" font-size="20" fill="#000" transform="translate(${textX}, ${textY}) matrix(1, 0.5, 0, 1, 0, 0)">${islandData.length} LISTINGS</text>`;
    
    const svgW = pRightX - pLeftX;
    const svgH = pBottomY + depth - pTopY;
    
    return (
      <div className="master-base" style={{ position: 'absolute', left: `${sX - topX + pLeftX}px`, top: `${sY + pTopY}px`, zIndex: -1 }}>
        <svg width={svgW} height={svgH} viewBox={`${pLeftX} ${pTopY} ${svgW} ${svgH}`} style={{ shapeRendering: 'crispEdges' }}>
          <g dangerouslySetInnerHTML={{ __html: topFace + gridStr + leftFace + rightFace + textStr }} />
        </svg>
      </div>
    );
  };

  if (islands.length === 0) return null;

  return (
    <div className="cityscape-body">
      <button className="dashboard-back-btn" onClick={onClose}>&larr; BACK TO APP</button>
      
      {/* Tooltip */}
      <div id="city-tooltip" className={hoveredData ? '' : 'hidden'} style={{ left: tooltipPos.x, top: tooltipPos.y }}>
        {hoveredData && (
          <>
            <h3 id="tt-company">{hoveredData.company}</h3>
            <p id="tt-person">ROLE: <span>{hoveredData.person}</span></p>
            <p id="tt-email">TYPE: <span>{hoveredData.email}</span></p>
            <p id="tt-date">DEADLINE: <span>{hoveredData.date}</span></p>
            <p id="tt-capital">SCORE: <span>{hoveredData.capital * 10}%</span></p>
            {hoveredData.isMatch && <span className="match-text">★ HIGH MATCH ★</span>}
            <div className="status-badge" style={{ backgroundColor: COLOR_MAP[hoveredData.colorKey].front, color: '#fff' }}>
              {COLOR_MAP[hoveredData.colorKey].label}
            </div>
          </>
        )}
      </div>

      {/* Details View */}
      {selectedData && (
        <div id="details-view">
          <div className="details-card">
            <button id="close-details" onClick={() => setSelectedData(null)}>X CLOSE</button>
            <h2 id="dv-company">{selectedData.company}</h2>
            <div className="dv-metrics">
              <div className="metric">
                <span className="label">ROLE</span>
                <span className="value">{selectedData.person}</span>
              </div>
              <div className="metric">
                <span className="label">DEADLINE</span>
                <span className="value">{selectedData.date}</span>
              </div>
              <div className="metric">
                <span className="label">MATCH SCORE</span>
                <span className="value">{selectedData.capital * 10}%</span>
              </div>
              <div className="metric">
                <span className="label">STATUS</span>
                <span className="value" style={{ color: COLOR_MAP[selectedData.colorKey].front }}>{COLOR_MAP[selectedData.colorKey].label}</span>
              </div>
            </div>
            {selectedData.isMatch && <p style={{ color: '#ca8a04', marginBottom: '20px', fontSize: '10px' }}>★ HIGH MATCH ★</p>}
            <a href={selectedData.original.link} target="_blank" rel="noreferrer" className="action-btn">OPEN OPPORTUNITY &rarr;</a>
          </div>
        </div>
      )}

      {/* Isometric Canvas */}
      <div id="city-container" ref={containerRef} style={{ transform: `scale(${selectedData ? baseScale * 2.5 : baseScale}) ${selectedData ? 'translateY(20%)' : ''}` }}>
        <div id="parallax-origin" ref={parallaxOriginRef} style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(${pan.x}px, ${pan.y}px)` }}>
          <div id="carousel-track" style={{ position: 'absolute', left: 0, top: 0, transition: 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)', transform: `translateX(${-currentIslandIndex * ISLAND_SPACING}px)` }}>
            {islands.map((island, idx) => {
              const minLen = Math.max(9, island.data.length);
              const c = Math.ceil(Math.sqrt(minLen));
              const r = Math.ceil(minLen / c);
              const totalHeight = (c + r) * TILE_DY;
              const sX = 0;
              const sY = -totalHeight / 2 + 150;

              // Sort for pseudo z-indexing depth
              const sortedData = [...island.data].sort((a, b) => b.packageValue - a.packageValue);

              return (
                <div key={idx} className={`island-container ${idx === currentIslandIndex ? 'island-active' : 'island-inactive'}`} style={{ left: `${idx * ISLAND_SPACING}px` }}>
                  {renderMasterBase(island.data, c, r, sX, sY)}
                  
                  {sortedData.map((data, i) => {
                    const row = Math.floor(i / c);
                    const col = i % c;
                    const Tx = sX + (col - row) * TILE_DX;
                    const Ty = sY + (col + row) * TILE_DY + TILE_DY;
                    
                    const pRandom = Math.abs((Math.sin((data.id||1) * 12.9898) * 43758.5453) % 1); 
                    const pRandom2 = Math.abs((Math.cos((data.id||1) * 78.233) * 43758.5453) % 1);
                    const offsetX = (pRandom - 0.5) * (TILE_DX * 0.4); 
                    const offsetY = (pRandom2 - 0.5) * (TILE_DY * 0.4); 
                    
                    const bData = getBuildingSVG(data);
                    const Wx = Tx + offsetX;
                    const Wy = Ty + bData.dyBase + bData.paddingBottom + offsetY; 
                    
                    return (
                      <div 
                        key={data.id}
                        className="building-wrapper raised"
                        style={{ left: Wx, top: Wy, zIndex: Math.floor(Ty + offsetY) + 10000 }}
                        onMouseMove={(e) => {
                          if (selectedData) return;
                          setTooltipPos({ x: e.pageX + 20, y: e.pageY + 20 });
                          setHoveredData(data);
                        }}
                        onMouseLeave={() => setHoveredData(null)}
                        onClick={() => {
                          if (idx === currentIslandIndex && !selectedData) {
                            setSelectedData(data);
                            setHoveredData(null);
                          }
                        }}
                        dangerouslySetInnerHTML={{ __html: bData.html }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation UI */}
      {!selectedData && (
        <>
          <div id="island-ui">
            <button className="nav-arrow" disabled={currentIslandIndex === 0} onClick={() => setCurrentIslandIndex(p => Math.max(0, p - 1))}>
              <ChevronLeft size={32} />
            </button>
            <div id="island-title">
              <h2>{islands[currentIslandIndex]?.title}</h2>
              <p>{islands[currentIslandIndex]?.desc} ({islands[currentIslandIndex]?.data.length} ITEMS)</p>
            </div>
            <button className="nav-arrow" disabled={currentIslandIndex === islands.length - 1} onClick={() => setCurrentIslandIndex(p => Math.min(islands.length - 1, p + 1))}>
              <ChevronRight size={32} />
            </button>
          </div>
          <div id="legend-ui">
            <h4>STATUS LEGEND</h4>
            <div className="legend-item"><span className="color-box" style={{ backgroundColor: '#22c55e' }}></span> NEW MATCHES</div>
            <div className="legend-item"><span className="color-box" style={{ backgroundColor: '#eab308' }}></span> APPLIED</div>
            <div className="legend-item"><span className="color-box" style={{ backgroundColor: '#f97316' }}></span> SAVED</div>
            <div className="legend-item"><span className="color-box" style={{ backgroundColor: '#475569' }}></span> REJECTED / IGNORED</div>
            <hr />
            <div className="legend-item"><span className="legend-icon" style={{ color: '#ca8a04' }}>★</span> HIGH MATCH (&gt;80%)</div>
          </div>
        </>
      )}
    </div>
  );
}
