'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Settings, Trash2, Clock } from 'lucide-react';
import useDashboardStore from '@/store/dashboardStore';
import { fetchApiData, getNestedValue } from '@/utils/api';
import { Widget } from '@/types/widget';
import { format } from 'date-fns';

interface WidgetCardProps {
  widget: Widget;
}

export default function WidgetCard({ widget }: WidgetCardProps) {
  const updateWidget = useDashboardStore((state) => state.updateWidget);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    updateWidget(widget.id, { isLoading: true, error: undefined });

    try {
      const response = await fetchApiData(widget.apiUrl);
      
      if (response.error) {
        updateWidget(widget.id, {
          error: response.error,
          isLoading: false,
        });
      } else {
        updateWidget(widget.id, {
          data: response.data,
          lastUpdated: new Date(),
          isLoading: false,
          error: undefined,
        });
      }
    } catch (error: any) {
      updateWidget(widget.id, {
        error: error.message || 'Failed to fetch data',
        isLoading: false,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, widget.refreshInterval * 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget.apiUrl, widget.refreshInterval, widget.id]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this widget?')) {
      removeWidget(widget.id);
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      // Check if it looks like currency
      if (value > 1000) {
        return new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 2,
        }).format(value);
      }
      return value.toString();
    }
    return String(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative group min-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{widget.name}</h3>
          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            {widget.refreshInterval}s
          </span>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw
              size={16}
              className={`text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Settings"
          >
            <Settings size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {widget.isLoading && !widget.data ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-green-500" size={32} />
          </div>
        ) : widget.error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 text-red-800 dark:text-red-400">
            {widget.error}
          </div>
        ) : widget.data && widget.selectedFields.length > 0 ? (
          <div className="space-y-3">
            {widget.selectedFields.map((field, index) => {
              const value = getNestedValue(widget.data, field.path);
              return (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {field.label || field.path.split('.').pop()}
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{formatValue(value)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No fields selected
          </div>
        )}
      </div>

      {/* Footer */}
      {widget.lastUpdated && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={12} />
          <span>Last updated: {format(widget.lastUpdated, 'HH:mm:ss')}</span>
        </div>
      )}
    </div>
  );
}
