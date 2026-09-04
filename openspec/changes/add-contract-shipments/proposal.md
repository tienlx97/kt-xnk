# Proposal: Contract Shipments

**Status:** done
**Created:** 2026-09-03

## Why

BE-kt-xnk shipped a `Shipment` entity (`add-contract-shipments` in
`../CLEAN ARCHITECTURE/openspec/changes/`) — a `Contract` has one or more
shipments ("lần xuất hàng"), each grouping Book info (booking/B-L/vessel)
and Shipment (lot) info (LCL/FCL, invoice/declaration values, quantity,
weight). Cost info is deliberately deferred on the backend too. User
asked (in this frontend session) to build the FE for this feature.

## What changes

- New `Shipment`/`ShipmentFormValues`/`ShipmentType`/
  `ShipmentQuantityUnit` typedefs in `types/index.js`.
- `config/shipment-types.js` (`LCL`/`FCL` fixed set + labels, mirrors
  `contract-annex-types.js`), `config/shipment-quantity-units.js`
  (`Cont`/`Kien` fixed set + labels "Cont"/"Kiện"),
  `config/shipment-schema.js` (zod, mirrors
  `CreateShipmentCommandValidator`/`UpdateShipmentCommandValidator`:
  required `supplierCustomerId`/`bookingNumber`/`type`/`name`/
  `paymentCondition` (reuses the existing `PAYMENT_TYPES` set) plus all
  Shipment-info numeric fields > 0; `billOfLadingNumber`/`shippingLine`/
  `vesselName` optional; `invoiceCurrency`/`declarationCurrency`
  constrained to the curated `CURRENCY_CODES` shortlist, same choice as
  `contract-schema.js`'s `currency`).
- New `api/shipments.js`: list/create/update against the nested
  `/api/v1/contracts/{contractId}/shipments...` routes.
- New `hooks/use-shipments-query.js` (per-contract list query +
  create/update mutations), `hooks/use-shipment-form.js` (create-or-update
  form state, pulls `customers` from `useCustomersQuery` for the
  supplier picker — same pattern as `use-service-agreement-form.js`).
- New `components/shipment-fields.jsx` (two sections: "Thông tin Book",
  "Thông tin lô hàng" — no cost-info section, deferred), `components/shipment-form-dialog.jsx`.
- `components/contracts-list.jsx`: new `'shipment'` `ExpandedTab`, a
  "Xuất hàng" tab listing each shipment (`shipmentCode · name`, type +
  quantity + booking number + supplier, invoice value, edit button) with
  a "Thêm lần xuất hàng" button (unconditionally enabled — unlike
  `PaymentSchedule`, the backend doesn't gate shipment creation on the
  contract being signed), create/edit dialogs.

## Not changing

No client-side mirror of a signed-contract precondition — the backend
doesn't enforce one for `Shipment` (unlike `PaymentSchedule`), so there is
none to mirror. No cost-info UI — matches the backend, which explicitly
deferred it.
