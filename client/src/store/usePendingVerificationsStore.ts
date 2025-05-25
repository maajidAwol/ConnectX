import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface PendingVerification {
  id: string
  name: string
  email: string
  logo_url: string | null
  phone: string | null
  address: string | null
  website_url: string | null
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  legal_name: string | null
  business_registration_number: string | null
  business_type: string | null
  business_bio: string | null
  tenant_verification_status: string
  tenant_verification_date: string | null
}

interface PendingVerificationsResponse {
  count: number
  next: string | null
  previous: string | null
  results: PendingVerification[]
}

interface PendingVerificationsState {
  pendingVerifications: PendingVerification[]
  isLoading: boolean
  error: string | null
  fetchPendingVerifications: () => Promise<void>
}

const API_URL = 'https://connectx-9agd.onrender.com/api'

const usePendingVerificationsStore = create<PendingVerificationsState>((set) => ({
  pendingVerifications: [],
  isLoading: false,
  error: null,

  fetchPendingVerifications: async () => {
    try {
      set({ isLoading: true, error: null })
      const { accessToken } = useAuthStore.getState()

      const response = await axios.get<PendingVerificationsResponse>(
        `${API_URL}/tenants/pending-verifications/?page=1&page_size=5`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/json',
          },
        }
      )

      set({ 
        pendingVerifications: response.data.results,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch pending verifications',
        isLoading: false 
      })
    }
  },
}))

export default usePendingVerificationsStore 