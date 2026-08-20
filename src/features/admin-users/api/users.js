import { apiRequest } from '../../../shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách người dùng';
const GENERIC_DETAIL_ERROR = 'Không thể tải thông tin người dùng';
const GENERIC_UPDATE_ERROR = 'Không thể cập nhật người dùng';

/**
 * Admin-only. Returns one page — the endpoint is paginated and its rows are a
 * slim projection without identity-document or address fields
 * (see the API's `docs/security.md`, M-4). Use `getUser` for the full record.
 * @param {{ page?: number, pageSize?: number }} [options]
 * @returns {Promise<import('../types/index.js').UserListResult>}
 */
export async function listUsers({ page = 1, pageSize = 25 } = {}) {
  const result = await apiRequest(
    `/api/v1/users?page=${page}&pageSize=${pageSize}`,
    { errorMessage: GENERIC_LIST_ERROR },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return {
    success: true,
    users: result.data?.items ?? [],
    page: result.data?.page ?? page,
    pageSize: result.data?.pageSize ?? pageSize,
    totalCount: result.data?.totalCount ?? 0,
    totalPages: result.data?.totalPages ?? 0,
  };
}

/**
 * Admin-only. The complete record for one user, including the fields the list
 * projection omits — the edit form needs them, and populating that form from a
 * list row would blank out whatever the row left out on the next save.
 * @param {string} userId
 * @returns {Promise<{ success: true, user: import('../types/index.js').UserDetail } | { success: false, message: string }>}
 */
export async function getUser(userId) {
  const result = await apiRequest(`/api/v1/users/${userId}`, {
    errorMessage: GENERIC_DETAIL_ERROR,
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, user: result.data };
}

/**
 * Admin-only. Same field shape as `registerUser` minus
 * `nationalId`/`password`.
 * @param {string} userId
 * @param {import('../types/index.js').EditUserFormValues} values
 * @returns {Promise<import('../types/index.js').CreateUserResult>}
 */
export async function updateUser(userId, values) {
  const result = await apiRequest(`/api/v1/users/${userId}`, {
    method: 'PUT',
    errorMessage: GENERIC_UPDATE_ERROR,
    body: {
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
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, id: result.data?.id };
}
