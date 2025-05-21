import { create } from 'zustand'
import { useAuthStore } from './authStore'

interface TenantData {
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
  legal_name: string
  business_registration_number: string
  business_type: string
  business_bio: string
  licence_registration_date: string
  tenant_verification_status: string
  tenant_verification_date: string | null
  business_registration_certificate_url: string
  business_license_url: string
  tin_number: string
  vat_number: string
  tax_office_address: string
  tax_registration_certificate_url: string
  bank_name: string
  bank_account_number: string
  bank_account_name: string
  bank_branch: string
  bank_statement_url: string | null
  mobileapp_url: string | null
  mobileapp_name: string | null
  id_card_url: string | null
}

interface TenantState {
  tenantData: TenantData | null
  isLoading: boolean
  error: string | null
  fetchTenantData: () => Promise<void>
  clearError: () => void
}

export const useTenantStore = create<TenantState>((set, get) => ({
  tenantData: null,
  isLoading: false,
  error: null,

  fetchTenantData: async () => {
    set({ isLoading: true, error: null });
    try {
     const { accessToken } = useAuthStore.getState()
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenants/me/`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      console.log(response)

      if (!response.ok) {
        throw new Error('Failed to fetch tenant data');
      }

      const tenantData = await response.json();
      
      set({ 
        tenantData,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch tenant data'
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
})) 