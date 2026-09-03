# Spec: Incoterm-Driven Place Fields

## Requirement: Place of loading is always sourced from Vietnam's Place catalog

The Contract form SHALL present "Nơi xếp hàng" as a `Selector` populated
from `Place` entries whose `countryId` belongs to the country named "Việt
Nam" (matched case/diacritics-insensitively — `Country` has no ISO code),
for every Incoterm, with a quick-add fixed to that country.

### Scenario: Picking a loading place

- GIVEN the Contract form is open
- WHEN the user opens "Nơi xếp hàng" and selects an option
- THEN `placeOfLoading` SHALL be set to that place's name, regardless of
  the currently selected Incoterm

### Scenario: No "Việt Nam" entry in the Country catalog

- GIVEN the Country catalog has no entry matching "Việt Nam"
- WHEN the Contract form is open
- THEN "Nơi xếp hàng" and its quick-add button SHALL be disabled, with a
  message explaining why

## Requirement: Place of discharge only applies to DDP/CIF

`placeOfDischarge` SHALL be required and sourced from the selected export
country's `Place` catalog when `incoterm` is `DDP` or `CIF`, and SHALL be
sent as `null` (blank in the form) for `EXW`/`FOB`.

### Scenario: Selecting CIF or DDP with a country chosen

- GIVEN the user has picked an export country and set Incoterm to `CIF` or
  `DDP`
- WHEN they open "Cảng/nơi đến"
- THEN it SHALL list `Place` entries scoped to that country, plus a
  quick-add fixed to the same country

### Scenario: Switching to FOB or EXW clears any selected discharge place

- GIVEN "Cảng/nơi đến" currently holds a value
- WHEN the user changes Incoterm to `FOB` or `EXW`
- THEN `placeOfDischarge` SHALL be cleared and the field SHALL become
  disabled

### Scenario: No export country selected yet

- GIVEN Incoterm is `DDP` or `CIF` but no export country is selected
- WHEN the Contract form is open
- THEN "Cảng/nơi đến" and its quick-add button SHALL stay disabled, with a
  message asking the user to pick an export country first

### Scenario: Changing the export country clears a stale discharge place

- GIVEN "Cảng/nơi đến" holds a value scoped to the previous export country
- WHEN the user changes "Nước xuất khẩu"
- THEN `placeOfDischarge` SHALL be cleared, since the previous value may
  not belong to the new country's `Place` catalog

## MODIFIED Requirement: Place of loading/discharge

Supersedes `wire-contract-country-port-and-field-renames`'s "Place of
loading/discharge remain free text" requirement — both fields are now
catalog-constrained `Selector`s (see above), not free `TextInput`s. A
quick-add dialog remains the only way to add a `Place` not already in the
catalog, mirroring the Country field's pattern.
