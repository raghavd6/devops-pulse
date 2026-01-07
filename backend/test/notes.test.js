
// backend/test/health.test.js
import request from 'supertest';

const { default: app } = await import('../src/index.js'); // app is listening, ok

test('health endpoint returns ok', async () => {
  const res = await request(app).get('/api/health');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('ok');
  expect(typeof res.body.db).toBe('boolean'); // true when DB up, false otherwise
});
