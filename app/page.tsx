'use client';

import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import useDashboardStore from '@/store/dashboardStore';

/**
 * Home page component
 * Initializes the dashboard store and renders the main Dashboard component
 */
export default function Home() {
  const initialize = useDashboardStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <Dashboard />;
}
