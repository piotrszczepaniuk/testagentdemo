# Petstore API - Comprehensive Test Plan

## Application Overview

The Petstore API (https://petstore.swagger.io/) is a sample REST API for managing pets in a pet store. The API provides:

- **Pet Management**: Create, read, update, and delete pet records
- **RESTful Operations**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **JSON Data Format**: Request and response bodies use JSON
- **Status Management**: Pets can have different statuses (available, pending, sold)

## Test Scenarios

### 1. Pet CRUD Operations

#### 1.1 Create Pet (POST /pet)
**Steps:**
1. Send POST request to `https://petstore.swagger.io/v2/pet`
2. Include JSON body with pet data:
   - `id`: 12345
   - `name`: "Fluffy"
   - `status`: "available"
   - `category`: { "id": 1, "name": "Dogs" }
   - `tags`: [{ "id": 1, "name": "friendly" }]
   - `photoUrls`: ["https://example.com/dog.jpg"]

**Expected Results:**
- HTTP status code: 200
- Response body contains the created pet with matching `id` and `name`
- Response includes all provided fields

#### 1.2 Get Pet by ID (GET /pet/{petId})
**Steps:**
1. Send GET request to `https://petstore.swagger.io/v2/pet/12345`

**Expected Results:**
- HTTP status code: 200
- Response body contains pet with `id`: 12345
- Response includes `name`, `status`, `category`, `tags`, and `photoUrls`

#### 1.3 Update Pet (PUT /pet)
**Steps:**
1. Send PUT request to `https://petstore.swagger.io/v2/pet`
2. Include JSON body with updated pet data:
   - `id`: 12345
   - `name`: "Fluffy Updated"
   - `status`: "sold"
   - Same category and tags as before

**Expected Results:**
- HTTP status code: 200
- Response body contains updated pet with new `name` and `status`
- All other fields remain unchanged

#### 1.4 Delete Pet (DELETE /pet/{petId})
**Steps:**
1. Send DELETE request to `https://petstore.swagger.io/v2/pet/12345`

**Expected Results:**
- HTTP status code: 200
- Subsequent GET request to same pet ID returns 404 (Not Found)

### 2. Smoke Test

#### 2.1 Health Check - Get Pet by Invalid ID
**Steps:**
1. Send GET request to `https://petstore.swagger.io/v2/pet/999999999`

**Expected Results:**
- HTTP status code: 404
- Response indicates pet not found

### 3. Negative Test Cases

#### 3.1 Create Pet with Invalid Data
**Steps:**
1. Send POST request to `https://petstore.swagger.io/v2/pet`
2. Include JSON body with missing required fields (e.g., no `name` field)

**Expected Results:**
- HTTP status code: 400 or 500 (depending on API validation)
- Error message indicates validation failure

#### 3.2 Get Pet with Non-Numeric ID
**Steps:**
1. Send GET request to `https://petstore.swagger.io/v2/pet/invalid-id`

**Expected Results:**
- HTTP status code: 400 or 404
- Error response indicates invalid input

#### 3.3 Update Non-Existent Pet
**Steps:**
1. Send PUT request to `https://petstore.swagger.io/v2/pet`
2. Include JSON body with `id`: 999999999

**Expected Results:**
- HTTP status code: 404 or 400
- Error indicates pet not found

## Test Data

- **Base URL**: `https://petstore.swagger.io/v2`
- **Test Pet ID**: 12345 (will be created and cleaned up)
- **Test Pet Name**: "Fluffy"
- **Test Category**: Dogs (id: 1)

## Assumptions

- API is publicly accessible
- No authentication required for basic operations
- Test data may persist between test runs (cleanup recommended)
- Pet IDs are unique and numeric

## Success Criteria

- All CRUD operations complete successfully
- Status codes match expected values
- Response bodies contain correct data structures
- Error handling works for invalid inputs
- Tests can run independently and in sequence

