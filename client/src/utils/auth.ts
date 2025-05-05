import { useAuthStore } from '@/store/authStore';

/**
 * Refreshes the access token using the refresh token
 * @returns A promise that resolves to a new access token or null if refresh fails
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = useAuthStore.getState().refreshToken;
    
    if (!refreshToken) {
      return null;
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    const newAccessToken = data.access;
    
    // Update auth store with new token
    const authStore = useAuthStore.getState();
    useAuthStore.setState({
      ...authStore,
      accessToken: newAccessToken,
    });
    
    // Update access token cookie
    if (typeof document !== 'undefined') {
      const date = new Date();
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000); // 1 day
      document.cookie = `accessToken=${newAccessToken};expires=${date.toUTCString()};path=/`;
    }
    
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

/**
 * Creates an authenticated fetch function that includes authorization headers
 * and handles token refresh
 */
export const createAuthFetch = () => {
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    // Get current access token
    let accessToken = useAuthStore.getState().accessToken;
    
    // Create headers with auth token
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };
    
    // Make the request
    let response = await fetch(url, {
      ...options,
      headers,
    });
    
    // If unauthorized, try to refresh token and retry
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Retry the request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        });
      } else {
        // Token refresh failed, logout user
        useAuthStore.getState().logout();
        throw new Error('Authentication failed');
      }
    }
    
    return response;
  };
  
  return fetchWithAuth;
};

/**
 * Check if the user has a specific role
 */
export const hasRole = (requiredRole: string): boolean => {
  const user = useAuthStore.getState().user;
  return user?.role === requiredRole;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().isAuthenticated;
}; 