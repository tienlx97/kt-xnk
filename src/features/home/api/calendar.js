/**
 * Pure month-grid math for `MiniCalendar`. No `Date.now()` anywhere in this
 * file — every function takes explicit year/month/day integers or an ISO
 * date string, so output is identical during server rendering and client
 * hydration. (A `Date.now()`-based "today" highlight would drift a few
 * hours apart between build time and the visitor's clock and cause a
 * hydration mismatch; this module intentionally has no notion of "today".)
 */

const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/** Monday-first weekday abbreviations, in display order. */
export function weekdayLabels() {
  return WEEKDAY_LABELS;
}

/**
 * Compact "Tháng M, yyyy" label for the calendar header, e.g. "Tháng 8,
 * 2026". Built by hand rather than `Intl.DateTimeFormat({month:'long'})`,
 * which renders the longer, lowercase "tháng 8 năm 2026" — correct
 * Vietnamese prose, but wider than this widget's header has room for.
 * @param {number} year
 * @param {number} month 0-indexed (0 = January), matching `Date`'s convention.
 */
export function monthLabel(year, month) {
  return `Tháng ${month + 1}, ${year}`;
}

/**
 * Lays a calendar month out as a flat, Monday-first grid of cells — `null`
 * for the leading/trailing padding before day 1 and after the last day, a
 * day number (1-based) everywhere else. Always a multiple of 7 so callers
 * can render it straight into a 7-column grid.
 *
 * `new Date(year, month, day)` (explicit numeric arguments, not an ISO
 * string) is timezone-safe: it resolves in the local calendar the same way
 * on any host, unlike parsing `"2026-08-01"` which anchors to UTC midnight.
 * @param {number} year
 * @param {number} month 0-indexed (0 = January)
 * @returns {(number | null)[]}
 */
export function monthGridCells(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 (Sun) – 6 (Sat)
  const leadingBlanks = (firstWeekday + 6) % 7; // shift to Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = new Array(leadingBlanks).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

/**
 * Day-of-month numbers (deduplicated) for every entry whose ISO date falls
 * within the given year/month — the set `MiniCalendar` highlights.
 * @param {{ date: string }[]} entries
 * @param {number} year
 * @param {number} month 0-indexed (0 = January)
 * @returns {Set<number>}
 */
export function daysWithEntries(entries, year, month) {
  const days = new Set();
  for (const { date } of entries) {
    const parsed = new Date(`${date}T12:00:00`);
    if (parsed.getFullYear() === year && parsed.getMonth() === month) {
      days.add(parsed.getDate());
    }
  }
  return days;
}
