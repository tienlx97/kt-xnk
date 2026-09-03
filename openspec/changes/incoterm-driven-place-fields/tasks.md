# Tasks: Incoterm-Driven Place Fields

## 1. Business rules

- [x] 1.1 `config/vietnam-country.js` + test — verify: `pnpm run test -- src/features/logistics-contracts/config/vietnam-country.test.js`
- [x] 1.2 `config/incoterms.js`: `requiresPlaceOfDischarge()` — verify: lint/typecheck clean
- [x] 1.3 `config/contract-schema.js`: conditional `placeOfDischarge` refine + tests — verify: `pnpm run test -- src/features/logistics-contracts/config/contract-schema.test.js`
- [x] 1.4 `api/contracts.js`: `PlaceOfDischarge` → `null` when blank + test — verify: `pnpm run test -- src/features/logistics-contracts/api/contracts.test.js`

## 2. Wiring

- [x] 2.1 `hooks/use-places-query.js`: `enabled` option — verify: `places-list.jsx`'s existing usage unaffected (lint/typecheck)
- [x] 2.2 `hooks/use-contract-form.js`: `vietnamCountryId`, `loadingPlaces`, `dischargePlaces`, `isPlaceOfDischargeApplicable`, clearing side effects in `setField` — verify: typecheck
- [x] 2.3 `components/contract-form-dialog.jsx`: Selector + quick-add for both fields — verify: live browser check (see 3.1)
- [x] 2.4 `components/quick-create-place-dialog.jsx`: fix stale-`countryId`-on-open bug — verify: live browser check (see 3.1)

## 3. Verification

- [x] 3.1 Live browser check via `claude-in-chrome`: confirmed "Nơi xếp hàng" pre-populated from Vietnam places; "Cảng/nơi đến" disabled until Incoterm ∈ {DDP, CIF} and a country is picked; quick-add locks the Country selector to the right country and auto-selects the new place; switching to FOB disables+clears "Cảng/nơi đến".
- [x] 3.2 `./harness/verify.sh` full pass.
