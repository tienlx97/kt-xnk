import { API_BASE_URL } from '../config/api-config.js';

const GENERIC_ERROR_MESSAGE = 'Sai email hoặc mật khẩu';

/**
 * Calls the real auth backend's `POST /v1/authentication/login`. On success it
 * responds with `{ id, firstName, lastName, email, token }`; on failure a
 * `problem+json` body with a human-readable `detail`.
 * @param {import('../types/index.js').LoginFormValues} values
 * @returns {Promise<import('../types/index.js').LoginResult>}
 */
export async function login({ email, password }) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/v1/authentication/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email, Password: password }),
    });
  } catch {
    return { success: false, message: 'Không thể kết nối đến máy chủ' };
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    return { success: false, message: problem?.detail ?? GENERIC_ERROR_MESSAGE };
  }

  const body = await response.json();
  return {
    success: true,
    token: body.token,
    id: body.id,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
  };
}
