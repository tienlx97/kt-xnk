import assert from 'node:assert/strict';
import test from 'node:test';

import { tablePagination } from './table-pagination.js';

test('empty server results stay on page one with a zero range', () => {
  assert.deepEqual(
    tablePagination(
      { pageIndex: 1, pageSize: 25, totalCount: 0, totalPages: 0 },
      0,
    ),
    { currentPage: 1, totalPages: 1, rangeStart: 0, rangeEnd: 0 },
  );
});

test('local filtering to no rows never displays an inverted range', () => {
  assert.deepEqual(
    tablePagination(
      { pageIndex: 2, pageSize: 25, totalCount: 40, totalPages: 2 },
      0,
    ),
    { currentPage: 2, totalPages: 2, rangeStart: 0, rangeEnd: 0 },
  );
});

test('last page range and stale page indexes are bounded', () => {
  assert.deepEqual(
    tablePagination(
      { pageIndex: 7, pageSize: 25, totalCount: 40, totalPages: 2 },
      15,
    ),
    { currentPage: 2, totalPages: 2, rangeStart: 26, rangeEnd: 40 },
  );
});
