import { apiRequest } from '../../../shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách quyền có thể cấp';
const GENERIC_GRANT_ERROR = 'Không thể cấp quyền';
const GENERIC_REVOKE_ERROR = 'Không thể thu hồi quyền';

/**
 * Admin-only. `Permission.Grantable` — the whitelist a permission must be
 * on before `grantUserPermission` will accept it. Fetched rather than
 * hardcoded so the FE never has its own stale copy of the backend's list
 * (see `openspec/changes/add-grantable-permissions-endpoint/proposal.md`).
 * @returns {Promise<string[]>}
 */
export async function listGrantablePermissions() {
  const result = await apiRequest('/api/v1/permissions/grantable', {
    errorMessage: GENERIC_LIST_ERROR,
  });

  return result.success ? (result.data ?? []) : [];
}

/**
 * Admin-only. Grants one permission directly to a user, independent of
 * their role/department — rejected (400) if `permission` is not in the
 * backend's `Permission.Grantable` whitelist. Rotates the target's
 * `SecurityStamp`, so it takes effect on their very next request.
 * @param {string} userId
 * @param {string} permission
 * @returns {Promise<{ success: true } | { success: false, message: string }>}
 */
export async function grantUserPermission(userId, permission) {
  const result = await apiRequest(`/api/v1/users/${userId}/permissions`, {
    method: 'POST',
    errorMessage: GENERIC_GRANT_ERROR,
    body: { Permission: permission },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true };
}

/**
 * Admin-only. Also rotates the target's `SecurityStamp`.
 * @param {string} userId
 * @param {string} permission
 * @returns {Promise<{ success: true } | { success: false, message: string }>}
 */
export async function revokeUserPermission(userId, permission) {
  const result = await apiRequest(
    `/api/v1/users/${userId}/permissions/${encodeURIComponent(permission)}`,
    { method: 'DELETE', errorMessage: GENERIC_REVOKE_ERROR },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true };
}
