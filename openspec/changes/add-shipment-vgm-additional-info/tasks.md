# Tasks

- [x] 1.1 `types/index.js`: `ShipmentVgm`/`ShipmentVgmFormValues` gain
      `packingDate`/`plannedPackingTime`/`actualPackingTime`/
      `truckArrivalTime`/`carrierCustomerId`/`note`
- [x] 1.2 `config/shipment-vgm-schema.js`: validation for the six fields
- [x] 1.3 `api/shipment-vgms.js`: `toRequestBody` sends the six fields;
      `withSeconds()` normalizer for `TimeInput`'s `HH:MM` → backend's
      required `HH:MM:SS`
- [x] 1.4 `hooks/use-shipment-vgm-form.js`: emptyValues/valuesFromVgm +
      `customersQuery` for the carrier picker
- [x] 1.5 `components/shipment-vgm-fields.jsx`: "Thông tin bổ sung"
      section (`DateInput`, `Selector`, 3×`TimeInput`, `TextArea`)
- [x] 1.6 `components/shipment-vgm-form-dialog.jsx`: pass `customers`
      through
- [x] 1.7 `components/shipment-expanded-details.jsx` +
      `components/contracts-list.jsx`: inline VGM table gains "Ngày đóng
      hàng"/"Nhà cung cấp vận chuyển" columns, `customersById` threaded
      down as a new prop
- [x] 1.8 `pnpm lint` / `pnpm typecheck` clean; `./harness/verify.sh` full
      pass
- [x] 1.9 `harness/PROGRESS.md` entry
- [x] 1.10 Live-verified 2026-09-03 against the local Docker backend, on
      contract `26KCTLIVE01` / shipment `SHP-01`: (a) "Thêm VGM" dialog
      renders all six new fields correctly, including live Gross
      weight/VGM preview. (b) First submit attempt failed with a generic
      "Không thể thêm VGM" error — traced via direct `fetch()` calls to
      the backend's `TimeOnly?` JSON binding rejecting bare `HH:MM`; fixed
      in `api/shipment-vgms.js`. (c) Confirmed the fix live: `POST` via
      raw `fetch()` returned `201` with `HH:MM:SS`; re-submitted through
      the actual UI form afterward — dialog closed, new row appeared
      inline with the correct date/carrier. (d) Edit dialog re-opened on
      the new row: every field, including all three times, pre-filled
      correctly. (e) Delete confirmation removed the row. (f) The
      pre-existing VGM row (backfilled by the backend migration's
      "Unknown" placeholder customer) rendered correctly in the new table
      columns too.
