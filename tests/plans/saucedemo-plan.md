# SauceDemo Application - Comprehensive Test Plan

## Application Overview

SauceDemo is a demo e-commerce web application designed for testing purposes. The application features:

- **Authentication**: User login with standard and locked-out user accounts
- **Product Catalog**: Browse and view product listings with images, names, descriptions, and prices
- **Shopping Cart**: Add/remove items, view cart contents
- **Checkout Flow**: Complete purchase with user information and order confirmation
- **Inventory Management**: Product sorting and filtering capabilities

**Base URL**: https://www.saucedemo.com/

## Test Scenarios

### 1. Authentication

#### 1.1 Successful Login
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Verify the login page is displayed with username and password fields
3. Enter "standard_user" in the username field
4. Enter "secret_sauce" in the password field
5. Click the "Login" button

**Expected Results:**
- User is redirected to the products/inventory page
- Products are displayed in a grid or list format
- Header shows "Swag Labs" branding
- Shopping cart icon is visible
- No error messages are displayed

#### 1.2 Failed Login - Invalid Credentials
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Enter "invalid_user" in the username field
3. Enter "wrong_password" in the password field
4. Click the "Login" button

**Expected Results:**
- User remains on the login page
- Error message is displayed indicating invalid credentials
- Error message text: "Epic sadface: Username and password do not match any user in this service"
- Username and password fields are still accessible

#### 1.3 Failed Login - Locked Out User
**Steps:**
1. Navigate to https://www.saucedemo.com/
2. Enter "locked_out_user" in the username field
3. Enter "secret_sauce" in the password field
4. Click the "Login" button

**Expected Results:**
- User remains on the login page
- Error message is displayed indicating the user is locked out
- Error message text: "Epic sadface: Sorry, this user has been locked out."
- Username and password fields are still accessible

### 2. Product Browsing

#### 2.1 View Product List
**Steps:**
1. Log in successfully as "standard_user"
2. Verify the products page loads

**Expected Results:**
- Multiple products are displayed
- Each product shows:
  - Product image
  - Product name
  - Product description
  - Product price
  - "Add to cart" button
- Header contains:
  - "Swag Labs" logo/text
  - Shopping cart icon
  - Menu button (hamburger menu)

#### 2.2 Sort Products by Price (Low to High)
**Steps:**
1. Log in successfully as "standard_user"
2. Locate the product sort dropdown/selector
3. Select "Price (low to high)" option

**Expected Results:**
- Products are reordered by price in ascending order
- First product has the lowest price
- Last product has the highest price
- All products remain visible

### 3. Shopping Cart Operations

#### 3.1 Add Single Item to Cart
**Steps:**
1. Log in successfully as "standard_user"
2. Locate a product (e.g., first product in the list)
3. Note the product name
4. Click the "Add to cart" button for that product
5. Verify the button text changes to "Remove"
6. Click on the shopping cart icon in the header

**Expected Results:**
- "Add to cart" button text changes to "Remove"
- Shopping cart icon shows a badge with "1" indicating one item
- Cart page displays the added product
- Product name matches the selected product
- Product price is displayed
- "Remove" button is available for the item
- "Continue Shopping" and "Checkout" buttons are visible

#### 3.2 Add Multiple Items to Cart
**Steps:**
1. Log in successfully as "standard_user"
2. Click "Add to cart" for the first product
3. Click "Add to cart" for a second product
4. Click "Add to cart" for a third product
5. Click on the shopping cart icon

**Expected Results:**
- Shopping cart icon shows badge with "3"
- Cart page displays all three products
- Each product shows:
  - Product name
  - Product description
  - Product price
  - "Remove" button
- Total number of items matches the number added

#### 3.3 Remove Item from Cart
**Steps:**
1. Log in successfully as "standard_user"
2. Add at least one item to cart
3. Navigate to the cart page
4. Click "Remove" button for one item

**Expected Results:**
- Item is removed from the cart
- Cart badge count decreases by 1
- Removed item no longer appears in the cart list
- If cart becomes empty, appropriate empty state may be shown

### 4. Checkout Flow

#### 4.1 Complete Checkout - Happy Path
**Steps:**
1. Log in successfully as "standard_user"
2. Add at least one item to cart
3. Navigate to the cart page
4. Click the "Checkout" button
5. Fill in the checkout information form:
   - First Name: "John"
   - Last Name: "Doe"
   - Postal Code: "12345"
6. Click the "Continue" button
7. Review the order summary on the overview page
8. Click the "Finish" button

**Expected Results:**
- Checkout information page is displayed with form fields
- Form accepts valid input
- Overview page displays:
  - Order summary with items
  - Payment information
  - Shipping information
  - Price breakdown (subtotal, tax, total)
- Success page displays:
  - "Thank you for your order!" message
  - Order completion confirmation
  - "Back Home" button is available

#### 4.2 Checkout - Missing Required Fields
**Steps:**
1. Log in successfully as "standard_user"
2. Add at least one item to cart
3. Navigate to the cart page
4. Click the "Checkout" button
5. Leave all fields empty
6. Click the "Continue" button

**Expected Results:**
- Error message is displayed
- Error message text: "Error: First Name is required" (or similar)
- User remains on the checkout information page
- Form fields are still accessible

#### 4.3 Cancel Checkout
**Steps:**
1. Log in successfully as "standard_user"
2. Add at least one item to cart
3. Navigate to the cart page
4. Click the "Checkout" button
5. Click the "Cancel" button on the checkout information page

**Expected Results:**
- User is redirected back to the cart page
- Cart items are still present
- No order is placed

### 5. Navigation and UI Elements

#### 5.1 Logout Functionality
**Steps:**
1. Log in successfully as "standard_user"
2. Click the menu button (hamburger icon) in the header
3. Click the "Logout" option

**Expected Results:**
- User is logged out
- User is redirected to the login page
- Login form is displayed
- Session is cleared

#### 5.2 Continue Shopping from Cart
**Steps:**
1. Log in successfully as "standard_user"
2. Add at least one item to cart
3. Navigate to the cart page
4. Click the "Continue Shopping" button

**Expected Results:**
- User is redirected to the products page
- Products are displayed
- Cart badge still shows the number of items
- Previously added items remain in cart

## Test Data

**Valid Credentials:**
- Username: `standard_user`
- Password: `secret_sauce`

**Locked Out User:**
- Username: `locked_out_user`
- Password: `secret_sauce`

**Invalid Credentials:**
- Username: `invalid_user`
- Password: `wrong_password`

## Assumptions

- All tests start from a fresh browser session (no cookies/cache)
- Application is accessible at https://www.saucedemo.com/
- Network connectivity is available
- Tests are independent and can be run in any order
- Product inventory may vary but core functionality remains consistent

## Success Criteria

- All happy path scenarios complete successfully
- Error handling scenarios display appropriate error messages
- UI elements are accessible and functional
- Navigation flows work as expected
- Cart state persists during navigation
- Checkout process completes end-to-end

