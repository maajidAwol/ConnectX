import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

export type Product = {
  id: string
  tenant: string[]
  owner: string
  sku: string
  name: string
  base_price: string
  profit_percentage: string
  selling_price: string
  quantity: number
  category: string
  is_public: boolean
  description: string
  cover_url: string
  images: string[]
  colors: string[]
  sizes: string[]
  total_sold: number
  total_ratings: number
  total_reviews: number
  created_at: string
  updated_at: string
}

export type FilterType = 'all' | 'public' | 'owned' | 'listed'

interface ProductState {
  products: Product[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  category: string
  filterType: FilterType
  fetchProducts: (options?: {
    page?: number
    search?: string
    filterType?: FilterType
    category?: string
  }) => Promise<void>
  setSearchQuery: (query: string) => void
  setFilterType: (filterType: FilterType) => void
  setCategory: (category: string) => void
  setCurrentPage: (page: number) => void
}

// In a production environment, this would be loaded from environment variables
// For this implementation, we're using a constant
const API_URL = 'https://connectx-9agd.onrender.com/api'

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 15,
  totalItems: 0,
  category: '',
  filterType: 'all',
  
  fetchProducts: async (options = {}) => {
    set({ isLoading: true, error: null })
    try {
      // Get auth token from the auth store
      const { accessToken, isAuthenticated } = useAuthStore.getState()
      
      if (!isAuthenticated || !accessToken) {
        set({ error: 'Authentication required to view products', isLoading: false })
        return
      }

      // Get the current state
      const state = get()
      
      // Use options or fallback to current state values
      const page = options.page || state.currentPage
      const search = options.search !== undefined ? options.search : state.searchQuery
      const filterType = options.filterType || state.filterType
      const category = options.category !== undefined ? options.category : state.category
      
      // Build query parameters
      const queryParams = new URLSearchParams()
      queryParams.append('page', page.toString())
      queryParams.append('size', state.itemsPerPage.toString())
      
      if (search) {
        queryParams.append('search', search)
      }
      
      if (filterType !== 'all') {
        queryParams.append('filter_type', filterType)
      }
      
      if (category) {
        queryParams.append('category', category)
      }
      
      const response = await axios.get(`${API_URL}/products/?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json'
        }
      })
      
      // Assuming the API returns { results: Product[], count: number, pages: number }
      const { results, count, pages } = response.data
      
      set({ 
        products: results || [], 
        totalItems: count || 0,
        totalPages: pages || 1,
        currentPage: page,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products', 
        isLoading: false 
      })
    }
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().fetchProducts({ page: 1, search: query }) // Reset to page 1 when searching
  },
  
  setFilterType: (filterType) => {
    set({ filterType })
    get().fetchProducts({ page: 1, filterType }) // Reset to page 1 when changing filter
  },
  
  setCategory: (category) => {
    set({ category })
    get().fetchProducts({ page: 1, category }) // Reset to page 1 when changing category
  },
  
  setCurrentPage: (page) => {
    get().fetchProducts({ page })
  }
}))

export default useProductStore 