import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface TopProduct {
  id: string
  name: string
  total_sales: number
  total_revenue: string
  quantity: number
}

interface TopProductsResponse {
  count: number
  next: string | null
  previous: string | null
  results: TopProduct[]
}

interface ProductAnalyticsState {
  topProducts: TopProduct[]
  isLoading: boolean
  error: string | null
  fetchTopProducts: () => Promise<void>
}

export const useProductAnalyticsStore = create<ProductAnalyticsState>((set) => ({
  topProducts: [],
  isLoading: false,
  error: null,

  fetchTopProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.get<TopProductsResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/tenant/top_products/`,
        {
          params: {
            page: 1,
            page_size: 5,
            order_by: 'total_revenue',
            order: 'desc'
          },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      set({ topProducts: response.data.results, isLoading: false })
    } catch (error) {
      set({ 
        error: 'Failed to fetch top products data', 
        isLoading: false 
      })
      console.error('Error fetching top products:', error)
    }
  }
})) 