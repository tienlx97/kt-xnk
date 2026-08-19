import { API_BASE_URL } from '../config/api-config.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách người dùng';
const GENERIC_UPDATE_ERROR = 'Không thể cập nhật người dùng';

/**
 * Admin-only endpoint.
 * @param {string} token
 * @returns {Promise<import('../types/index.js').UserListResult>}
 */
export async function listUsers(token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { success: false, message: 'Không thể kết nối đến máy chủ' };
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    return { success: false, message: problem?.detail ?? GENERIC_LIST_ERROR };
  }

  return { success: true, users: await response.json() };
}

/**
 * Admin-only endpoint. Same field shape as `registerUser` minus
 * `nationalId`/`password`.
 * @param {string} userId
 * @param {import('../types/index.js').EditUserFormValues} values
 * @param {string} token
 * @returns {Promise<import('../types/index.js').CreateUserResult>}
 */
export async function updateUser(userId, values, token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        FirstName: values.firstName,
        LastName: values.lastName,
        YearOfBirth: values.yearOfBirth,
        Gender: values.gender,
        NationalIdIssueDate: values.nationalIdIssueDate,
        NationalIdIssuePlace: values.nationalIdIssuePlace,
        PassportNumber: values.passportNumber || null,
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
    return { success: false, message: problem?.detail ?? GENERIC_UPDATE_ERROR };
  }

  const body = await response.json();
  return { success: true, id: body.id };
}
