const GENERIC_ERROR_MESSAGE = 'Không thể tải danh sách địa giới hành chính';

/**
 * Static Vietnam administrative-unit datasets bundled under `public/data/`,
 * served straight from Next.js's static file handler — not `/api/backend`,
 * since this isn't backend data (no auth needed, doesn't change per user).
 * Sourced from https://github.com/madnh/hanhchinhvn (pre-2025-merger, 3
 * levels: tỉnh/thành → quận/huyện → xã/phường, from Tổng Cục Thống Kê) and
 * https://github.com/thanglequoc/vietnamese-provinces-database
 * (post-2025-merger, 2 levels: tỉnh/thành → xã/phường), trimmed to just the
 * `code`/`name`/parent-code fields the cascading Selectors need.
 * @param {string} path
 */
async function fetchAddressData(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
  return response.json();
}

/**
 * @returns {Promise<import('../types/index.js').OldAddressData>}
 */
export function fetchOldAddressData() {
  return fetchAddressData('/data/vn-address-old.json');
}

/**
 * @returns {Promise<import('../types/index.js').NewAddressData>}
 */
export function fetchNewAddressData() {
  return fetchAddressData('/data/vn-address-new.json');
}
