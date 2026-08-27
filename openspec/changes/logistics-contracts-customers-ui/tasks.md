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
