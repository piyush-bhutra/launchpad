export const COLOR_MAP = {
    green: { top: '#4ade80', front: '#22c55e', right: '#16a34a', label: 'RECENT (<3 DAYS)' },
    yellow: { top: '#fde047', front: '#eab308', right: '#ca8a04', label: '3-7 DAYS AGO' },
    orange: { top: '#fb923c', front: '#f97316', right: '#ea580c', label: '1-4 WEEKS AGO' },
    red: { top: '#f87171', front: '#ef4444', right: '#dc2626', label: 'OVER 1 MONTH' },
    black: { top: '#64748b', front: '#475569', right: '#334155', label: 'SUSPICIOUS SENDER' }
};

export function buildSVGPolygon(points, fill) {
    const pts = points.map(p => `${p.x},${p.y}`).join(' ');
    return `<polygon points="${pts}" fill="${fill}" stroke="#000" stroke-width="2" stroke-linejoin="miter"/>`;
}

export function getCubePolygons(cx, cy, w, h, colors) {
    const dx = w / 2;
    const dy = dx / 2; 
    
    const leftFace = buildSVGPolygon([
        { x: cx - dx, y: cy - h - dy },
        { x: cx, y: cy - h },
        { x: cx, y: cy },
        { x: cx - dx, y: cy - dy }
    ], colors.front);
    
    const rightFace = buildSVGPolygon([
        { x: cx, y: cy - h },
        { x: cx + dx, y: cy - h - dy },
        { x: cx + dx, y: cy - dy },
        { x: cx, y: cy }
    ], colors.right);
    
    const topFace = buildSVGPolygon([
        { x: cx, y: cy - h - 2*dy },
        { x: cx + dx, y: cy - h - dy },
        { x: cx, y: cy - h },
        { x: cx - dx, y: cy - h - dy }
    ], colors.top);

    return leftFace + rightFace + topFace;
}

export function drawStarSVG(cx, cy, r) {
    let pts = [];
    for(let i=0; i<10; i++) {
        let angle = -Math.PI/2 + (i * Math.PI / 5);
        let rad = (i % 2 === 0) ? r : r * 0.45;
        pts.push(`${cx + Math.cos(angle)*rad},${cy + Math.sin(angle)*rad}`);
    }
    return `
        <g class="star-anim">
            <polygon points="${pts.join(' ')}" fill="#fde047" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
        </g>
    `;
}

// 1. STARTUP ARCHITECTURE (Tiers 5 & 6)
export function getStartupSVG(data) {
    const w = 80 + Math.random() * 20; 
    const h = 30 + (data.packageValue * 0.4); 
    const colors = COLOR_MAP[data.colorKey];
    
    const dx = w / 2;
    const dy = dx / 2;
    
    const svgWidth = w + 80; 
    const svgHeight = h + 2*dy + 180; 
    
    const cx = svgWidth / 2;
    const paddingBottom = 30; 
    const cy = svgHeight - paddingBottom; 

    let svgContent = '';
    
    // Baseplate
    svgContent += getCubePolygons(cx, cy, w * 1.4, 8, {
        top: '#cbd5e1', front: '#94a3b8', right: '#64748b'
    });
    
    // Left Face (Pentagon for peaked roof)
    const peakH = 25;
    const leftFace = buildSVGPolygon([
        { x: cx - dx, y: cy - 8 - dy },
        { x: cx, y: cy - 8 },
        { x: cx, y: cy - 8 - h },
        { x: cx - dx/2, y: cy - 8 - h - dy/2 - peakH },
        { x: cx - dx, y: cy - 8 - h - dy }
    ], colors.front);
    svgContent += leftFace;
    
    // Right Face (Rectangle)
    const rightFace = buildSVGPolygon([
        { x: cx, y: cy - 8 - h },
        { x: cx + dx, y: cy - 8 - h - dy },
        { x: cx + dx, y: cy - 8 - dy },
        { x: cx, y: cy - 8 }
    ], colors.right);
    svgContent += rightFace;
    
    // Roof Left Slope (Darker)
    const roofLeft = buildSVGPolygon([
        { x: cx - dx/2, y: cy - 8 - h - dy/2 - peakH },
        { x: cx - dx, y: cy - 8 - h - dy },
        { x: cx, y: cy - 8 - h - 2*dy },
        { x: cx + dx/2, y: cy - 8 - h - 1.5*dy - peakH }
    ], colors.right); 
    svgContent += roofLeft;

    // Roof Right Slope
    const roofRight = buildSVGPolygon([
        { x: cx - dx/2, y: cy - 8 - h - dy/2 - peakH },
        { x: cx + dx/2, y: cy - 8 - h - 1.5*dy - peakH },
        { x: cx + dx, y: cy - 8 - h - dy },
        { x: cx, y: cy - 8 - h }
    ], colors.top);
    svgContent += roofRight;
    
    // Windows
    const maxWindows = data.mailCount;
    const windowColor = data.isSuspicious ? '#ef4444' : '#fde047';
    const wDx = (dx * 0.4) / 2; 
    const wCx = cx - dx/2; 
    let h_usable = h - 15; 
    if (h_usable < 10) h_usable = 10;
    let slotHeight = h_usable / maxWindows;
    let windowHeight = Math.min(20, slotHeight * 0.7);
    let gap = Math.min(15, slotHeight * 0.3);
    
    for(let i=0; i<maxWindows; i++) {
        const baseY = cy - 8 - dy/2 - 8 - (i * (windowHeight + gap));
        const pts = [
            { x: wCx - wDx, y: baseY - windowHeight - wDx/2 },
            { x: wCx + wDx, y: baseY - windowHeight + wDx/2 },
            { x: wCx + wDx, y: baseY + wDx/2 },
            { x: wCx - wDx, y: baseY - wDx/2 }
        ];
        svgContent += buildSVGPolygon(pts, windowColor);
    }
    
    // Company Name
    const midX = cx + dx/2;
    const midY = cy - h/2 - dy/2 - 4; 
    const companyName = data.company.toUpperCase();
    let maxFontSizeH = (h - 15) / companyName.length;
    let maxFontSizeW = dx - 4;
    let fSize = Math.min(maxFontSizeH, maxFontSizeW, 14);
    if (fSize > 4) {
        svgContent += `<text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-family="'Press Start 2P', monospace" font-size="${fSize}" fill="rgba(0,0,0,0.4)" transform="translate(${midX}, ${midY}) matrix(1, -0.5, 0, 1, 0, 0) rotate(90)">${companyName}</text>`;
    }

    if (data.isMatch) {
        const starCy = cy - 8 - h - dy/2 - peakH - 25; 
        svgContent += drawStarSVG(cx - dx/2, starCy, 14); // Centered over peak
    }
    
    return {
        html: `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="overflow: visible">${svgContent}</svg>`,
        paddingBottom: paddingBottom, 
        dyBase: (w * 1.4) / 4 
    };
}

// 2. CORPORATE ARCHITECTURE (Tiers 3 & 4)
export function getCorporateSVG(data) {
    const w = 60 + Math.random() * 20; 
    const h = 40 + (data.packageValue * 0.8); 
    const colors = COLOR_MAP[data.colorKey];
    
    const dx = w / 2;
    const dy = dx / 2;
    
    const acH = 15;
    const acW = w * 0.4;
    const starH = data.isMatch ? 40 : 0; 
    
    const svgWidth = w + 80; 
    const svgHeight = h + 2*dy + acH + starH + 160; 
    
    const cx = svgWidth / 2;
    const paddingBottom = 30; 
    const cy = svgHeight - paddingBottom; 

    let svgContent = '';
    
    svgContent += getCubePolygons(cx, cy, w * 1.4, 8, {
        top: '#cbd5e1', front: '#94a3b8', right: '#64748b'
    });
    
    svgContent += getCubePolygons(cx, cy - 8, w, h, colors);
    
    const maxWindows = data.mailCount;
    const windowColor = data.isSuspicious ? '#ef4444' : '#fde047';
    
    const wDx = (dx * 0.4) / 2; 
    const wCx = cx - dx/2; 
    let h_usable = h - 15; 
    if (h_usable < 10) h_usable = 10;
    
    let slotHeight = h_usable / maxWindows;
    let windowHeight = Math.min(25, slotHeight * 0.7);
    let gap = Math.min(20, slotHeight * 0.3);
    
    for(let i=0; i<maxWindows; i++) {
        const baseY = cy - 8 - dy/2 - 8 - (i * (windowHeight + gap));
        const pts = [
            { x: wCx - wDx, y: baseY - windowHeight - wDx/2 },
            { x: wCx + wDx, y: baseY - windowHeight + wDx/2 },
            { x: wCx + wDx, y: baseY + wDx/2 },
            { x: wCx - wDx, y: baseY - wDx/2 }
        ];
        svgContent += buildSVGPolygon(pts, windowColor);
    }
    
    const acCy = cy - 8 - h;
    svgContent += getCubePolygons(cx, acCy, acW, acH, {
        top: '#e2e8f0', front: '#cbd5e1', right: '#94a3b8'
    });
    
    const midX = cx + dx/2;
    const midY = cy - h/2 - dy/2 - 4; 
    const companyName = data.company.toUpperCase();
    let maxFontSizeH = (h - 15) / companyName.length;
    let maxFontSizeW = dx - 4;
    let fSize = Math.min(maxFontSizeH, maxFontSizeW, 14);
    if (fSize > 4) {
        svgContent += `<text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-family="'Press Start 2P', monospace" font-size="${fSize}" fill="rgba(0,0,0,0.4)" transform="translate(${midX}, ${midY}) matrix(1, -0.5, 0, 1, 0, 0) rotate(90)">${companyName}</text>`;
    }

    if (data.isMatch) {
        const starCy = acCy - acH - 25; 
        svgContent += drawStarSVG(cx, starCy, 14);
    }
    
    return {
        html: `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="overflow: visible">${svgContent}</svg>`,
        paddingBottom: paddingBottom, 
        dyBase: (w * 1.4) / 4 
    };
}

// 3. SKYSCRAPER ARCHITECTURE (Tiers 1 & 2)
export function getSkyscraperSVG(data) {
    const w = 50 + Math.random() * 20; 
    const h = 80 + (data.packageValue * 1.3); // Extrapolated height
    const colors = COLOR_MAP[data.colorKey];
    
    const dx = w / 2;
    const dy = dx / 2;
    
    const svgWidth = w + 80; 
    const svgHeight = h + 2*dy + 30 + 50 + 260; 
    
    const cx = svgWidth / 2;
    const paddingBottom = 30; 
    const cy = svgHeight - paddingBottom; 

    let svgContent = '';
    
    // Baseplate
    svgContent += getCubePolygons(cx, cy, w * 1.4, 8, {
        top: '#cbd5e1', front: '#94a3b8', right: '#64748b'
    });
    
    // Main Shaft
    svgContent += getCubePolygons(cx, cy - 8, w, h, colors);
    
    // Top Tier (Setback)
    const tW = w * 0.6;
    const tDx = tW / 2;
    const tDy = tDx / 2;
    const cy_tier = cy - 8 - h - dy + tDy;
    svgContent += getCubePolygons(cx, cy_tier, tW, 30, {
        top: colors.top, front: colors.front, right: colors.right
    });
    
    // Spire
    const sW = w * 0.15;
    const sDx = sW / 2;
    const sDy = sDx / 2;
    const cy_spire = cy_tier - 30 - tDy + sDy;
    svgContent += getCubePolygons(cx, cy_spire, sW, 50, {
        top: '#e2e8f0', front: '#cbd5e1', right: '#94a3b8'
    });
    
    // Windows (on Main Shaft only)
    const maxWindows = data.mailCount;
    const windowColor = data.isSuspicious ? '#ef4444' : '#fde047';
    const wDx = (dx * 0.4) / 2; 
    const wCx = cx - dx/2; 
    let h_usable = h - 15; 
    if (h_usable < 10) h_usable = 10;
    
    let slotHeight = h_usable / maxWindows;
    let windowHeight = Math.min(25, slotHeight * 0.7);
    let gap = Math.min(20, slotHeight * 0.3);
    
    for(let i=0; i<maxWindows; i++) {
        const baseY = cy - 8 - dy/2 - 8 - (i * (windowHeight + gap));
        const pts = [
            { x: wCx - wDx, y: baseY - windowHeight - wDx/2 },
            { x: wCx + wDx, y: baseY - windowHeight + wDx/2 },
            { x: wCx + wDx, y: baseY + wDx/2 },
            { x: wCx - wDx, y: baseY - wDx/2 }
        ];
        svgContent += buildSVGPolygon(pts, windowColor);
    }
    
    // Company Name (on Main Shaft)
    const midX = cx + dx/2;
    const midY = cy - h/2 - dy/2 - 4; 
    const companyName = data.company.toUpperCase();
    let maxFontSizeH = (h - 15) / companyName.length;
    let maxFontSizeW = dx - 4;
    let fSize = Math.min(maxFontSizeH, maxFontSizeW, 14);
    if (fSize > 4) {
        svgContent += `<text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-family="'Press Start 2P', monospace" font-size="${fSize}" fill="rgba(0,0,0,0.4)" transform="translate(${midX}, ${midY}) matrix(1, -0.5, 0, 1, 0, 0) rotate(90)">${companyName}</text>`;
    }

    if (data.isMatch) {
        const starCy = cy_spire - 50 - sDy - 25; 
        svgContent += drawStarSVG(cx, starCy, 14);
    }
    
    return {
        html: `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="overflow: visible">${svgContent}</svg>`,
        paddingBottom: paddingBottom, 
        dyBase: (w * 1.4) / 4 
    };
}

export function getBuildingSVG(data) {
    const capitalVal = data.capital * 10;
    if (capitalVal >= 650) {
        return getSkyscraperSVG(data); // Tiers 1-2
    } else if (capitalVal >= 350) {
        return getCorporateSVG(data);  // Tiers 3-4
    } else {
        return getStartupSVG(data);    // Tiers 5-6
    }
}
