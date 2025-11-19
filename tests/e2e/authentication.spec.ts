import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('Successful Login', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    // 2. Verify the login page is displayed with username and password fields
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    // 3. Enter "standard_user" in the username field
    await page.fill('#user-name', 'standard_user');

    // 4. Enter "secret_sauce" in the password field
    await page.fill('#password', 'secret_sauce');

    // 5. Click the "Login" button
    await page.click('#login-button');

    // Expected Results:
    // - User is redirected to the products/inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // - Products are displayed in a grid or list format
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    
    // - Header shows "Swag Labs" branding
    await expect(page.locator('.app_logo')).toBeVisible();
    
    // - Shopping cart icon is visible
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
    
    // - No error messages are displayed
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });

  test('Failed Login - Invalid Credentials', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    // 2. Enter "invalid_user" in the username field
    await page.fill('#user-name', 'invalid_user');

    // 3. Enter "wrong_password" in the password field
    await page.fill('#password', 'wrong_password');

    // 4. Click the "Login" button
    await page.click('#login-button');

    // Expected Results:
    // - User remains on the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // - Error message is displayed indicating invalid credentials
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    
    // - Error message text: "Epic sadface: Username and password do not match any user in this service"
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match any user in this service');
    
    // - Username and password fields are still accessible
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('Failed Login - Locked Out User', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    // 2. Enter "locked_out_user" in the username field
    await page.fill('#user-name', 'locked_out_user');

    // 3. Enter "secret_sauce" in the password field
    await page.fill('#password', 'secret_sauce');

    // 4. Click the "Login" button
    await page.click('#login-button');

    // Expected Results:
    // - User remains on the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // - Error message is displayed indicating the user is locked out
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    
    // - Error message text: "Epic sadface: Sorry, this user has been locked out."
    await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out');
    
    // - Username and password fields are still accessible
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });
});

