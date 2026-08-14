/** @typedef {import('../types/index.js').NavLink} NavLink */

export const site = {
  name: 'Đại Nghĩa Group',
  description:
    'Cổng thông tin nội bộ Đại Nghĩa Group — nơi tra cứu quy định, hướng dẫn và tài liệu dùng chung cho toàn hệ sinh thái.',
  slogan: 'Kiến tạo giá trị — Phát triển bền vững',
};

/** @type {NavLink[]} */
export const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tutorial', href: '/tutorial' },
  { label: 'Docs', href: '/docs' },
  { label: 'Design System', href: '/design-system' },
  { label: 'Đăng nhập', href: '/login' },
];

/** @type {NavLink[]} */
export const topNavLinks = navLinks.filter(({ href }) =>
  ['/docs'].includes(href),
);
