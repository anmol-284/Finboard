'use client';

import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import useDashboardStore from '@/store/dashboardStore';

export default function Home() {
  const initialize = useDashboardStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <Dashboard />;
}
