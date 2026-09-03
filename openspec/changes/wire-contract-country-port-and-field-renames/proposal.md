# Proposal: Wire Contract Country/Port Catalog + Field Renames

**Status:** done
**Created:** 2026-08-30

## Why

BE-kt-xnk's Contracts (Logistics) API shipped (already merged) a set of
breaking wire changes: `PortOfLoading`/`PortOrPlaceOfDestination` renamed to
`PlaceOfLoading`/`PlaceOfDischarge`, `PartyA` renamed to `Buyer`, the
free-text `ExportCountry` replaced by a required `CountryId` FK into a new
`Country` catalog, a new `Port` lookup catalog scoped per-country, a new
optional `Note` field, and a new `QuotationDate <= CreatedDate` validation
rule. The frontend still speaks the old shape and needs to catch up.

## What changes

- `api/contracts.js` `buildContractBody()`: `ExportCountry`→`CountryId`,
  `PortOfLoading`→`PlaceOfLoading`, `PortOrPlaceOfDestination`→
  `PlaceOfDischarge`, `PartyA`→`Buyer`, add `Note`.
- New catalogs `Country` (`api/countries.js`, `use-countries-query.js`,
  `config/country-schema.js`, `country-fields.jsx`,
  `quick-create-country-dialog.jsx`) and `Port` (`api/ports.js`,
  `use-ports-query.js`, `config/port-schema.js`, `port-fields.jsx`,
  `quick-create-port-dialog.jsx`), following the Seller/Customer catalog
  pattern exactly (list+create only).
- `config/contract-schema.js`: `exportCountry` string rule →
  `countryId` non-empty rule; `portOfLoading`/`portOrPlaceOfDestination` →
  `placeOfLoading`/`placeOfDischarge`; add optional `note` (max 2000); add a
  cross-field refine enforcing `quotationDate <= createdDate`.
- `hooks/use-contract-form.js`: Party-A-flavored names → Buyer-flavored
  names; add `countryId` state (Selector-backed, like `sourceCustomerId`)
  and `note` (plain string).
- `components/contract-form-dialog.jsx`: "Nước xuất khẩu" becomes a
  `Selector` + quick-create `Country`; "Cảng xếp hàng"/"Cảng/nơi đến" stay
  `TextInput`s bound to the renamed fields (see Scope decisions below); add
  a `Note` `TextArea`; "Party A (Khách hàng)" section → "Buyer (Khách
  hàng)".
- `components/party-a-fields.jsx` → `buyer-fields.jsx` (`BuyerFields`).
- `components/contracts-list.jsx`: `Party A` label → `Buyer`; country now
  resolved via `useCountriesQuery()` lookup-by-id (`ContractResponse` only
  carries `countryId`, no denormalized name — confirmed in
  `docs/api/Contracts.md`, BE-kt-xnk).

## Scope decisions

- **Port suggestion UX**: no existing lightweight freeform-autocomplete
  component (`Typeahead` forces a selection from `searchSource`, doesn't
  support "type anything, list is just a hint") — shipping plain
  `TextInput`s for `PlaceOfLoading`/`PlaceOfDischarge`, not building a
  custom typeahead. Gap noted in PROGRESS.md.
- **Country/Port standalone pages**: none — following the Seller precedent
  (in-form quick-create only), not the Customer precedent (own list page).
  No signal in `logistics-contracts-customers-ui`'s proposal or PROGRESS.md
  that catalogs get pages by default.

## Out of scope

- NotifyParty/Consignee (already out of scope, unaffected by this change).
- Any backend change (already shipped, read-only reference).
