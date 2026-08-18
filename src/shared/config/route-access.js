/**
 * Route-level role gating, enforced by `src/middleware.js` before a
 * matching page ever renders (same "block before render" property
 * `(protected)/layout.jsx` already gives the plain login check).
 *
 * Empty today — nothing needs restricting yet. To gate a route once it
 * exists, add an entry:
 * `{ pathPrefix: '/logistics', allowedRoles: ['Admin', 'Logistics'] }`
 * (`pathPrefix` matches the route itself and every sub-route under it,
 * same semantics as `isNavLinkActive` in `src/shared/api/nav.js`).
 * @type {Array<{ pathPrefix: string, allowedRoles: string[] }>}
 */
export const routeAccessRules = [];
