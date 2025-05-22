import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  tenant_name?: string
}

interface CreateAdminData {
  email: string
  password: string
  name: string
  role: string
}

interface AdminStore {
  admins: AdminUser[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  pageSize: number
  fetchAdmins: (page: number, size: number) => Promise<void>
  createAdmin: (data: CreateAdminData) => Promise<AdminUser>
  deleteAdmin: (id: string) => Promise<void>
  setPage: (page: number) => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const useAdminStore = create<AdminStore>((set) => ({
  admins: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 5,
  fetchAdmins: async (page: number, size: number) => {
    set({ loading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.get(
        `${API_URL}/users/admins/?page=${page}&size=${size}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'application/json',
          },
        }
      )
      set({
        admins: response.data.results,
        totalCount: response.data.count,
        loading: false,
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch admins', loading: false })
    }
  },
  createAdmin: async (data: CreateAdminData) => {
    set({ loading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.post(
        `${API_URL}/users/`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      set({ loading: false })
      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create admin'
      set({ error: errorMessage, loading: false })
      throw new Error(errorMessage)
    }
  },
  deleteAdmin: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      await axios.delete(
        `${API_URL}/users/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'application/json',
          },
        }
      )
      // Update the local state by removing the deleted admin
      set((state) => ({
        admins: state.admins.filter((admin) => admin.id !== id),
        totalCount: state.totalCount - 1,
        loading: false,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete admin'
      set({ error: errorMessage, loading: false })
      throw new Error(errorMessage)
    }
  },
  setPage: (page: number) => set({ currentPage: page }),
})) 