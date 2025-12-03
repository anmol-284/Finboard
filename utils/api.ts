import axios, { AxiosError } from 'axios';

export interface ApiResponse {
  data: any;
  error?: string;
}

export const fetchApiData = async (url: string): Promise<ApiResponse> => {
  try {
    // Try direct fetch first
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      },
    });

    return {
      data: response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // If CORS error, try using proxy
    if (axiosError.code === 'ERR_NETWORK' || (axiosError.response?.status === 0)) {
      try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const proxyResponse = await axios.get(proxyUrl, {
          timeout: 10000,
        });
        
        return {
          data: proxyResponse.data,
        };
      } catch (proxyError) {
        return {
          data: null,
          error: 'Network error: Unable to reach the API. Please check your connection.',
        };
      }
    }
    
    if (axiosError.response) {
      return {
        data: null,
        error: `API Error: ${axiosError.response.status} - ${axiosError.response.statusText}`,
      };
    } else if (axiosError.request) {
      return {
        data: null,
        error: 'Network error: Unable to reach the API. Please check your connection.',
      };
    } else {
      return {
        data: null,
        error: `Error: ${axiosError.message}`,
      };
    }
  }
};

// Helper to extract nested values from object using dot notation path
export const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return null;
  
  return path.split('.').reduce((current, prop) => {
    if (current === null || current === undefined) return null;
    
    // Handle array indices like "items[0].name"
    const arrayMatch = prop.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      const arrayName = arrayMatch[1];
      const index = parseInt(arrayMatch[2], 10);
      return current[arrayName] && Array.isArray(current[arrayName]) ? current[arrayName][index] : null;
    }
    
    return current[prop] !== undefined ? current[prop] : null;
  }, obj);
};

// Flatten nested object to paths
export const flattenObject = (obj: any, prefix = ''): Array<{ path: string; value: any; type: string }> => {
  const result: Array<{ path: string; value: any; type: string }> = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (value === null || value === undefined) {
        result.push({ path: fullPath, value: null, type: 'null' });
      } else if (Array.isArray(value)) {
        result.push({ path: fullPath, value: value, type: 'array' });
        // If array contains objects, show first item structure
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          result.push(...flattenObject(value[0], `${fullPath}[0]`));
        }
      } else if (typeof value === 'object') {
        result.push({ path: fullPath, value: value, type: 'object' });
        result.push(...flattenObject(value, fullPath));
      } else {
        result.push({
          path: fullPath,
          value: value,
          type: typeof value,
        });
      }
    }
  }

  return result;
};
