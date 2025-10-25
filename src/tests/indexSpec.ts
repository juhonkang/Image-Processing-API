import supertest from 'supertest';
import app from '../index'; // import the express app

const request = supertest(app);

describe('Test endpoint responses', () => {
  it('gets the api endpoint and return 200 ', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('should return 404 for non-existent routes', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(404);
  });
});
