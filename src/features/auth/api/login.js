import { testUsers } from '../config/test-users.js';

const MOCK_LATENCY_MS = 500;

/** @param {'access' | 'refresh'} kind */
function mockToken(kind) {
  return `mock-${kind}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Mocked login call — checks credentials against `test-users.js` instead of
 * a real backend, and returns mock opaque tokens instead of real JWTs. This
 * is the seam to swap for a real `fetch` call once the backend project
 * exposes an auth endpoint — keep the `accessToken`/`refreshToken` field
 * names so nothing else in the feature needs to change shape.
 * @param {import('../types/index.js').LoginFormValues} values
 * @returns {Promise<import('../types/index.js').LoginResult>}
 */
export function login({ username, password }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matched = testUsers.some(
        (user) => user.username === username && user.password === password,
      );
      resolve(
        matched
          ? { success: true, accessToken: mockToken('access'), refreshToken: mockToken('refresh') }
          : { success: false, message: 'Sai số căn cước công dân hoặc mật khẩu' },
      );
    }, MOCK_LATENCY_MS);
  });
}
