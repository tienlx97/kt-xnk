/**
 * @typedef {Object} NavLink
 * @property {string} label
 * @property {string} href
 * @property {NavLink[]} [children]
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
