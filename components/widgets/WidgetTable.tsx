'use client';

import { useEffect, useState, useMemo } from 'react';
import { RefreshCw, Settings, Trash2, Clock, Search } from 'lucide-react';
import useDashboardStore from '@/store/dashboardStore';
import { fetchApiData, getNestedValue, flattenObject } from '@/utils/api';
import { Widget } from '@/types/widget';
import { format } from 'date-fns';

interface WidgetTableProps {
  widget: Widget;
}

export default function WidgetTable({ widget }: WidgetTableProps) {
  const updateWidget = useDashboardStore((state) => state.updateWidget);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

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

  // Extract array data from API response
  const tableData = useMemo(() => {
    if (!widget.data) return [];

    // Try to find array in selected fields
    for (const field of widget.selectedFields) {
      const value = getNestedValue(widget.data, field.path);
      if (Array.isArray(value) && value.length > 0) {
        return value;
      }
    }

    // Try to find any array in the data
    const flattened = flattenObject(widget.data);
    const arrayField = flattened.find((f) => f.type === 'array' && Array.isArray(f.value) && f.value.length > 0);
    if (arrayField && Array.isArray(arrayField.value)) {
      return arrayField.value;
    }

    return [];
  }, [widget.data, widget.selectedFields]);

  // Get table columns from first item
  const columns = useMemo(() => {
    if (tableData.length === 0) return [];
    const firstItem = tableData[0];
    if (typeof firstItem === 'object' && firstItem !== null) {
      return Object.keys(firstItem);
    }
    return [];
  }, [tableData]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...tableData];

    // Filter
    if (searchQuery) {
      result = result.filter((row) => {
        if (typeof row === 'object' && row !== null) {
          return Object.values(row).some((val) =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return String(row).toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Sort
    if (sortConfig && typeof result[0] === 'object' && result[0] !== null) {
      result.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key];
        const bVal = (b as any)[sortConfig.key];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [tableData, searchQuery, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current && current.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

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

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {widget.isLoading && !widget.data ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-green-500" size={32} />
          </div>
        ) : widget.error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 text-red-800 dark:text-red-400">
            {widget.error}
          </div>
        ) : processedData.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {columns.map((col) => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 uppercase"
                  >
                    <div className="flex items-center gap-2">
                      {col.replace(/_/g, ' ')}
                      {sortConfig?.key === col && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {columns.map((col) => (
                    <td key={col} className="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">
                      {typeof row === 'object' && row !== null
                        ? String((row as any)[col] ?? 'N/A')
                        : String(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          {widget.lastUpdated && (
            <>
              <Clock size={12} />
              <span>Last updated: {format(widget.lastUpdated, 'HH:mm:ss')}</span>
            </>
          )}
        </div>
        <span>{processedData.length} of {tableData.length} items</span>
      </div>
    </div>
  );
}
