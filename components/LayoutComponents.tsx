import React, { ReactNode } from 'react';
import { Search, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export const DashboardCard: React.FC<CardProps> = ({ title, children, className = "", icon }) => {
  return (
    <div className={`relative flex flex-col bg-white border border-slate-200 shadow-sm ${className}`}>
      {/* Formal Header Style */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
           {/* Blue rectangular indicator */}
           <div className="w-1 h-4 bg-[#0055a6]"></div>
           <h3 className="text-base font-bold text-[#0055a6] tracking-wide font-sans">{title}</h3>
        </div>
        {icon && <div className="text-slate-400 opacity-50 scale-90">{icon}</div>}
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
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#0055a6] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="mt-6 text-[#003366] font-bold tracking-widest text-lg">{t('loading')}</h2>
    </div>
  );
};

export const SearchSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-[#f9fafb] border-b border-slate-200 py-5 px-4 lg:px-8 flex flex-col md:flex-row items-center gap-6 shadow-inner">
        <div className="flex items-center gap-3 text-[#0055a6] shrink-0">
            <div className="w-10 h-10 rounded-full border-2 border-[#0055a6] flex items-center justify-center bg-white">
                <Search size={20} strokeWidth={3} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-wide">{t('search.title')}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0055a6]/70">{t('search.subtitle')}</span>
            </div>
        </div>
        
        <div className="flex-1 flex items-center w-full max-w-4xl gap-0">
            <div className="relative flex-1">
                <input 
                    type="text" 
                    placeholder={t('search.placeholder')}
                    className="w-full h-10 border border-[#0055a6] pl-4 pr-4 focus:outline-none focus:ring-1 focus:ring-[#0055a6] text-sm text-slate-700 placeholder-slate-400"
                />
            </div>
            <button className="bg-[#0055a6] text-white h-10 px-8 font-medium hover:bg-[#004488] transition-colors text-sm tracking-widest">
                {t('search.button')}
            </button>
        </div>
        
        <div className="hidden xl:flex text-xs text-slate-600 gap-4 items-center">
             <span className="bg-[#e91e63] text-white px-1.5 py-0.5 rounded-[2px] font-bold">{t('search.hotwords')}</span>
             <div className="flex gap-4 font-medium text-slate-500">
                <span className="hover:text-[#0055a6] cursor-pointer hover:underline">GDP</span>
                <span className="hover:text-[#0055a6] cursor-pointer hover:underline">CPI</span>
                <span className="hover:text-[#0055a6] cursor-pointer hover:underline">3D打印</span>
                <span className="hover:text-[#0055a6] cursor-pointer hover:underline">矫正器订单</span>
                <span className="hover:text-[#0055a6] cursor-pointer hover:underline">耗材库存</span>
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

  const formatDate = (date: Date) => {
    // If language is en, use standard EN format
    if (language === 'en') {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit', weekday: 'long' });
    }
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="flex flex-col w-full shadow-md z-50 relative bg-white">
        {/* Top Utility Bar - Dark Blue */}
        <div className="bg-[#1e50a2] text-white text-[11px] py-1.5 px-4 lg:px-8 flex justify-between items-center">
           <div className="opacity-80 font-mono tracking-tight text-[10px]">
              {formatDate(time)}
           </div>
           
           <div className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition-colors" onClick={toggleLanguage}>
             <Globe size={12} />
             <span className="font-bold tracking-wide">{t('lang.switch')}</span>
           </div>
        </div>

        {/* Main Banner - Gradient Blue with Pattern */}
        <div className="relative bg-gradient-to-r from-[#0092ff] via-[#0070d6] to-[#0055a6] h-24 lg:h-28 px-6 lg:px-8 flex items-center justify-between overflow-hidden">
            {/* Abstract Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" 
                 style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px'}}>
            </div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>

            <div className="flex items-center gap-4 z-10 w-full">
                {/* Logo Area */}
                <div className="flex flex-col border-l-[5px] border-yellow-400 pl-5 py-2">
                    <h1 className="font-sans font-bold text-white tracking-widest drop-shadow-md leading-none flex flex-col lg:flex-row lg:items-end gap-1.5 lg:gap-4">
                        <span className="text-4xl lg:text-5xl">{t('app.title')}</span>
                        <span className="text-xl lg:text-3xl font-light opacity-95 tracking-widest pb-1">{t('app.subtitle')}</span>
                    </h1>
                </div>
            </div>
        </div>
    </div>
  );
};