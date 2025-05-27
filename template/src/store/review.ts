import { create } from 'zustand';
import { apiRequest } from 'src/lib/api-config';
import { useAuthStore } from 'src/store/auth';

export interface Review {
  id: string;
  tenant: string;
  product: string;
  user: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  is_purchased: boolean;
  created_at: string;
}

interface ReviewStore {
  reviews: Review[];
  myReviews: Review[];
  productReviews: Review[];
  loading: boolean;
  error: string | null;
  fetchReviews: (page?: number, search?: string, ordering?: string) => Promise<void>;
  fetchMyReviews: (page?: number, search?: string, ordering?: string) => Promise<void>;
  fetchProductReviews: (productId: string, page?: number, search?: string, ordering?: string) => Promise<void>;
  createReview: (data: Omit<Review, 'id' | 'created_at'>) => Promise<Review>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  myReviews: [],
  productReviews: [],
  loading: false,
  error: null,

  fetchReviews: async (page = 1, search = '', ordering = '-created_at') => {
    try {
      set({ loading: true, error: null });
      const params = new URLSearchParams({
        page: page.toString(),
        ordering,
        ...(search && { search }),
      });
      const response = await apiRequest(`/reviews/?${params.toString()}`, {}, true);
      if (typeof response === 'object' && response !== null && 'results' in response && Array.isArray(response.results)) {
        set({ reviews: response.results as Review[], loading: false });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      set({ error: 'Failed to fetch reviews', loading: false });
    }
  },

  fetchMyReviews: async (page = 1, search = '', ordering = '-created_at') => {
    try {
      set({ loading: true, error: null });
      const params = new URLSearchParams({
        page: page.toString(),
        ordering,
        ...(search && { search }),
      });
      const response = await apiRequest(`/reviews/my_reviews/?${params.toString()}`, {}, true);
      if (typeof response === 'object' && response !== null && 'results' in response && Array.isArray(response.results)) {
        set({ myReviews: response.results as Review[], loading: false });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      set({ error: 'Failed to fetch my reviews', loading: false });
    }
  },

  fetchProductReviews: async (productId: string, page = 1, search = '', ordering = '-created_at') => {
    try {
      set({ loading: true, error: null });
      
      const params = new URLSearchParams({
        page: page.toString(),
        ordering,
        product_id: productId,
        ...(search && { search }),
      });
      
      const url = `/reviews/product-reviews/?${params.toString()}`;
      
      const response = await apiRequest(url, {}, true);
      
      if (typeof response === 'object' && response !== null) {
        if ('results' in response && Array.isArray(response.results)) {
          set({ productReviews: response.results, loading: false });
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      set({ error: 'Failed to fetch product reviews', loading: false });
    }
  },

  createReview: async (data: Omit<Review, "id" | "created_at">): Promise<Review> => {
    try {
      set({ loading: true, error: null });
      
      // Get the access token from auth store
      const { accessToken } = useAuthStore.getState();
      if (!accessToken) {
        throw new Error('You must be logged in to create a review');
      }
      
      
      const reviewData = {
        ...data,
        rating: Number(data.rating), // Ensure rating is a number
        is_purchased: Boolean(data.is_purchased), // Ensure boolean
      };
            
      const response = await apiRequest('/reviews/', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      }, true, accessToken);
      
      
      set({ loading: false });
      return response as Review;
    } catch (error) {
      set({ error: 'Failed to create review', loading: false });
      throw error;
    }
  },
})); 