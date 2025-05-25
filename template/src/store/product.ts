import { create } from 'zustand';
import { apiRequest } from '../lib/api-config';

export interface Product {
  id: string;
  tenant: string[];
  owner: string;
  sku: string;
  name: string;
  base_price: string;
  profit_percentage: number | null;
  selling_price: string | null;
  quantity: number;
  category: {
    id: string;
    icon: string | null;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    tenant: string;
    parent: string | null;
  };
  is_public: boolean;
  description: string;
  short_description: string;
  tag: string[];
  brand: string;
  additional_info: Record<string, string>;
  warranty: string;
  cover_url: string;
  images: string[];
  colors: string[];
  sizes: string[];
  total_sold: number;
  review: {
    total_reviews: number;
    average_rating: number;
    rating_distribution: {
      '1': number;
      '2': number;
      '3': number;
      '4': number;
      '5': number;
    };
  };
  created_at: string;
  updated_at: string;
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
  selectedCategoryId: string | null;
  sortBy: string;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  fetchProducts: (page?: number, status?: string, categoryId?: string | null, sortBy?: string, searchQuery?: string, minPrice?: number | null, maxPrice?: number | null, minRating?: number | null) => Promise<ProductResponse | undefined>;
  fetchProductById: (id: string) => Promise<void>;
  fetchListedCategories: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  setSelectedCategory: (categoryId: string | null) => void;
  setSortBy: (sortBy: string) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setMinRating: (rating: number | null) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  featuredProducts: [],
  selectedCategoryId: null,
  sortBy: 'latest',
  minPrice: null,
  maxPrice: null,
  minRating: null,

  setSelectedCategory: (categoryId: string | null) => {
    set({ selectedCategoryId: categoryId });
    get().fetchProducts(1, 'listed', categoryId, get().sortBy, '', get().minPrice, get().maxPrice, get().minRating);
  },

  setSortBy: (sortBy: string) => {
    set({ sortBy });
    get().fetchProducts(1, 'listed', get().selectedCategoryId, sortBy, '', get().minPrice, get().maxPrice, get().minRating);
  },

  setPriceRange: (min: number | null, max: number | null) => {
    set({ minPrice: min, maxPrice: max });
    get().fetchProducts(1, 'listed', get().selectedCategoryId, get().sortBy, '', min, max, get().minRating);
  },

  setMinRating: (rating: number | null) => {
    set({ minRating: rating });
    get().fetchProducts(1, 'listed', get().selectedCategoryId, get().sortBy, '', get().minPrice, get().maxPrice, rating);
  },

  fetchProducts: async (page = 1, status = 'listed', categoryId = null, sortBy = 'latest', searchQuery = '', minPrice = null, maxPrice = null, minRating = null) => {
    try {
      set({ loading: true, error: null });
      
      let url = 'products';
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('status', status);
      params.append('sort_by', sortBy.replace(/\/$/, ''));

      if (categoryId) {
        const cleanCategoryId = categoryId.toString().replace(/\/$/, '');
        params.append('category_id', cleanCategoryId);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (minPrice !== null) {
        params.append('min_price', minPrice.toString());
      }

      if (maxPrice !== null) {
        params.append('max_price', maxPrice.toString());
      }

      if (minRating !== null) {
        params.append('min_rating', minRating.toString());
      }

      const finalUrl = `${url}?${params.toString()}`;

      const response = await apiRequest<ProductResponse>(finalUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }, true, undefined, true);

      if (response) {
        // Sort products based on sortBy if needed
        let sortedResults = [...response.results];
        if (sortBy === 'price_asc') {
          sortedResults.sort((a, b) => parseFloat(a.base_price) - parseFloat(b.base_price));
        } else if (sortBy === 'price_desc') {
          sortedResults.sort((a, b) => parseFloat(b.base_price) - parseFloat(a.base_price));
        } else if (sortBy === 'rating') {
          sortedResults.sort((a, b) => (b.review?.average_rating || 0) - (a.review?.average_rating || 0));
        } else if (sortBy === 'latest') {
          sortedResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        set({
          products: sortedResults,
          totalCount: response.count || 0,
          currentPage: page,
          loading: false,
        });
      }

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