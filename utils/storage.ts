// Utility functions for localStorage operations

export const saveToStorage = (key: string, value: any): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    }
  } catch (error) {
    console.error('Error loading from storage:', error);
  }
  return defaultValue;
};

export const removeFromStorage = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error removing from storage:', error);
  }
};
