import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách nhóm chi phí';
const GENERIC_CREATE_ERROR = 'Không thể tạo nhóm chi phí';

/**
 * Requires `logistics:contracts:view`. Full CRUD exists on the backend
 * (`docs/api/ShipmentCostCategories.md`, BE-kt-xnk) but only list+create are
 * wired here — no call site needs update/delete yet (mirrors `places.js`).
 * @returns {Promise<{ success: true, costCategories: import('../types/index.js').ShipmentCostCategory[] } | { success: false, message: string }>}
 */
export async function listShipmentCostCategories() {
  const result = await apiRequest('/api/v1/shipment-cost-categories', {
    errorMessage: GENERIC_LIST_ERROR,
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, costCategories: result.data ?? [] };
}

/**
 * Requires `logistics:contracts:manage`.
 * @param {import('../types/index.js').ShipmentCostCategoryFormValues} values
 * @returns {Promise<{ success: true, costCategory: import('../types/index.js').ShipmentCostCategory } | { success: false, message: string }>}
 */
export async function createShipmentCostCategory(values) {
  const result = await apiRequest('/api/v1/shipment-cost-categories', {
    method: 'POST',
    errorMessage: GENERIC_CREATE_ERROR,
    body: {
      Name: values.name,
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, costCategory: result.data };
}
