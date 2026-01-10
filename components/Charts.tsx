import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { ChartData, WorkloadDetailRecord } from '../types';
import { FileText, Settings, ChevronRight, X, User, Database } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchWorkloadData, fetchWorkloadDetails } from '../services/api';

/**
 * ======================================================================
 * 1. Product Bar Chart
 * ======================================================================
 */

interface ProductBarChartProps {
  data: ChartData[];
}

export const ProductBarChart: React.FC<ProductBarChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => {
    if (a.isLagging && !b.isLagging) return -1;
    if (!a.isLagging && b.isLagging) return 1;
    return 0;
  });

  return (
    <div className="w-full h-full overflow-y-auto pr-1 custom-scrollbar">
      <div className="flex flex-col gap-3">
        {sortedData.map((item, index) => (
          <div 
            key={index}
            className={`flex flex-col p-3 rounded border transition-all hover:border-tech-cyan/50 ${
              item.isLagging 
                ? 'bg-red-900/10 border-red-900/30' 
                : 'bg-[#0b1121]/40 border-[#1e293b]'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-200 truncate max-w-[70%]">{item.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button title="查看日志" className="text-slate-500 hover:text-tech-cyan transition-colors">
                  <FileText size={14} />
                </button>
                <button title="调整进度" className="text-slate-500 hover:text-tech-cyan transition-colors">
                  <Settings size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
               <div className="flex justify-between items-end text-xs mb-1">
                 <span className={`${item.isLagging ? 'text-red-400' : 'text-tech-blue'} font-semibold`}>
                   {item.statusLabel}
                 </span>
                 <span className="text-slate-400 font-mono font-medium">{item.progress}%</span>
               </div>
               
               <div className="w-full h-1.5 bg-[#0b1121] rounded-full overflow-hidden border border-[#1e293b]">
                 <div 
                   className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                     item.isLagging ? 'bg-red-500' : 'bg-gradient-to-r from-blue-600 to-cyan-400'
                   }`}
                   style={{ width: `${item.progress}%` }}
                 ></div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ======================================================================
 * 2. Status Pie Chart
 * ======================================================================
 */
const StatusTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0b1121]/95 backdrop-blur-md border border-tech-cyan/30 p-3 rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] max-w-[200px] z-50">
        <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
           <span className="text-sm font-bold" style={{ color: data.color }}>{data.name}</span>
           <span className="text-xs text-slate-400">Avg: {data.avgTime}</span>
        </div>
        <div className="space-y-1">
          {data.projectList?.map((proj: string, idx: number) => (
            <div key={idx} className="text-xs text-slate-300 truncate flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2 shrink-0"></span>
              <span className="truncate">{proj}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface StatusPieChartProps {
  data: ChartData[];
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-row items-center justify-between relative">
      <div className="flex-1 h-full relative min-w-[150px]">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                labelLine={{ stroke: '#475569', strokeWidth: 1, length: 15, length2: 15 } as any}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  if (percent < 0.05) return null;
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius * 1.4; 
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill="#94a3b8" 
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      className="text-[10px] lg:text-xs font-bold font-mono"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip content={<StatusTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner circle decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] rounded-full border border-tech-cyan/20 bg-tech-cyan/5 shadow-[0_0_10px_rgba(6,182,212,0.2)]"></div>
        </div>
      </div>

      <div className="w-[110px] lg:w-[130px] flex-shrink-0 flex flex-col justify-center gap-2 lg:gap-3 pr-2 border-l border-[#1e293b] pl-3 h-[85%] my-auto z-10 bg-[#0b1121]/30">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between group w-full">
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <span 
                className="w-2.5 h-2.5 rounded-[1px] shadow-[0_0_5px_currentColor]" 
                style={{ backgroundColor: item.color, color: item.color }}
              />
              <span className="text-[10px] lg:text-xs font-semibold text-slate-300 truncate" title={item.name}>
                {item.name}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium font-mono flex-shrink-0 ml-1">
              ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ======================================================================
 * 3. Workload Dashboard (Interactive)
 * ======================================================================
 */

const WorkloadDetailsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { language, t } = useLanguage();
  const [details, setDetails] = useState<WorkloadDetailRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchWorkloadDetails(language);
        setDetails(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [language]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#151e32] rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-[80vh] border border-tech-cyan/30">
         <div className="flex justify-between items-center p-5 border-b border-[#1e293b]">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-tech-cyan/10 rounded-lg text-tech-cyan border border-tech-cyan/20">
               <Database size={20} />
             </div>
             <h3 className="text-lg font-bold text-slate-100 tracking-wide">{t('label.detail')}</h3>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-[#1e293b] rounded-full">
             <X size={20} />
           </button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
           {loading ? (
             <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="w-8 h-8 border-2 border-tech-cyan border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-slate-400 font-medium">{t('loading')}</span>
             </div>
           ) : (
             <table className="w-full text-left border-collapse">
               <thead className="bg-[#0b1121] sticky top-0 z-10">
                 <tr>
                   <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'en' ? 'Employee' : '员工姓名'}</th>
                   <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'en' ? 'Role' : '岗位'}</th>
                   <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'en' ? 'Project' : '项目名称'}</th>
                   <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'en' ? 'Task' : '任务类型'}</th>
                   <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{language === 'en' ? 'Hours' : '工时'}</th>
                   <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{language === 'en' ? 'Status' : '状态'}</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#1e293b]">
                 {details.map((row) => (
                   <tr key={row.id} className="hover:bg-white/5 transition-colors">
                     <td className="px-5 py-3 text-sm font-medium text-slate-300 flex items-center gap-2">
                       <User size={14} className="text-slate-500" />
                       {row.employeeName}
                     </td>
                     <td className="px-5 py-3 text-sm text-slate-400">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border ${
                         row.role.includes('Design') || row.role.includes('设计') ? 'bg-sky-900/30 text-sky-400 border-sky-800' :
                         row.role.includes('Prod') || row.role.includes('生产') ? 'bg-indigo-900/30 text-indigo-400 border-indigo-800' :
                         'bg-slate-800 text-slate-400 border-slate-700'
                       }`}>
                         {row.role}
                       </span>
                     </td>
                     <td className="px-5 py-3 text-sm text-slate-400">{row.projectName}</td>
                     <td className="px-5 py-3 text-sm text-slate-500">{row.taskType}</td>
                     <td className="px-5 py-3 text-sm text-slate-300 font-mono font-bold text-right">{row.hoursSpent}h</td>
                     <td className="px-5 py-3 text-right">
                       <span className={`text-xs font-bold ${['Done', '已完成'].includes(row.status) ? 'text-emerald-400' : 'text-amber-400'}`}>
                         {row.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
         </div>

         <div className="p-4 border-t border-[#1e293b] bg-[#0b1121]/50 flex justify-end rounded-b-lg">
           <button 
             onClick={onClose}
             className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded transition-colors shadow-lg"
           >
             {t('label.close')}
           </button>
         </div>
      </div>
    </div>
  );
};

interface WorkloadDashboardProps {
  rate: number; 
  breakdown: { role: string; time: number; unit: string }[];
}

export const WorkloadGauge: React.FC<WorkloadDashboardProps> = ({ rate: initialRate, breakdown: initialBreakdown }) => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'cycle'>('week');
  const [currentRate, setCurrentRate] = useState(initialRate);
  const [currentBreakdown, setCurrentBreakdown] = useState(initialBreakdown);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    handleFilterChange('week');
  }, [language]);

  const handleFilterChange = async (filter: 'week' | 'month' | 'cycle') => {
    setTimeFilter(filter);
    setIsUpdating(true);
    try {
      const newData = await fetchWorkloadData(filter, language);
      setCurrentRate(newData.rate);
      setCurrentBreakdown(newData.breakdown);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col px-1 pb-1">
        <div className="flex justify-end mb-2 shrink-0 z-10">
          <div className="flex bg-[#0b1121] rounded p-0.5 border border-[#1e293b]">
            {['week', 'month', 'cycle'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter as any)}
                className={`px-3 py-0.5 text-[10px] font-medium rounded-sm transition-all leading-none ${
                  timeFilter === filter 
                    ? 'bg-tech-cyan text-black shadow-glow' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-[#1e293b]'
                }`}
              >
                {t(`filter.${filter}`)}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex flex-1 items-center gap-3 lg:gap-4 min-h-0 transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
          <div className="relative w-[70px] h-[70px] lg:w-[80px] lg:h-[80px] flex-shrink-0 ml-1">
             <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
               <circle cx="50%" cy="50%" r="42%" className="stroke-[#1e293b]" strokeWidth="12%" fill="none" />
               <circle 
                 cx="50%" cy="50%" r="42%" 
                 className="stroke-tech-cyan transition-all duration-1000 ease-out" 
                 strokeWidth="12%" 
                 fill="none" 
                 pathLength={100}
                 strokeDasharray="100"
                 strokeDashoffset={100 - currentRate}
                 strokeLinecap="round"
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center pt-0.5">
               <span className="text-xl lg:text-2xl font-black text-slate-100 tracking-tighter leading-none">{currentRate}%</span>
               <span className="text-[8px] lg:text-[9px] text-slate-500 font-bold uppercase mt-0.5 transform scale-90">{t('totalLoad')}</span>
             </div>
          </div>

          <div className="flex-1 space-y-1.5 pr-1 min-w-0 flex flex-col justify-center">
             {currentBreakdown?.map((item, idx) => {
               const specificColors = [
                  'bg-sky-500 shadow-[0_0_5px_#0ea5e9]',    // Design
                  'bg-indigo-500 shadow-[0_0_5px_#6366f1]', // Production
                  'bg-purple-500 shadow-[0_0_5px_#a855f7]', // Quality
                  'bg-slate-500'   // Logistics
               ];

               const maxExpected = timeFilter === 'cycle' ? 120 : (timeFilter === 'month' ? 30 : 5);
               const widthPct = Math.min((item.time / maxExpected) * 100, 100);

               return (
                 <div key={idx} className="flex flex-col gap-0.5 w-full">
                   <div className="flex justify-between items-end text-xs leading-none">
                     <span className="text-slate-400 font-semibold text-[10px] lg:text-xs truncate max-w-[55%]">{item.role}</span>
                     
                     <span className="text-tech-cyan font-bold font-mono whitespace-nowrap text-[10px] lg:text-xs flex-shrink-0 ml-1">
                       {item.time}<span className="text-[8px] lg:text-[10px] text-slate-500">{t('unit.hours')}</span> 
                     </span>
                   </div>
                   <div className="w-full h-1 lg:h-1.5 bg-[#0b1121] rounded-full overflow-hidden border border-[#1e293b]/50">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${specificColors[idx]}`}
                        style={{ width: `${widthPct}%` }} 
                      ></div>
                   </div>
                 </div>
               );
             })}
          </div>
        </div>

        <div className="flex justify-end mt-1 shrink-0">
          <button 
            onClick={() => setIsDetailOpen(true)}
            className="flex items-center text-[9px] lg:text-[10px] text-slate-500 hover:text-tech-cyan transition-colors group cursor-pointer font-medium"
          >
            {t('label.detail')}
            <ChevronRight size={10} className="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {isDetailOpen && <WorkloadDetailsModal onClose={() => setIsDetailOpen(false)} />}
    </>
  );
};