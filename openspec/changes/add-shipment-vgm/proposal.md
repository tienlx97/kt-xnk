# Proposal: Shipment VGM

**Status:** done
**Created:** 2026-09-03

## Why

BE-kt-xnk shipped `ShipmentVgm` (`add-shipment-vgm` in
`../CLEAN ARCHITECTURE/openspec/changes/`) — a `Shipment` has one or more
VGM ("Verified Gross Mass") records, one per container: tên cont, tên
seal, loại cont, tare, payload, max gross, net weight, gross weight
(computed) and VGM (computed). Unlike every other child entity in
`add-contract-shipments`/`add-payment-schedule-and-contract-signatures`,
this one supports delete on the backend. User asked to build the FE.

## What changes

- `types/index.js`: `ShipmentContainerType`, `ShipmentVgm`,
  `ShipmentVgmFormValues`.
- `config/shipment-container-types.js` (`Size20`/`Size40`/`Size40HC`/
  `Size45` fixed set, labels `"20'"`/`"40'"`/`"40'HC"`/`"45'"`),
  `config/shipment-vgm-schema.js` (zod, mirrors
  `CreateShipmentVgmCommandValidator`).
- `api/shipment-vgms.js` (list/create/update/**delete** against
  `/api/v1/contracts/{contractId}/shipments/{shipmentId}/vgm...`),
  `hooks/use-shipment-vgms-query.js` (list query + create/update/delete
  mutations), `hooks/use-shipment-vgm-form.js`.
- `components/shipment-vgm-fields.jsx` (also live-previews
  `grossWeight`/`vgm` client-side from the current form values, purely as
  a UX preview — the backend's computed response values are still what
  gets displayed everywhere else), `components/shipment-vgm-form-dialog.jsx`.
- New `components/shipment-vgm-list-dialog.jsx`: a **third level of
  nested dialog** (Contract → Shipment → VGM), since VGM records belong
  to one specific shipment rather than the contract as a whole — every
  other child list in this feature lives directly in a Contract-level
  tab. Opened via a new "Quản lý VGM" icon button on each shipment row in
  the "Xuất hàng" tab (`contracts-list.jsx`). Lists the shipment's
  containers with add/edit/**delete** — delete asks for confirmation via
  Astryx `AlertDialog` first (the one delete-confirmation flow in this
  app so far; no prior pattern existed to reuse since no other feature
  here has delete).

## Not changing

No precondition tying VGM creation to a signed contract or shipment
state — the backend doesn't enforce one either.
