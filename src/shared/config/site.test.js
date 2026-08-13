import assert from 'node:assert/strict';
import { test } from 'node:test';

import { navLinks, sideNavTitles, site } from './site.js';

test('site config has a name and description', () => {
  assert.ok(site.name.length > 0);
  assert.ok(site.description.length > 0);
});

test('optional sidenav titles are non-empty strings', () => {
  for (const title of sideNavTitles) {
    assert.equal(typeof title, 'string');
    assert.ok(title.length > 0);
  }
});

test('navLinks each have a label and href', () => {
  assert.ok(navLinks.length > 0);
  for (const link of navLinks) {
    assert.ok(link.label.length > 0);
    assert.ok(link.href.startsWith('/'));
  }
});
