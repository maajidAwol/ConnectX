import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/protected-route';
import { useAuthStore } from '@/store/authStore';

// Mock the necessary modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the router
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('redirects to login page when user is not authenticated', () => {
    // Mock unauthenticated state
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        isAuthenticated: false,
        user: null,
      };
      return selector(store);
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Check if router.push was called with '/login'
    expect(mockPush).toHaveBeenCalledWith('/login');
    
    // Should not render children when not authenticated
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated and no role is required', () => {
    // Mock authenticated state
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com', role: 'user' },
      };
      return selector(store);
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Should render children when authenticated
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    
    // Router.push should not be called
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects to appropriate page when user does not have required role', () => {
    // Mock authenticated state with user role
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        isAuthenticated: true,
        user: { id: '1', email: 'test@example.com', role: 'user' },
      };
      return selector(store);
    });
    
    render(
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    
    // Should redirect to home page
    expect(mockPush).toHaveBeenCalledWith('/');
    
    // Should not render children when role requirement is not met
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('redirects admin users to admin dashboard when lacking specific role', () => {
    // Mock authenticated state with admin role
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        isAuthenticated: true,
        user: { id: '1', email: 'admin@example.com', role: 'admin' },
      };
      return selector(store);
    });
    
    render(
      <ProtectedRoute requiredRole="owner">
        <div>Owner Content</div>
      </ProtectedRoute>
    );
    
    // Should redirect to admin dashboard
    expect(mockPush).toHaveBeenCalledWith('/admin');
    
    // Should not render children when role requirement is not met
    expect(screen.queryByText('Owner Content')).not.toBeInTheDocument();
  });

  it('redirects merchant users to merchant dashboard when lacking specific role', () => {
    // Mock authenticated state with owner role
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        isAuthenticated: true,
        user: { id: '1', email: 'merchant@example.com', role: 'owner' },
      };
      return selector(store);
    });
    
    render(
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    
    // Should redirect to merchant dashboard
    expect(mockPush).toHaveBeenCalledWith('/merchant');
    
    // Should not render children when role requirement is not met
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('renders children when user has the required role', () => {
    // Mock authenticated state with correct role
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        isAuthenticated: true,
        user: { id: '1', email: 'admin@example.com', role: 'admin' },
      };
      return selector(store);
    });
    
    render(
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    
    // Should render children when role requirement is met
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    
    // Router.push should not be called
    expect(mockPush).not.toHaveBeenCalled();
  });
}); 