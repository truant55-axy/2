import React, { ReactNode } from 'react';
import { Search, Globe, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export const DashboardCard: React.FC<CardProps> = ({ title, children, className = "", icon }) => {
  return (
    <div className={`relative flex flex-col bg-[#151e32]/80 backdrop-blur-sm border border-[#1e293b] shadow-glow rounded-lg ${className}`}>
      {/* Decorative corner accents matching the reference image style */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-tech-cyan/50 rounded-tl-sm"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-tech-cyan/50 rounded-tr-sm"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-tech-cyan/50 rounded-bl-sm"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-tech-cyan/50 rounded-br-sm"></div>

      {/* Tech Header Style */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]/60 bg-gradient-to-r from-[#1e293b]/40 to-transparent">
        <div className="flex items-center gap-2">
           {/* Cyan orb indicator */}
           <div className="w-2 h-2 rounded-full bg-tech-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
           <h3 className="text-sm font-bold text-slate-100 tracking-wider font-sans">{title}</h3>
        </div>
        {icon && <div className="text-tech-cyan opacity-70 scale-90 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">{icon}</div>}
      </div>
      <div className="flex-1 p-4 overflow-hidden relative">
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

export const SearchSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-[#151e32]/50 border-y border-[#1e293b] py-3 px-4 lg:px-8 flex flex-col md:flex-row items-center gap-6 backdrop-blur-md">
        <div className="flex items-center gap-3 text-tech-cyan shrink-0">
            <div className="w-8 h-8 rounded border border-tech-cyan/30 flex items-center justify-center bg-[#0b1121] shadow-glow">
                <Search size={16} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-wide text-slate-200">{t('search.title')}</span>
            </div>
        </div>
        
        <div className="flex-1 flex items-center w-full max-w-4xl gap-2">
            <div className="relative flex-1 group">
                <input 
                    type="text" 
                    placeholder={t('search.placeholder')}
                    className="w-full h-8 bg-[#0b1121]/50 border border-[#334155] pl-4 pr-4 focus:outline-none focus:border-tech-cyan focus:shadow-glow text-xs text-slate-300 placeholder-slate-600 transition-all rounded-sm"
                />
            </div>
            <button className="bg-tech-cyan/10 border border-tech-cyan/50 text-tech-cyan h-8 px-6 font-bold hover:bg-tech-cyan hover:text-black transition-all text-xs tracking-wider rounded-sm shadow-glow">
                {t('search.button')}
            </button>
        </div>
        
        <div className="hidden xl:flex text-xs text-slate-500 gap-4 items-center">
             <span className="text-tech-blue/80 px-1.5 py-0.5 border border-tech-blue/30 rounded-[2px] font-bold text-[10px]">{t('search.hotwords')}</span>
             <div className="flex gap-4 font-medium text-slate-400">
                <span className="hover:text-tech-cyan cursor-pointer transition-colors">GDP</span>
                <span className="hover:text-tech-cyan cursor-pointer transition-colors">3D打印</span>
                <span className="hover:text-tech-cyan cursor-pointer transition-colors">矫正器</span>
             </div>
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
    // Return distinct parts for styling
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
    <div className="flex flex-col w-full z-50 relative bg-[#0b1121] border-b border-[#1e293b]">
        {/* Main Tech Header */}
        <div className="h-16 lg:h-20 px-4 lg:px-8 flex items-center justify-between relative overflow-hidden">
            {/* Top decorative line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tech-cyan/50 to-transparent"></div>
            
            {/* Background Mesh (Subtle) */}
            <div className="absolute inset-0 opacity-20" 
                 style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '30px 30px'}}>
            </div>

            {/* Left: Logo/Title */}
            <div className="flex items-center gap-4 z-10">
                <div className="flex flex-col">
                    <h1 className="font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200 tracking-widest leading-none flex flex-col lg:flex-row lg:items-end gap-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        <span className="text-2xl lg:text-3xl">{t('app.title')}</span>
                        <span className="text-sm lg:text-base font-medium text-tech-cyan opacity-80 tracking-[0.2em] border-l-2 border-tech-cyan pl-3 mb-1">{t('app.subtitle')}</span>
                    </h1>
                </div>
            </div>

            {/* Right: Actions & Time */}
            <div className="flex items-center gap-6 z-10">
               {/* Time Widget */}
               <div className="hidden md:flex flex-col items-end text-right">
                  <div className="text-xl font-mono font-bold text-tech-cyan leading-none drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                    {timeStr}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium tracking-wider flex gap-2 mt-1">
                    <span>{dateStr}</span>
                    <span className="text-tech-blue">{weekStr}</span>
                  </div>
               </div>

               {/* Lang Switch */}
               <button 
                 className="flex items-center gap-2 px-3 py-1.5 border border-tech-blue/30 bg-tech-blue/10 hover:bg-tech-blue/20 text-tech-blue rounded text-xs transition-all font-bold tracking-wide" 
                 onClick={toggleLanguage}
               >
                 <Globe size={14} />
                 <span>{t('lang.switch')}</span>
               </button>
            </div>
        </div>
    </div>
  );
};