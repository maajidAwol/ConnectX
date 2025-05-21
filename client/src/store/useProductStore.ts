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

// Type for product creation with file uploads
export type ProductCreateData = Omit<Product, 'id' | 'tenant' | 'owner' | 'profit_percentage' | 'selling_price' | 'total_sold' | 'total_ratings' | 'total_reviews' | 'created_at' | 'updated_at'> & {
  cover_image_upload?: File
  images_upload?: File | File[]
}

// Type for filter options
export type FilterType = 'all' | 'public' | 'owned' | 'listed' | 'merchant'

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
  listProduct: (productId: string, profitPercentage: number) => Promise<{ detail: string }>
  unlistProduct: (productId: string) => Promise<{ detail: string }>
  deleteProduct: (productId: string) => Promise<{ detail: string }>
  createProduct: (productData: ProductCreateData) => Promise<Product>
  getProductById: (productId: string) => Promise<Product>
  updateProduct: (productId: string, productData: Partial<ProductCreateData>) => Promise<Product>
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
  itemsPerPage: 10,
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
      
      // The API returns { results: Product[], count: number }
      const { results, count, next, previous } = response.data
      
      // Calculate total pages based on count and itemsPerPage
      const totalPages = Math.ceil((count || 0) / state.itemsPerPage)
      
      set({ 
        products: results || [], 
        totalItems: count || 0,
        totalPages: totalPages || 1,
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
  },
  
  listProduct: async (productId: string, profitPercentage: number) => {
    try {
      const { accessToken } = useAuthStore.getState();
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${API_URL}/products/${productId}/list-to-tenant/?profit_percentage=${profitPercentage}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to list product');
      }

      const data = await response.json();
      
      // Refresh products with current filter type
      const { filterType } = get();
      await get().fetchProducts({ filterType });
      
      return data;
    } catch (error) {
      console.error('Error listing product:', error);
      throw error;
    }
  },

  unlistProduct: async (productId: string) => {
    try {
      const { accessToken } = useAuthStore.getState();
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${API_URL}/products/${productId}/unlist-from-tenant/`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to unlist product');
      }

      const data = await response.json();
      
      // Refresh products with current filter type
      const { filterType } = get();
      await get().fetchProducts({ filterType });
      
      return data;
    } catch (error) {
      console.error('Error unlisting product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      const { accessToken } = useAuthStore.getState();
      if (!accessToken) throw new Error('Authentication required');
      const response = await fetch(
        `${API_URL}/products/${productId}/`,
        {
          method: 'DELETE',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      const data = await response.json().catch(() => ({ detail: 'Product deleted successfully.' }));
      // Refresh products with current filter type
      const { filterType } = get();
      await get().fetchProducts({ filterType });
      return data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  getProductById: async (productId: string) => {
    try {
      const { accessToken } = useAuthStore.getState();
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/products/${productId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch product details');
      }

      const productData = await response.json();
      return productData;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },
  
  updateProduct: async (productId: string, productData) => {
    try {
      const { accessToken } = useAuthStore.getState();
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      // Create FormData object
      const formData = new FormData();

      // Add all text fields
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'tag' || key === 'colors' || key === 'sizes') {
          // Handle arrays by converting to JSON string
          formData.append(key, JSON.stringify(value));
        } else if (key === 'additional_info') {
          // Handle additional_info object by converting to JSON string
          formData.append(key, JSON.stringify(value));
        } else if (key !== 'cover_image_upload' && key !== 'images_upload') {
          // Add all other fields except file uploads
          formData.append(key, value as string);
        }
      });

      // Add cover image if exists
      if (productData.cover_image_upload) {
        formData.append('cover_image_upload', productData.cover_image_upload);
      }

      // Add additional images if exist
      if (productData.images_upload) {
        if (Array.isArray(productData.images_upload)) {
          productData.images_upload.forEach((file: File) => {
            formData.append('images_upload', file);
          });
        } else {
          formData.append('images_upload', productData.images_upload);
        }
      }

      const response = await fetch(`${API_URL}/products/${productId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update product');
      }

      const updatedProduct = await response.json();
      
      // Refresh products list
      const { filterType } = get();
      await get().fetchProducts({ filterType });
      
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  
  createProduct: async (productData) => {
    try {
      const { accessToken } = useAuthStore.getState();
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      // Create FormData object
      const formData = new FormData();

      // Add all text fields
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'tag' || key === 'colors' || key === 'sizes') {
          // Handle arrays by converting to JSON string
          formData.append(key, JSON.stringify(value));
        } else if (key === 'additional_info') {
          // Handle additional_info object by converting to JSON string
          formData.append(key, JSON.stringify(value));
        } else if (key !== 'cover_image_upload' && key !== 'images_upload') {
          // Add all other fields except file uploads
          formData.append(key, value as string);
        }
      });

      // Add cover image if exists
      if (productData.cover_image_upload) {
        formData.append('cover_image_upload', productData.cover_image_upload);
      }

      // Add additional images if exist
      if (productData.images_upload) {
        if (Array.isArray(productData.images_upload)) {
          productData.images_upload.forEach((file: File) => {
            formData.append('images_upload', file);
          });
        } else {
          formData.append('images_upload', productData.images_upload);
        }
      }

      const response = await fetch(`${API_URL}/products/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.detail || 'Failed to create product');
      }

      const newProduct = await response.json();
      
      // Refresh products with current filter type
      const { filterType } = get();
      await get().fetchProducts({ filterType });
      
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
}))

export default useProductStore 