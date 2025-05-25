import { create } from "zustand"
import axios from "axios"
import { useAuthStore } from "./authStore"

export interface OrderItem {
  id: string
  product: string
  product_details: {
    id: string
    name: string
    sku: string
    cover_url: string
  }
  product_owner_tenant_id: string
  product_owner_tenant_name: string
  quantity: number
  price: string
  custom_profit_percentage: string
  custom_selling_price: string
}

export interface OrderHistory {
  status: string
  description: string
  created_by_name: string
  created_at: string
}

export interface ShippingAddressDetails {
  id: string
  full_address: string
  phone_number: string
}

export interface SingleOrder {
  id: string
  order_number: string
  seller_tenant_id: string
  seller_tenant_name: string
  user_name: string
  status: string
  subtotal: string
  taxes: string
  shipping: string
  discount: string
  total_amount: string
  notes: string
  email: string
  phone: string
  created_at: string
  updated_at: string
  shipping_address_details: ShippingAddressDetails
  items: OrderItem[]
  history: OrderHistory[]
}

interface SingleOrderStore {
  order: SingleOrder | null
  isLoading: boolean
  error: string | null
  fetchOrder: (id: string) => Promise<void>
  updateOrderStatus: (id: string, status: string) => Promise<void>
}

const useSingleOrderStore = create<SingleOrderStore>((set) => ({
  order: null,
  isLoading: false,
  error: null,
  fetchOrder: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      set({ order: res.data, isLoading: false })
    } catch (error: any) {
      set({
        error: error?.response?.data?.detail || error.message || "Failed to fetch order",
        isLoading: false,
      })
    }
  },
  updateOrderStatus: async (id: string, status: string) => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      set({ order: res.data, isLoading: false })
    } catch (error: any) {
      set({
        error: error?.response?.data?.detail || error.message || "Failed to update order status",
        isLoading: false,
      })
    }
  },
}))

export default useSingleOrderStore 