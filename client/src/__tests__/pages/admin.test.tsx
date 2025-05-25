import { render, screen } from '@testing-library/react';
import AdminPage from '@/app/admin/page';
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
  BarChart3: () => <div data-testid="icon-bar-chart" />,
  CheckCircle: () => <div data-testid="icon-check-circle" />,
  Clock: () => <div data-testid="icon-clock" />,
  DollarSign: () => <div data-testid="icon-dollar-sign" />,
  Users: () => <div data-testid="icon-users" />,
}));

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the auth store
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        isAuthenticated: true,
        user: { id: '1', email: 'admin@example.com', role: 'admin' },
      };
      return selector(store);
    });
  });

  it('renders the admin dashboard with the correct title and description', () => {
    render(<AdminPage />);
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('System overview, health, performance, and metrics')).toBeInTheDocument();
  });

  it('renders all metrics cards correctly', () => {
    render(<AdminPage />);
    
    // Check metric card titles
    expect(screen.getByText('Total Merchants')).toBeInTheDocument();
    expect(screen.getAllByText('Total Revenue')[0]).toBeInTheDocument();
    expect(screen.getByText('Active Developers')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();
    
    // Check growth labels are present
    expect(screen.getByText('+12% from last month')).toBeInTheDocument();
    expect(screen.getByText('+8.2% from last month')).toBeInTheDocument();
    expect(screen.getByText('+18% from last month')).toBeInTheDocument();
    expect(screen.getByText('Uptime last 30 days')).toBeInTheDocument();
  });

  it('is wrapped in a ProtectedRoute with admin role requirement', () => {
    render(<AdminPage />);
    
    const protectedRoute = screen.getByTestId('protected-route');
    expect(protectedRoute).toBeInTheDocument();
    expect(protectedRoute).toHaveAttribute('data-role', 'admin');
  });

  it('renders the Merchant Approval Queue section', () => {
    render(<AdminPage />);
    
    expect(screen.getByText('Merchant Approval Queue')).toBeInTheDocument();
    expect(screen.getByText('Merchants awaiting verification and approval')).toBeInTheDocument();
    
    // Should show multiple merchants awaiting approval
    const acmeEntities = screen.getAllByText(/Acme E-Commerce \d/);
    expect(acmeEntities.length).toBeGreaterThan(0);
    
    // Should show review links
    const reviewLinks = screen.getAllByText('Review');
    expect(reviewLinks.length).toBeGreaterThan(0);
  });

  it('renders the System Metrics section', () => {
    render(<AdminPage />);
    
    expect(screen.getByText('System Metrics')).toBeInTheDocument();
    expect(screen.getByText('Performance and health indicators')).toBeInTheDocument();
  });

  it('renders the Recent Activity section', () => {
    render(<AdminPage />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Latest system events')).toBeInTheDocument();
  });

  it('renders the Top Merchants section', () => {
    render(<AdminPage />);
    
    expect(screen.getByText('Top Merchants')).toBeInTheDocument();
    expect(screen.getByText('By transaction volume')).toBeInTheDocument();
  });

  it('renders the API Usage section', () => {
    render(<AdminPage />);
    
    expect(screen.getByText('API Usage')).toBeInTheDocument();
    expect(screen.getByText('Top endpoints by request volume')).toBeInTheDocument();
  });

  it('includes View All links for relevant sections', () => {
    render(<AdminPage />);
    
    const viewAllLinks = screen.getAllByText('View All');
    expect(viewAllLinks.length).toBeGreaterThan(0);
  });
}); 