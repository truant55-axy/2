import React, { useEffect, useRef, useState } from 'react';
import { MapLocation } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Enabled Real Map
const USE_REAL_MAP = true; 

interface MapWidgetProps {
  locations: MapLocation[];
}


const MockMapOverlay: React.FC<{ locations: MapLocation[] }> = ({ locations }) => {
  const { t } = useLanguage();
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none bg-slate-50">
       {/* Grid Background */}
      <div className="absolute inset-0 opacity-40" 
           style={{
             backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Map Content Layer */}
      <div className="absolute inset-0 p-4 pointer-events-auto overflow-hidden rounded-2xl">
        {/* Simulated Road Network (Abstract SVGs) - Grey lines on white */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 stroke-slate-400" strokeWidth="2" fill="none">
          <path d="M100,100 Q250,50 400,150 T800,100" />
          <path d="M50,300 Q200,400 350,250 T700,350" />
          <path d="M300,50 L350,400" />
          <path d="M500,50 L450,400" />
          <circle cx="50%" cy="50%" r="150" stroke="#94a3b8" />
          <circle cx="50%" cy="50%" r="250" stroke="#cbd5e1" />
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
              <div className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${loc.status === 'busy' ? 'bg-rose-400' : 'bg-sky-400'}`}></div>
              {/* Core Dot */}
              <div className={`relative w-3 h-3 border-2 border-white rounded-full shadow-md ${loc.type === 'transport' ? 'bg-amber-400' : (loc.status === 'busy' ? 'bg-rose-500' : 'bg-sky-500')}`}></div>
            </div>

            {/* Tooltip Label - Light Theme */}
            <div className="absolute top-[-36px] left-1/2 transform -translate-x-1/2 bg-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
              {loc.label}
              <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b border-r border-slate-100 transform rotate-45"></div>
            </div>
          </div>
        ))}
        
        {/* Selected Highlight */}
        <div className="absolute top-[35%] left-[55%] pointer-events-none">
             <div className="w-24 h-24 -ml-12 -mt-12 border-2 border-sky-400/30 rounded-full animate-pulse"></div>
             <div className="absolute top-0 right-0 w-24 h-[1px] bg-gradient-to-l from-sky-400 to-transparent transform rotate-[-45deg] origin-bottom-left"></div>
             <div className="absolute top-[-45px] right-[-110px] bg-white/90 backdrop-blur border border-slate-200 p-2.5 rounded-lg text-xs shadow-lg">
                <p className="font-bold text-slate-800">五洲大道中心</p>
                <div className="flex items-center gap-1 mt-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                   <p className="text-slate-500">{t('map.normal')}</p>
                </div>
             </div>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-white/80 px-2 py-1 rounded text-[10px] text-slate-400 border border-slate-200">
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
           mapStyle: 'amap://styles/whitesmoke', // Light theme map style
           resizeEnable: true,
           zoomEnable: true,
           scrollWheel: true
        });

        // Store instance
        mapInstanceRef.current = map;

        locations.forEach(loc => {
           if (loc.lng && loc.lat) {
             const markerContent = `
                <div class="relative flex items-center justify-center w-6 h-6">
                  <div class="absolute w-full h-full rounded-full animate-ping opacity-75 ${loc.status === 'busy' ? 'bg-rose-400' : 'bg-sky-400'}"></div>
                  <div class="relative w-3 h-3 border-2 border-white rounded-full shadow-md ${loc.type === 'transport' ? 'bg-amber-400' : (loc.status === 'busy' ? 'bg-rose-500' : 'bg-sky-500')}"></div>
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
                offset: new AMap.Pixel(0, -30), 
                content: `<div class='bg-white text-slate-700 text-xs font-bold px-2 py-1 rounded shadow border border-slate-100'>${loc.label}</div>`,
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
    <div className="w-full h-full relative overflow-hidden bg-slate-50 rounded-xl">
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
          className="w-8 h-8 bg-white hover:bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm transition-colors cursor-pointer active:bg-slate-100"
          title="Zoom In"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white hover:bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm transition-colors cursor-pointer active:bg-slate-100"
          title="Zoom Out"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    </div>
  );
};
