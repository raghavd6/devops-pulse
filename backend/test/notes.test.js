
// backend/test/notes.test.js
import request from 'supertest';
import app from '../src/index.js';

test('health endpoint returns ok', async () => {
  const res = await request(app).get('/api/health');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('ok');
  expect(typeof res.body.db).toBe('boolean'); // true when DB up, false otherwise
});
