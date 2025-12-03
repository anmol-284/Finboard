'use client';

import { useState, useEffect } from 'react';
import { X, Eye, Search, Plus, Check, Loader2 } from 'lucide-react';
import useDashboardStore from '@/store/dashboardStore';
import { fetchApiData, flattenObject } from '@/utils/api';
import { WidgetField, DisplayMode } from '@/types/widget';
import { LayoutDashboard, Table, LineChart } from 'lucide-react';

interface AddWidgetModalProps {
  onClose: () => void;
}

export default function AddWidgetModal({ onClose }: AddWidgetModalProps) {
  const addWidget = useDashboardStore((state) => state.addWidget);
  
  const [widgetName, setWidgetName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('card');
  const [selectedFields, setSelectedFields] = useState<WidgetField[]>([]);
  const [availableFields, setAvailableFields] = useState<Array<{ path: string; value: any; type: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArraysOnly, setShowArraysOnly] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [apiData, setApiData] = useState<any>(null);

  const testApi = async () => {
    if (!apiUrl.trim()) {
      setTestResult({ success: false, message: 'Please enter an API URL' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetchApiData(apiUrl);
      
      if (response.error) {
        setTestResult({ success: false, message: response.error });
        setApiData(null);
      } else {
        setApiData(response.data);
        const flattened = flattenObject(response.data);
        setTestResult({
          success: true,
          message: `API connection successful! ${flattened.length} fields found.`,
        });
        setAvailableFields(flattened);
      }
    } catch (error: any) {
      setTestResult({ success: false, message: error.message || 'Failed to test API' });
      setApiData(null);
    } finally {
      setIsTesting(false);
    }
  };

  const filteredFields = availableFields.filter((field) => {
    const matchesSearch = field.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArrayFilter = !showArraysOnly || field.type === 'array';
    return matchesSearch && matchesArrayFilter;
  });

  const toggleField = (field: { path: string; value: any; type: string }) => {
    const isSelected = selectedFields.some((f) => f.path === field.path);
    
    if (isSelected) {
      setSelectedFields(selectedFields.filter((f) => f.path !== field.path));
    } else {
      setSelectedFields([
        ...selectedFields,
        {
          path: field.path,
          label: field.path.split('.').pop(),
          type: field.type,
          value: field.value,
        },
      ]);
    }
  };

  const handleSubmit = () => {
    if (!widgetName.trim()) {
      alert('Please enter a widget name');
      return;
    }
    if (!apiUrl.trim()) {
      alert('Please enter an API URL');
      return;
    }
    if (selectedFields.length === 0) {
      alert('Please select at least one field to display');
      return;
    }

    addWidget({
      name: widgetName,
      apiUrl: apiUrl.trim(),
      refreshInterval,
      displayMode,
      selectedFields,
    });

    onClose();
  };

  // Auto-test when API URL changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (apiUrl.trim() && apiUrl.startsWith('http')) {
        // Auto-test after 1 second of no typing
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [apiUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Widget</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="text-gray-600 dark:text-gray-400" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Widget Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Widget Name
            </label>
            <input
              type="text"
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
              placeholder="Bitcoin"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* API URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={testApi}
                disabled={isTesting || !apiUrl.trim()}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Testing...
                  </>
                ) : (
                  'Test'
                )}
              </button>
            </div>
            {testResult && (
              <div
                className={`mt-2 p-3 rounded-lg flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                }`}
              >
                <Eye size={16} />
                <span className="text-sm">{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Refresh Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Refresh Interval (seconds)
            </label>
            <input
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value) || 30)}
              min={1}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Display Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Fields to Display
            </label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setDisplayMode('card')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  displayMode === 'card'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <LayoutDashboard size={18} />
                Card
              </button>
              <button
                onClick={() => setDisplayMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  displayMode === 'table'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Table size={18} />
                Table
              </button>
              <button
                onClick={() => setDisplayMode('chart')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  displayMode === 'chart'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <LineChart size={18} />
                Chart
              </button>
            </div>
          </div>

          {/* Field Selection */}
          {testResult?.success && (
            <div>
              <div className="mb-4">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search for fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {displayMode === 'table' && (
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={showArraysOnly}
                      onChange={(e) => setShowArraysOnly(e.target.checked)}
                      className="rounded"
                    />
                    Show arrays only (for table view)
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Available Fields */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Available Fields
                  </h3>
                  <div className="border border-gray-300 dark:border-gray-700 rounded-lg max-h-64 overflow-y-auto">
                    {filteredFields.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No fields found
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredFields.map((field, index) => {
                          const isSelected = selectedFields.some((f) => f.path === field.path);
                          return (
                            <div
                              key={index}
                              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {field.path}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {field.type} | {String(field.value).substring(0, 50)}
                                    {String(field.value).length > 50 ? '...' : ''}
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleField(field)}
                                  className={`ml-2 p-1 rounded ${
                                    isSelected
                                      ? 'bg-green-500 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                  }`}
                                >
                                  {isSelected ? <Check size={16} /> : <Plus size={16} />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Fields */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Selected Fields ({selectedFields.length})
                  </h3>
                  <div className="border border-gray-300 dark:border-gray-700 rounded-lg max-h-64 overflow-y-auto">
                    {selectedFields.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No fields selected
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedFields.map((field, index) => (
                          <div
                            key={index}
                            className="p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="text-sm text-gray-900 dark:text-white">{field.path}</span>
                            <button
                              onClick={() => toggleField({ path: field.path, value: field.value, type: field.type || 'string' })}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!widgetName.trim() || !apiUrl.trim() || selectedFields.length === 0}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}
