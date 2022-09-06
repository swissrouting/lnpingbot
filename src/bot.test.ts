import { describe, expect, test } from '@jest/globals';
import { app } from './bot';
import request from 'supertest';

describe('/', () => {
  test('should serve the homepage', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Express + TypeScript Server');
  });
});

describe('/api/bot', () => {
  test('should fail on GET requests', async () => {
    const response = await request(app).get('/api/bot');
    expect(response.statusCode).toBe(404);
  });
  test('should fail on empty POST requests', async () => {
    const response = await request(app).post('/api/bot');
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Request body cannot be empty');
  });
});
