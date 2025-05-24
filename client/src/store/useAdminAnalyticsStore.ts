import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface OverviewAnalytics {
  total_merchants: number
  total_revenue: string
  total_orders: number
  active_tenants: number
}

interface RecentActivity {
  user: {
    id: string
    name: string
    email: string
    avatar_url: string
  }
  tenant: {
    id: string
    name: string
  }
  role: string
  action: string
  timestamp: string
  details: {
    status: string
    order_id: string
    total_amount: number
  }
}

interface TopTenant {
  tenant_name: string
  total_revenue: string
  total_orders: number
}

interface ApiUsage {
  endpoint: string
  method: string
  total_calls: number
  avg_response_time: number
  success_rate: number
}

interface AdminAnalyticsState {
  overview: OverviewAnalytics | null
  recentActivities: RecentActivity[]
  topTenants: TopTenant[]
  apiUsage: ApiUsage[]
  isLoading: {
    overview: boolean
    activities: boolean
    tenants: boolean
    api: boolean
  }
  error: {
    overview: string | null
    activities: string | null
    tenants: string | null
    api: string | null
  }
  fetchOverview: () => Promise<void>
  fetchRecentActivities: () => Promise<void>
  fetchTopTenants: () => Promise<void>
  fetchApiUsage: () => Promise<void>
}

const API_URL = 'https://connectx-backend-295168525338.europe-west1.run.app/api'

const useAdminAnalyticsStore = create<AdminAnalyticsState>((set) => ({
  overview: null,
  recentActivities: [],
  topTenants: [],
  apiUsage: [],
  isLoading: {
    overview: false,
    activities: false,
    tenants: false,
    api: false
  },
  error: {
    overview: null,
    activities: null,
    tenants: null,
    api: null
  },

  fetchOverview: async () => {
    try {
      set((state) => ({ 
        isLoading: { ...state.isLoading, overview: true },
        error: { ...state.error, overview: null }
      }))
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get<OverviewAnalytics>(
        `${API_URL}/admin/analytics/overview/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }
      )

      set((state) => ({ 
        overview: response.data,
        isLoading: { ...state.isLoading, overview: false }
      }))
    } catch (error) {
      set((state) => ({ 
        error: { 
          ...state.error, 
          overview: error instanceof Error ? error.message : 'Failed to fetch overview analytics'
        },
        isLoading: { ...state.isLoading, overview: false }
      }))
    }
  },

  fetchRecentActivities: async () => {
    try {
      set((state) => ({ 
        isLoading: { ...state.isLoading, activities: true },
        error: { ...state.error, activities: null }
      }))
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get(
        `${API_URL}/admin/analytics/recent_activities/?page=1&page_size=4`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }
      )

      set((state) => ({ 
        recentActivities: response.data.results,
        isLoading: { ...state.isLoading, activities: false }
      }))
    } catch (error) {
      set((state) => ({ 
        error: { 
          ...state.error, 
          activities: error instanceof Error ? error.message : 'Failed to fetch recent activities'
        },
        isLoading: { ...state.isLoading, activities: false }
      }))
    }
  },

  fetchTopTenants: async () => {
    try {
      set((state) => ({ 
        isLoading: { ...state.isLoading, tenants: true },
        error: { ...state.error, tenants: null }
      }))
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get(
        `${API_URL}/admin/analytics/top_tenants/?page=1&page_size=4`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }
      )

      set((state) => ({ 
        topTenants: response.data.results,
        isLoading: { ...state.isLoading, tenants: false }
      }))
    } catch (error) {
      set((state) => ({ 
        error: { 
          ...state.error, 
          tenants: error instanceof Error ? error.message : 'Failed to fetch top tenants'
        },
        isLoading: { ...state.isLoading, tenants: false }
      }))
    }
  },

  fetchApiUsage: async () => {
    try {
      set((state) => ({ 
        isLoading: { ...state.isLoading, api: true },
        error: { ...state.error, api: null }
      }))
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get(
        `${API_URL}/admin/analytics/api_usage/?page=1&page_size=4`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }
      )

      set((state) => ({ 
        apiUsage: response.data.results,
        isLoading: { ...state.isLoading, api: false }
      }))
    } catch (error) {
      set((state) => ({ 
        error: { 
          ...state.error, 
          api: error instanceof Error ? error.message : 'Failed to fetch API usage'
        },
        isLoading: { ...state.isLoading, api: false }
      }))
    }
  },
}))

export default useAdminAnalyticsStore 