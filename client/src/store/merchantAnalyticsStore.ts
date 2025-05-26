import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

interface OverviewData {
  total_revenue: string
  total_orders: number
  total_products: number
  total_customers: number
}

interface RevenueOverviewData {
  labels: string[]
  revenue: number[]
  total_revenue: number
  average_monthly_revenue: number
  highest_revenue_month: {
    date: string
    amount: number
  }
  lowest_revenue_month: {
    date: string
    amount: number
  }
}

interface ReviewAnalyticsData {
  average_rating: number
  total_reviews: number
  rating_distribution: {
    "1": number
    "2": number
    "3": number
    "4": number
    "5": number
  }
}

interface DemographicAnalyticsData {
  total_users: number
  gender_age_distribution: {
    male_18_24: number
    male_25_34: number
    male_35_44: number
    male_45_54: number
    male_55_plus: number
    female_18_24: number
    female_25_34: number
    female_35_44: number
    female_45_54: number
    female_55_plus: number
    others: number
  }
}

interface MerchantAnalyticsState {
  overview: OverviewData | null
  revenueOverview: RevenueOverviewData | null
  reviewAnalytics: ReviewAnalyticsData | null
  demographicAnalytics: DemographicAnalyticsData | null
  isLoading: boolean
  error: string | null
  fetchOverview: () => Promise<void>
  fetchRevenueOverview: () => Promise<void>
  fetchReviewAnalytics: () => Promise<void>
  fetchDemographicAnalytics: () => Promise<void>
}

export const useMerchantAnalyticsStore = create<MerchantAnalyticsState>((set) => ({
  overview: null,
  revenueOverview: null,
  reviewAnalytics: null,
  demographicAnalytics: null,
  isLoading: false,
  error: null,

  fetchOverview: async () => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tenant/overview/`,
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

  fetchRevenueOverview: async () => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tenant/revenue_overview/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      set({ revenueOverview: response.data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch revenue overview data', 
        isLoading: false 
      })
    }
  },

  fetchReviewAnalytics: async () => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tenant/review_analytics/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      set({ reviewAnalytics: response.data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch review analytics data', 
        isLoading: false 
      })
    }
  },

  fetchDemographicAnalytics: async () => {
    set({ isLoading: true, error: null })
    try {
      const { accessToken } = useAuthStore.getState()
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tenant/demographic_analytics/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      set({ demographicAnalytics: response.data, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch demographic analytics data', 
        isLoading: false 
      })
    }
  },
})) 