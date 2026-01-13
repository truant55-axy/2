import React, { useState, useEffect } from 'react';
import { Header, DashboardCard, LoadingScreen, SearchSection, SearchResultsModal, HospitalNavBar } from './components/LayoutComponents';
import { ProductBarChart, StatusPieChart, WorkloadGauge, WorkloadFilter } from './components/Charts';
import { MapWidget } from './components/MapWidget';
import { TotalOrdersWidget, PatientListWidget } from './components/InfoWidgets';
import { Activity, PieChart, Clock, Map, Database, Users } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { searchGlobalData, fetchHospitalList, fetchWorkloadData } from './services/api';
import { SearchResults, Hospital } from './types';

const DashboardContent: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const { data, loading, error } = useDashboard(language, selectedHospitalId);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // Workload Widget State
  const [wlFilter, setWlFilter] = useState<'week'|'month'|'cycle'>('week');
  const [wlData, setWlData] = useState<{rate: number, breakdown: any[]} | null>(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

  // Initial Fetch of Hospital List
  useEffect(() => {
    const loadHospitals = async () => {
        const list = await fetchHospitalList(language);
        setHospitals(list);
    };
    loadHospitals();
  }, [language]);

  // Sync workload data when main data loads
  useEffect(() => {
    if (data) {
        setWlData({
            rate: data.workloadRate,
            breakdown: data.workloadBreakdown
        });
        setWlFilter('week');
    }
  }, [data]);

  const handleWlFilterChange = async (f: 'week'|'month'|'cycle') => {
    setWlFilter(f);
    try {
        const res = await fetchWorkloadData(f, language, selectedHospitalId);
        setWlData(res);
    } catch(e) { console.error(e); }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setIsSearchOpen(true);
    setIsSearching(true);
    setSearchResults(null);
    try {
      const results = await searchGlobalData(query, language);
      setSearchResults(results);
    } catch (e) { console.error(e); } finally { setIsSearching(false); }
  };

  if (loading && !data) {
    return <LoadingScreen />;
  }

  if (error || !data) {
    return <div className="min-h-screen bg-[#0b1121] flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    // Mobile: min-h-screen (scrollable). Desktop: h-screen (fixed).
    <div className="lg:h-screen lg:w-screen min-h-screen w-full bg-[#020617] text-slate-200 font-sans selection:bg-tech-cyan selection:text-black flex flex-col relative">
      {/* Background Grid - Fixed so it covers scroll on mobile */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>
      
      <div className="z-10 flex flex-col lg:h-full min-h-screen">
        <Header />
        
        {/* Navigation & Search Row */}
        {/* Removed fixed positioning on mobile to prevent overlap issues */}
        <div className="shrink-0 flex flex-col md:flex-row border-b border-[#1e293b] bg-[#020617] lg:bg-transparent z-40">
            <div className="flex-1 min-w-0">
                <HospitalNavBar 
                    hospitals={hospitals} 
                    selectedId={selectedHospitalId} 
                    onSelect={setSelectedHospitalId} 
                />
            </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-3 lg:p-3 lg:overflow-hidden flex flex-col min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-3 lg:h-full pb-10 lg:pb-0">
            
            {/* Left Column (25%) */}
            <div className="lg:col-span-3 flex flex-col gap-4 lg:gap-3 lg:h-full min-h-0">
              {/* Basic Data */}
              {/* Mobile: 320px fixed height. Desktop: 40% */}
              <DashboardCard title={t('card.basicData')} className="h-[320px] lg:h-[40%] lg:min-h-0 shrink-0" icon={<Database size={16} />}>
                <ProductBarChart data={data.productDistribution} />
              </DashboardCard>

              {/* Platform Data Summary */}
              {/* Mobile: 280px fixed height. Desktop: 35% */}
              <DashboardCard title={t('card.platformData')} className="h-[280px] lg:h-[35%] lg:min-h-0 shrink-0" icon={<PieChart size={16} />}>
                <StatusPieChart data={data.statusDistribution} />
              </DashboardCard>

               {/* Workload Stats */}
               {/* Mobile: 280px fixed height. Desktop: Flex fill */}
              <DashboardCard 
                title={t('card.workload')} 
                className="h-[280px] lg:flex-1 lg:min-h-0 shrink-0" 
                icon={<Clock size={16} />}
                extra={<WorkloadFilter filter={wlFilter} onChange={handleWlFilterChange} />}
              >
                {wlData && (
                    <WorkloadGauge 
                        rate={wlData.rate} 
                        breakdown={wlData.breakdown} 
                        period={wlFilter}
                    />
                )}
              </DashboardCard>
            </div>

            {/* Center Column (55%) - Map */}
            <div className="lg:col-span-6 lg:h-full flex flex-col min-h-0 gap-4 lg:gap-0">
               {/* Search Section */}
               <div className="mb-0 lg:mb-2 shrink-0">
                 <SearchSection onSearch={handleSearch} />
               </div>
               
               {/* Map Card */}
               {/* Mobile: 400px fixed height. Desktop: Flex fill */}
               <DashboardCard title={selectedHospitalId ? hospitals.find(h=>h.id === selectedHospitalId)?.name || t('card.map') : t('card.map')} className="h-[400px] lg:flex-1 shadow-glow-strong border-tech-cyan/30 lg:min-h-0 shrink-0" icon={<Map size={16} />}>
                 <MapWidget locations={data.mapLocations} />
               </DashboardCard>
            </div>

            {/* Right Column (20%) */}
            <div className="lg:col-span-3 flex flex-col gap-4 lg:gap-3 lg:h-full min-h-0">
              {/* Total Orders */}
              {/* Mobile: 140px fixed height. Desktop: 20% */}
              <DashboardCard title={t('card.totalOrders')} className="h-[140px] lg:h-[20%] lg:min-h-[120px] shrink-0" icon={<Activity size={16} />}>
                <TotalOrdersWidget count={data.totalOrders} />
              </DashboardCard>

              {/* Patient List */}
              {/* Mobile: 600px fixed height (plenty of scrolling room). Desktop: Flex fill */}
              <DashboardCard title={t('card.patientList')} className="h-[600px] lg:flex-1 lg:min-h-0 shrink-0" icon={<Users size={16} />}>
                <PatientListWidget patients={data.patients} />
              </DashboardCard>
            </div>

          </div>
        </main>
      </div>

      {isSearchOpen && (
        <SearchResultsModal 
          onClose={() => setIsSearchOpen(false)} 
          results={searchResults}
          isLoading={isSearching}
          query={searchQuery}
        />
      )}
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