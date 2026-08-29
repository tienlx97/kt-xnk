import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách bên bán';
const GENERIC_CREATE_ERROR = 'Không thể thêm bên bán';

/**
 * Requires `logistics:contracts:view`.
 * @returns {Promise<{ success: true, sellers: import('../types/index.js').Seller[] } | { success: false, message: string }>}
 */
export async function listSellers() {
  const result = await apiRequest('/api/v1/sellers', {
    errorMessage: GENERIC_LIST_ERROR,
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, sellers: result.data ?? [] };
}

/**
 * Requires `logistics:contracts:manage`.
 * @param {import('../types/index.js').SellerFormValues} values
 * @param {import('../types/index.js').ExtraFieldRow[]} [extraFieldRows]
 * @returns {Promise<{ success: true, seller: import('../types/index.js').Seller } | { success: false, message: string }>}
 */
export async function createSeller(values, extraFieldRows = []) {
  const result = await apiRequest('/api/v1/sellers', {
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

  return { success: true, seller: result.data };
}
