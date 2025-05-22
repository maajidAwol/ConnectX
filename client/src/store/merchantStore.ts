import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface MerchantDetails {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  website_url: string | null
  legal_name: string | null
  business_type: string | null
  business_bio: string | null
  business_registration_number: string | null
  licence_registration_date: string | null
  tin_number: string | null
  vat_number: string | null
  tax_office_address: string | null
  bank_name: string | null
  bank_account_number: string | null
  bank_account_name: string | null
  bank_branch: string | null
  tenant_verification_status: 'unverified' | 'pending' | 'under_review' | 'approved' | 'rejected'
  id_card_url: string | null
  tax_registration_certificate_url: string | null
  business_registration_certificate_url: string | null
  is_verified: boolean
  tenant_verification_date: string | null
}

interface MerchantStore {
  merchant: MerchantDetails | null
  loading: boolean
  error: string | null
  fetchMerchantDetails: (id: string) => Promise<void>
  updateMerchantStatus: (id: string, status: 'pending' | 'under_review' | 'rejected') => Promise<void>
  approveMerchant: (id: string) => Promise<void>
}

export const useMerchantStore = create<MerchantStore>((set) => ({
  merchant: null,
  loading: false,
  error: null,
  fetchMerchantDetails: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tenants/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'application/json',
          },
        }
      )
      set({ merchant: response.data, loading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch merchant details', loading: false })
    }
  },
  updateMerchantStatus: async (id: string, status: 'pending' | 'under_review' | 'rejected') => {
    set({ loading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const formData = new FormData()
      formData.append('tenant_verification_status', status)
      
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenants/${id}/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      set((state) => ({
        merchant: state.merchant ? { ...state.merchant, tenant_verification_status: status } : null,
        loading: false,
      }))
      return response.data
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update merchant status', loading: false })
      throw error
    }
  },
  approveMerchant: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenants/${id}/VerificationStatus`,
        { is_verified: true },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      set((state) => ({
        merchant: state.merchant ? { 
          ...state.merchant, 
          is_verified: true,
          tenant_verification_status: 'approved',
          tenant_verification_date: response.data.tenant_verification_date
        } : null,
        loading: false,
      }))
      return response.data
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to approve merchant', loading: false })
      throw error
    }
  },
})) 