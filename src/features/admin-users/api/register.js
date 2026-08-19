import { API_BASE_URL } from '../config/api-config.js';

const GENERIC_ERROR_MESSAGE = 'Không thể tạo người dùng';

/**
 * Calls the real auth backend's admin-only `POST
 * /api/v1/authentication/register`.
 * @param {import('../types/index.js').CreateUserFormValues} values
 * @param {string} token - The calling Admin's bearer token. Read
 *   server-side by the page (`src/app/(protected)/admin/users/new/page.jsx`)
 *   and passed down as a prop — this feature never reads the session cookie
 *   itself, since doing so would require importing `features/auth`, which
 *   `no-feature-to-feature` forbids.
 * @returns {Promise<import('../types/index.js').CreateUserResult>}
 */
export async function registerUser(values, token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/authentication/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        NationalId: values.nationalId,
        FirstName: values.firstName,
        LastName: values.lastName,
        Password: values.password,
        Phone: values.phone,
        AddressType: values.addressType,
        Province: values.province,
        District: values.district || null,
        Ward: values.ward,
        AddressDetail: values.addressDetail,
        PositionId: values.positionId,
        CompanyId: values.companyId,
        BranchId: values.branchId,
        DepartmentId: values.departmentId,
      }),
    });
  } catch {
    return { success: false, message: 'Không thể kết nối đến máy chủ' };
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    return { success: false, message: problem?.detail ?? GENERIC_ERROR_MESSAGE };
  }

  const body = await response.json();
  return { success: true, id: body.id };
}
