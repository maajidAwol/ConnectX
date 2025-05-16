import { render, screen } from '@testing-library/react';
import MerchantPage from '@/app/merchant/page';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

// Mock the necessary modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock the ProtectedRoute component
jest.mock('@/components/protected-route', () => ({
  __esModule: true,
  default: ({ children, requiredRole }) => <div data-testid="protected-route" data-role={requiredRole}>{children}</div>,
}));

// Mock the icons
jest.mock('lucide-react', () => ({
  ArrowUpRight: () => <div data-testid="icon-arrow-up-right" />,
  Clock: () => <div data-testid="icon-clock" />,
  DollarSign: () => <div data-testid="icon-dollar-sign" />,
  Package: () => <div data-testid="icon-package" />,
  ShoppingCart: () => <div data-testid="icon-shopping-cart" />,
  TrendingUp: () => <div data-testid="icon-trending-up" />,
  Users: () => <div data-testid="icon-users" />,
}));

describe('MerchantPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the auth store
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        isAuthenticated: true,
        user: { id: '1', email: 'merchant@example.com', role: 'owner' },
      };
      return selector(store);
    });
  });

  it('renders the merchant dashboard with the correct title and description', () => {
    render(<MerchantPage />);
    
    expect(screen.getByText('Merchant Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Business metrics, quick stats, and insights')).toBeInTheDocument();
  });

  it('renders all stats cards correctly', () => {
    render(<MerchantPage />);
    
    // Check stat card titles - using getAllByText for elements that appear multiple times
    expect(screen.getAllByText('Total Revenue')[0]).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    
    // Check the values are displayed
    expect(screen.getByText('+573')).toBeInTheDocument();
    expect(screen.getByText('2,845')).toBeInTheDocument();
  });

  it('is wrapped in a ProtectedRoute with proper role', () => {
    render(<MerchantPage />);
    
    const protectedRoute = screen.getByTestId('protected-route');
    expect(protectedRoute).toBeInTheDocument();
    expect(protectedRoute).toHaveAttribute('data-role', 'owner');
  });

  it('renders the Recent Orders section', () => {
    render(<MerchantPage />);
    
    expect(screen.getByText('Recent Orders')).toBeInTheDocument();
    expect(screen.getByText('Latest customer orders requiring attention')).toBeInTheDocument();
  });

  it('renders the Sales Overview section', () => {
    render(<MerchantPage />);
    
    expect(screen.getByText('Sales Overview')).toBeInTheDocument();
    expect(screen.getByText('Monthly revenue breakdown')).toBeInTheDocument();
    expect(screen.getByText('Direct Sales')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Affiliate')).toBeInTheDocument();
  });

  it('renders the Top Products section', () => {
    render(<MerchantPage />);
    
    expect(screen.getByText('Top Products')).toBeInTheDocument();
    expect(screen.getByText('By sales volume')).toBeInTheDocument();
  });

  it('renders the Recent Activity section', () => {
    render(<MerchantPage />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Latest store events')).toBeInTheDocument();
  });

  it('includes View All links for relevant sections', () => {
    render(<MerchantPage />);
    
    const viewAllLinks = screen.getAllByText('View All');
    expect(viewAllLinks.length).toBeGreaterThan(0);
  });
}); 