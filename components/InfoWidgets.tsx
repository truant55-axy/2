import React, { useState } from 'react';
import { Search, Building2, ChevronRight, X, MapPin } from 'lucide-react';
import { Patient, Hospital } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface TotalOrdersWidgetProps {
  count: number;
}

export const TotalOrdersWidget: React.FC<TotalOrdersWidgetProps> = ({ count }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 font-sans tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        {count.toLocaleString()}
        <span className="text-lg text-tech-cyan ml-2 font-bold">{t('unit.orders')}</span>
      </div>
      <div className="w-24 h-1 bg-[#1e293b] mt-4 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-tech-cyan to-blue-600 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
      </div>
    </div>
  );
};

interface HospitalListWidgetProps {
  hospitals: Hospital[];
}

export const HospitalListWidget: React.FC<HospitalListWidgetProps> = ({ hospitals }) => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const { t } = useLanguage();

  return (
    <>
      <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
        <ul className="space-y-1">
          {hospitals.map((hospital) => (
            <li 
              key={hospital.id} 
              onClick={() => setSelectedHospital(hospital)}
              className="flex items-center text-sm text-slate-400 hover:text-tech-cyan hover:bg-[#1e293b]/50 transition-all cursor-pointer p-2.5 rounded group border border-transparent hover:border-tech-cyan/20"
            >
              <div className="w-8 h-8 rounded bg-[#0b1121] border border-[#1e293b] flex items-center justify-center mr-3 group-hover:border-tech-cyan/50 transition-colors shrink-0 shadow-inner">
                  <Building2 className="w-4 h-4 text-slate-500 group-hover:text-tech-cyan" />
              </div>
              <span className="truncate font-medium">{hospital.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hospital Detail Modal */}
      {selectedHospital && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all"
          onClick={() => setSelectedHospital(null)}
        >
          <div 
            className="bg-[#151e32] rounded-lg shadow-2xl w-full max-w-md p-6 relative border border-tech-cyan/30 animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 p-1 rounded-full text-slate-500 hover:bg-[#1e293b] hover:text-white transition-colors"
              onClick={() => setSelectedHospital(null)}
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 bg-[#0b1121] rounded-lg flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-tech-cyan/30">
                  <Building2 className="w-8 h-8 text-tech-cyan" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 text-center leading-tight px-4">
                {selectedHospital.name}
              </h3>
              {selectedHospital.location && (
                <div className="flex items-center mt-2 text-xs text-slate-400">
                  <MapPin size={12} className="mr-1" />
                  <span>{selectedHospital.location}</span>
                </div>
              )}
            </div>

            <div className="bg-[#0b1121]/50 rounded p-4 border border-[#1e293b]">
              <h4 className="text-xs font-bold text-tech-blue uppercase tracking-wider mb-2">{t('label.intro')}</h4>
              <div className="text-slate-300 text-sm leading-relaxed max-h-[40vh] overflow-y-auto custom-scrollbar text-justify">
                  {selectedHospital.description || t('label.no_desc')}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setSelectedHospital(null)}
                className="px-6 py-2 bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/50 text-sm font-bold rounded hover:bg-tech-cyan hover:text-black transition-colors shadow-glow"
              >
                {t('label.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface PatientListWidgetProps {
  patients: Patient[];
}

export const PatientListWidget: React.FC<PatientListWidgetProps> = ({ patients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-400 border-emerald-900/50 bg-emerald-900/10';
      case 'Sampling': return 'text-amber-400 border-amber-900/50 bg-amber-900/10';
      case 'Processing': return 'text-blue-400 border-blue-900/50 bg-blue-900/10';
      default: return 'text-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
        case 'Completed': return t('status.completed');
        case 'Sampling': return t('status.sampling');
        case 'Processing': return t('status.processing');
        default: return status;
    }
  }

  const filteredPatients = patients.filter(p => p.name.includes(searchTerm) || p.project.includes(searchTerm));

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="relative mb-4">
        <input 
          type="text" 
          placeholder={t('patient.search')}
          className="w-full bg-[#0b1121] border border-[#334155] text-slate-200 text-sm rounded pl-10 pr-4 py-2 focus:outline-none focus:border-tech-cyan focus:shadow-glow transition-all placeholder-slate-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="group bg-[#0b1121]/40 border border-[#1e293b] rounded p-3 hover:border-tech-cyan/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500">{patient.hospital}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(patient.status)}`}>
                {getStatusText(patient.status)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-slate-200 font-bold">{patient.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5 group-hover:text-tech-cyan transition-colors">{patient.project}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-tech-cyan transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};