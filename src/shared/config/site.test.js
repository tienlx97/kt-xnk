import assert from 'node:assert/strict';
import { test } from 'node:test';

import { navLinks, site, topNavLinks } from './site.js';

test('site config has a name and description', () => {
  assert.ok(site.name.length > 0);
  assert.ok(site.description.length > 0);
});

test('navLinks each have a label and href', () => {
  assert.ok(navLinks.length > 0);
  for (const link of navLinks) {
    assert.ok(link.label.length > 0);
    assert.ok(link.href.startsWith('/'));
  }
});

test('topNavLinks exposes Tutorial and Docs in order', () => {
  assert.deepEqual(
    topNavLinks.map(({ label, href }) => ({ label, href })),
    [
      { label: 'Tutorial', href: '/tutorial' },
      { label: 'Docs', href: '/docs' },
    ],
  );
});
