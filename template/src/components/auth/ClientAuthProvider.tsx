'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from 'src/store/auth';

interface Props {
  children: React.ReactNode;
}

export default function ClientAuthProvider({ children }: Props) {
  const [isHydrated, setIsHydrated] = useState(false);
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // This will run only on the client side
    const initializeStore = async () => {
      try {
        await initialize();
        // Add a small delay to ensure hydration is complete
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsHydrated(true);
      } catch (error) {
        console.error('Error initializing auth store:', error);
        setIsHydrated(true); // Still set to true to prevent infinite loading
      }
    };

    initializeStore();
  }, [initialize]);

  // Show loading state while hydrating
  if (!isHydrated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
} 