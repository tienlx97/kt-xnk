# Proposal: Shipments List Page

**Status:** done
**Created:** 2026-09-04

## Why

A UX review of the Contracts/Customers screens (this session) flagged
the per-contract expanded row in `contracts-list.jsx` as overloaded: 6
tabs (Info/Seller/Customer/Payment Schedule/Shipment/Service Agreement),
each with its own nested CRUD, plus an existing workaround for a
`Selector`-in-dialog portal-stacking bug tied to that nesting. User asked
to split the "Shipment" tab into its own top-level page, mirroring the
precedent already set by Service Agreement's standalone
`/logistics/service-agreements` page. BE-kt-xnk already exposes a
system-wide, paginated `GET /api/v1/shipments` endpoint (confirmed by
user against the backend docs), so — like Service Agreement — this is a
pure FE addition with no backend dependency.

## What changes

- New `api/shipments.js` function `listAllShipments({ page, pageSize })`
  against `GET /api/v1/shipments` (system-wide, not contract-scoped),
  same success/message wrapper shape as `listServiceAgreements`.
- New `hooks/use-shipments-list-query.js` (`useShipmentsListQuery`) —
  kept as a separate file/hook from the existing per-contract
  `useShipmentsQuery` (`use-shipments-query.js`), since that name is
  already taken by the per-contract list.
- New `components/shipments-list.jsx` (`ShipmentsList`): flat,
  paginated, searchable table of every Shipment across every contract,
  columns joined client-side against `useContractsQuery`/
  `useCustomersQuery` for `contractNumber`/`projectName`/forwarder name
  (same join pattern as `service-agreements-list.jsx`). Row expansion
  reuses the existing `ShipmentExpandedDetails` unchanged. A "Thêm
  Shipment" button opens a small contract-picker step (`Selector`, new
  UI pattern — Service Agreement's standalone page never needed one
  since it has no create button at all) before the existing
  `ShipmentFormDialog`. Editing happens via a "Sửa Shipment" button in
  the expanded row's footer — a new optional `onEdit` prop on
  `ShipmentExpandedDetails` (left unused by `contracts-list.jsx`) —
  rather than a persistent per-row icon column, since `AdvanceTable`
  silently drops any `tableColumns` key not also declared in
  `columnOptions` (discovered live; no other `AdvanceTable`-based list in
  this app has one either).
  `ShipmentFormDialog`/`ShipmentVgmFormDialog` are rendered as siblings
  of `AdvanceTable`, never inside `renderExpanded` — deliberately
  following `contracts-list.jsx`'s proven-safe pattern for the
  Selector-portal-stacking bug, not `service-agreements-list.jsx`'s
  pattern (which renders its own Selector-bearing dialogs inside
  `renderExpanded` and likely carries the same latent bug, left
  unfixed as out of scope here).
- New route `src/app/(protected)/logistics/shipments/page.jsx`
  (structural clone of `logistics/service-agreements/page.jsx`).
- `src/sidebarLogistics.json`: new "Shipment" nav entry.
- `src/shared/config/route-access.js`: new `/logistics/shipments` rule,
  same permission as `/logistics/contracts`.
- `src/features/logistics-contracts/index.js`: export `ShipmentsList`.

## Out of scope

- The "Shipment" tab inside a contract's own expanded row
  (`contracts-list.jsx`) is unchanged — both entry points coexist, same
  as Service Agreement's tab + standalone page.
- No delete affordance for Shipment (backend doesn't support it, same
  parity note as `add-contract-shipments`).
- Not fixing the latent Selector-portal-stacking risk already present in
  `service-agreements-list.jsx`'s own expanded-row dialogs — noted, not
  touched.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-09-04 | Standalone page gets a contract-picker create flow (unlike Service Agreement, which has none) | User explicitly asked for it despite no code precedent |
