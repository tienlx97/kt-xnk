import assert from 'node:assert/strict';
import test from 'node:test';

import { setConcurrentSessions } from './users.js';

test('updates the concurrent-session policy through the dedicated endpoint', async () => {
  const originalFetch = globalThis.fetch;
  /** @type {{ input?: string, init?: RequestInit }} */
  const captured = {};
  globalThis.fetch = async (input, init) => {
    captured.input = String(input);
    captured.init = init;
    return new Response(null, { status: 204 });
  };

  try {
    const result = await setConcurrentSessions('user-123', false);

    assert.deepEqual(result, { success: true });
    assert.equal(
      captured.input,
      '/api/backend/api/v1/users/user-123/concurrent-sessions',
    );
    assert.equal(captured.init?.method, 'PUT');
    assert.deepEqual(JSON.parse(String(captured.init?.body)), {
      Allowed: false,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
