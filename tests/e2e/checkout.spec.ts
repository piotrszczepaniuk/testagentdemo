import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Log in and add item to cart before each test
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Add item to cart
    await page.locator('.inventory_item').first().locator('button').filter({ hasText: 'Add to cart' }).click();
  });

  test('Complete Checkout - Happy Path', async ({ page }) => {
    // 1. Log in successfully as "standard_user" (done in beforeEach)
    // 2. Add at least one item to cart (done in beforeEach)
    // 3. Navigate to the cart page
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    // 4. Click the "Checkout" button
    await page.click('[data-test="checkout"]');
    
    // 5. Fill in the checkout information form
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // 6. Click the "Continue" button
    await page.click('[data-test="continue"]');
    
    // 7. Review the order summary on the overview page
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    
    // Expected Results - Overview page displays:
    // - Order summary with items
    await expect(page.locator('.cart_item')).toBeVisible();
    
    // - Payment information
    await expect(page.locator('.summary_info_label').filter({ hasText: 'Payment Information' })).toBeVisible();
    
    // - Shipping information
    await expect(page.locator('.summary_info_label').filter({ hasText: 'Shipping Information' })).toBeVisible();
    
    // - Price breakdown (subtotal, tax, total)
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
    
    // 8. Click the "Finish" button
    await page.click('[data-test="finish"]');
    
    // Expected Results - Success page displays:
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    
    // - "Thank you for your order!" message
    await expect(page.locator('.complete-header')).toContainText('Thank you for your order!');
    
    // - Order completion confirmation
    await expect(page.locator('.complete-text')).toBeVisible();
    
    // - "Back Home" button is available
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });

  test('Checkout - Missing Required Fields', async ({ page }) => {
    // 1. Log in successfully as "standard_user" (done in beforeEach)
    // 2. Add at least one item to cart (done in beforeEach)
    // 3. Navigate to the cart page
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    // 4. Click the "Checkout" button
    await page.click('[data-test="checkout"]');
    
    // 5. Leave all fields empty
    // 6. Click the "Continue" button
    await page.click('[data-test="continue"]');

    // Expected Results:
    // - Error message is displayed
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    
    // - Error message text: "Error: First Name is required" (or similar)
    await expect(page.locator('[data-test="error"]')).toContainText('required');
    
    // - User remains on the checkout information page
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    
    // - Form fields are still accessible
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('Cancel Checkout', async ({ page }) => {
    // 1. Log in successfully as "standard_user" (done in beforeEach)
    // 2. Add at least one item to cart (done in beforeEach)
    // 3. Navigate to the cart page
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    // 4. Click the "Checkout" button
    await page.click('[data-test="checkout"]');
    
    // 5. Click the "Cancel" button on the checkout information page
    await page.click('[data-test="cancel"]');

    // Expected Results:
    // - User is redirected back to the cart page
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    // - Cart items are still present
    await expect(page.locator('.cart_item')).toHaveCount(1);
    
    // - No order is placed (verified by still being on cart page)
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });
});

