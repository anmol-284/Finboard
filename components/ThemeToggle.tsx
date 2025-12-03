'use client';

import { Moon, Sun } from 'lucide-react';
import useDashboardStore from '@/store/dashboardStore';

export default function ThemeToggle() {
  const theme = useDashboardStore((state) => state.theme);
  const setTheme = useDashboardStore((state) => state.setTheme);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="text-yellow-500" size={20} /> : <Moon className="text-gray-700" size={20} />}
    </button>
  );
}
