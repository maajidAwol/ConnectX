import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock the components used in the HomePage
jest.mock('@/components/partner-scroll', () => ({
  PartnerScroll: () => <div data-testid="partner-scroll-mock" />,
}));

jest.mock('@/components/testimonial-carousel', () => ({
  TestimonialCarousel: () => <div data-testid="testimonial-carousel-mock" />,
}));

jest.mock('@/components/process-steps', () => ({
  ProcessSteps: () => <div data-testid="process-steps-mock" />,
}));

jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div data-testid="accordion-mock">{children}</div>,
  AccordionItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('HomePage', () => {
  it('renders the home page correctly', () => {
    render(<HomePage />);
    
    // Check if the main heading is rendered
    expect(screen.getByText('The E-Commerce Backend That Powers Your Growth')).toBeInTheDocument();
    
    // Check if the beta tag is rendered
    expect(screen.getByText('v1.0 Beta')).toBeInTheDocument();
    
    // Check if CTA buttons are rendered
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
    expect(screen.getByText('View Documentation')).toBeInTheDocument();
    
    // Check if feature section heading is rendered
    expect(screen.getByText('Everything you need to succeed')).toBeInTheDocument();
    
    // Check if core features are rendered
    expect(screen.getByText('Centralized Backend')).toBeInTheDocument();
    expect(screen.getByText('Inventory Management')).toBeInTheDocument();
    expect(screen.getByText('Order Processing')).toBeInTheDocument();
    expect(screen.getByText('User Authentication')).toBeInTheDocument();
    
    // Check if the mocked components are rendered
    expect(screen.getByTestId('partner-scroll-mock')).toBeInTheDocument();
    expect(screen.getByTestId('testimonial-carousel-mock')).toBeInTheDocument();
    expect(screen.getByTestId('process-steps-mock')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-mock')).toBeInTheDocument();
  });

  it('has correct links to other pages', () => {
    render(<HomePage />);
    
    // Check for documentation link
    const docsLink = screen.getByRole('link', { name: 'View Documentation' });
    expect(docsLink).toHaveAttribute('href', '/docs');
    
    // Check for pricing link - using getByRole with partial match instead of exact text
    const pricingLink = screen.getByRole('link', { name: 'Pricing' });
    expect(pricingLink).toHaveAttribute('href', '/pricing');
    
    // Check for signup link - look for the Get Started Now link that points to signup
    const getStartedLink = screen.getByRole('link', { name: 'Get Started Now' });
    expect(getStartedLink).toHaveAttribute('href', '/signup');
  });

  it('displays the dashboard preview in hero section', () => {
    render(<HomePage />);
    
    // Check for dashboard elements
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByText('$24,512.65')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('API Status')).toBeInTheDocument();
    expect(screen.getByText('All Systems Operational')).toBeInTheDocument();
  });
}); 