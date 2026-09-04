# Tasks

- [x] 1.1 `config/shipment-quantity-units.js`: `quantityUnitForShipmentType`
- [x] 1.2 `shipment-schema.js`/`use-shipment-form.js`: drop `quantityUnit`
- [x] 1.3 `api/shipments.js`: split into `toCreateRequestBody`/
      `toUpdateRequestBody`, neither sends `quantityUnit`, only create
      sends `Type`
- [x] 1.4 `shipment-fields.jsx`: derived unit as `units` suffix on "Số
      lượng"; "Loại hình" disabled when `isEditing`
- [x] 1.5 `shipment-form-dialog.jsx`: pass `isEditing` through
- [x] 1.6 `contracts-list.jsx`: Shipment table supplier column header →
      "Forwarder"
- [x] 1.7 `pnpm lint` / `pnpm typecheck` clean; `./harness/verify.sh`
      full pass
- [x] 1.8 Live-verified 2026-09-04 against the local Docker backend on
      `26KCTLIVE01`: new LCL shipment showed "Kiện" unit live as LCL was
      picked, saved as `26KCTLIVE01/LCL-01` / "10 Kiện"; pre-existing FCL
      shipment re-rendered as `26KCTLIVE01/LOT-01` / "3 Cont" (was
      `SHP-01`); edit dialog showed "Loại hình" disabled.
