import { create } from 'zustand';
import { apiRequest } from '../lib/api-config';

export interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  base_price: string;
  selling_price: string;
  quantity: number;
  category: {
    id: string;
    name: string;
  };
  brand: string;
  warranty: string;
  sku: string;
  cover_url: string;
  images: string[];
  colors: string[];
  total_ratings: number;
  total_reviews: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  tenant: string;
  parent: string | null;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface ProductResponse {
  count: number;
  results: Product[];
}

interface ProductState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  featuredProducts: Product[];
  fetchProducts: (page?: number, status?: string, categoryId?: string | null, sortBy?: string, searchQuery?: string) => Promise<ProductResponse | undefined>;
  fetchProductById: (id: string) => Promise<void>;
  fetchListedCategories: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  featuredProducts: [],

  fetchProducts: async (page = 1, status = 'listed', categoryId = null, sortBy = 'latest', searchQuery = '') => {
    try {
      set({ loading: true, error: null });
      
      let url = `/products/?page=${page}&status=${status}&sort_by=${sortBy}`;
      if (categoryId) {
        url += `&category=${categoryId}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await apiRequest<ProductResponse>(url, {
        method: 'GET',
      }, true, undefined, true);

      set({
        products: response.results || [],
        totalCount: response.count || 0,
        currentPage: page,
        loading: false,
      });

      return response;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        loading: false,
      });
      return undefined;
    }
  },

  fetchProductById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const product = await apiRequest<Product>(`/products/${id}/`, {
        method: 'GET',
      }, true, undefined, true);
      set({ currentProduct: product, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        loading: false,
      });
    }
  },

  fetchListedCategories: async () => {
    try {
      const response = await apiRequest<PaginatedResponse<Category>>('/products/listed-categories/', {
        method: 'GET',
      }, true, undefined, true);
      
      // Extract unique categories by name to avoid duplicates
      const uniqueCategories = response.results.reduce((acc: Category[], current) => {
        const exists = acc.find(item => item.name === current.name);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      set({ categories: uniqueCategories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      set({ categories: [] });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await apiRequest<ProductResponse>('/products/?featured=true', {
        method: 'GET',
      }, true, undefined, true);
      set({
        featuredProducts: response.results || [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch featured products',
        loading: false,
      });
    }
  },
})); 