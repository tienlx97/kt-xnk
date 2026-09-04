# Tasks

- [x] 1.1 `types/index.js`: new `ShipmentType`/`ShipmentQuantityUnit`/
      `Shipment`/`ShipmentFormValues` typedefs
- [x] 1.2 `config/shipment-types.js`, `config/shipment-quantity-units.js`
      (fixed sets + labels), `config/shipment-schema.js` (zod)
- [x] 1.3 New `api/shipments.js` (list/create/update against
      `/api/v1/contracts/{contractId}/shipments...`)
- [x] 1.4 New `hooks/use-shipments-query.js` (list query + create/update
      mutations), `hooks/use-shipment-form.js` (create-or-update form
      state + customers for the supplier picker)
- [x] 1.5 New `components/shipment-fields.jsx` (Book info + Shipment/lot
      info sections), `components/shipment-form-dialog.jsx`
- [x] 1.6 `components/contracts-list.jsx`: `'shipment'` `ExpandedTab`,
      "Xuất hàng" tab (list + "Thêm lần xuất hàng" button, unconditionally
      enabled), create/edit dialogs
- [x] 1.7 `pnpm lint` / `pnpm typecheck` clean; `./harness/verify.sh` full
      pass
- [x] 1.8 `harness/PROGRESS.md` entry
- [x] 1.9 Live-verified 2026-09-03. First pass hit a 404 (backend hadn't
      deployed `/shipments` yet — see PROGRESS.md history). Re-tested
      after the backend deployed it: (a)/(b) confirmed as before. (c)
      confirmed — created a shipment on `26KCTLIVE01`, backend assigned
      `26KCTLIVE01/SHP-01`, row shows `FCL · 3 Kiện · Booking BOOK-LIVE-002
      · Broker2 1788276513` + `60,000.00 VND`, matching
      type/quantity/booking/supplier/invoice-value. (d) confirmed — the
      edit dialog pre-fills every field, including all four `Selector`s
      (Nhà cung cấp, Loại hình, Điều kiện thanh toán, currency ×2).
