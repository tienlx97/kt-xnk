import { apiRequest } from '../../../shared/api/api-client.js';

/**
 * Organisation-directory reads. They require a signed-in caller (the backend
 * stopped serving them anonymously — see its
 * `openspec/changes/fix-401-vs-403-authentication/`), but no `Admin` role.
 *
 * No token is passed: requests go through this app's `/api/backend` proxy,
 * which attaches it from the HttpOnly session cookie.
 *
 * On failure they resolve to `[]` rather than an error result — they only
 * populate selector options, and a selector with no options is a survivable
 * degradation. A 401 still ends the session inside `apiRequest`, so an expired
 * token surfaces as a redirect to `/login` rather than silently empty
 * dropdowns.
 */

/** @returns {Promise<import('../types/index.js').Company[]>} */
export async function listCompanies() {
  const result = await apiRequest('/api/v1/companies');
  return result.success ? (result.data ?? []) : [];
}

/**
 * @param {string} companyId
 * @returns {Promise<import('../types/index.js').Branch[]>}
 */
export async function listBranches(companyId) {
  if (!companyId) return [];

  const result = await apiRequest(`/api/v1/companies/${companyId}/branches`);
  return result.success ? (result.data ?? []) : [];
}

/**
 * Returns every department across every company/branch — the caller filters by
 * `branchId` client-side (see `use-org-directory.js`), same as there being no
 * server-side "departments by branch" filter today.
 * @returns {Promise<import('../types/index.js').Department[]>}
 */
export async function listDepartments() {
  const result = await apiRequest('/api/v1/departments');
  return result.success ? (result.data ?? []) : [];
}

/**
 * Positions are a company-wide catalog, not scoped to
 * Company/Branch/Department.
 * @returns {Promise<import('../types/index.js').Position[]>}
 */
export async function listPositions() {
  const result = await apiRequest('/api/v1/positions');
  return result.success ? (result.data ?? []) : [];
}
