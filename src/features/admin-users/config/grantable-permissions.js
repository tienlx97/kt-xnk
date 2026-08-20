/**
 * Vietnamese display labels for permissions from `GET /permissions/grantable`
 * — a **curated local fallback**, not the source of which permissions
 * exist (that's the backend's `GrantablePermission` catalog, fetched at
 * runtime; see
 * `openspec/changes/add-create-grantable-permission/proposal.md`). A
 * permission not listed here still renders — see `labelForPermission`.
 * @type {Record<string, { label: string, description?: string }>}
 */
export const PERMISSION_LABELS = {
  'logistics:secret': {
    label: 'Dữ liệu mật Logistics',
    description:
      'Dành cho trưởng phòng hoặc 1 nhân viên được chỉ định riêng — độc lập với phòng ban.',
  },
};

/**
 * Preference order: a curated `PERMISSION_LABELS` entry (nicest — reviewed
 * copy) beats the backend's `description` (Admin-authored free text at
 * creation time — works for anything, including a permission created
 * through the API that this map has never heard of) beats the raw key
 * (never disappears, even with no description either).
 * @param {string} permission
 * @param {string | null} [apiDescription] `description` from
 *   `GET /permissions/grantable` for this permission.
 * @returns {{ label: string, description?: string }}
 */
export function labelForPermission(permission, apiDescription) {
  const curated = PERMISSION_LABELS[permission];
  if (curated) return curated;

  return apiDescription
    ? { label: permission, description: apiDescription }
    : { label: permission };
}
