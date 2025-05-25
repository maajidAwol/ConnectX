import { create } from 'zustand'
import { useAuthStore } from './authStore'

interface AnalyticsState {
  apiEndpoints: {
    labels: string[]
    values: number[]
  }
  monthlyRevenue: {
    labels: string[]
    values: number[]
  }
  newMerchants: {
    labels: string[]
    values: number[]
  }
  weekdayTransactions: {
    labels: string[]
    counts: number[]
    revenue: number[]
  }
  isLoading: boolean
  error: string | null
  fetchApiEndpoints: () => Promise<void>
  fetchMonthlyRevenue: () => Promise<void>
  fetchNewMerchants: () => Promise<void>
  fetchWeekdayTransactions: () => Promise<void>
}

const { accessToken } = useAuthStore.getState()

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  apiEndpoints: {
    labels: [],
    values: []
  },
  monthlyRevenue: {
    labels: [],
    values: []
  },
  newMerchants: {
    labels: [],
    values: []
  },
  weekdayTransactions: {
    labels: [],
    counts: [],
    revenue: []
  },
  isLoading: false,
  error: null,

  fetchApiEndpoints: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('https://connectx-backend-295168525338.europe-west1.run.app/api/admin/analytics/api_endpoints_graph/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      set({ apiEndpoints: data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch API endpoints data', isLoading: false })
    }
  },

  fetchMonthlyRevenue: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('https://connectx-backend-295168525338.europe-west1.run.app/api/admin/analytics/monthly_revenue_graph/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      set({ monthlyRevenue: data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch monthly revenue data', isLoading: false })
    }
  },

  fetchNewMerchants: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('https://connectx-backend-295168525338.europe-west1.run.app/api/admin/analytics/new_merchants_graph/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      set({ newMerchants: data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch new merchants data', isLoading: false })
    }
  },

  fetchWeekdayTransactions: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('https://connectx-backend-295168525338.europe-west1.run.app/api/admin/analytics/weekday_transactions_graph/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      set({ weekdayTransactions: data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch weekday transactions data', isLoading: false })
    }
  }
})) 