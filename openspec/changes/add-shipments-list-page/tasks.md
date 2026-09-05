# Tasks: Shipments List Page

- [x] 1.1 Add `listAllShipments` to `api/shipments.js` — verify: `pnpm run typecheck` passes.
- [x] 1.2 Add `hooks/use-shipments-list-query.js` — verify: lint clean.
- [x] 1.3 Build `components/shipments-list.jsx` (list + join + row expansion + contract-picker create flow) — verify: lint + typecheck clean.
- [x] 1.4 Export `ShipmentsList` from `features/logistics-contracts/index.js`.
- [x] 1.5 Add `app/(protected)/logistics/shipments/page.jsx`.
- [x] 1.6 Wire nav (`sidebarLogistics.json`) and route gating (`route-access.js`).
- [x] 1.7 Live-verify in browser: list loads with contract/forwarder columns resolved (`GET /api/v1/shipments` returns 200 with real data), create-via-contract-picker opens the right dialog, row expansion shows metadata + VGM, "Thêm VGM" dialog's `Selector` dropdown is mouse-clickable (no portal-stacking regression) — verify: `./harness/verify.sh` full pass + manual browser check, evidence `harness/runs/20260904-085546-700649/`.

## 2. Follow-up fix found during live verification

- [x] 2.1 `AdvanceTable` drops any `tableColumns` key not also declared in `columnOptions` — the originally-planned per-row "Sửa" icon column silently disappeared. Removed that column; added an optional `onEdit` prop to `ShipmentExpandedDetails` (unused by `contracts-list.jsx`, which keeps its own row-level icon on a plain, non-`AdvanceTable` `<Table>`) rendering a "Sửa Shipment" footer button, same spot pattern as `ContractExpandedDetails`'s "Sửa hợp đồng" — verify: live-clicked it, edit dialog opens pre-filled with the row's data.

## 3. Fullscreen create/edit experiment

- [x] 3.1 Render the shared `ShipmentFormDialog` as Astryx's fullscreen variant for both create and edit, make the form fill the viewport, and keep its tab body independently scrollable beneath a pinned header/footer — verify: `./harness/verify.sh` full pass and browser checks at 1272×573 and 390×844; evidence `harness/runs/20260905-shipment-fullscreen/` and `harness/runs/20260905-115256-6350/`.

## 4. Logistics costs table polish

- [x] 4.1 Separate vertical tab scrolling from the table's horizontal overflow, remove the clipped duplicate heading, move add/total into a compact toolbar, use compact table density, change Note to a one-row `TextArea`, and rebalance width toward Cost Category and Provider — verify: create-empty, create-with-row, and edit-with-row browser checks at 1272×573 plus `./harness/verify.sh`; evidence `harness/runs/20260905-shipment-cost-table/` and `harness/runs/20260905-120835-6570/`.
