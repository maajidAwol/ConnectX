import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './auth';

export type CartItem = {
  id: string;
  name: string;
  cover_url: string;
  price: number;
  selling_price?: number;
  colors: string[];
  sizes: string[];
  category: string;
  quantity: number;
  color?: string;
  size?: string;
};

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  increaseQuantity: (id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        // Check if user is authenticated
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) {
          // Redirect to login with a message
          window.location.href = '/auth/login-illustration?message=Please login to add items to cart';
          return;
        }

        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          return { items: [...state.items, item] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      decreaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          ),
        }));
      },
      
      increaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
      // Only persist cart data if user is authenticated
      partialize: (state) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        return isAuthenticated ? state : { items: [] };
      },
    }
  )
);