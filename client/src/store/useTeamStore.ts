import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface TeamMember {
  id: string
  name: string
  email: string
  phone_number: string | null
  role: string
  tenant: string
  bio: string | null
  tenant_name: string
  tenant_id: string
  avatar_url: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  groups: string[]
}

interface TeamState {
  members: TeamMember[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  fetchMembers: (page?: number) => Promise<void>
  addMember: (data: { email: string; password: string; name: string; role: string }) => Promise<TeamMember>
  deleteMember: (id: string) => Promise<void>
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  totalItems: 0,

  fetchMembers: async (page = 1) => {
    try {
      set({ isLoading: true, error: null })
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get(
        `${API_URL}/users/members/?page=${page}&size=${get().itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }
      )

      const { count, results } = response.data
      const totalPages = Math.ceil(count / get().itemsPerPage)

      set({
        members: results,
        totalItems: count,
        totalPages,
        currentPage: page,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch team members',
        isLoading: false,
      })
    }
  },

  addMember: async (data) => {
    try {
      set({ isLoading: true, error: null })
      const { accessToken } = useAuthStore.getState()

      const response = await axios.post(
        `${API_URL}/users/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        }
      )

      set((state) => ({
        members: [response.data, ...state.members],
        isLoading: false,
      }))

      return response.data
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add team member',
        isLoading: false,
      })
      throw error
    }
  },

  deleteMember: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const { accessToken } = useAuthStore.getState()

      await axios.delete(
        `${API_URL}/users/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }
      )

      set((state) => ({
        members: state.members.filter((member) => member.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete team member',
        isLoading: false,
      })
      throw error
    }
  },
}))

export default useTeamStore 