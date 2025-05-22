import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface Tenant {
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
  licence_registration_date: string | null
  tenant_verification_status: 'unverified' | 'pending' | 'under_review' | 'approved' | 'rejected'
  tenant_verification_date: string | null
  business_registration_certificate_url: string | null
  business_license_url: string | null
  tin_number: string | null
  vat_number: string | null
  tax_office_address: string | null
  tax_registration_certificate_url: string | null
  bank_name: string | null
  bank_account_number: string | null
  bank_account_name: string | null
  bank_branch: string | null
  bank_statement_url: string | null
  mobileapp_url: string | null
  mobileapp_name: string | null
  id_card_url: string | null
}

interface TenantStore {
  // Merchant Management State
  tenants: Tenant[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  pageSize: number
  searchQuery: string
  statusFilter: string
  sortOrder: 'created_at' | '-created_at'

  // Business Profile State
  tenantData: Tenant | null
  isLoading: boolean

  // Merchant Management Actions
  fetchTenants: () => Promise<void>
  setPage: (page: number) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setSortOrder: (order: 'created_at' | '-created_at') => void
  refreshTenants: () => Promise<void>

  // Business Profile Actions
  fetchTenantData: () => Promise<void>
  updateTenantData: (formData: FormData) => Promise<void>
  clearError: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const useTenantStore = create<TenantStore>((set, get) => ({
  // Merchant Management State
  tenants: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 5,
  searchQuery: '',
  statusFilter: '',
  sortOrder: '-created_at',

  // Business Profile State
  tenantData: null,
  isLoading: false,

  // Merchant Management Actions
  fetchTenants: async () => {
    const { currentPage, pageSize, searchQuery, statusFilter, sortOrder } = get()
    set({ loading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
        ordering: sortOrder,
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }
      if (statusFilter) {
        params.append('tenant_verification_status', statusFilter)
      }

      const response = await axios.get(
        `${API_URL}/tenants/?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': 'application/json',
          },
        }
      )
      set({
        tenants: response.data.results,
        totalCount: response.data.count,
        loading: false,
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch tenants', loading: false })
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page })
    get().fetchTenants()
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 })
    get().fetchTenants()
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status, currentPage: 1 })
    get().fetchTenants()
  },

  setSortOrder: (order: 'created_at' | '-created_at') => {
    set({ sortOrder: order })
    get().fetchTenants()
  },

  refreshTenants: async () => {
    await get().fetchTenants()
  },

  // Business Profile Actions
  fetchTenantData: async () => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      if (!accessToken) {
        throw new Error('No access token available')
      }

      const response = await axios.get(
        `${API_URL}/tenants/me/`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      set({
        tenantData: response.data,
        isLoading: false,
        error: null
      })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tenant data'
      })
      throw error
    }
  },

  updateTenantData: async (formData: FormData) => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const { tenantData } = get()
      
      if (!accessToken || !tenantData) {
        throw new Error('No access token or tenant data available')
      }

      const response = await axios.patch(
        `${API_URL}/tenants/${tenantData.id}/`,
        formData,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      
      set({ 
        tenantData: response.data,
        isLoading: false,
        error: null
      })
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update tenant data'
      })
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  },
})) 