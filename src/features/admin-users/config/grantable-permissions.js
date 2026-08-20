/**
 * Mirrors the backend's whitelist — `Permission.Grantable`
 * (BE-kt-xnk, `CompanyManagement.Application/Common/Authorization/Permission.cs`).
 * Kept as a small hardcoded list rather than fetched from an endpoint: it is
 * tiny today and the backend already rejects (400) anything not on its own
 * copy, so a stale FE list can only under-offer options, never grant
 * something it shouldn't.
 * @typedef {Object} GrantablePermission
 * @property {string} key
 * @property {string} label
 * @property {string} [description]
 */

/** @type {GrantablePermission[]} */
export const GRANTABLE_PERMISSIONS = [
  {
    key: 'logistics:secret',
    label: 'Dữ liệu mật Logistics',
    description:
      'Dành cho trưởng phòng hoặc 1 nhân viên được chỉ định riêng — độc lập với phòng ban.',
  },
];
