import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface OverviewData {
  total_revenue: string
  total_orders: number
  total_products: number
  total_customers: number
}

interface MerchantAnalyticsState {
  overview: OverviewData | null
  isLoading: boolean
  error: string | null
  fetchOverview: () => Promise<void>
}

export const useMerchantAnalyticsStore = create<MerchantAnalyticsState>((set) => ({
  overview: null,
  isLoading: false,
  error: null,

  fetchOverview: async () => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.get(
        'https://connectx-backend-295168525338.europe-west1.run.app/api/tenant/overview/',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      set({ overview: response.data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch overview data', 
        isLoading: false 
      })
    }
  },
})) 