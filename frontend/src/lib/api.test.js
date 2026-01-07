import { describe, it, expect, vi } from 'vitest';
import { getHealth } from './api.js';

describe('api helper', () => {
  it('getHealth calls /api/health', async () => {
    const mock = vi.fn(async () => ({ ok: true, json: async () => ({ status: 'ok' }) }));
    global.fetch = mock;
    const data = await getHealth();
    expect(data.status).toBe('ok');
    expect(String(mock.mock.calls[0][0])).toContain('/api/health');
  });
});
