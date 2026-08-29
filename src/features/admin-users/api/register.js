import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_ERROR_MESSAGE = 'Không thể tạo người dùng';

/**
 * Calls the real auth backend's admin-only `POST
 * /api/v1/authentication/register`.
 * The bearer token is attached by the `/api/backend` proxy from the HttpOnly
 * session cookie; no caller passes one.
 * @param {import('../types/index.js').CreateUserFormValues} values
 * @returns {Promise<import('../types/index.js').CreateUserResult>}
 */
export async function registerUser(values) {
  const result = await apiRequest(
    '/api/v1/authentication/register',
    {
      method: 'POST',
      errorMessage: GENERIC_ERROR_MESSAGE,
      body: {
        NationalId: values.nationalId,
        FirstName: values.firstName,
        LastName: values.lastName,
        Password: values.password,
        YearOfBirth: values.yearOfBirth,
        Gender: values.gender,
        NationalIdIssueDate: values.nationalIdIssueDate,
        NationalIdIssuePlace: values.nationalIdIssuePlace,
        PassportNumber: values.passportNumber || null,
        Phone: values.phone,
        OldProvince: values.oldProvince,
        OldDistrict: values.oldDistrict,
        OldWard: values.oldWard,
        OldAddressDetail: values.oldAddressDetail,
        NewProvince: values.newProvince,
        NewWard: values.newWard,
        NewAddressDetail: values.newAddressDetail,
        PositionId: values.positionId,
        CompanyId: values.companyId,
        BranchId: values.branchId,
        DepartmentId: values.departmentId,
        ExtraPermissions: values.extraPermissions,
      },
    },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, id: result.data?.id, employeeCode: result.data?.employeeCode };
}
