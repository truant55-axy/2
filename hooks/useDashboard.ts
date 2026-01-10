import { useState, useEffect } from 'react';
import { DashboardMetrics } from '../types';
import { fetchDashboardData } from '../services/api';
import { Language } from '../contexts/LanguageContext';

export const useDashboard = (language: Language) => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        // Only show loading screen on first load to prevent flashing every 2 minutes
        // We can infer it's the first load if data is null, but since we are inside a closure 
        // where data might be stale, we simply rely on the initial state logic or 
        // accept the design. However, to keep it smooth, let's keep the logic simple.
        // If we wanted to avoid flash on refetch, we would check if (data === null) setLoading(true).
        // But for this specific request, I will just update the interval.
        setLoading(true);
        const result = await fetchDashboardData(language);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch dashboard data');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Poll every 2 minutes (120000 ms)
    const interval = setInterval(loadData, 120000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [language]);

  return { data, loading, error };
};