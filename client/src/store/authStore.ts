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

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  signup: (data: { name: string; email: string; password: string; fullname: string }) => Promise<{ success: boolean; error?: string }>
  login: (data: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
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
        return { success: false, error: 'Signup failed' }
      }

      const userData = await response.json()
      set({ user: userData, isAuthenticated: true })
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An error occurred during signup' }
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
        return { success: false, error: 'Invalid credentials' }
      }

      const { access, refresh, user } = await response.json()
      set({ 
        user, 
        accessToken: access,
        refreshToken: refresh,
        isAuthenticated: true 
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An error occurred during login' }
    }
  },
  logout: () => {
    set({ 
      user: null, 
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false 
    })
  },
}))