import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

// Mock the necessary modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => <div data-testid="mock-toaster" />,
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockGetRedirectPath = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    
    // Mock the Zustand store
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        login: mockLogin,
        getRedirectPath: mockGetRedirectPath,
        user: null,
      };
      return selector(store);
    });
    
    // Mock the getState method for the success case
    useAuthStore.getState = jest.fn().mockReturnValue({
      user: { role: 'merchant' }
    });
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);
    
    // Check if important elements are rendered
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('updates form values when user types', async () => {
    render(<LoginPage />);
    
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls login function with correct data on form submission', async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginPage />);
    
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('shows success toast and redirects on successful login', async () => {
    jest.useFakeTimers();
    mockLogin.mockResolvedValue(undefined);
    mockGetRedirectPath.mockReturnValue('/dashboard');
    
    render(<LoginPage />);
    
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Wait for the async login operation to complete
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Welcome back! Redirecting to dashboard...',
        expect.any(Object)
      );
    });
    
    // Advance timers to trigger the setTimeout callback
    jest.advanceTimersByTime(2000);
    
    // Now the redirect should have been triggered
    expect(mockGetRedirectPath).toHaveBeenCalled();
  });

  it('shows error toast on failed login', async () => {
    // Mock a failed login
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    
    render(<LoginPage />);
    
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    // Increase the timeout for this test
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid email or password. Please try again.',
        expect.any(Object)
      );
    }, { timeout: 10000 });
  });

  it('disables the submit button while loading', async () => {
    // Create a promise that won't resolve immediately to keep the loading state
    const loginPromise = new Promise<void>(() => {
      // This promise intentionally never resolves to keep the loading state
    });
    
    mockLogin.mockReturnValue(loginPromise);
    
    render(<LoginPage />);
    
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Button should now show loading state and be disabled
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    }, { timeout: 10000 });
    
    // No need to resolve the promise since we're just testing the loading state
  }, 15000); // Increase timeout for this specific test
}); 