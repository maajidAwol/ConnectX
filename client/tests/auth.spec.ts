import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    
    // Check if login form is visible
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
    
    // Check for email and password inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    // Check for validation messages
    const errorMessages = page.locator('[role="alert"]');
    await expect(errorMessages).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');
    
    // Find the signup button in the header
    const signupButton = page.getByRole('button', { name: 'Sign Up' });
    await expect(signupButton).toBeVisible();
    
    // Click the signup button
    await signupButton.click();
    
    // Verify we're on the signup page
    await expect(page).toHaveURL(/.*signup/);
    
    // Verify the signup form is visible
    const signupForm = page.locator('form');
    await expect(signupForm).toBeVisible();
  });

//   test('should navigate to signup from mobile menu', async ({ page }) => {
//     // Set viewport to mobile size
//     await page.setViewportSize({ width: 375, height: 667 });
    
//     await page.goto('/');
    
//     // Open mobile menu
//     const menuButton = page.getByRole('button', { name: /menu/i });
//     await expect(menuButton).toBeVisible();
//     await menuButton.click();
    
//     // Find and click the signup button in mobile menu
//     const mobileSignupButton = page.getByRole('button', { name: 'Sign Up' });
//     await expect(mobileSignupButton).toBeVisible();
//     await mobileSignupButton.click();
    
//     // Verify we're on the signup page
//     await expect(page).toHaveURL(/.*signup/);
//   });

  test('should navigate to signup from mobile menu', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open mobile menu using more robust selector
    const menuButton = page.locator('button.md\\:hidden').filter({ has: page.locator('svg') }); // Targets button with SVG (Menu/X icon)
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Wait for mobile menu to appear
    const mobileMenu = page.locator('div.md\\:hidden.border-t');
    await expect(mobileMenu).toBeVisible();

    // Find and click the signup button in mobile menu
    const mobileSignupButton = page.locator('div.md\\:hidden').getByRole('button', { name: 'Sign Up' });
    await expect(mobileSignupButton).toBeVisible();
    await mobileSignupButton.click();

    // Wait for navigation and verify URL
    await page.waitForURL(/.*signup/);
    await expect(page).toHaveURL(/.*signup/);
  });
}); 