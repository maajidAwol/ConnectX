import { create } from 'zustand';
import { useAuthStore } from './auth';
import { apiRequest } from '../lib/api-config';

interface Category {
  id: string;
  icon: string | null;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  tenant: string;
  parent: string | null;
}

interface Product {
  id: string;
  tenant: string[];
  owner: string;
  sku: string;
  name: string;
  base_price: string;
  profit_percentage: number | null;
  selling_price: number | null;
  quantity: number;
  category: Category;
  is_public: boolean;
  description: string;
  short_description: string;
  tag: string[];
  brand: string;
  additional_info: Record<string, any>;
  warranty: string;
  cover_url: string;
  images: string[];
  colors: string[];
  sizes: string[];
  total_sold: number;
  total_ratings: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

interface ProductResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  topProducts: Product[];
  popularProducts: Product[];
  hotDealProducts: Product[];
  featuredBrandsProducts: Product[];
  currentProduct: Product | null;
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  categories: Category[];
  fetchProducts: (page?: number, type?: string, categoryId?: string | null, sort?: string) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchTopProducts: () => Promise<void>;
  fetchPopularProducts: () => Promise<void>;
  fetchHotDealProducts: () => Promise<void>;
  fetchFeaturedBrandsProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchListedCategories: () => Promise<void>;
  clearError: () => void;
}

// Placeholder image for products without images
const PLACEHOLDER_IMAGE = '/assets/placeholder.jpg';

const processProductImage = (imageUrl: string) => {
  if (!imageUrl || imageUrl.includes('example.com') || !imageUrl.startsWith('http')) {
    return PLACEHOLDER_IMAGE;
  }
  return imageUrl;
};

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  featuredProducts: [],
  topProducts: [],
  popularProducts: [],
  hotDealProducts: [],
  featuredBrandsProducts: [],
  currentProduct: null,
  totalCount: 0,
  currentPage: 1,
  loading: false,
  error: null,
  categories: [],

  fetchProducts: async (
    page = 1,
    type = 'listed',
    categoryId?: string | null,
    sort?: string
  ) => {
    try {
      set({ loading: true, error: null });
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: '5',
        filter_type: type,
        ...(categoryId && { category__name: categoryId }),
        ...(sort && { sort }),
      });

      const data = await apiRequest<ProductResponse>(
        `/products/?${queryParams.toString()}`,
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        },
        false // Don't include authentication
      );
      
      if (!data || !data.results) {
        throw new Error('Invalid response format from API');
      }

      const processedProducts = data.results.map(product => ({
        ...product,
        cover_url: processProductImage(product.cover_url),
        images: product.images.map(processProductImage),
      }));

      set({
        products: processedProducts,
        totalCount: data.count || 0,
        currentPage: page,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
        products: [],
        totalCount: 0,
      });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      set({ loading: true, error: null });
      
      const data = await apiRequest<ProductResponse>(
        '/products/?page_size=4&is_public=true&sort=total_sold',
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        },
        false
      );
      
      const processedProducts = data.results.map(product => ({
          ...product,
          cover_url: processProductImage(product.cover_url),
          images: product.images.map(processProductImage),
      }));

      set({
        featuredProducts: processedProducts,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },

  fetchTopProducts: async () => {
    try {
      set({ loading: true, error: null });
      
      const data = await apiRequest<ProductResponse>(
        '/products/?page_size=8&sort=total_ratings',
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        },
        false
      );
      
      const processedProducts = data.results.map(product => ({
        ...product,
        cover_url: processProductImage(product.cover_url),
        images: product.images.map(processProductImage),
      }));

      set({ topProducts: processedProducts, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },

  fetchPopularProducts: async () => {
    try {
      set({ loading: true, error: null });
      
      const data = await apiRequest<ProductResponse>(
        '/products/?page_size=8&sort=-total_sold',
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        },
        false
      );
      
      const processedProducts = data.results.map(product => ({
        ...product,
        cover_url: processProductImage(product.cover_url),
        images: product.images.map(processProductImage),
      }));

      set({ popularProducts: processedProducts, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },

  fetchHotDealProducts: async () => {
    try {
      set({ loading: true, error: null });
      
      const data = await apiRequest<ProductResponse>(
        '/products/?page_size=6&sort=-created_at',
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        },
        false
      );
      
      const processedProducts = data.results.map(product => ({
        ...product,
        cover_url: processProductImage(product.cover_url),
        images: product.images.map(processProductImage),
      }));

      set({ hotDealProducts: processedProducts, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },

  fetchFeaturedBrandsProducts: async () => {
    try {
      set({ loading: true, error: null });
      
      const data = await apiRequest<ProductResponse>(
        '/products/?page_size=3&sort=-total_sold',
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        },
        false
      );
      
      const processedProducts = data.results.map(product => ({
        ...product,
        cover_url: processProductImage(product.cover_url),
        images: product.images.map(processProductImage),
      }));

      set({ featuredBrandsProducts: processedProducts, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },

  fetchProductById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      const product = await apiRequest<Product>(`/products/${id}/`);
      
      // Process images for the product
      const processedProduct = {
        ...product,
        cover_url: processProductImage(product.cover_url),
        images: product.images.map(processProductImage),
      };

      set({
        currentProduct: processedProduct,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },

  fetchListedCategories: async () => {
    try {
      set({ loading: true, error: null });

      const data = await apiRequest<{ count: number; results: Category[] }>(
        '/products/listed-categories/',
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        },
        false // Don't include authentication
      );

      if (!data || !data.results) {
        throw new Error('Invalid response format for categories');
      }

      set({ categories: data.results, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred fetching categories',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
})); 