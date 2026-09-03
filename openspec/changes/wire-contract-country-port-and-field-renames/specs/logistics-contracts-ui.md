# Spec: Contract Country/Port Catalog + Field Renames

## Requirement: Contract country is a catalog reference

The Contract form SHALL let the user pick an existing `Country` from a
Selector (sent as `CountryId`, a required FK — not free text) or quick-add a
new `Country` without leaving the Contract form.

### Scenario: Quick-adding a country from the Contract form

- GIVEN the Contract form's "Thông tin chung" section is open
- WHEN the user opens the Country quick-add dialog, enters a name, and
  submits
- THEN the new country SHALL be created and automatically selected as the
  contract's country, without closing the Contract form

## Requirement: Place of loading/discharge remain free text

`PlaceOfLoading` and `PlaceOfDischarge` SHALL remain free-text inputs, not
constrained to the `Port` catalog — `Port` exists only for lookup/creation
convenience, per `docs/api/Ports.md` (BE-kt-xnk).

### Scenario: Entering a discharge place that is not a cataloged port

- GIVEN the user types a general address (not a port name) into "Cảng/nơi
  đến"
- WHEN the form is submitted
- THEN the value SHALL be sent as-is as `PlaceOfDischarge`, with no
  validation against the `Port` catalog

## Requirement: Quotation date must not be after the contract date

The Contract form SHALL block submission client-side when `quotationDate`
is after `createdDate`, mirroring the backend's
`QuotationDate <= CreatedDate` rule.

### Scenario: Quotation date after contract date

- GIVEN the user sets "Ngày báo giá" to a date after "Ngày tạo hợp đồng"
- WHEN the form is submitted
- THEN submission SHALL be blocked with an error on "Ngày báo giá"

## Requirement: Buyer replaces Party A in the wire payload and UI

The system SHALL send the buyer section as `Buyer` (was `PartyA`) and label
its form section "Buyer (Khách hàng)".
