import React, { ReactNode, useRef, useState } from 'react';
import { Search, Globe, Clock, ChevronRight, X, User, Building2, MapPin, Package, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SearchResults, Hospital } from '../types';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  extra?: ReactNode;
}

export const DashboardCard: React.FC<CardProps> = ({ title, children, className = "", icon, extra }) => {
  return (
    <div className={`relative flex flex-col bg-[#151e32]/80 backdrop-blur-sm border border-[#1e293b] shadow-glow rounded-lg ${className}`}>
      {/* Decorative corner accents matching the reference image style */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-tech-cyan/50 rounded-tl-sm"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-tech-cyan/50 rounded-tr-sm"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-tech-cyan/50 rounded-bl-sm"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-tech-cyan/50 rounded-br-sm"></div>

      {/* Tech Header Style */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e293b]/60 bg-gradient-to-r from-[#1e293b]/40 to-transparent shrink-0">
        <div className="flex items-center gap-2 overflow-hidden mr-auto">
           {/* Cyan orb indicator */}
           <div className="w-1.5 h-1.5 rounded-full bg-tech-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)] shrink-0"></div>
           <h3 className="text-sm font-bold text-slate-100 tracking-wider font-sans truncate">{title}</h3>
        </div>
        
        {/* Right Side: Extra Controls + Icon */}
        <div className="flex items-center gap-3 ml-2 shrink-0">
            {extra && <div className="flex items-center">{extra}</div>}
            {icon && <div className="text-tech-cyan opacity-70 scale-90 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] shrink-0">{icon}</div>}
        </div>
      </div>
      <div className="flex-1 p-2 overflow-hidden relative flex flex-col">
        {children}
      </div>
    </div>
  );
};

export const LoadingScreen: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 bg-[#0b1121] z-[100] flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-2 border-[#1e293b] rounded-full"></div>
        <div className="absolute inset-0 border-2 border-t-tech-cyan border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
        <div className="absolute inset-4 border-2 border-b-tech-blue border-t-transparent border-l-transparent border-r-transparent rounded-full animate-spin-slow"></div>
      </div>
      <h2 className="mt-6 text-tech-cyan font-bold tracking-[0.2em] text-lg animate-pulse">{t('loading')}</h2>
    </div>
  );
};

interface HospitalNavBarProps {
    hospitals: Hospital[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
}

export const HospitalNavBar: React.FC<HospitalNavBarProps> = ({ hospitals, selectedId, onSelect }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full bg-[#151e32]/30 border-b border-[#1e293b] py-2 px-4 backdrop-blur-md flex items-center gap-4">
            <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded border transition-all cursor-pointer hover:shadow-glow shrink-0"
                style={{
                    backgroundColor: selectedId === null ? 'rgba(6, 182, 212, 0.2)' : 'rgba(11, 17, 33, 0.5)',
                    borderColor: selectedId === null ? '#06b6d4' : '#334155',
                    color: selectedId === null ? '#fff' : '#94a3b8'
                }}
                onClick={() => onSelect(null)}
            >
                <LayoutGrid size={14} />
                <span className="text-xs font-bold tracking-wide">总体数据</span>
            </div>

            <div className="h-6 w-[1px] bg-[#334155] shrink-0 mx-1"></div>

            <div 
                ref={scrollRef}
                className="flex-1 flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1"
                style={{ scrollbarWidth: 'none' }} 
            >
                {hospitals.map(hospital => (
                    <button
                        key={hospital.id}
                        onClick={() => onSelect(hospital.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all whitespace-nowrap group ${
                            selectedId === hospital.id 
                            ? 'bg-tech-cyan/20 border-tech-cyan text-white shadow-glow' 
                            : 'bg-[#0b1121]/50 border-[#334155] text-slate-400 hover:border-tech-cyan/50 hover:text-slate-200'
                        }`}
                    >
                        <Building2 size={12} className={selectedId === hospital.id ? 'text-tech-cyan' : 'text-slate-500 group-hover:text-tech-cyan'} />
                        <span className="text-xs font-medium">{hospital.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  const handleClick = () => {
    onSearch(query);
  };

  return (
    <div className="bg-[#151e32]/50 border-y border-[#1e293b] py-2 px-4 flex items-center gap-4 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 text-tech-cyan shrink-0">
            <Search size={14} />
            <span className="text-xs font-bold tracking-wide text-slate-200">{t('search.title')}</span>
        </div>
        
        <div className="flex-1 flex items-center max-w-lg gap-2">
            <input 
                type="text" 
                placeholder={t('search.placeholder')}
                className="flex-1 h-7 bg-[#0b1121]/50 border border-[#334155] px-3 focus:outline-none focus:border-tech-cyan focus:shadow-glow text-xs text-slate-300 placeholder-slate-600 transition-all rounded-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleClick}
              className="bg-tech-cyan/10 border border-tech-cyan/50 text-tech-cyan h-7 px-4 font-bold hover:bg-tech-cyan hover:text-black transition-all text-xs rounded-sm shadow-glow"
            >
                {t('search.button')}
            </button>
        </div>
    </div>
  );
};

export const Header: React.FC = () => {
  const [time, setTime] = React.useState(new Date());
  const { language, setLanguage, t } = useLanguage();

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const dateStr = language === 'en' 
      ? date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
      : date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    
    const timeStr = date.toLocaleTimeString(language === 'en' ? 'en-US' : 'zh-CN', { hour12: false });
    const weekStr = date.toLocaleString(language === 'en' ? 'en-US' : 'zh-CN', { weekday: language === 'en' ? 'short' : 'long' });

    return { dateStr, timeStr, weekStr };
  };

  const { dateStr, timeStr, weekStr } = formatDateTime(time);

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="flex flex-col w-full z-50 relative bg-[#0b1121] border-b border-[#1e293b] shrink-0">
        <div className="h-14 lg:h-16 px-4 lg:px-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tech-cyan/50 to-transparent"></div>
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '30px 30px'}}></div>

            <div className="flex items-center gap-4 z-10">
                <div className="flex flex-col">
                    <h1 className="font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200 tracking-widest leading-none flex flex-col lg:flex-row lg:items-end gap-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        <span className="text-xl lg:text-2xl">{t('app.title')}</span>
                        <span className="text-xs lg:text-sm font-medium text-tech-cyan opacity-80 tracking-[0.2em] border-l-2 border-tech-cyan pl-3 mb-1">{t('app.subtitle')}</span>
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-6 z-10">
               <div className="hidden md:flex flex-col items-end text-right">
                  <div className="text-lg font-mono font-bold text-tech-cyan leading-none drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                    {timeStr}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium tracking-wider flex gap-2 mt-0.5">
                    <span>{dateStr}</span>
                    <span className="text-tech-blue">{weekStr}</span>
                  </div>
               </div>

               <button 
                 className="flex items-center gap-2 px-2 py-1 border border-tech-blue/30 bg-tech-blue/10 hover:bg-tech-blue/20 text-tech-blue rounded text-[10px] transition-all font-bold tracking-wide" 
                 onClick={toggleLanguage}
               >
                 <Globe size={12} />
                 <span>{t('lang.switch')}</span>
               </button>
            </div>
        </div>
    </div>
  );
};

interface SearchResultsModalProps {
  onClose: () => void;
  results: SearchResults | null;
  isLoading: boolean;
  query: string;
}

export const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ onClose, results, isLoading, query }) => {
  const { t } = useLanguage();
  if (!results && !isLoading) return null;
  const hasResults = results && (results.products.length > 0 || results.hospitals.length > 0 || results.patients.length > 0 || results.locations.length > 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-32 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#151e32] border border-tech-cyan/50 w-full max-w-4xl rounded-lg flex flex-col max-h-[70vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-[#1e293b] bg-[#0b1121]">
          <div className="text-slate-100 font-bold">{t('search.results')} "{query}"</div>
          <button onClick={onClose}><X size={20} className="text-slate-500 hover:text-white"/></button>
        </div>
        <div className="p-6 overflow-y-auto">
             {isLoading ? <div className="text-center text-tech-cyan">Searching...</div> : !hasResults ? <div className="text-center text-slate-500">No results</div> : (
                 <div className="text-slate-300">Found {results?.products.length} products, {results?.patients.length} patients...</div>
             )}
        </div>
      </div>
    </div>
  );
};