/**
 * @typedef {Object} NavLink
 * @property {string} label
 * @property {string} href
 * @property {NavLink[]} [children]
 * @property {string[]} [allowedRoles] - Omitted: visible to any logged-in
 *   visitor (today's default for every link). Present: only visible to a
 *   visitor whose session roles intersect this list — see
 *   `src/shared/api/nav.js`'s `filterNavLinksByRoles`.
 */

/**
 * React Docs-compatible sidebar registry item.
 * @typedef {{
 *   title?: string,
 *   path?: string,
 *   routes?: SidebarRouteItem[],
 *   hasSectionHeader?: boolean,
 *   sectionHeader?: string,
 * }} SidebarRouteItem
 */

/** @typedef {SidebarRouteItem & { title: string, path: string, routes: SidebarRouteItem[] }} SidebarRouteTree */

export {};
