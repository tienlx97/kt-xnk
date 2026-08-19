/**
 * Route-level permission gating, enforced by `src/middleware.js` before a
 * matching page ever renders (same "block before render" property
 * `(protected)/layout.jsx` already gives the plain login check). Checks an
 * abstract permission string, not a role name — the backend alone maps
 * role → permission (`BE-kt-xnk`'s `RolePermissions.Map`), so renaming a
 * department there never requires an FE change here.
 *
 * `pathPrefix` matches the route itself and every sub-route under it, same
 * semantics as `isNavLinkActive` in `src/shared/api/nav.js`.
 * @type {Array<{ pathPrefix: string, allowedPermissions: string[] }>}
 */
export const routeAccessRules = [
  { pathPrefix: '/admin', allowedPermissions: ['users:manage'] },
];
