# Proposal: Contract Annex Tab

**Status:** done
**Created:** 2026-09-01

## Why

BE-kt-xnk shipped `ContractAnnex` (`openspec/changes/add-contract-annexes/`
in the API repo): a per-contract amendment record (amount increase/decrease
or value change) with system-assigned sequential numbering and a computed
`annexCode`. The frontend's expanded contract row has no way to see or
manage them yet. User request: add an "Annex" tab to the contract row's
expanded-details `TabList`, enabled only when the contract has at least
one annex, disabled otherwise.

## What changes

- New `ContractAnnex`/`ContractAnnexFormValues` typedefs
  (`types/index.js`).
- New `config/contract-annex-types.js` (fixed `AmountIncrease`/
  `AmountDecrease`/`ValueChange` set + Vietnamese labels, mirrors
  `incoterms.js`) and `config/contract-annex-schema.js` (zod, mirrors
  `contract-bank-schema.js`).
- New `api/contract-annexes.js`: `listContractAnnexes(contractId)`,
  `createContractAnnex(contractId, values)`,
  `updateContractAnnex(contractId, annexId, values)` — nested under
  `/api/v1/contracts/{contractId}/annexes...`, unlike every other catalog
  here which is flat.
- New `hooks/use-contract-annexes-query.js` (per-contract list query,
  keyed by `contractId`, `enabled` only once one exists) and
  `hooks/use-contract-annex-form.js` (create-or-update form state,
  mirrors `use-country-form.js`; `annexNumber`/`annexCode` never appear in
  form values — backend-assigned).
- New `components/contract-annex-fields.jsx` (Selector + NumberInput +
  DateInput + 2 CheckboxInputs) and
  `components/contract-annex-form-dialog.jsx` (create/edit, mirrors
  `country-form-dialog.jsx`).
- `components/contracts-list.jsx`: `ExpandedTab` gains `'annex'`;
  `ContractExpandedDetails` fetches that contract's annexes
  (`useContractAnnexesQuery(contract.id)`, only runs while the row is
  expanded) and renders a new "Phụ lục" `Tab` with an `endContent` count,
  `aria-disabled` when the contract has zero annexes, and a guard in the
  `TabList`'s `onChange` that refuses to switch to it while disabled (an
  `aria-disabled` button still fires `onClick` — Astryx's `Tab` has no
  built-in disabled/blocking behavior, see `Tab.tsx`). A `List` of annexes
  (code, type, amount, signed date, buyer/seller-signed) with a per-row
  edit `IconButton`. A "Thêm phụ lục" `Button` lives in the panel's bottom
  action row — always enabled, independent of the tab's disabled state,
  since disabling the tab would otherwise make it impossible to ever
  create the *first* annex through this UI.

## Scope decisions

- **No delete**: the backend deliberately doesn't support it yet
  (`add-contract-annexes` proposal.md, BE-kt-xnk) — nothing to wire here.
- **Tab disabling is app-level, not a Tab prop**: `@astryxdesign/core`'s
  `Tab` renders a plain `<button>` with no `isDisabled`/`disabled` prop in
  its type (unlike `Button`/`CheckboxInput`); `aria-disabled` only changes
  the CSS cursor, the click handler still fires. Blocking the actual
  switch happens in `TabList`'s `onChange` instead.
- **Create/edit dialog is separate from the "info" tab's other
  dialogs**: annexes get their own `ContractAnnexFormDialog` rather than
  extending `ContractFormDialog`, since an annex is a distinct backend
  resource (own id, own endpoint) rather than a field on `Contract`.

## Out of scope

- Any backend change (already shipped, `add-contract-annexes` in the API
  repo).
- A standalone Annexes page — annexes only make sense in the context of
  one contract, so there is no flat catalog list akin to Country/Seller.
