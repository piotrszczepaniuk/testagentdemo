import { test, expect } from '@playwright/test';

test.describe('Navigation and UI Elements', () => {
  test.beforeEach(async ({ page }) => {
    // Log in successfully before each test
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Logout Functionality', async ({ page }) => {
    // 1. Log in successfully as "standard_user" (done in beforeEach)
    // 2. Click the menu button (hamburger icon) in the header
    await page.click('#react-burger-menu-btn');
    
    // 3. Click the "Logout" option
    await page.click('#logout_sidebar_link');

    // Expected Results:
    // - User is logged out
    // - User is redirected to the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // - Login form is displayed
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    
    // - Session is cleared (verify by checking we can't access inventory without login)
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Continue Shopping from Cart', async ({ page }) => {
    // 1. Log in successfully as "standard_user" (done in beforeEach)
    // 2. Add at least one item to cart
    await page.locator('.inventory_item').first().locator('button').filter({ hasText: 'Add to cart' }).click();
    const cartBadgeCount = await page.locator('.shopping_cart_badge').textContent();
    
    // 3. Navigate to the cart page
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    // 4. Click the "Continue Shopping" button
    await page.click('[data-test="continue-shopping"]');

    // Expected Results:
    // - User is redirected to the products page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // - Products are displayed
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    
    // - Cart badge still shows the number of items
    await expect(page.locator('.shopping_cart_badge')).toHaveText(cartBadgeCount || '1');
    
    // - Previously added items remain in cart
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
});

