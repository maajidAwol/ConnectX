import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface OverviewData {
  total_revenue: string
  total_orders: number
  total_products: number
  total_customers: number
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

interface RecentOrder {
  id: string
  order_number: string
  customer_name: string
  total_amount: string
  status: string
  created_at: string
}

interface TopProduct {
  id: string
  name: string
  total_sales: number
  total_revenue: string
  quantity: number
}

interface MerchantDashboardState {
  overview: OverviewData | null
  recentActivities: RecentActivity[]
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
  isLoading: {
    overview: boolean
    activities: boolean
    orders: boolean
    products: boolean
  }
  error: {
    overview: string | null
    activities: string | null
    orders: string | null
    products: string | null
  }
  fetchOverview: () => Promise<void>
  fetchRecentActivities: () => Promise<void>
  fetchRecentOrders: () => Promise<void>
  fetchTopProducts: () => Promise<void>
}

const API_URL = 'https://connectx-backend-295168525338.europe-west1.run.app/api'

const useMerchantDashboardStore = create<MerchantDashboardState>((set) => ({
  overview: null,
  recentActivities: [],
  recentOrders: [],
  topProducts: [],
  isLoading: {
    overview: false,
    activities: false,
    orders: false,
    products: false
  },
  error: {
    overview: null,
    activities: null,
    orders: null,
    products: null
  },

  fetchOverview: async () => {
    try {
      set((state) => ({ 
        isLoading: { ...state.isLoading, overview: true },
        error: { ...state.error, overview: null }
      }))
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get<OverviewData>(
        `${API_URL}/tenant/overview/`,
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
          overview: error instanceof Error ? error.message : 'Failed to fetch overview data'
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
        `${API_URL}/tenant/recent_activities/?page=1&page_size=4`,
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

  fetchRecentOrders: async () => {
    try {
      set((state) => ({ 
        isLoading: { ...state.isLoading, orders: true },
        error: { ...state.error, orders: null }
      }))
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get(
        `${API_URL}/tenant/recent_orders/?page=1&page_size=4`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }
      )

      set((state) => ({ 
        recentOrders: response.data.results,
        isLoading: { ...state.isLoading, orders: false }
      }))
    } catch (error) {
      set((state) => ({ 
        error: { 
          ...state.error, 
          orders: error instanceof Error ? error.message : 'Failed to fetch recent orders'
        },
        isLoading: { ...state.isLoading, orders: false }
      }))
    }
  },

  fetchTopProducts: async () => {
    try {
      set((state) => ({ 
        isLoading: { ...state.isLoading, products: true },
        error: { ...state.error, products: null }
      }))
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get(
        `${API_URL}/tenant/top_products/?page=1&page_size=4`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }
      )

      set((state) => ({ 
        topProducts: response.data.results,
        isLoading: { ...state.isLoading, products: false }
      }))
    } catch (error) {
      set((state) => ({ 
        error: { 
          ...state.error, 
          products: error instanceof Error ? error.message : 'Failed to fetch top products'
        },
        isLoading: { ...state.isLoading, products: false }
      }))
    }
  },
}))

export default useMerchantDashboardStore 