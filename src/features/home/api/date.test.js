import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  formatDateBadge,
  formatDayMonth,
  formatEventWhen,
  formatLongDate,
} from './date.js';

test('formats a compact day/month label', () => {
  assert.equal(formatDayMonth('2026-08-20'), '20/8');
});

test('formats a full Vietnamese date', () => {
  assert.equal(formatLongDate('2026-09-02'), '2 tháng 9, 2026');
});

test('splits a date into day and abbreviated month for the badge', () => {
  assert.deepEqual(formatDateBadge('2026-08-20'), {
    day: '20',
    month: 'Thg 8',
  });
});

test('describes a timed event with its start time', () => {
  const when = formatEventWhen({ date: '2026-08-20', time: '08:30' });
  assert.match(when, /^Thứ Năm, 20 tháng 8, 2026 · 08:30$/);
});

test('describes an all-day event without a time', () => {
  const when = formatEventWhen({ date: '2026-09-02', time: null });
  assert.match(when, /· cả ngày$/);
});

// Regression guard for the timezone bug this module's `T12:00` pin exists to
// prevent: parsing a bare ISO date yields UTC midnight, which renders as the
// previous calendar day anywhere behind UTC. Asia/Ho_Chi_Minh (UTC+7) is
// ahead, so the failure mode shows up in the other direction — a date that
// silently rolls forward — under a negative offset. Both directions are
// covered by pinning midday and asserting the day number never moves.
test('keeps the calendar day stable regardless of process timezone', () => {
  const original = process.env.TZ;
  try {
    for (const zone of ['UTC', 'Asia/Ho_Chi_Minh', 'America/Los_Angeles']) {
      process.env.TZ = zone;
      assert.equal(
        formatDateBadge('2026-09-02').day,
        '2',
        `day drifted in ${zone}`,
      );
    }
  } finally {
    process.env.TZ = original;
  }
});
