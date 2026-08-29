# Tasks

- [x] 1.1 `sidebarLogistics.json` + `protected-app-shell.jsx` (`SIDE_NAV_ROUTES`,
      `hasSelfManagedPadding`) + `(protected)/layout.jsx` (`sideNavRouteTrees`)
- [x] 1.2 `route-access.js`: `/logistics/contracts`/`/logistics/customers`
      rules before the existing `/logistics` rule
- [x] 1.3 `src/features/logistics-contracts/`: types, config (incoterms,
      zod schemas), api (`contracts`, `customers`, `contract-banks`,
      `org-directory`), hooks (queries/mutations, `use-extra-field-rows`,
      `use-payment-term-rows`, `use-contract-form`, `use-customer-form`,
      `use-bank-form`)
- [x] 1.4 Components: `ContractsList`, `ContractFormDialog`,
      `PartyAFields`/`CustomerFields`/`BankFields`,
      `PaymentTermsFields`, `ExtraFieldsEditor`, `ContractBanksFields`,
      `QuickCreateCustomerDialog`/`QuickCreateBankDialog`, `CustomersList`,
      `CustomerFormDialog`
- [x] 1.5 Routes: `app/(protected)/logistics/{contracts,customers}/page.jsx`
- [x] 1.6 `api/contracts.test.js` (Party A payload branching:
      inline vs `SourceCustomerId`)
- [x] 1.7 `pnpm lint`/`typecheck`/`structure`/`test`/`build`/
      `quality-thresholds` all green; `./harness/verify.sh` 10/10
- [x] 1.8 Live browser verification against the local BE-kt-xnk Docker API
      (login, create customer, create contract with quick-add
      customer+bank, payment-terms-sum validation, Company→Branch cascade,
      edit prefill) — see `harness/PROGRESS.md` 2026-08-27 entry

## Amendment (same day): CommonDialog, currency display, optional branch

- [x] 1.9 `shared/components/common-dialog.jsx` (new, wraps Astryx
      `Dialog`: fixed top offset + centered + wider/taller defaults); all 4
      logistics-contracts dialogs switched to it
- [x] 1.10 `config/currencies.js` (`CURRENCY_CODES`, `formatMoney`);
      Currency Selector + live-formatted preview added to
      `ContractFormDialog`; `ContractsList`'s Giá trị column uses
      `formatMoney`
- [x] 1.11 "Chi nhánh" Selector made `isOptional` (was `isRequired`);
      `contract-schema.js`'s `branchId` rule relaxed to match;
      `api/contracts.js` sends `BranchId: values.branchId || null`
- [x] 1.12 Bug found and fixed: Astryx `NumberInput` defaults `step` to
      `1`, silently failing native HTML5 validation (no console error, no
      network request) for any decimal value and blocking form submission
      before React's `onSubmit` ran. Added `step={0.01}` to "Giá trị hợp
      đồng" and "Tỷ lệ (%)" (payment terms) — the only two `NumberInput`s
      in this feature that take fractional values
- [x] 1.13 `pnpm lint`/`typecheck`/`structure`/`test` (84, +1)/`build`/
      `quality-thresholds` green; `./harness/verify.sh` 10/10; live
      re-verification (dialog position/size, formatted money preview,
      branch-less contract creation with a decimal value) — see
      `harness/PROGRESS.md`'s second 2026-08-27 entry

## Amendment (same day): dialog UI polish + real-time duplicate contract-number check

- [x] 1.14 `ContractFormDialog`: "Giá trị hợp đồng" formats inline via
      `NumberInput`'s `units` prop instead of a separate `Text` preview;
      "Đơn vị tiền tệ" `Selector` shrunk to a fixed 120px; "Thông tin chung"
      turned into a `FormSection` inside the same `CollapsibleGroup` as the
      other three sections (was a fixed, non-collapsible `Card`)
- [x] 1.15 `PaymentTermsFields` gained a "Thành tiền" column per row
      (`contractValue × paymentRatioPercent / 100`, `formatMoney`) —
      derived/read-only, not sent in the payload
- [x] 1.16 Backend (`BE-kt-xnk`, sibling repo): new
      `GET /api/v1/contracts/exists?contractNumber=&excludeContractId=` →
      `{ exists }`, gated `logistics:contracts:view` (any scope — not
      branch-scoped, `ContractNumber` uniqueness is system-wide). See that
      repo's `openspec/changes/add-contract-number-exists-endpoint/` and its
      own `PROGRESS.md` entry.
- [x] 1.17 `api/contracts.js`: `checkContractNumberExists`; new
      `hooks/use-contract-number-exists-query.js` (400ms debounce +
      `useQuery`); `use-contract-form.js` wires it into
      `fieldStatuses.contractNumber` (schema errors win) and exposes
      `isCheckingContractNumber` for the field's `isLoading` spinner
- [x] 1.19 `customer-fields.jsx`: new `isCollapsible` prop (default `false`)
      gates Người đại diện/Chức vụ/Địa chỉ/`ExtraFieldsEditor` behind a
      `useCollapsible`-driven toggle button; enabled from
      `party-a-fields.jsx`'s two `CustomerFields` call sites only — the
      standalone Customers-page dialog and quick-create dialog keep the
      full flat form
- [x] 1.20 `party-a-fields.jsx`/`contract-schema.js`: dropped the
      free-typed "no customer selected → type a company name inline"
      fallback — Party A must now reference a catalog `Customer` (pick or
      "Thêm khách hàng"), since it duplicated the quick-create button.
      Schema's Party-A `.refine` simplified to `Boolean(sourceCustomerId)`;
      added an edit-mode hint for a pre-existing catalog-less Party A
      (backend still accepts one, just not offered here anymore)
- [x] 1.21 `pnpm lint`/`typecheck`/`structure`/`test` (83/83) green.
      **Not** live-tested against a running dev server + BE-kt-xnk API this
      session — static verification only, see `harness/PROGRESS.md`
- [x] 1.22 `NumberInput` "Giá trị hợp đồng": format giá trị đã commit theo
      mẫu `xxx,yyy.zz`; tái sử dụng một `Intl.NumberFormat` và kiểm thử các ca
      phân cách hàng nghìn, hai chữ số thập phân, làm tròn, currency và giá
      trị không hữu hạn
- [x] 1.23 Table Hợp đồng: click/Enter/Space trên một row để mở panel chi
      tiết full-width ngay bên dưới; mỗi lần chỉ mở một hợp đồng, dùng lại các
      trường đang có và giữ action Sửa độc lập với thao tác expand
