# Proposal: Incoterm-Driven Place Fields

**Status:** done
**Created:** 2026-09-01

## Why

`placeOfLoading`/`placeOfDischarge` were plain free-text `TextInput`s,
deliberately kept that way by `wire-contract-country-port-and-field-renames`
(no autocomplete component existed then). User asked for real business
logic instead: "Nơi xếp hàng" should always be picked from Vietnam's
`Place` catalog (every Incoterm here starts the seller's leg
domestically); "Cảng/nơi đến" only applies to DDP/CIF (picked from the
export country's `Place` catalog, with a quick-add), and must be `null`
for FOB/EXW (the buyer arranges carriage past origin under those terms).

## What changes

- New `config/vietnam-country.js` (`isVietnamCountryName`/
  `findVietnamCountry`): `Country` has no ISO code (plain `{id, name}`
  catalog), so "which one is Vietnam" is a diacritics/case-insensitive name
  match — confirmed against the live catalog's actual `"Việt Nam"` entry.
- `config/incoterms.js`: `requiresPlaceOfDischarge(incoterm)` — true for
  DDP/CIF only (the other half of the full `INCOTERM_CODES` set).
- `config/contract-schema.js`: `placeOfDischarge` is now required exactly
  when `requiresPlaceOfDischarge(incoterm)` and must be blank otherwise
  (cross-field refine), instead of always-required.
- `api/contracts.js`: `PlaceOfDischarge` sent as `null` when blank.
- `hooks/use-places-query.js`: `usePlacesQuery` gained an `enabled` option
  (mirrors `useBranchesQuery(companyId)`) so a country-scoped caller can
  skip fetching until its `countryId` is known.
- `hooks/use-contract-form.js`: resolves `vietnamCountryId` from the
  countries catalog; loads `loadingPlaces` (Vietnam-scoped) and
  `dischargePlaces` (scoped to the selected export country); `setField`
  clears `placeOfDischarge` whenever `incoterm` stops requiring it or
  `countryId` changes.
- `components/contract-form-dialog.jsx`: both fields become `Selector` +
  "+" quick-add (same pattern as "Nước xuất khẩu"), reusing the existing
  `QuickCreatePlaceDialog`. "Nơi xếp hàng" disables if no "Việt Nam" entry
  exists in the catalog; "Cảng/nơi đến" disables (with a reason) unless the
  Incoterm is DDP/CIF **and** an export country is selected.
- `hooks/use-contract-form.js`: **bug fix** — `Place.name` isn't unique
  (no catalog constraint), and the Selector options for both fields are
  keyed by name, so two same-named places for one country produced a
  duplicate-key React error. Added `dedupePlacesByName()` (first
  occurrence wins) before building `loadingPlaces`/`dischargePlaces`.
  Surfaced live: my own testing had created "Cảng Bangkok" for Thái Lan
  twice across two passes (see `quick-create-place-dialog.jsx` bug below —
  the first attempt silently failed to show the right country, so I
  re-created it).
- `components/quick-create-place-dialog.jsx` / `hooks/use-place-form.js`:
  **bug fix, corrected after an initial wrong fix** — this dialog stays
  mounted and is opened by its caller's `IconButton.onClick` setting
  `isOpen` directly, never through the dialog's own `onOpenChange`. An
  initial attempt made `handleOpenChange` reset on both open and close,
  but since the open path never calls `handleOpenChange` at all, that only
  ever exercised the pre-existing close-time reset — closing and
  reopening in testing looked like success for the wrong reason. Real fix:
  `usePlaceForm` now takes an `isOpen` param and re-seeds `values` via
  React's "adjust state during rendering" pattern (compared against a
  `prevIsOpen` state mirror — not a `useEffect`, which this repo's
  `react-hooks/set-state-in-effect` lint forbids for synchronous
  `setState`) whenever `isOpen` flips true. See `harness/PROGRESS.md` for
  the full story and the reproduction that caught the first fix being
  wrong.

## Out of scope

- No backend change (already shipped, per the prior change).
- No data migration for existing contracts whose `placeOfLoading`/
  `placeOfDischarge` text doesn't match a current `Place` catalog entry —
  the Selector shows blank for those until the user re-picks/re-adds it;
  acceptable since the value round-trips unchanged if left untouched.
- Superseded (not this session's task): the old
  `wire-contract-country-port-and-field-renames` requirement "Place of
  loading/discharge remain free text" — these fields are now
  catalog-constrained. That spec's requirement doc is stale as of this
  change; not rewritten here (out of scope to touch a "done" change's
  spec), but doesn't reflect the current behavior — see this proposal's
  `specs/` instead.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-09-01 | Matched "Việt Nam" by normalized name, not a hardcoded id | `Country` has no code field; verified the live catalog has exactly one match |
| 2026-09-01 | Added a quick-add "+" to "Nơi xếp hàng" too, not just "Cảng/nơi đến" | User only asked for it on the discharge field, but a Selector with no escape hatch would dead-end the loading field the same way; matches the existing Country field's pattern |
| 2026-09-01 | Selector option `value` is the `Place.name` string, not its `id` | The wire field stays a plain string (unchanged shape); using `name` means an exact-name match displays correctly with no id↔name lookup needed |
