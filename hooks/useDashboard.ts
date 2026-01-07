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

    // Poll every 30s
    const interval = setInterval(loadData, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [language]);

  return { data, loading, error };
};