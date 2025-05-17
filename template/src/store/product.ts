import { create } from 'zustand';
import { useAuthStore } from './auth';

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
  currentProduct: Product | null;
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  fetchProducts: (page?: number) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearError: () => void;
}

const API_URL = 'https://connectx-9agd.onrender.com/api';

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
  currentProduct: null,
  totalCount: 0,
  currentPage: 1,
  loading: false,
  error: null,

  fetchProducts: async (page = 1) => {
    try {
      set({ loading: true, error: null });
      
      const accessToken = useAuthStore.getState().accessToken;
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/products/?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        throw new Error('Please login to view products');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ProductResponse = await response.json();
      
      // Process images for each product
      const processedProducts = data.results.map(product => ({
        ...product,
        cover_url: processProductImage(product.cover_url),
        images: product.images.map(processProductImage),
      }));

      set({
        products: processedProducts,
        totalCount: data.count,
        currentPage: page,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false,
      });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      set({ loading: true, error: null });
      
      const accessToken = useAuthStore.getState().accessToken;
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      // You can modify this to use a specific endpoint for featured products
      // For now, we'll just get the first page and filter by most sold/rated
      const response = await fetch(`${API_URL}/products/?page=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }

      const data: ProductResponse = await response.json();
      
      // Process images and sort by total_sold to get featured products
      const processedProducts = data.results
        .map(product => ({
          ...product,
          cover_url: processProductImage(product.cover_url),
          images: product.images.map(processProductImage),
        }))
        .sort((a, b) => b.total_sold - a.total_sold);

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

  fetchProductById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      const accessToken = useAuthStore.getState().accessToken;
      
      if (!accessToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/products/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        throw new Error('Please login to view product details');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const product: Product = await response.json();
      
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

  clearError: () => {
    set({ error: null });
  },
})); 