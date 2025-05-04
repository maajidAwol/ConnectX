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

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  tenantData: TenantData | null
  accessToken: string | null
  refreshToken: string | null
  signup: (data: { name: string; email: string; password: string; fullname: string }) => Promise<void>
  login: (data: { email: string; password: string }) => Promise<void>
  logout: () => void
  getRedirectPath: () => string
  fetchTenantData: () => Promise<void>
  isTenantVerified: () => boolean
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
  try {
    const userJson = getCookie('user');
    if (userJson) {
      user = JSON.parse(decodeURIComponent(userJson));
    }
  } catch (error) {
    console.error('Error parsing user from cookie:', error);
  }
  
  return {
    isAuthenticated: !!accessToken && !!refreshToken,
    user,
    accessToken,
    refreshToken
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...loadStateFromCookies(),
  tenantData: null,
  signup: async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Signup failed')
      }

      const userData = await response.json()
      set({ user: userData, isAuthenticated: true })
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  },
  login: async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const { access, refresh, user } = await response.json()
      
      // Set cookies with expiration - 7 days for refresh token, 24 hours for access token
      setCookie('accessToken', access, 1); // 1 day
      setCookie('refreshToken', refresh, 7); // 7 days
      setCookie('userRole', user.role, 7);
      setCookie('user', encodeURIComponent(JSON.stringify(user)), 7);
      
      set({ 
        user, 
        accessToken: access,
        refreshToken: refresh,
        isAuthenticated: true 
      });

      // Fetch tenant data after successful login
      await get().fetchTenantData();
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },
  logout: () => {
    // Clear cookies
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    deleteCookie('userRole');
    deleteCookie('user');
    
    set({ 
      user: null, 
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      tenantData: null
    });
    
    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
  getRedirectPath: () => {
    const { user } = get()
    if (!user) return '/login'
    
    // Redirect based on user role
    if (user.role === 'owner') {
      return '/merchant'
    } else if (user.role === 'admin') {
      return '/admin'
    }
    
    return '/'
  },
  fetchTenantData: async () => {
    try {
      const { accessToken, user } = get();
      if (!accessToken || !user?.tenant) throw new Error('No access token or tenant ID available');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenants/${user.tenant}/`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch tenant data');

      const tenantData = await response.json();
      set({ tenantData });

      // Store tenant data in cookie for persistence
      setCookie('tenantData', encodeURIComponent(JSON.stringify(tenantData)), 7);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      // Don't throw here, just log the error
    }
  },
  isTenantVerified: () => {
    const { tenantData } = get();
    console.log("tenantData", tenantData)
    return tenantData?.is_verified || false;
  }
}))