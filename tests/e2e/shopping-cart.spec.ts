import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Log in successfully before each test
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Add Single Item to Cart', async ({ page }) => {
    // 1. Log in successfully as "standard_user" (done in beforeEach)
    // 2. Locate a product (e.g., first product in the list)
    const firstProduct = page.locator('.inventory_item').first();
    const productName = await firstProduct.locator('.inventory_item_name').textContent();
    
    // 3. Note the product name (stored in variable)
    // 4. Click the "Add to cart" button for that product
    await firstProduct.locator('button').filter({ hasText: 'Add to cart' }).click();
    
    // 5. Verify the button text changes to "Remove"
    await expect(firstProduct.locator('button')).toContainText('Remove');
    
    // 6. Click on the shopping cart icon in the header
    await page.click('.shopping_cart_link');

    // Expected Results:
    // - Shopping cart icon shows a badge with "1" indicating one item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // - Cart page displays the added product
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    // - Product name matches the selected product
    await expect(page.locator('.cart_item')).toContainText(productName || '');
    
    // - Product price is displayed
    await expect(page.locator('.inventory_item_price')).toBeVisible();
    
    // - "Remove" button is available for the item
    await expect(page.locator('button').filter({ hasText: 'Remove' })).toBeVisible();
    
    // - "Continue Shopping" and "Checkout" buttons are visible
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('Add Multiple Items to Cart', async ({ page }) => {
    // 1. Log in successfully as "standard_user" (done in beforeEach)
    // 2. Click "Add to cart" for the first product
    await page.locator('.inventory_item').first().locator('button').filter({ hasText: 'Add to cart' }).click();
    
    // 3. Click "Add to cart" for a second product
    await page.locator('.inventory_item').nth(1).locator('button').filter({ hasText: 'Add to cart' }).click();
    
    // 4. Click "Add to cart" for a third product
    await page.locator('.inventory_item').nth(2).locator('button').filter({ hasText: 'Add to cart' }).click();
    
    // 5. Click on the shopping cart icon
    await page.click('.shopping_cart_link');

    // Expected Results:
    // - Shopping cart icon shows badge with "3"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
    
    // - Cart page displays all three products
    await expect(page.locator('.cart_item')).toHaveCount(3);
    
    // - Each product shows: Product name, Product description, Product price, "Remove" button
    const cartItems = page.locator('.cart_item');
    for (let i = 0; i < 3; i++) {
      await expect(cartItems.nth(i).locator('.inventory_item_name')).toBeVisible();
      await expect(cartItems.nth(i).locator('.inventory_item_desc')).toBeVisible();
      await expect(cartItems.nth(i).locator('.inventory_item_price')).toBeVisible();
      await expect(cartItems.nth(i).locator('button').filter({ hasText: 'Remove' })).toBeVisible();
    }
    
    // - Total number of items matches the number added
    await expect(page.locator('.cart_item')).toHaveCount(3);
  });

  test('Remove Item from Cart', async ({ page }) => {
    // 1. Log in successfully as "standard_user" (done in beforeEach)
    // 2. Add at least one item to cart
    await page.locator('.inventory_item').first().locator('button').filter({ hasText: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // 3. Navigate to the cart page
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    // 4. Click "Remove" button for one item
    await page.locator('button').filter({ hasText: 'Remove' }).first().click();

    // Expected Results:
    // - Item is removed from the cart
    await expect(page.locator('.cart_item')).toHaveCount(0);
    
    // - Cart badge count decreases by 1 (or disappears)
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    
    // - Removed item no longer appears in the cart list
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });
});

