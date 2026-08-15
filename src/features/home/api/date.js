/**
 * Vietnamese date formatting for home-page content.
 *
 * Config files store dates as ISO `YYYY-MM-DD` strings and never
 * pre-formatted text, so the display format is decided here in exactly one
 * place. `Intl.DateTimeFormat` instances are created at module scope
 * because constructing one is the expensive part — reusing them keeps
 * per-item formatting cheap in lists.
 *
 * Every parse pins midday (`T12:00`) rather than the ISO default of
 * midnight UTC: a bare `new Date('2026-09-02')` is UTC midnight, which
 * renders as the *previous* day in any timezone behind UTC. Midday is far
 * enough from both edges that the calendar day is stable everywhere.
 */

const dayMonthFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: 'numeric',
  month: 'numeric',
});

const longDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const weekdayFormatter = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' });

/**
 * @param {string} isoDate ISO `YYYY-MM-DD`
 * @returns {Date}
 */
function parse(isoDate) {
  return new Date(`${isoDate}T12:00:00`);
}

/**
 * Public form of `parse` for callers that need the `Date` object itself
 * rather than a formatted string — e.g. `api/calendar.js`, which reads the
 * year/month/day off an event's ISO string to place it on a month grid.
 * @param {string} isoDate ISO `YYYY-MM-DD`
 * @returns {Date}
 */
export function parseIsoDate(isoDate) {
  return parse(isoDate);
}

/**
 * Compact `d/M` label for dense rows (notices, meta lines).
 * @param {string} isoDate ISO `YYYY-MM-DD`
 */
export function formatDayMonth(isoDate) {
  return dayMonthFormatter.format(parse(isoDate));
}

/**
 * Full `d [tháng] M, yyyy` label for article and gallery captions.
 * @param {string} isoDate ISO `YYYY-MM-DD`
 */
export function formatLongDate(isoDate) {
  return longDateFormatter.format(parse(isoDate));
}

/**
 * Day number and abbreviated month for the two-line date chip on event
 * cards, e.g. `{ day: '20', month: 'Thg 8' }`.
 *
 * The month label is assembled by hand rather than through
 * `Intl.DateTimeFormat({ month: 'short' })`: Vietnamese has no genuinely
 * short month name, so `short` returns the full "Tháng 8", which overflows
 * a 56px chip. "Thg" is the conventional written abbreviation.
 * @param {string} isoDate ISO `YYYY-MM-DD`
 */
export function formatDateBadge(isoDate) {
  const parsed = parse(isoDate);
  return {
    day: String(parsed.getDate()),
    month: `Thg ${parsed.getMonth() + 1}`,
  };
}

/**
 * One-line "when" description for an event: weekday, date, and either the
 * start time or an all-day marker.
 * @param {{ date: string, time: string | null }} event
 */
export function formatEventWhen({ date, time }) {
  const parsed = parse(date);
  const weekday = weekdayFormatter.format(parsed);
  const when = longDateFormatter.format(parsed);
  return time
    ? `${weekday}, ${when} · ${time}`
    : `${weekday}, ${when} · cả ngày`;
}
