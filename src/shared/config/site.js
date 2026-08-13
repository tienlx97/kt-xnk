/** @typedef {import('../types/index.js').NavLink} NavLink */

export const site = {
  name: 'KT-XNK',
  description: 'OpenSpec x Harness Engineering starter — Next.js + StyleX.',
};

/** @type {NavLink[]} */
export const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tutorial', href: '/tutorial' },
  { label: 'Blog', href: '/blog' },
  { label: 'Design System', href: '/design-system' },
  { label: 'Đăng nhập', href: '/login' },
];

// Optional reference headings shown after the navigation links. An empty or
// omitted list leaves the sidenav unchanged.
export const sideNavTitles = ['react@19.2', 'react-dom@19.2', 'React Compiler'];
