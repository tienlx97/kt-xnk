# Proposal: Country/Port Management Pages

**Status:** done
**Created:** 2026-08-30

## Why

`wire-contract-country-port-and-field-renames` (merged) built the full
`Country`/`Port` catalog plumbing (api/hooks/schema/fields) but, following
the Seller precedent, deliberately shipped no standalone management page —
only the in-form "+ Thêm nước"/"+ Thêm cảng" quick-create dialogs. User has
now explicitly asked for standalone create/list pages for "nước xuất khẩu"
(export country) and "cảng" (port), matching the Customer precedent
instead.

## What changes

- New components in `src/features/logistics-contracts/`: `CountriesList`,
  `CountryFormDialog`, `PortsList`, `PortFormDialog` — reusing the existing
  `use-country-form.js`/`use-port-form.js`/`country-fields.jsx`/
  `port-fields.jsx`, following `CustomersList`/`CustomerFormDialog`'s shape
  (a real `<form>`, since these dialogs are not nested inside another
  dialog's form).
- Two new routes: `app/(protected)/logistics/{countries,ports}/page.jsx`.
- `sidebarLogistics.json` gains "Nước"/"Cảng" entries.
- `route-access.js` gains `/logistics/countries`/`/logistics/ports` rules
  (`logistics:contracts:view`, matching `GET /api/v1/countries`/
  `GET /api/v1/ports`'s required permission per `docs/api/Countries.md`/
  `docs/api/Ports.md` in `BE-kt-xnk`), listed before the existing broader
  `/logistics` rule.
- `index.js` exports `CountriesList`/`PortsList`.

## Out of scope

- No update/delete for Country/Port — matches the backend, which is
  create+list only (same constraint the Customer/Seller/Bank catalogs
  already have on this frontend).
- No changes to the in-form quick-create dialogs or the Contract form
  itself — the management pages and the Contract form's Country/Port
  pickers share the same TanStack Query cache key, so a country/port
  created from its own page already appears in the Contract form's
  Selector without further wiring (confirmed by reading
  `use-countries-query.js`/`use-ports-query.js`'s `invalidateQueries`
  calls).
