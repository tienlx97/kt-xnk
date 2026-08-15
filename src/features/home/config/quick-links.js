/**
 * @typedef {{
 *   icon: import('@astryxdesign/core/Icon').IconName,
 *   label: string,
 *   description: string,
 *   href: string,
 * }} QuickLink
 */

/**
 * Fast-access tiles to the docs employees look up most often. Pulled from
 * the "Nội quy" and "IT" doc categories (see `src/sidebarPost.json`).
 * @type {QuickLink[]}
 */
export const quickLinks = [
  {
    icon: 'info',
    label: 'Nội quy chung',
    description: 'Quy định chung áp dụng toàn công ty',
    href: '/docs/noi-quy-chung',
  },
  {
    icon: 'clock',
    label: 'Giờ làm việc',
    description: 'Khung giờ làm việc tiêu chuẩn',
    href: '/docs/gio-lam-viec',
  },
  {
    icon: 'calendar',
    label: 'Nghỉ phép',
    description: 'Quy trình xin nghỉ & ngày phép',
    href: '/docs/nghi-phep',
  },
  {
    icon: 'checkDouble',
    label: 'Chấm công',
    description: 'Cách chấm công & tính công',
    href: '/docs/cham-cong',
  },
  {
    icon: 'wrench',
    label: 'Hỗ trợ IT',
    description: 'Tài khoản, thiết bị, sự cố kỹ thuật',
    href: '/docs/ho-tro-it',
  },
  {
    icon: 'warning',
    label: 'Bảo mật',
    description: 'Quy định an toàn thông tin',
    href: '/docs/bao-mat',
  },
];
