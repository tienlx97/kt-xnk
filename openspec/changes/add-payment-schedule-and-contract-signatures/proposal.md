# Proposal: Contract Signatures + Payment Schedules

**Status:** done
**Created:** 2026-09-03

## Why

BE-kt-xnk shipped `Contract.SellerSigned`/`BuyerSigned` and a full
`PaymentSchedule` CRUD (per-contract customer payment installments, system-
assigned `PaymentNumber`/computed `PaymentCode`) in
`../CLEAN ARCHITECTURE/openspec/changes/add-contract-signatures-and-payment-schedules/`.
Neither was wired into this frontend: `Contract`'s own `sellerSigned`/
`buyerSigned` were missing everywhere (the *annex*/*service-agreement*
versions of these flags already existed and are unrelated), and
`PaymentSchedule` had no types/api/hooks/components/UI at all. User asked
to check both the ContractBank feature (already present) and
PaymentSchedule (missing) and add whatever was missing.

The backend also added a hard rule mid-session (user follow-up: "Tôi
muốn chặn cứng" — hard-block it): creating a `PaymentSchedule` requires
`Contract.SellerSigned && Contract.BuyerSigned`, `400` otherwise. The
frontend mirrors this as a disabled "Thêm đợt thanh toán" button +
tooltip, not a duplicated schema rule (the check needs the parent
`Contract`, which the schema doesn't have access to).

## What changes

- `Contract`/`ContractFormValues` gain `sellerSigned`/`buyerSigned`
  (`types/index.js`, `config/contract-schema.js`, `hooks/use-contract-form.js`,
  `api/contracts.js`); `ContractFormDialog` gets two `CheckboxInput`s
  ("Bên bán ký"/"Bên mua ký"); `contracts-list.jsx`'s "Thông tin" tab shows
  them as "Đã ký"/"Chưa ký".
- New `PaymentSchedule`/`PaymentScheduleFormValues`/`PaymentType` typedefs;
  `config/payment-schedule-types.js` (`TT`/`LC` fixed set + Vietnamese
  labels, mirrors `contract-annex-types.js`) and
  `config/payment-schedule-schema.js` (zod, mirrors
  `contract-annex-schema.js`).
- New `api/payment-schedules.js`: list/create/update against the nested
  `/api/v1/contracts/{contractId}/payment-schedules...` routes.
- New `hooks/use-payment-schedules-query.js` (per-contract list query +
  create/update mutations) and `hooks/use-payment-schedule-form.js`
  (create-or-update form state) — both mirror the `ContractAnnex`
  equivalents.
- New `components/payment-schedule-fields.jsx` (DateInput + NumberInput +
  Selector + TextArea) and `components/payment-schedule-form-dialog.jsx`.
- `components/contracts-list.jsx`: per-contract payment-schedule query, its
  own "Đợt thanh toán khách" `ExpandedTab` (list + "Thêm đợt thanh toán"
  button, disabled with a tooltip unless `sellerSigned && buyerSigned`),
  create/edit dialogs. (Originally landed inside the "Thông tin" tab — see
  decision log entry below for the move to its own tab.)

## Out of scope

- No delete for `PaymentSchedule` (backend doesn't have one — explicit
  original ask: "không cần delete").
- No client-side duplication of the signed-contract precondition as a zod
  rule — enforced via a disabled button, with the backend's `400` as the
  actual source of truth (message surfaced via `api/payment-schedules.js`'s
  generic error path if ever reached anyway).

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-09-03 | Payment-schedule list/section placed inside the existing "Thông tin" tab (next to "Đợt thanh toán" payment *terms*), not a new `ExpandedTab` | Matches where `ContractAnnex`'s "Phụ lục" list already lives (pulled into "Thông tin" per an earlier session) — one info tab, not a proliferation of tabs. |
| 2026-09-03 | Reverted the above, same day: moved to its own `paymentSchedule` `ExpandedTab` (always visible, next to "Khách hàng", before "Service Agreement") | Explicit user follow-up request: "Đợt thanh toán khách hãy để 1 tab riêng" (put it in its own tab). |
