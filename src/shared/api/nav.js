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

/** @typedef {import('../types/index.js').SidebarRouteItem} SidebarRouteItem */

/**
 * Build the ancestor breadcrumbs for a route from the same tree used by the
 * sidebar. The matching page itself is intentionally omitted because its
 * title is rendered immediately below the breadcrumb trail.
 * @param {SidebarRouteItem} route
 * @param {string} pathname
 * @returns {Array<{label: string, href?: string, isCurrent?: boolean}>}
 */
export function getSidebarBreadcrumbs(route, pathname) {
  const trail = findRouteTrail(route, pathname);
  if (!trail) return [];

  const ancestors = /** @type {Array<SidebarRouteItem & {title: string}>} */ (
    trail.slice(0, -1).filter((item) => item.title)
  );

  return ancestors.map((item, index) => {
    const isCurrent = index === ancestors.length - 1;

    return {
      label: item.title,
      ...(item.path && !isCurrent ? { href: item.path } : {}),
      isCurrent,
    };
  });
}

/**
 * @param {SidebarRouteItem} route
 * @param {string} pathname
 * @returns {SidebarRouteItem[] | undefined}
 */
function findRouteTrail(route, pathname) {
  if (route.path === pathname) return [route];

  for (const child of route.routes ?? []) {
    const childTrail = findRouteTrail(child, pathname);
    if (childTrail) return [route, ...childTrail];
  }

  return undefined;
}
