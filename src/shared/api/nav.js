/**
 * Whether a nav link should render as "active" for the current pathname.
 * The home link ("/") only matches exactly — otherwise it would light up
 * on every route. Every other link also matches its own sub-routes (e.g.
 * "/tutorial" stays active on "/tutorial/bat-dau"), so the section a user
 * is browsing stays visibly highlighted instead of going dark the moment
 * they open a post.
 * @param {string} pathname
 * @param {string} href
 */
export function isNavLinkActive(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
