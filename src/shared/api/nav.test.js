import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { getSidebarBreadcrumbs } from './nav.js';

const sidebar = JSON.parse(
  await readFile(new URL('../../sidebarPost.json', import.meta.url), 'utf8'),
);

test('builds Docs breadcrumbs from the containing sidebar group', () => {
  assert.deepEqual(getSidebarBreadcrumbs(sidebar, '/docs/lam-them-gio'), [
    { label: 'Docs', href: '/docs', isCurrent: false },
    { label: 'NỘI QUY', isCurrent: true },
  ]);

  assert.deepEqual(getSidebarBreadcrumbs(sidebar, '/docs/may-tinh'), [
    { label: 'Docs', href: '/docs', isCurrent: false },
    { label: 'IT', isCurrent: true },
  ]);
});

test('returns no breadcrumbs when the route is absent from the sidebar', () => {
  assert.deepEqual(getSidebarBreadcrumbs(sidebar, '/docs/khong-ton-tai'), []);
});
