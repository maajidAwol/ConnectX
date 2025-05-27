import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface ApiKey {
  id: string
  name: string
  key?: string
  is_active: boolean
  created_at: string
  revoked_at: string | null
}

interface ApiKeyResponse {
  count: number
  next: string | null
  previous: string | null
  results: ApiKey[]
}

interface ApiKeyStore {
  apiKeys: ApiKey[]
  isLoading: boolean
  error: string | null
  fetchApiKeys: () => Promise<void>
  generateApiKey: (name: string) => Promise<ApiKey>
  revokeApiKey: (id: string) => Promise<void>
  deleteApiKey: (id: string) => Promise<void>
}

const useApiKeyStore = create<ApiKeyStore>((set, get) => ({
  apiKeys: [],
  isLoading: false,
  error: null,

  fetchApiKeys: async () => {
    try {
      set({ isLoading: true, error: null })
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get<ApiKeyResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api-keys/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      set({ 
        apiKeys: response.data.results,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch API keys',
        isLoading: false 
      })
    }
  },

  generateApiKey: async (name: string) => {
    try {
      set({ isLoading: true, error: null })
      const { accessToken } = useAuthStore.getState()

      const response = await axios.post<ApiKey>(
        `${process.env.NEXT_PUBLIC_API_URL}/api-keys/`,
        {
          name,
          is_active: true
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const newApiKey = response.data
      set(state => ({ 
        apiKeys: [newApiKey, ...state.apiKeys],
        isLoading: false 
      }))
      return newApiKey
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate API key',
        isLoading: false 
      })
      throw error
    }
  },

  revokeApiKey: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const { accessToken } = useAuthStore.getState()
      const apiKey = get().apiKeys.find(key => key.id === id)

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api-keys/${id}/revoke/`,
        {
          name: apiKey?.name,
          is_active: false
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      set(state => ({
        apiKeys: state.apiKeys.map(key => 
          key.id === id ? { ...key, is_active: false, revoked_at: new Date().toISOString() } : key
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to revoke API key',
        isLoading: false 
      })
      throw error
    }
  },

  deleteApiKey: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const { accessToken } = useAuthStore.getState()

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api-keys/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      set(state => ({
        apiKeys: state.apiKeys.filter(key => key.id !== id),
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete API key',
        isLoading: false 
      })
      throw error
    }
  }
}))

export default useApiKeyStore 