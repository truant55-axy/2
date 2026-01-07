import React, { useState } from 'react';
import { Search, Building2, User, ChevronRight, X, MapPin } from 'lucide-react';
import { Patient, Hospital } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface TotalOrdersWidgetProps {
  count: number;
}

export const TotalOrdersWidget: React.FC<TotalOrdersWidgetProps> = ({ count }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-700 font-sans tracking-tight">
        {count.toLocaleString()}
        <span className="text-lg text-slate-400 ml-2 font-bold">{t('unit.orders')}</span>
      </div>
      <div className="w-24 h-1 bg-slate-100 mt-4 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-600 animate-pulse"></div>
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
              className="flex items-center text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer p-2.5 rounded-lg group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-blue-50 transition-colors shrink-0">
                  <Building2 className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </div>
              <span className="truncate font-medium">{hospital.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hospital Detail Modal */}
      {selectedHospital && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm transition-all"
          onClick={() => setSelectedHospital(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              onClick={() => setSelectedHospital(null)}
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-blue-50">
                  <Building2 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 text-center leading-tight px-4">
                {selectedHospital.name}
              </h3>
              {selectedHospital.location && (
                <div className="flex items-center mt-2 text-xs text-slate-400">
                  <MapPin size={12} className="mr-1" />
                  <span>{selectedHospital.location}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('label.intro')}</h4>
              <div className="text-slate-600 text-sm leading-relaxed max-h-[40vh] overflow-y-auto custom-scrollbar text-justify">
                  {selectedHospital.description || t('label.no_desc')}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setSelectedHospital(null)}
                className="px-6 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200"
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
      case 'Completed': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Sampling': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Processing': return 'text-blue-600 bg-blue-50 border-blue-100';
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
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="group bg-white border border-slate-100 rounded-xl p-3.5 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-400">{patient.hospital}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(patient.status)}`}>
                {getStatusText(patient.status)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-slate-800 font-bold">{patient.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{patient.project}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};