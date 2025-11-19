// spec: tests/plans/petstore-api-plan.md
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://petstore.swagger.io/v2';
const TEST_PET_ID = 12345;

test.describe('Pet CRUD Operations', () => {
  test('Create Pet (POST /pet)', async ({ request }) => {
    // 1. Send POST request to https://petstore.swagger.io/v2/pet
    // 2. Include JSON body with pet data
    const petData = {
      id: TEST_PET_ID,
      name: 'Fluffy',
      status: 'available',
      category: { id: 1, name: 'Dogs' },
      tags: [{ id: 1, name: 'friendly' }],
      photoUrls: ['https://example.com/dog.jpg']
    };

    const response = await request.post(`${BASE_URL}/pet`, {
      data: petData
    });

    // Expected Results: HTTP status code: 200
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    
    // Expected Results: Response body contains the created pet with matching id and name
    expect(responseBody.id).toBe(TEST_PET_ID);
    expect(responseBody.name).toBe('Fluffy');
    
    // Expected Results: Response includes all provided fields
    expect(responseBody.status).toBe('available');
    expect(responseBody.category).toEqual({ id: 1, name: 'Dogs' });
    expect(responseBody.tags).toHaveLength(1);
    expect(responseBody.tags[0]).toEqual({ id: 1, name: 'friendly' });
    expect(responseBody.photoUrls).toContain('https://example.com/dog.jpg');
  });

  test('Get Pet by ID (GET /pet/{petId})', async ({ request }) => {
    // First create a pet to ensure it exists
    const petData = {
      id: TEST_PET_ID,
      name: 'Fluffy',
      status: 'available',
      category: { id: 1, name: 'Dogs' },
      tags: [{ id: 1, name: 'friendly' }],
      photoUrls: ['https://example.com/dog.jpg']
    };
    await request.post(`${BASE_URL}/pet`, { data: petData });

    // 1. Send GET request to https://petstore.swagger.io/v2/pet/12345
    const response = await request.get(`${BASE_URL}/pet/${TEST_PET_ID}`);

    // Expected Results: HTTP status code: 200
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    
    // Expected Results: Response body contains pet with id: 12345
    expect(responseBody.id).toBe(TEST_PET_ID);
    
    // Expected Results: Response includes name, status, category, tags, and photoUrls
    expect(responseBody).toHaveProperty('name');
    expect(responseBody).toHaveProperty('status');
    expect(responseBody).toHaveProperty('category');
    expect(responseBody).toHaveProperty('tags');
    expect(responseBody).toHaveProperty('photoUrls');
  });

  test('Update Pet (PUT /pet)', async ({ request }) => {
    // First create a pet to update
    const initialPetData = {
      id: TEST_PET_ID,
      name: 'Fluffy',
      status: 'available',
      category: { id: 1, name: 'Dogs' },
      tags: [{ id: 1, name: 'friendly' }],
      photoUrls: ['https://example.com/dog.jpg']
    };
    await request.post(`${BASE_URL}/pet`, { data: initialPetData });

    // 1. Send PUT request to https://petstore.swagger.io/v2/pet
    // 2. Include JSON body with updated pet data
    const updatedPetData = {
      id: TEST_PET_ID,
      name: 'Fluffy Updated',
      status: 'sold',
      category: { id: 1, name: 'Dogs' },
      tags: [{ id: 1, name: 'friendly' }],
      photoUrls: ['https://example.com/dog.jpg']
    };

    const response = await request.put(`${BASE_URL}/pet`, {
      data: updatedPetData
    });

    // Expected Results: HTTP status code: 200
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    
    // Expected Results: Response body contains updated pet with new name and status
    expect(responseBody.id).toBe(TEST_PET_ID);
    expect(responseBody.name).toBe('Fluffy Updated');
    expect(responseBody.status).toBe('sold');
    
    // Expected Results: All other fields remain unchanged
    expect(responseBody.category).toEqual({ id: 1, name: 'Dogs' });
    expect(responseBody.tags).toHaveLength(1);
  });

  test('Delete Pet (DELETE /pet/{petId})', async ({ request }) => {
    // First ensure the pet exists by creating it
    const petData = {
      id: TEST_PET_ID,
      name: 'Fluffy',
      status: 'available',
      category: { id: 1, name: 'Dogs' },
      tags: [],
      photoUrls: []
    };
    await request.post(`${BASE_URL}/pet`, { data: petData });

    // Verify pet exists before deletion
    const getBeforeResponse = await request.get(`${BASE_URL}/pet/${TEST_PET_ID}`);
    expect(getBeforeResponse.status()).toBe(200);

    // 1. Send DELETE request to https://petstore.swagger.io/v2/pet/12345
    const deleteResponse = await request.delete(`${BASE_URL}/pet/${TEST_PET_ID}`);

    // Expected Results: HTTP status code: 200
    expect(deleteResponse.status()).toBe(200);

    // Expected Results: Subsequent GET request to same pet ID returns 404 (Not Found)
    // This is the critical validation - if pet still exists, test should FAIL
    const getAfterResponse = await request.get(`${BASE_URL}/pet/${TEST_PET_ID}`);
    expect(getAfterResponse.status()).toBe(404);
    
    const errorBody = await getAfterResponse.json();
    expect(errorBody.message).toContain('Pet not found');
  });
});

