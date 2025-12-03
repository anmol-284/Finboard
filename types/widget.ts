export type WidgetType = 'card' | 'table' | 'chart';

export type DisplayMode = 'card' | 'table' | 'chart';

export interface WidgetField {
  path: string;
  label?: string;
  type?: string;
  value?: any;
}

export interface Widget {
  id: string;
  name: string;
  apiUrl: string;
  refreshInterval: number; // in seconds
  displayMode: DisplayMode;
  selectedFields: WidgetField[];
  lastUpdated?: Date;
  error?: string;
  isLoading?: boolean;
  data?: any;
  position?: number;
}

export interface DashboardState {
  widgets: Widget[];
  theme: 'light' | 'dark';
}
