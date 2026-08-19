import { API_BASE_URL } from '../config/api-config.js';

/**
 * Public endpoint — populates the Company selector.
 * @returns {Promise<import('../types/index.js').Company[]>}
 */
export async function listCompanies() {
  const response = await fetch(`${API_BASE_URL}/api/v1/companies`);
  if (!response.ok) return [];
  return response.json();
}

/**
 * Public endpoint — populates the Branch selector once a Company is chosen.
 * @param {string} companyId
 * @returns {Promise<import('../types/index.js').Branch[]>}
 */
export async function listBranches(companyId) {
  if (!companyId) return [];
  const response = await fetch(
    `${API_BASE_URL}/api/v1/companies/${companyId}/branches`,
  );
  if (!response.ok) return [];
  return response.json();
}

/**
 * Public endpoint. Returns every department across every company/branch —
 * the caller filters by `branchId` client-side (see `use-org-directory.js`),
 * same as there being no server-side "departments by branch" filter today.
 * @returns {Promise<import('../types/index.js').Department[]>}
 */
export async function listDepartments() {
  const response = await fetch(`${API_BASE_URL}/api/v1/departments`);
  if (!response.ok) return [];
  return response.json();
}

/**
 * Public endpoint — populates the Position (chức vụ) selector. Positions
 * are a company-wide catalog, not scoped to Company/Branch/Department.
 * @returns {Promise<import('../types/index.js').Position[]>}
 */
export async function listPositions() {
  const response = await fetch(`${API_BASE_URL}/api/v1/positions`);
  if (!response.ok) return [];
  return response.json();
}
