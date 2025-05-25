import axios from 'axios';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://connectx-9agd.onrender.com';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': API_KEY || '',
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
        errorMessage = errorData.detail || errorData.message || errorData.error || errorMessage;
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
    // Remove leading slash if present and clean the endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Use the proxy endpoint - don't add /api since it's already in the endpoint
    const url = `/api/proxy/${cleanEndpoint}`;

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(JSON.stringify({
        status: response.status,
        message: 'An error occurred',
        details: errorData || response.statusText,
      }));
    }

    const data = await response.json();

    // Cache successful GET responses
    if (useCache && cacheKey && options.method === 'GET') {
      setCachedData(cacheKey, data);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
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