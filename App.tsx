import React from 'react';
import { Header, DashboardCard, LoadingScreen, SearchSection } from './components/LayoutComponents';
import { ProductBarChart, StatusPieChart, WorkloadGauge } from './components/Charts';
import { MapWidget } from './components/MapWidget';
import { TotalOrdersWidget, HospitalListWidget, PatientListWidget } from './components/InfoWidgets';
import { Activity, PieChart, Clock, Map, Database, Users, Building } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const DashboardContent: React.FC = () => {
  const { language, t } = useLanguage();
  const { data, loading, error } = useDashboard(language);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0b1121] flex items-center justify-center text-red-500 font-mono">
        Error loading dashboard data: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-tech-cyan selection:text-black flex flex-col overflow-hidden relative">
      {/* Global Background Grid Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{
               backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.5) 1px, transparent 1px)',
               backgroundSize: '50px 50px'
           }}>
      </div>
      
      <div className="z-10 flex flex-col h-full">
        <Header />
        <SearchSection />
        
        <main className="flex-1 p-3 lg:p-5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
            
            {/* Left Column (25%) */}
            <div className="lg:col-span-3 flex flex-col gap-5 h-full overflow-y-auto custom-scrollbar pr-1">
              {/* Basic Data - Enhanced List View */}
              <DashboardCard title={t('card.basicData')} className="flex-1 min-h-[300px]" icon={<Database size={16} />}>
                <ProductBarChart data={data.productDistribution} />
              </DashboardCard>

              {/* Platform Data Summary - Enhanced Pie */}
              <DashboardCard title={t('card.platformData')} className="h-[280px]" icon={<PieChart size={16} />}>
                <StatusPieChart data={data.statusDistribution} />
              </DashboardCard>

               {/* Workload Stats - Enhanced Dashboard */}
              <DashboardCard title={t('card.workload')} className="h-[200px]" icon={<Clock size={16} />}>
                <WorkloadGauge rate={data.workloadRate} breakdown={data.workloadBreakdown} />
              </DashboardCard>
            </div>

            {/* Center Column (50%) - Map */}
            <div className="lg:col-span-6 h-full flex flex-col min-h-[400px]">
               <DashboardCard title={t('card.map')} className="h-full shadow-glow-strong border-tech-cyan/30" icon={<Map size={16} />}>
                 <MapWidget locations={data.mapLocations} />
               </DashboardCard>
            </div>

            {/* Right Column (25%) */}
            <div className="lg:col-span-3 flex flex-col gap-5 h-full overflow-y-auto custom-scrollbar pl-1">
              {/* Total Orders */}
              <DashboardCard title={t('card.totalOrders')} className="h-[150px]" icon={<Activity size={16} />}>
                <TotalOrdersWidget count={data.totalOrders} />
              </DashboardCard>

              {/* Basic Info (Hospitals) */}
              <DashboardCard title={t('card.basicInfo')} className="flex-1 min-h-[200px]" icon={<Building size={16} />}>
                <HospitalListWidget hospitals={data.hospitals} />
              </DashboardCard>

              {/* Patient List */}
              <DashboardCard title={t('card.patientList')} className="flex-1 min-h-[300px]" icon={<Users size={16} />}>
                <PatientListWidget patients={data.patients} />
              </DashboardCard>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  );
}