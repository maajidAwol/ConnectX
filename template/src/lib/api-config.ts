import { useAuthStore } from '../store/auth';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Validate required environment variables
if (!API_URL) {
  console.error('NEXT_PUBLIC_BACKEND_URL is not set in environment variables');
}

if (!API_KEY) {
  console.error('NEXT_PUBLIC_API_KEY is not set in environment variables');
}

// Types
export interface Tenant {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  theme: {
    primary_color: string;
    secondary_color: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  role: string;
  tenant: string;
  bio: string | null;
  tenant_name: string;
  tenant_id: string;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  groups: string[];
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map<string, { data: any; timestamp: number }>();

// Helper function to generate cache key
const generateCacheKey = (endpoint: string, options: RequestInit = {}) => {
  const queryParams = new URLSearchParams(options.body as string || '').toString();
  return `${endpoint}${queryParams ? `?${queryParams}` : ''}`;
};

// Helper function to check if cache is valid
const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Helper function to get cached data
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }
  return null;
};

// Helper function to set cache data
const setCachedData = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Helper function to clear cache
export const clearCache = () => {
  cache.clear();
};

// Helper function to get API headers
export const getApiHeaders = (includeAuth = false, accessToken?: string) => {
  if (!API_KEY) {
    throw new Error('API key is not configured. Please set NEXT_PUBLIC_API_KEY in your environment variables.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': API_KEY,
  };

  if (includeAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
};

// Helper function to handle API errors
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    let errorDetails = null;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        
        // Handle specific error cases with user-friendly messages
        if (response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (response.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else if (response.status === 422) {
          errorMessage = errorData.detail || 'Please check your input and try again.';
        } else if (response.status === 500) {
          errorMessage = 'Something went wrong on our end. Please try again later.';
        } else {
          errorMessage = errorData.detail || errorData.message || errorData.error || errorMessage;
        }
        
        errorDetails = errorData;
      } else {
        errorMessage = response.statusText || errorMessage;
      }
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(JSON.stringify({
      status: response.status,
      message: errorMessage,
      details: errorDetails
    }));
  }
  return response;
};

// Helper function to make API requests with caching
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = false,
  accessToken?: string | null,
  useCache = true
): Promise<T> => {
  try {
    if (!API_URL) {
      throw new Error('Backend URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL in your environment variables.');
    }

    // Remove leading slash if present and clean the endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Ensure the endpoint ends with a trailing slash
    const endpointWithSlash = cleanEndpoint.endsWith('/') ? cleanEndpoint : `${cleanEndpoint}/`;
    
    // Use the proxy endpoint
    const url = `/api/proxy/${endpointWithSlash}`;


    // Generate cache key for GET requests
    const cacheKey = options.method === 'GET' ? generateCacheKey(url, options) : null;
    
    // Check cache for GET requests
    if (useCache && cacheKey && options.method === 'GET') {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData as T;
      }
    }

    const headers = getApiHeaders(includeAuth, accessToken || undefined);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // Handle 401 Unauthorized error
    if (response.status === 401 && includeAuth && accessToken) {
      try {
        console.log('Token expired, attempting to refresh...');
        // Try to refresh the token
        const { refreshAccessToken } = useAuthStore.getState();
        const newAccessToken = await refreshAccessToken();
        
        if (!newAccessToken) {
          throw new Error('Your session has expired. Please log in again.');
        }

        console.log('Token refreshed successfully, retrying request...');
        // Retry the request with the new token
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            ...options.headers,
            'Authorization': `Bearer ${newAccessToken}`,
          },
        });

        await handleApiError(retryResponse);
        const data = await retryResponse.json();

        // Cache successful GET responses
        if (useCache && cacheKey && options.method === 'GET') {
          setCachedData(cacheKey, data);
        }

        return data;
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Your session has expired. Please log in again.');
      }
    }

    await handleApiError(response);
    const data = await response.json();

    // Cache successful GET responses
    if (useCache && cacheKey && options.method === 'GET') {
      setCachedData(cacheKey, data);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        throw new Error(errorData.message || 'An unexpected error occurred');
      } catch {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
    throw new Error('An unexpected error occurred');
  }
};

// Helper function to sanitize sensitive data
const sanitizeResponseData = (data: any): any => {
  if (!data) return data;
  
  const sanitized = { ...data };
  
  // Sanitize tokens
  if (sanitized.access) sanitized.access = '***';
  if (sanitized.refresh) sanitized.refresh = '***';
  
  // Sanitize user data
  if (sanitized.user) {
    sanitized.user = {
      ...sanitized.user,
      email: '***',
      password: '***',
      phone_number: '***',
      id: '***'
    };
  }
  
  // Sanitize tenant data
  if (sanitized.tenant) {
    sanitized.tenant = {
      ...sanitized.tenant,
      email: '***',
      phone: '***',
      api_key: '***',
      id: '***'
    };
  }
  
  return sanitized;
}; 