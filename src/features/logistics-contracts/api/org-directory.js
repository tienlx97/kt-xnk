import { apiRequest } from '@/shared/api/api-client.js';

/**
 * Minimal read-only company/branch lookup for the Contract form's Branch
 * selector. Deliberately duplicated from `features/admin-users/api/
 * org-directory.js` rather than imported — `harness/structure.rules.cjs`
 * forbids one feature importing another's internals.
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
