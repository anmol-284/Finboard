'use client';

import { useEffect, useState, useMemo } from 'react';
import { RefreshCw, Settings, Trash2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useDashboardStore from '@/store/dashboardStore';
import { fetchApiData, getNestedValue } from '@/utils/api';
import { Widget } from '@/types/widget';
import { format } from 'date-fns';

interface WidgetChartProps {
  widget: Widget;
}

export default function WidgetChart({ widget }: WidgetChartProps) {
  const updateWidget = useDashboardStore((state) => state.updateWidget);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Transform data for chart
  const chartData = useMemo(() => {
    if (!widget.data || widget.selectedFields.length === 0) return [];

    // Try to find time series data
    const data = widget.data;
    
    // If we have selected fields, use them
    if (widget.selectedFields.length >= 2) {
      // Assume first field is X-axis, others are Y-axis
      const xField = widget.selectedFields[0];
      const yFields = widget.selectedFields.slice(1);

      // Try to extract array data
      const arrayValue = getNestedValue(data, xField.path);
      if (Array.isArray(arrayValue)) {
        return arrayValue.map((item: any, index: number) => {
          const result: any = {
            name: item[xField.path.split('.').pop() || 'name'] || index,
          };
          yFields.forEach((field) => {
            const value = typeof item === 'object' ? getNestedValue(item, field.path) : null;
            result[field.path.split('.').pop() || 'value'] = value;
          });
          return result;
        });
      }
    }

    // Fallback: try to find any time series structure
    const keys = Object.keys(data);
    for (const key of keys) {
      const value = data[key];
      if (Array.isArray(value) && value.length > 0) {
        return value.map((item: any, index: number) => {
          if (typeof item === 'object' && item !== null) {
            return item;
          }
          return { name: index, value: item };
        });
      }
    }

    return [];
  }, [widget.data, widget.selectedFields]);

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative group min-h-[400px]">
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
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px]">
        {widget.isLoading && !widget.data ? (
          <div className="flex items-center justify-center h-full">
            <RefreshCw className="animate-spin text-green-500" size={32} />
          </div>
        ) : widget.error ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 text-red-800 dark:text-red-400">
              {widget.error}
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            No chart data available. Please select appropriate fields for time series data.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb',
                }}
              />
              <Legend />
              {widget.selectedFields.slice(1).map((field, index) => {
                const dataKey = field.path.split('.').pop() || 'value';
                return (
                  <Line
                    key={field.path}
                    type="monotone"
                    dataKey={dataKey}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    name={field.label || dataKey}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
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
