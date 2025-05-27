import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

export type Category = {
  id: string
  name: string
  description: string
  icon: string | null
  parent: string | null
  created_at: string
  updated_at: string
  tenant: string
}

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  fetchCategories: (options?: {
    page?: number
    search?: string
  }) => Promise<void>
  setSearchQuery: (query: string) => void
  setCurrentPage: (page: number) => void
  addCategory: (data: {
    name: string
    description: string
    icon?: File
    parent?: string
  }) => Promise<any>
  updateCategory: (id: string, data: {
    name: string
    description: string
    icon?: File
    parent?: string
  }) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  canEditCategory: (category: Category) => boolean
}

// In a production environment, this would be loaded from environment variables
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  totalItems: 0,
  
  fetchCategories: async (options = {}) => {
    set({ isLoading: true, error: null })
    try {
      // Get auth token from the auth store
      const { accessToken, isAuthenticated, tenantData } = useAuthStore.getState()
      
      if (!isAuthenticated || !accessToken) {
        set({ error: 'Authentication required to view categories', isLoading: false })
        return
      }

      // Get the current state
      const state = get()
      
      // Use options or fallback to current state values
      const page = options.page || state.currentPage
      const search = options.search !== undefined ? options.search : state.searchQuery
      
      // Build query parameters
      const queryParams = new URLSearchParams()
      queryParams.append('page', page.toString())
      queryParams.append('size', state.itemsPerPage.toString())
      
      if (search) {
        queryParams.append('search', search)
      }

      // Prepare headers
      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json'
      }

      // Add X-API-Key header if available
      if (tenantData?.api_key) {
        headers['X-API-Key'] = tenantData.api_key
      }
      
      const response = await axios.get(`${API_URL}/categories/?${queryParams.toString()}`, {
        headers
      })
      
      // The API returns { count, next, previous, results }
      const { count, next, previous, results } = response.data
      
      // Calculate total pages based on count and itemsPerPage
      const totalPages = Math.ceil((count || 0) / state.itemsPerPage)
      
      set({ 
        categories: results || [], 
        totalItems: count || 0,
        totalPages: totalPages || 1,
        currentPage: page,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching categories:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch categories', 
        isLoading: false 
      })
    }
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().fetchCategories({ page: 1, search: query }) // Reset to page 1 when searching
  },
  
  setCurrentPage: (page) => {
    get().fetchCategories({ page })
  },
  
  addCategory: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken, tenantData } = useAuthStore.getState()
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      
      if (data.icon) {
        formData.append('icon', data.icon)
      }
      
      // Always include parent field - empty string if no parent selected
      formData.append('parent', data.parent || '')

      // Prepare headers
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${accessToken}`,
        'accept': 'application/json'
      }

      // Add X-API-Key header if available
      if (tenantData?.api_key) {
        headers['X-API-Key'] = tenantData.api_key
      }

      const response = await axios.post(
        `${API_URL}/categories/`,
        formData,
        {
          headers
        }
      )

      const newCategory = response.data
      // Don't add to local state - let the page component refresh from backend
      return newCategory
    } catch (error) {
      console.error('Error adding category:', error)
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  
  updateCategory: async (id: string, data: {
    name: string
    description: string
    icon?: File
    parent?: string
  }) => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken, tenantData } = useAuthStore.getState()

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      
      if (data.icon) {
        formData.append('icon', data.icon)
      }
      
      // Always include parent field - empty string if no parent selected
      formData.append('parent', data.parent || '')

      // Prepare headers
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${accessToken}`,
        'accept': 'application/json'
      }

      // Add X-API-Key header if available
      if (tenantData?.api_key) {
        headers['X-API-Key'] = tenantData.api_key
      }
      
      const response = await axios.patch(
        `${API_URL}/categories/${id}/`,
        formData,
        {
          headers
        }
      )

      const updatedCategory = response.data
      // Don't update local state - let the page component refresh from backend
      return updatedCategory
    } catch (error) {
      console.error('Error updating category:', error)
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  
  deleteCategory: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken, tenantData } = useAuthStore.getState()

      // Prepare headers
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${accessToken}`,
        'accept': 'application/json'
      }

      // Add X-API-Key header if available
      if (tenantData?.api_key) {
        headers['X-API-Key'] = tenantData.api_key
      }
      
      await axios.delete(
        `${API_URL}/categories/${id}/`,
        {
          headers
        }
      )

      // Don't update local state - let the page component refresh from backend
    } catch (error) {
      console.error('Error deleting category:', error)
      set({ error: error instanceof Error ? error.message : 'An error occurred' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  canEditCategory: (category: Category) => {
    const { user } = useAuthStore.getState()
    return user?.tenant === category.tenant
  }
}))

export default useCategoryStore 