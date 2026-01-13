import { useState, useEffect } from 'react';
import { DashboardMetrics } from '../types';
import { fetchDashboardData } from '../services/api';
import { Language } from '../contexts/LanguageContext';

export const useDashboard = (language: Language, hospitalId: number | null) => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        // Pass hospitalId to the fetch function
        const result = await fetchDashboardData(language, hospitalId);
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

    // Poll every 2 minutes
    const interval = setInterval(loadData, 120000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [language, hospitalId]); // Refetch when hospitalId changes

  return { data, loading, error };
};