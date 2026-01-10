import React, { useEffect, useRef, useState } from 'react';
import { MapLocation } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Enabled Real Map
const USE_REAL_MAP = true; 

interface MapWidgetProps {
  locations: MapLocation[];
}

/**
 * 模拟/艺术风格地图层
 * Dark Tech Theme Edition
 */
const MockMapOverlay: React.FC<{ locations: MapLocation[] }> = ({ locations }) => {
  const { t } = useLanguage();
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none bg-[#0b1121]">
       {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Radial Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0b1121] opacity-80"></div>

      {/* Map Content Layer */}
      <div className="absolute inset-0 p-4 pointer-events-auto overflow-hidden rounded-lg">
        {/* Simulated Road Network (Abstract SVGs) - Cyan lines on dark */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-tech-cyan" strokeWidth="1" fill="none">
          {/* World/Globe Abstraction */}
          <circle cx="50%" cy="50%" r="28%" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="35%" stroke="#334155" strokeWidth="1" />
          <circle cx="50%" cy="50%" r="42%" stroke="#1e293b" strokeWidth="1" strokeDasharray="10 5" />
          
          <path d="M100,100 Q250,50 400,150 T800,100" strokeOpacity="0.5" />
          <path d="M50,300 Q200,400 350,250 T700,350" strokeOpacity="0.5" />
          <path d="M300,50 L350,400" strokeOpacity="0.2" />
          <path d="M500,50 L450,400" strokeOpacity="0.2" />
        </svg>

        {/* Map Pins */}
        {locations.map((loc) => (
          <div 
            key={loc.id}
            className="absolute group cursor-pointer"
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
          >
            <div className="relative flex items-center justify-center w-6 h-6">
              {/* Ping Animation */}
              <div className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${loc.status === 'busy' ? 'bg-red-500' : 'bg-tech-cyan'}`}></div>
              {/* Core Dot */}
              <div className={`relative w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${loc.type === 'transport' ? 'bg-amber-400' : (loc.status === 'busy' ? 'bg-red-500' : 'bg-tech-cyan')}`}></div>
            </div>

            {/* Tooltip Label - Dark Theme */}
            <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-[#151e32]/90 border border-tech-cyan/30 text-slate-200 text-xs font-bold px-3 py-1.5 rounded shadow-glow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none backdrop-blur-md">
              {loc.label}
              <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#151e32] border-b border-r border-tech-cyan/30 transform rotate-45"></div>
            </div>
            
            {/* Connecting Lines to Center (Visual Effect) */}
            <div className="absolute top-3 left-3 w-[200px] h-[1px] bg-gradient-to-r from-tech-cyan/20 to-transparent transform origin-left rotate-[var(--r)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{'--r': `${Math.random() * 360}deg`} as any}></div>
          </div>
        ))}
        
        {/* Selected Highlight (Center) */}
        <div className="absolute top-[35%] left-[55%] pointer-events-none">
             <div className="w-24 h-24 -ml-12 -mt-12 border border-tech-cyan/30 rounded-full animate-pulse-fast shadow-[0_0_15px_rgba(6,182,212,0.1)]"></div>
             <div className="absolute top-0 right-0 w-24 h-[1px] bg-gradient-to-l from-tech-cyan to-transparent transform rotate-[-45deg] origin-bottom-left"></div>
             <div className="absolute top-[-50px] right-[-120px] bg-[#0b1121]/80 backdrop-blur border border-tech-cyan/50 p-3 rounded text-xs shadow-glow">
                <p className="font-bold text-tech-cyan uppercase tracking-wider mb-1">DATA CENTER</p>
                <p className="font-bold text-slate-100 text-sm">五洲大道中心</p>
                <div className="flex items-center gap-1 mt-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span>
                   <p className="text-slate-400">{t('map.normal')}</p>
                </div>
             </div>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded text-[10px] text-slate-500 border border-slate-800 font-mono">
          {t('map.mock')}
        </div>
      </div>
    </div>
  );
};

export const MapWidget: React.FC<MapWidgetProps> = ({ locations }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // Store map instance for zoom controls
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!USE_REAL_MAP) return;
    
    // Check if AMap is loaded globally
    // @ts-ignore
    if (typeof window.AMap === 'undefined') {
      console.warn("AMap SDK not loaded in window. Showing mock map.");
      return;
    }

    if (mapContainerRef.current) {
      try {
        // @ts-ignore
        const AMap = window.AMap;
        
        const map = new AMap.Map(mapContainerRef.current, {
           zoom: 11,
           center: [121.4737, 31.2304], // Shanghai Center
           mapStyle: 'amap://styles/darkblue', // Dark theme map style
           resizeEnable: true,
           zoomEnable: true,
           scrollWheel: true,
           pitch: 50, // Tilt for 3D effect
           viewMode: '3D'
        });

        // Store instance
        mapInstanceRef.current = map;

        locations.forEach(loc => {
           if (loc.lng && loc.lat) {
             const markerContent = `
                <div class="relative flex items-center justify-center w-6 h-6">
                  <div class="absolute w-full h-full rounded-full animate-ping opacity-75 ${loc.status === 'busy' ? 'bg-red-500' : 'bg-cyan-400'}"></div>
                  <div class="relative w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${loc.type === 'transport' ? 'bg-amber-400' : (loc.status === 'busy' ? 'bg-red-500' : 'bg-cyan-400')}"></div>
                </div>
             `;
             
             // @ts-ignore
             const marker = new AMap.Marker({
                position: [loc.lng, loc.lat],
                title: loc.label,
                content: markerContent,
                offset: new AMap.Pixel(-12, -12)
             });
             marker.setMap(map);
             
             // Add tooltip on hover via Label
             marker.setLabel({
                offset: new AMap.Pixel(0, -35), 
                content: `<div class='bg-[#0b1121] text-cyan-400 text-xs font-bold px-2 py-1 rounded shadow border border-cyan-900/50'>${loc.label}</div>`,
                direction: 'top'
             });
           }
        });

        setIsMapLoaded(true);

        return () => {
          if (map) {
            map.destroy();
            mapInstanceRef.current = null;
          }
        };
      } catch (e) {
        console.error("Failed to initialize AMap:", e);
        setIsMapLoaded(false);
      }
    }
  }, [locations]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0b1121] rounded-lg border border-[#1e293b]">
      {/* Real Map Container */}
      <div 
        ref={mapContainerRef} 
        id="amap-container" 
        className={`w-full h-full absolute inset-0 z-0 transition-opacity duration-500 ${isMapLoaded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
      />
      
      {/* Fallback Mock Map (shows if Real Map fails or loading) */}
      {(!USE_REAL_MAP || !isMapLoaded) && (
        <MockMapOverlay locations={locations} />
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={handleZoomIn}
          className="w-8 h-8 bg-[#151e32] hover:bg-tech-cyan/20 text-slate-300 hover:text-tech-cyan rounded flex items-center justify-center border border-[#1e293b] shadow-lg transition-colors cursor-pointer"
          title="Zoom In"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-8 h-8 bg-[#151e32] hover:bg-tech-cyan/20 text-slate-300 hover:text-tech-cyan rounded flex items-center justify-center border border-[#1e293b] shadow-lg transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    </div>
  );
};