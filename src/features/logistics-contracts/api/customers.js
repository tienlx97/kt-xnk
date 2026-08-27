import { apiRequest } from '../../../shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách khách hàng';
const GENERIC_CREATE_ERROR = 'Không thể thêm khách hàng';

/**
 * Requires `logistics:contracts:view`.
 * @returns {Promise<{ success: true, customers: import('../types/index.js').Customer[] } | { success: false, message: string }>}
 */
export async function listCustomers() {
  const result = await apiRequest('/api/v1/customers', {
    errorMessage: GENERIC_LIST_ERROR,
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, customers: result.data ?? [] };
}

/**
 * Requires `logistics:contracts:manage`.
 * @param {import('../types/index.js').CustomerFormValues} values
 * @param {import('../types/index.js').ExtraFieldRow[]} [extraFieldRows]
 * @returns {Promise<{ success: true, customer: import('../types/index.js').Customer } | { success: false, message: string }>}
 */
export async function createCustomer(values, extraFieldRows = []) {
  const result = await apiRequest('/api/v1/customers', {
    method: 'POST',
    errorMessage: GENERIC_CREATE_ERROR,
    body: {
      CompanyName: values.companyName,
      RepresentativeName: values.representativeName || null,
      RepresentativeTitle: values.representativeTitle || null,
      Address: values.address || null,
      ExtraFields: extraFieldRows
        .filter((row) => row.key.trim())
        .map((row) => ({ Key: row.key, Value: row.value })),
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, customer: result.data };
}
