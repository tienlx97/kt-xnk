# Proposal: Shipment VGM additional info

**Status:** done
**Created:** 2026-09-03

## Why

Same-day follow-up to `add-shipment-vgm`. BE-kt-xnk shipped
`add-shipment-vgm-additional-info` (`../CLEAN ARCHITECTURE/openspec/changes/`)
— `ShipmentVgm` gained six "Thông tin bổ sung" fields: `packingDate`
(required), `plannedPackingTime`/`actualPackingTime`/`truckArrivalTime`
(optional), `carrierCustomerId` (required, live reference to the
`Customer` catalog — same pattern as `Shipment.supplierCustomerId`),
`note` (optional). User asked to build the FE.

## What changes

- `types/index.js`: `ShipmentVgm`/`ShipmentVgmFormValues` gain the six
  fields.
- `config/shipment-vgm-schema.js`: `packingDate`/`carrierCustomerId`
  required, the rest optional (mirrors the backend validators).
- `api/shipment-vgms.js`: `toRequestBody` sends the six fields.
  **Bug found and fixed during live verification**: the backend's
  `TimeOnly?` fields deserialize via System.Text.Json's built-in
  converter, which requires seconds (`HH:MM:SS`) — Astryx's `TimeInput`
  emits bare `HH:MM`, which the backend rejected with `400`. Added a
  `withSeconds()` normalizer that appends `:00` before sending.
- `hooks/use-shipment-vgm-form.js`: also fetches the `Customer` catalog
  (mirrors `useShipmentForm`'s `supplierCustomerId` pattern) for the
  carrier picker.
- `components/shipment-vgm-fields.jsx`: new "Thông tin bổ sung" section —
  `DateInput` (required), `Selector` with `hasSearch` for the carrier
  (required), three `TimeInput`s with `hasClear` (optional, `24h` format),
  `TextArea` for the note (optional).
- `components/shipment-vgm-form-dialog.jsx`: passes `customers` through.
- `components/shipment-expanded-details.jsx` /
  `components/contracts-list.jsx`: the inline VGM table gains "Ngày đóng
  hàng"/"Nhà cung cấp vận chuyển" columns (resolved via the already-fetched
  `customersById` map, now threaded down as a new prop) — the other four
  fields stay edit-dialog-only, same as `payload`/`maxGross`/`netWeight`/
  `packagingWeight` before them, to avoid an even wider table.

## Not changing

No new config file for the carrier — it reuses the existing `Customer`
catalog fetch, same as `Shipment.supplierCustomerId`.
