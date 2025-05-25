import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ConnectX/);
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check if main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should have working theme toggle', async ({ page }) => {
    await page.goto('/');
    
    // Find the theme toggle button
    const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeToggle).toBeVisible();
    
    // Click to open the dropdown
    await themeToggle.click();
    
    // Select dark theme
    const darkThemeOption = page.getByRole('menuitem', { name: 'Dark' });
    await expect(darkThemeOption).toBeVisible();
    await darkThemeOption.click();
    
    // Verify dark theme is applied
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
    
    // Click to open the dropdown again
    await themeToggle.click();
    
    // Select light theme
    const lightThemeOption = page.getByRole('menuitem', { name: 'Light' });
    await expect(lightThemeOption).toBeVisible();
    await lightThemeOption.click();
    
    // Verify light theme is applied
    await expect(page.locator('html')).not.toHaveAttribute('class', /dark/);
  });
}); 