const GENERIC_ERROR_MESSAGE = 'Sai CCCD hoặc mật khẩu';

/**
 * Calls the real auth backend's `POST /api/v1/authentication/login`. On
 * success it responds with `{ id, firstName, lastName, nationalId, token,
 * refreshToken }`;
 * on failure a `problem+json` body with a human-readable `detail`.
 *
 * Goes through the same `/api/backend` proxy as everything else (so the
 * backend's address never reaches the browser), but deliberately NOT through
 * `shared/api/api-client.js`. That client treats `401` as "your session expired"
 * — it clears the session and redirects to `/login`. Here a `401` means
 * "wrong CCCD or password", on a page that *is* `/login`. Sending it through
 * the client would replace an accurate error message with a misleading one.
 * This is the one endpoint that needs no token, so there is no session for
 * the client to manage anyway.
 * @param {import('../types/index.js').LoginFormValues} values
 * @returns {Promise<import('../types/index.js').LoginResult>}
 */
export async function login({ nationalId, password }) {
  let response;
  try {
    response = await fetch('/api/backend/api/v1/authentication/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ NationalId: nationalId, Password: password }),
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
    refreshToken: body.refreshToken,
    id: body.id,
    firstName: body.firstName,
    lastName: body.lastName,
    nationalId: body.nationalId,
  };
}
