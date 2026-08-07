import { testUsers } from '../config/test-users.js';

const MOCK_LATENCY_MS = 500;

/**
 * Mocked login call — checks credentials against `test-users.js` instead of
 * a real backend. This is the seam to swap for a real `fetch` call once the
 * backend project exposes an auth endpoint.
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
          ? { success: true }
          : { success: false, message: 'Sai số căn cước công dân hoặc mật khẩu' },
      );
    }, MOCK_LATENCY_MS);
  });
}
