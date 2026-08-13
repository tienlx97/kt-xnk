/** @typedef {import('../types/index.js').NavLink} NavLink */

export const site = {
  name: 'KT-XNK',
  description: 'OpenSpec x Harness Engineering starter — Next.js + StyleX.',
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
  ['/tutorial', '/docs'].includes(href),
);
