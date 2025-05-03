import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

export type Category = {
  id: string
  name: string
  description: string
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
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category | null>
  updateCategory: (id: string, data: Partial<Omit<Category, 'id'>>) => Promise<boolean>
  deleteCategory: (id: string) => Promise<boolean>
}

// In a production environment, this would be loaded from environment variables
const API_URL = 'https://connectx-9agd.onrender.com/api'

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
      const { accessToken, isAuthenticated } = useAuthStore.getState()
      
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
      
      const response = await axios.get(`${API_URL}/categories/?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json'
        }
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
  
  addCategory: async (categoryData) => {
    try {
      const { accessToken } = useAuthStore.getState()
      if (!accessToken) {
        set({ error: 'Authentication required to add category' })
        return null
      }
      
      const response = await axios.post(`${API_URL}/categories/`, categoryData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      })
      
      // Refresh categories after adding
      get().fetchCategories()
      
      return response.data
    } catch (error) {
      console.error('Error adding category:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add category'
      })
      return null
    }
  },
  
  updateCategory: async (id, data) => {
    try {
      const { accessToken } = useAuthStore.getState()
      if (!accessToken) {
        set({ error: 'Authentication required to update category' })
        return false
      }
      
      await axios.patch(`${API_URL}/categories/${id}/`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      })
      
      // Refresh categories after updating
      get().fetchCategories()
      
      return true
    } catch (error) {
      console.error('Error updating category:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update category'
      })
      return false
    }
  },
  
  deleteCategory: async (id) => {
    try {
      const { accessToken } = useAuthStore.getState()
      if (!accessToken) {
        set({ error: 'Authentication required to delete category' })
        return false
      }
      
      await axios.delete(`${API_URL}/categories/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json'
        }
      })
      
      // Refresh categories after deleting
      get().fetchCategories()
      
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete category'
      })
      return false
    }
  }
}))

export default useCategoryStore 