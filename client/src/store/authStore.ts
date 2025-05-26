import { create } from 'zustand'
import axios from 'axios'

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
  phone_number: string | null
  bio: string | null
  tenant_name: string
  tenant_id: string
  is_active: boolean
  groups: string[]
  age: number | null
  gender: 'male' | 'female'
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
  age: number | null
  gender: 'male' | 'female'
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
  fetchUserProfile: () => Promise<void>
  isTenantVerified: () => boolean
  clearError: () => void
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
  validateToken: () => boolean
  updateProfile: (formData: FormData) => Promise<void>
  resendVerification: (email: string) => Promise<void>
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
  const userRole = getCookie('userRole');
  
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
  
  // Only consider authenticated if we have both tokens and user data
  const isAuthenticated = !!accessToken && !!refreshToken && !!user && !!userRole;
  
  return {
    isAuthenticated,
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
    set({ isLoading: true, error: null })
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('fullname', data.fullname)
      formData.append('age', data.age?.toString() || '')
      formData.append('gender', data.gender)

      const response = await axios.post(
        'https://connectx-backend-295168525338.europe-west1.run.app/api/tenants/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      set({ isLoading: false })
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create account'
      set({ error: errorMessage, isLoading: false })
      throw error
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
      
      // Update state with new auth data
      set({ 
        user, 
        accessToken: access,
        refreshToken: refresh,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      // Fetch user profile to ensure we have the latest data
      await get().fetchUserProfile();
      
      // Only fetch tenant data if user is not an admin
      if (user.role !== 'admin') {
        await get().fetchTenantData();
      }
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

  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken } = get();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me/`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      
      // Update user data in state and cookie
      set({ 
        user: userData,
        isLoading: false,
        error: null
      });
      setCookie('user', encodeURIComponent(JSON.stringify(userData)), 7);
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user profile'
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
  },

  validateToken: () => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    const userRole = getCookie('userRole');
    const userJson = getCookie('user');
    
    if (!accessToken || !refreshToken || !userRole || !userJson) {
      set({ isAuthenticated: false, user: null });
      return false;
    }
    
    try {
      const user = JSON.parse(decodeURIComponent(userJson));
      if (!user || !user.role) {
        set({ isAuthenticated: false, user: null });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      set({ isAuthenticated: false, user: null });
      return false;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken } = get();
      if (!accessToken) {
        throw new Error('No access token available. Please log in again.');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password/`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, clear auth state
          set({ 
            isAuthenticated: false, 
            user: null, 
            accessToken: null,
            refreshToken: null,
            error: 'Your session has expired. Please log in again.'
          });
          // Clear cookies
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          deleteCookie('userRole');
          deleteCookie('user');
          throw new Error('Your session has expired. Please log in again.');
        }
        if (response.status === 400 && data.error === "Old password is incorrect") {
          throw new Error("Current password is incorrect");
        } else if (response.status === 400 && data.new_password) {
          throw new Error(data.new_password[0]);
        }
        throw new Error(data.detail || data.message || "Failed to change password");
      }

      set({ isLoading: false, error: null });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to change password'
      });
      throw error;
    }
  },

  updateProfile: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken } = get();
      if (!accessToken) {
        throw new Error('No access token available. Please log in again.');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/update-profile/`,
        {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, clear auth state
          set({ 
            isAuthenticated: false, 
            user: null, 
            accessToken: null,
            refreshToken: null,
            error: 'Your session has expired. Please log in again.'
          });
          // Clear cookies
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          deleteCookie('userRole');
          deleteCookie('user');
          throw new Error('Your session has expired. Please log in again.');
        }
        throw new Error(data.detail || data.message || "Failed to update profile");
      }

      // After successful update, fetch the latest user data
      await get().fetchUserProfile();
      
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile'
      });
      throw error;
    }
  },

  resendVerification: async (email: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification/`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      if (!response.data) {
        throw new Error('Failed to resend verification email')
      }

      set({ isLoading: false, error: null })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to resend verification email'
      })
      throw error
    }
  },
}))