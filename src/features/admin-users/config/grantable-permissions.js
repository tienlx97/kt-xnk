/**
 * Vietnamese display labels for permissions from `GET /permissions/grantable`
 * — a **local fallback**, not the source of which permissions exist (that's
 * the backend's `Permission.Grantable`, fetched at runtime; see
 * `openspec/changes/add-grantable-permissions-endpoint/proposal.md`). A
 * permission the backend returns but this map has no entry for still
 * renders — using the raw key as its own label — instead of silently
 * disappearing from the tab.
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
 * @param {string} permission
 * @returns {{ label: string, description?: string }}
 */
export function labelForPermission(permission) {
  return PERMISSION_LABELS[permission] ?? { label: permission };
}
