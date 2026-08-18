import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  filterNavLinksByRoles,
  getActiveSidebarGroupKey,
  getSidebarBreadcrumbs,
  toggleSidebarGroup,
} from './nav.js';

const sidebar = JSON.parse(
  await readFile(new URL('../../sidebarPost.json', import.meta.url), 'utf8'),
);

test('builds Docs breadcrumbs from the containing sidebar group', () => {
  assert.deepEqual(getSidebarBreadcrumbs(sidebar, '/docs/lam-them-gio'), [
    { label: 'Docs', href: '/docs', isCurrent: false },
    { label: 'Nội quy', isCurrent: true },
  ]);

  assert.deepEqual(getSidebarBreadcrumbs(sidebar, '/docs/may-tinh'), [
    { label: 'Docs', href: '/docs', isCurrent: false },
    { label: 'IT', isCurrent: true },
  ]);
});

test('returns no breadcrumbs when the route is absent from the sidebar', () => {
  assert.deepEqual(getSidebarBreadcrumbs(sidebar, '/docs/khong-ton-tai'), []);
});

test('selects only the group containing the active sidebar route', () => {
  assert.equal(
    getActiveSidebarGroupKey(sidebar.routes, '/docs/gio-lam-viec'),
    '/docs',
  );
  assert.equal(
    getActiveSidebarGroupKey(sidebar.routes, '/docs/may-tinh'),
    '/docs/it',
  );
});

test('keeps a nav link with no allowedRoles for anyone', () => {
  const navLinks = [{ label: 'Docs', href: '/docs' }];
  assert.deepEqual(filterNavLinksByRoles(navLinks, []), navLinks);
  assert.deepEqual(filterNavLinksByRoles(navLinks, ['Admin']), navLinks);
});

test('keeps a role-restricted nav link only for a matching role', () => {
  const navLinks = [
    {
      label: 'Logistics',
      href: '/logistics',
      allowedRoles: ['Admin', 'Logistics'],
    },
  ];

  assert.deepEqual(filterNavLinksByRoles(navLinks, ['Logistics']), navLinks);
  assert.deepEqual(filterNavLinksByRoles(navLinks, ['Admin']), navLinks);
  assert.deepEqual(filterNavLinksByRoles(navLinks, ['Participant']), []);
  assert.deepEqual(filterNavLinksByRoles(navLinks, []), []);
});

test('toggles sidebar groups as an exclusive accordion', () => {
  const pathname = '/docs/gio-lam-viec';
  const activeGroupKey = getActiveSidebarGroupKey(sidebar.routes, pathname);
  const openedSecondGroup = toggleSidebarGroup(
    null,
    pathname,
    activeGroupKey,
    '/docs/it',
  );

  assert.deepEqual(openedSecondGroup, { pathname, groupKey: '/docs/it' });
  assert.deepEqual(
    toggleSidebarGroup(openedSecondGroup, pathname, activeGroupKey, '/docs/it'),
    { pathname, groupKey: null },
  );
  assert.equal(
    getActiveSidebarGroupKey(sidebar.routes, '/docs/may-tinh'),
    '/docs/it',
  );
});
