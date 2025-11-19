// spec: tests/plans/petstore-api-plan.md
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://petstore.swagger.io/v2';

test.describe('Smoke Test', () => {
  test('Health Check - Get Pet by Invalid ID', async ({ request }) => {
    // Use a truly non-existent ID (timestamp-based to avoid conflicts)
    const nonExistentId = Date.now() + 1000000000; // Future timestamp
    
    // 1. Send GET request to https://petstore.swagger.io/v2/pet/{nonExistentId}
    const response = await request.get(`${BASE_URL}/pet/${nonExistentId}`);

    // Expected Results: HTTP status code: 404
    // If API returns 200 for a non-existent pet, this test should FAIL
    expect(response.status()).toBe(404);

    // Expected Results: Response indicates pet not found
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message');
    expect(responseBody.message).toContain('Pet not found');
  });
});

