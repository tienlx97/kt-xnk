import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách cảng';
const GENERIC_CREATE_ERROR = 'Không thể tạo cảng';

/**
 * Requires `logistics:contracts:view`.
 * @param {{ countryId?: string }} [options] Filter to places of one country;
 *   omit to list places of every country.
 * @returns {Promise<{ success: true, places: import('../types/index.js').Place[] } | { success: false, message: string }>}
 */
export async function listPlaces({ countryId } = {}) {
  const query = countryId
    ? `?${new URLSearchParams({ countryId }).toString()}`
    : '';
  const result = await apiRequest(`/api/v1/places${query}`, {
    errorMessage: GENERIC_LIST_ERROR,
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, places: result.data ?? [] };
}

/**
 * Requires `logistics:contracts:manage`.
 * @param {import('../types/index.js').PlaceFormValues} values
 * @returns {Promise<{ success: true, place: import('../types/index.js').Place } | { success: false, message: string }>}
 */
export async function createPlace(values) {
  const result = await apiRequest('/api/v1/places', {
    method: 'POST',
    errorMessage: GENERIC_CREATE_ERROR,
    body: {
      Name: values.name,
      CountryId: values.countryId,
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, place: result.data };
}
