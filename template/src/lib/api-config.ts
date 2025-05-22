// API Configuration
export const API_URL = '/api/proxy'; // Changed to use our proxy endpoint

// Types
export interface Tenant {
  id: string;
  name: string;
  email: string;
  logo: string | null;
  phone: string | null;
  address: string | null;
  website_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  legal_name: string | null;
  business_registration_number: string | null;
  business_type: string | null;
  business_bio: string | null;
  tenant_verification_status: string;
  api_key: string;
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

// Helper function to get API headers
export const getApiHeaders = (includeAuth = false, accessToken?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
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
        errorMessage = errorData.error || errorData.message || errorData.detail || errorMessage;
        errorDetails = errorData;
      } else {
        errorMessage = response.statusText || errorMessage;
      }
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }

    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      message: errorMessage,
      details: errorDetails
    });

    throw new Error(JSON.stringify({
      status: response.status,
      message: errorMessage,
      details: errorDetails
    }));
  }
  return response;
};

// Helper function to make API requests
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = false,
  accessToken?: string
): Promise<T> => {
  try {
    const headers = getApiHeaders(includeAuth, accessToken);
    
    // Ensure endpoint starts with a forward slash
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Add cache-busting for GET requests
    const timestamp = new Date().getTime();
    const url = `${API_URL}${normalizedEndpoint}${normalizedEndpoint.includes('?') ? '&' : '?'}_t=${timestamp}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    await handleApiError(response);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response type: ${contentType}`);
    }
  } catch (error) {
    throw error;
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