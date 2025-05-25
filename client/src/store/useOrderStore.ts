import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

export interface Order {
  id: string
  order_number: string
  seller_tenant_id: string
  seller_tenant_name: string
  status: string
  total_amount: string
  created_at: string
  items_count: number
  total_quantity: number
  first_item: {
    product_name: string
    product_id: string
    cover_url: string
  }
  payment_status: {
    display_status: string
    method: string | null
  }
}

interface OrderResponse {
  count: number
  next: string | null
  previous: string | null
  results: Order[]
}

interface OrderStore {
  orders: Order[]
  recentOrders: Order[]
  isLoading: boolean
  isLoadingRecent: boolean
  error: string | null
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  fetchOrders: (page?: number, size?: number) => Promise<void>
  fetchRecentOrders: () => Promise<void>
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
}

const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  recentOrders: [],
  isLoading: false,
  isLoadingRecent: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalCount: 0,

  fetchOrders: async (page = 1, size = 10) => {
    try {
      set({ isLoading: true, error: null })
      const { accessToken } = useAuthStore.getState()
      
      const response = await axios.get<OrderResponse>(
        `https://connectx-9agd.onrender.com/api/orders/?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const { results, count } = response.data
      const totalPages = Math.ceil(count / size)

      set({
        orders: results,
        totalCount: count,
        totalPages,
        currentPage: page,
        pageSize: size,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false,
      })
    }
  },

  fetchRecentOrders: async () => {
    try {
      set({ isLoadingRecent: true, error: null })
      const { accessToken } = useAuthStore.getState()
      
      const response = await axios.get<OrderResponse>(
        'https://connectx-9agd.onrender.com/api/orders/?page=1&size=5',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      set({
        recentOrders: response.data.results,
        isLoadingRecent: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch recent orders',
        isLoadingRecent: false,
      })
    }
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page })
    get().fetchOrders(page, get().pageSize)
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 1 })
    get().fetchOrders(1, size)
  },
}))

export default useOrderStore 