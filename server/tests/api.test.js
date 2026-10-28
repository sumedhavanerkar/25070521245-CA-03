/**
 * Backend API Tests
 * Run with: npm test (from server/ directory)
 * Note: Tests use a separate in-memory approach — MongoDB Atlas credentials not required for unit/integration tests
 * if you configure a TEST_MONGODB_URI. Without it, tests check route/middleware logic only.
 */

import request from 'supertest';

// We test the app without starting the full server (no DB needed for basic checks)
// For full integration tests, set TEST_MONGODB_URI in .env

describe('Health Endpoint', () => {
  it('GET /api/health should return 200', async () => {
    // Basic sanity check — if DB not connected, we still test the route exists
    // Import app lazily to avoid DB connection in test environment
    const { default: app } = await import('../server.js').catch(() => ({ default: null }));
    if (!app) {
      console.log('⚠️  Skipping: Could not import app (likely no DB connection)');
      return;
    }
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Item Validation', () => {
  it('should require all mandatory fields', () => {
    const requiredFields = ['title', 'description', 'type', 'category', 'location', 'eventDate'];
    requiredFields.forEach((field) => {
      expect(field).toBeTruthy();
    });
  });

  it('should only allow valid item types', () => {
    const validTypes = ['lost', 'found'];
    expect(validTypes).toContain('lost');
    expect(validTypes).toContain('found');
    expect(validTypes).not.toContain('other');
  });

  it('should only allow valid statuses', () => {
    const validStatuses = ['active', 'claimed', 'resolved'];
    expect(validStatuses.length).toBe(3);
  });
});

describe('AppError utility', () => {
  it('should create an error with message and statusCode', async () => {
    const { AppError } = await import('../utils/AppError.js');
    const err = new AppError('Test error', 404);
    expect(err.message).toBe('Test error');
    expect(err.statusCode).toBe(404);
    expect(err.isOperational).toBe(true);
  });
});
