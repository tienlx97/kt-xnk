import { apiRequest } from '@/shared/api/api-client.js';

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

const GENERIC_CREATE_COMPANY_ERROR = 'Không thể thêm công ty';
const GENERIC_CREATE_BRANCH_ERROR = 'Không thể thêm chi nhánh';
const GENERIC_CREATE_DEPARTMENT_ERROR = 'Không thể thêm phòng ban';
const GENERIC_CREATE_POSITION_ERROR = 'Không thể thêm chức vụ';

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

/**
 * Admin-only (`CreateCompanyCommand`, `[Authorize(Roles = "Admin")]`) — safe
 * to expose here because every caller of this module already sits behind
 * `/admin/users`.
 * @param {string} name
 * @returns {Promise<{ success: true, id: string } | { success: false, message: string }>}
 */
export async function createCompany(name) {
  const result = await apiRequest('/api/v1/companies', {
    method: 'POST',
    errorMessage: GENERIC_CREATE_COMPANY_ERROR,
    body: { Name: name },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, id: result.data?.id };
}

/**
 * Admin-only (`CreateBranchCommand`).
 * @param {string} companyId
 * @param {string} name
 * @returns {Promise<{ success: true, id: string } | { success: false, message: string }>}
 */
export async function createBranch(companyId, name) {
  const result = await apiRequest(`/api/v1/companies/${companyId}/branches`, {
    method: 'POST',
    errorMessage: GENERIC_CREATE_BRANCH_ERROR,
    body: { Name: name },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, id: result.data?.id };
}

/**
 * Admin-only (`CreateDepartmentCommand`).
 * @param {string} branchId
 * @param {string} name
 * @returns {Promise<{ success: true, id: string } | { success: false, message: string }>}
 */
export async function createDepartment(branchId, name) {
  const result = await apiRequest('/api/v1/departments', {
    method: 'POST',
    errorMessage: GENERIC_CREATE_DEPARTMENT_ERROR,
    body: { Name: name, BranchId: branchId },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, id: result.data?.id };
}

/**
 * Admin-only (`CreatePositionCommand`).
 * @param {string} name
 * @returns {Promise<{ success: true, id: string } | { success: false, message: string }>}
 */
export async function createPosition(name) {
  const result = await apiRequest('/api/v1/positions', {
    method: 'POST',
    errorMessage: GENERIC_CREATE_POSITION_ERROR,
    body: { Name: name },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, id: result.data?.id };
}
