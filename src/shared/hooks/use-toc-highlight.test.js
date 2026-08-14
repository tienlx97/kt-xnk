import assert from 'node:assert/strict';
import test from 'node:test';

import { findActiveTocIndex } from './use-toc-highlight.js';

test('keeps the first TOC item active before the first heading crosses the offset', () => {
  assert.equal(findActiveTocIndex([120, 480, 840], false), 0);
});

test('selects the last heading above the fixed header offset', () => {
  assert.equal(findActiveTocIndex([-400, 40, 300], false), 1);
});

test('selects the final TOC item at the bottom of the page', () => {
  assert.equal(findActiveTocIndex([-800, -300, 220], true), 2);
});

test('returns no selection when no rendered heading exists', () => {
  assert.equal(findActiveTocIndex([], false), -1);
});
