# Proposal: Shipment code by type, forwarder wording

**Status:** done
**Created:** 2026-09-04

## Why

BE-kt-xnk shipped `add-shipment-type-scoped-numbering`
(`../CLEAN ARCHITECTURE/openspec/changes/`): `ShipmentCode` now encodes
load type (`LCL-{n}`/`LOT-{n}`, separate per-type sequence), `Type` is
immutable after creation, and `QuantityUnit` is derived from `Type`
rather than an independent input. Also: Booking info's "Nhà cung cấp"
field should read "Forwarder". User asked to build the FE.

## What changes

- `config/shipment-quantity-units.js`: new
  `quantityUnitForShipmentType(type)` helper mirroring the backend's
  computed `Shipment.QuantityUnit` getter.
- `shipment-schema.js`/`use-shipment-form.js`: drop `quantityUnit` from
  the form entirely.
- `api/shipments.js`: `toCreateRequestBody`/`toUpdateRequestBody` (split
  from one shared builder) — neither sends `quantityUnit`; only create
  sends `Type`.
- `shipment-fields.jsx`: "Số lượng" shows the derived unit as its
  `units` suffix (with a hint before a type is picked) instead of a
  Selector; "Loại hình" is disabled once editing an existing shipment
  (`isEditing` prop from `ShipmentFormDialog`).
- `contracts-list.jsx`: Shipment table's supplier column header renamed
  "Forwarder" (the Selector label and expanded-row `MetadataListItem`
  had already been renamed by the time this session picked up the rest).

## Not changing

No new fields, no new endpoints — purely reflecting the backend's
already-shipped rules in the form/table.
