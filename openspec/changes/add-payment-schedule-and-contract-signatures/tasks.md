# Tasks

- [x] 1.1 `types/index.js`: `Contract`/`ContractFormValues` gain
      `sellerSigned`/`buyerSigned`; new `PaymentType`/`PaymentSchedule`/
      `PaymentScheduleFormValues` typedefs
- [x] 1.2 `config/contract-schema.js`: add `sellerSigned`/`buyerSigned`
      (`z.boolean()`); new `config/payment-schedule-types.js` (fixed
      `TT`/`LC` set + labels), `config/payment-schedule-schema.js` (zod)
- [x] 1.3 `hooks/use-contract-form.js`: thread `sellerSigned`/
      `buyerSigned` through `emptyValues`/`valuesFromContract`;
      `api/contracts.js`: send `SellerSigned`/`BuyerSigned`
- [x] 1.4 New `api/payment-schedules.js` (list/create/update against
      `/api/v1/contracts/{contractId}/payment-schedules...`)
- [x] 1.5 New `hooks/use-payment-schedules-query.js` (list query +
      create/update mutations), `hooks/use-payment-schedule-form.js`
      (create-or-update form state)
- [x] 1.6 New `components/payment-schedule-fields.jsx`,
      `components/payment-schedule-form-dialog.jsx`; `contract-form-dialog.jsx`
      gets `sellerSigned`/`buyerSigned` `CheckboxInput`s
- [x] 1.7 `components/contracts-list.jsx`: signed-flags display, per-contract
      payment-schedule query, "Đợt thanh toán khách" section (list +
      disabled-unless-fully-signed "Thêm" button), create/edit dialogs;
      skeleton-row fixture updated for the two new required `Contract` fields
- [x] 1.8 Update existing tests for the two new `Contract` fields
      (`contract-schema.test.js`, `api/contracts.test.js`); new
      SellerSigned/BuyerSigned round-trip test
- [x] 1.9 `pnpm lint` / `pnpm typecheck` / `pnpm test` clean;
      `./harness/verify.sh` full pass
- [x] 1.10 `harness/PROGRESS.md` entry
