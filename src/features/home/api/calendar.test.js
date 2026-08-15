import assert from 'node:assert/strict';
import { test } from 'node:test';

import { daysWithEntries, monthGridCells, monthLabel } from './calendar.js';

test('August 2026 starts on a Saturday, so the grid leads with 5 blanks', () => {
  const cells = monthGridCells(2026, 7); // month is 0-indexed: 7 = August
  assert.equal(cells.length % 7, 0, 'grid must be a whole number of weeks');
  assert.deepEqual(cells.slice(0, 5), [null, null, null, null, null]);
  assert.equal(cells[5], 1);
  assert.equal(cells.at(-1) === 31 || cells.at(-1) === null, true);
  assert.ok(cells.includes(31), 'August has 31 days');
});

test('February in a leap year has 29 days, none in the next month', () => {
  const cells = monthGridCells(2028, 1); // 2028 is a leap year
  assert.ok(cells.includes(29));
  assert.ok(!cells.includes(30));
});

test('grid cells are always a multiple of 7 regardless of month length', () => {
  for (let month = 0; month < 12; month += 1) {
    const cells = monthGridCells(2026, month);
    assert.equal(cells.length % 7, 0, `month ${month} grid is not 7-wide`);
  }
});

test('collects the day numbers of entries within the given month', () => {
  const entries = [
    { date: '2026-08-20' },
    { date: '2026-08-25' },
    { date: '2026-09-02' }, // different month — excluded
  ];
  assert.deepEqual(daysWithEntries(entries, 2026, 7), new Set([20, 25]));
});

test('deduplicates same-day entries', () => {
  const entries = [{ date: '2026-08-20' }, { date: '2026-08-20' }];
  assert.deepEqual(daysWithEntries(entries, 2026, 7), new Set([20]));
});

test('month label is a Vietnamese "Tháng N, yyyy" string', () => {
  assert.equal(monthLabel(2026, 7), 'Tháng 8, 2026');
});
