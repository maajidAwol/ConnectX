import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpPage from '@/app/signup/page';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Mock the necessary modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn()
  }),
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => <div data-testid="mock-toaster" />,
}));

// Mock the Logo component
jest.mock('@/components/logo', () => ({
  Logo: () => <div data-testid="logo-mock" />,
}));

describe('SignUpPage', () => {
  const mockSignup = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Update mock implementation for each test
    // We don't need to call mockReturnValue again since it's done in the jest.mock
    
    // Mock the Zustand store
    (useAuthStore as jest.Mock).mockImplementation((selector) => {
      const store = {
        signup: mockSignup,
      };
      return selector(store);
    });
  });

  it('renders the signup form correctly', () => {
    render(<SignUpPage />);
    
    // Check title and description
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText('Enter your information below to create your account')).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    
    // Check submit button
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    
    // Check logo is displayed
    expect(screen.getByTestId('logo-mock')).toBeInTheDocument();
  });

  it('updates form values when user types', async () => {
    render(<SignUpPage />);
    
    const user = userEvent.setup();
    const companyNameInput = screen.getByLabelText('Company Name');
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    await user.type(companyNameInput, 'Test Company');
    await user.type(fullNameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(companyNameInput).toHaveValue('Test Company');
    expect(fullNameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls signup function with correct data on form submission', async () => {
    mockSignup.mockResolvedValue(undefined);
    
    render(<SignUpPage />);
    
    const user = userEvent.setup();
    const companyNameInput = screen.getByLabelText('Company Name');
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await user.type(companyNameInput, 'Test Company');
    await user.type(fullNameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(mockSignup).toHaveBeenCalledWith({
      name: 'Test Company',
      fullname: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
  });

  it('shows success toast and redirects on successful signup', async () => {
    mockSignup.mockResolvedValue(undefined);
    
    render(<SignUpPage />);
    
    const user = userEvent.setup();
    const companyNameInput = screen.getByLabelText('Company Name');
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await user.type(companyNameInput, 'Test Company');
    await user.type(fullNameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Wait for the async operations to complete
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Account created successfully!'
      );
      // Check that push was called on the router
      expect(useRouter().push).toHaveBeenCalledWith('/login');
    });
  });

  it('shows error toast on failed signup', async () => {
    // Mock a failed signup
    const errorMessage = 'Email already exists';
    mockSignup.mockRejectedValue(new Error(errorMessage));
    
    render(<SignUpPage />);
    
    const user = userEvent.setup();
    const companyNameInput = screen.getByLabelText('Company Name');
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await user.type(companyNameInput, 'Test Company');
    await user.type(fullNameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Wait for the async operations to complete
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to create account. Please try again.'
      );
      // Should not redirect on error
      expect(useRouter().push).not.toHaveBeenCalled();
    });
  });

  it('disables the submit button while loading', async () => {
    // Create a promise that won't resolve immediately to keep the loading state
    const signupPromise = new Promise<void>(() => {
      // This promise intentionally never resolves to keep the loading state
    });
    
    mockSignup.mockReturnValue(signupPromise);
    
    render(<SignUpPage />);
    
    const user = userEvent.setup();
    const companyNameInput = screen.getByLabelText('Company Name');
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    await user.type(companyNameInput, 'Test Company');
    await user.type(fullNameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Button should now show loading state and be disabled
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
    });
  });

  it('validates required fields before submission', async () => {
    render(<SignUpPage />);
    
    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    // Try to submit without filling any fields
    await user.click(submitButton);
    
    // Signup should not be called because HTML validation should prevent submission
    expect(mockSignup).not.toHaveBeenCalled();
  });
}); 