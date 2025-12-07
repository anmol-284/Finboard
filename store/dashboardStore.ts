import { create } from 'zustand';
import { Widget, DashboardState } from '@/types/widget';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

interface DashboardStore extends DashboardState {
  addWidget: (widget: Omit<Widget, 'id' | 'lastUpdated' | 'error' | 'isLoading'>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  reorderWidgets: (widgets: Widget[]) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  clearAllWidgets: () => void;
  initialize: () => void;
  exportConfig: () => void;
  importConfig: (config: DashboardState) => boolean;
}

const STORAGE_KEY = 'dashboard-storage';

const loadState = (): DashboardState => {
  if (typeof window === 'undefined') {
    return { widgets: [], theme: 'dark' };
  }
  return loadFromStorage<DashboardState>(STORAGE_KEY, { widgets: [], theme: 'dark' });
};

const saveState = (state: DashboardState) => {
  if (typeof window !== 'undefined') {
    saveToStorage(STORAGE_KEY, state);
  }
};

const useDashboardStore = create<DashboardStore>((set, get) => {
  // Always start with empty state to prevent hydration mismatches
  // The initialize() function will load the actual state after mount
  return {
    widgets: [],
    theme: 'dark',

    initialize: () => {
      const saved = loadState();
      set(saved);
    },

  addWidget: (widget) => {
    const newWidget: Widget = {
      ...widget,
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: undefined,
      error: undefined,
      isLoading: false,
    };
    set((state) => {
      const newState = { ...state, widgets: [...state.widgets, newWidget] };
      saveState({ widgets: newState.widgets, theme: newState.theme });
      return newState;
    });
  },

  removeWidget: (id) => {
    set((state) => {
      const newState = { ...state, widgets: state.widgets.filter((w) => w.id !== id) };
      saveState({ widgets: newState.widgets, theme: newState.theme });
      return newState;
    });
  },

  updateWidget: (id, updates) => {
    set((state) => {
      const newState = {
        ...state,
        widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
      };
      saveState({ widgets: newState.widgets, theme: newState.theme });
      return newState;
    });
  },

  reorderWidgets: (widgets) => {
    set((state) => {
      const newState = { ...state, widgets };
      saveState({ widgets: newState.widgets, theme: newState.theme });
      return newState;
    });
  },

  setTheme: (theme) => {
    set((state) => {
      const newState = { ...state, theme };
      saveState({ widgets: newState.widgets, theme: newState.theme });
      return newState;
    });
  },

  clearAllWidgets: () => {
    set((state) => {
      const newState = { ...state, widgets: [] };
      saveState({ widgets: newState.widgets, theme: newState.theme });
      return newState;
    });
  },

  exportConfig: () => {
    const state = get();
    const exportData = {
      widgets: state.widgets.map((w) => ({
        name: w.name,
        apiUrl: w.apiUrl,
        displayMode: w.displayMode,
        refreshInterval: w.refreshInterval,
        selectedFields: w.selectedFields,
      })),
      theme: state.theme,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importConfig: (config: DashboardState) => {
    try {
      // Validate config structure
      if (!config || typeof config !== 'object') {
        throw new Error('Invalid configuration format');
      }

      if (!Array.isArray(config.widgets)) {
        throw new Error('Widgets must be an array');
      }

      // Validate each widget
      const validatedWidgets = config.widgets.map((widget: any) => {
        if (!widget.name || !widget.apiUrl || !widget.displayMode) {
          throw new Error('Widget missing required fields: name, apiUrl, or displayMode');
        }
        return {
          name: widget.name,
          apiUrl: widget.apiUrl,
          displayMode: widget.displayMode,
          refreshInterval: widget.refreshInterval || 30,
          selectedFields: widget.selectedFields || [],
        };
      });

      // Validate theme
      const validatedTheme = config.theme === 'light' || config.theme === 'dark' 
        ? config.theme 
        : 'dark';

      // Apply imported config
      const newState = {
        widgets: validatedWidgets.map((widget) => ({
          ...widget,
          id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          lastUpdated: undefined,
          error: undefined,
          isLoading: false,
        })),
        theme: validatedTheme,
      };

      set(newState);
      saveState(newState);
      return true;
    } catch (error: any) {
      console.error('Import error:', error);
      return false;
    }
  },
  };
});

export default useDashboardStore;
