import { create } from 'zustand'

interface User {
  id: string
  tenant: string
  name: string
  email: string
  role: string
  is_verified: boolean
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface TenantData {
  id: string
  name: string
  legal_name: string | null
  business_registration_number: string | null
  api_key: string | null
  email: string
  logo: string | null
  business_type: string | null
  phone: string | null
  address: string | null
  mobileapp_url: string | null
  mobileapp_name: string | null
  licence_registration_date: string | null
  tenant_verification_status: string
  tenant_verification_date: string | null
  business_bio: string | null
  website_url: string | null
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

interface SignupData {
  name: string
  email: string
  password: string
  fullname: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  tenantData: TenantData | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  signup: (data: SignupData) => Promise<void>
  login: (data: { email: string; password: string }) => Promise<void>
  logout: () => void
  getRedirectPath: () => string
  fetchTenantData: () => Promise<void>
  isTenantVerified: () => boolean
  clearError: () => void
}

// In Next.js, cookies need to be set server-side
// For simplicity, we'll use the browser's document.cookie API for client-side
const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const cookieString = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
  return cookieString ? cookieString.split('=')[1] : null;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// Helper function to get state from cookies
const loadStateFromCookies = () => {
  const accessToken = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');
  
  let user = null;
  let tenantData = null;
  
  try {
    const userJson = getCookie('user');
    if (userJson) {
      user = JSON.parse(decodeURIComponent(userJson));
    }
    
    const tenantDataJson = getCookie('tenantData');
    if (tenantDataJson) {
      tenantData = JSON.parse(decodeURIComponent(tenantDataJson));
    }
  } catch (error) {
    console.error('Error parsing data from cookies:', error);
  }
  
  return {
    isAuthenticated: !!accessToken && !!refreshToken,
    user,
    tenantData,
    accessToken,
    refreshToken
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...loadStateFromCookies(),
  isLoading: false,
  error: null,

  signup: async (data: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('fullname', data.fullname);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Signup failed');
      }

      // Don't set authentication state on signup
      // User needs to verify email and login first
      set({ 
        isLoading: false,
        error: null
      });

      return responseData;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      throw error;
    }
  },

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Check if the error is due to unverified email
        if (responseData.error?.includes("verify your email")) {
          throw new Error(responseData.error);
        }
        throw new Error(responseData.message || 'Invalid credentials');
      }

      const { access, refresh, user } = responseData;
      
      // Set cookies with expiration - 7 days for refresh token, 24 hours for access token
      setCookie('accessToken', access, 1); // 1 day
      setCookie('refreshToken', refresh, 7); // 7 days
      setCookie('userRole', user.role, 7);
      setCookie('user', encodeURIComponent(JSON.stringify(user)), 7);
      
      set({ 
        user, 
        accessToken: access,
        refreshToken: refresh,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      // Fetch tenant data after successful login
      await get().fetchTenantData();
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
      throw error;
    }
  },

  logout: () => {
    // Clear cookies
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    deleteCookie('userRole');
    deleteCookie('user');
    deleteCookie('tenantData');
    
    set({ 
      user: null, 
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      tenantData: null,
      error: null
    });
    
    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },

  getRedirectPath: () => {
    const { user } = get();
    if (!user) return '/login';
    
    // Redirect based on user role
    if (user.role === 'owner') {
      return '/merchant';
    } else if (user.role === 'admin') {
      return '/admin';
    }
    
    return '/';
  },

  fetchTenantData: async () => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken, user } = get();
      if (!accessToken || !user?.tenant) {
        throw new Error('No access token or tenant ID available');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenants/${user.tenant}/`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tenant data');
      }

      const tenantData = await response.json();
      
      // Store tenant data in state and cookie
      set({ 
        tenantData,
        isLoading: false,
        error: null
      });
      setCookie('tenantData', encodeURIComponent(JSON.stringify(tenantData)), 7);
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tenant data'
      });
      throw error;
    }
  },

  isTenantVerified: () => {
    const { tenantData } = get();
    if (!tenantData) {
      // If tenant data is not loaded, try to fetch it
      get().fetchTenantData();
      return false;
    }
    return tenantData.is_verified || false;
  },

  clearError: () => {
    set({ error: null });
  }
}))