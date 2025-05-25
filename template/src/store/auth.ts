import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiRequest, Tenant } from '../lib/api-config';

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  role: string;
  tenant: string;
  bio?: string;
  tenant_name: string;
  tenant_id: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  groups: string[];
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: User) => void;
  fetchTenantDetails: () => Promise<void>;
  initialize: () => Promise<void>;
}

// Create a safe storage object that only works on the client side
const storage = {
  getItem: (name: string) => {
    try {
      if (typeof window === 'undefined') return null;
      const value = localStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(name, value);
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  },
  removeItem: (name: string) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(name);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  },
};

// Create the store with initial state
const initialState = {
  user: null,
  tenant: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      initialize: async () => {
        try {
          const storedState = storage.getItem('auth-storage');
          if (storedState?.state) {
            set({
              ...storedState.state,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error initializing auth store:', error);
          set({ isLoading: false });
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const userData = await apiRequest<User>('/users/', {
            method: 'POST',
            body: JSON.stringify({
              name,
              email,
              password,
              role: 'customer',
            }),
          });

          set({
            user: userData,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const requestBody = JSON.stringify({ 
            email, 
            password,
          });
          
          const data = await apiRequest<LoginResponse>('/auth/login/', {
            method: 'POST',
            body: requestBody,
          });
          
          if (!data.access || !data.refresh || !data.user) {
            throw new Error('Invalid response from server');
          }
          
          const newState = {
            user: data.user,
            accessToken: data.access,
            refreshToken: data.refresh,
            isAuthenticated: true,
            isLoading: false,
          };

          set(newState);

          // Store in localStorage
          storage.setItem('auth-storage', JSON.stringify({
            state: newState,
            version: 0,
          }));

          // Fetch tenant details after successful login
          const store = useAuthStore.getState();
          await store.fetchTenantDetails();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      fetchTenantDetails: async () => {
        try {
          const store = useAuthStore.getState();
          if (!store.accessToken) return;

          const tenantData = await apiRequest<Tenant>('/tenants/me/', {
            method: 'GET',
          }, true, store.accessToken);

          set({ tenant: tenantData });
        } catch (error) {
          // Silent fail for tenant details
          console.warn('Failed to fetch tenant details:', error);
        }
      },

      updateUser: (userData: User) => {
        set((state) => ({
          user: {
            ...state.user,
            ...userData,
          },
        }));
      },

      logout: () => {
        storage.removeItem('auth-storage');
        set(initialState);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        user: state.user,
        tenant: state.tenant,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!state.user) state.user = null;
          if (!state.tenant) state.tenant = null;
          if (!state.accessToken) state.accessToken = null;
          if (!state.refreshToken) state.refreshToken = null;
          if (typeof state.isAuthenticated !== 'boolean') state.isAuthenticated = false;
        }
      },
    }
  )
); 