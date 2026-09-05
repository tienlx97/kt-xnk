# Proposal: Polish Payment Editors

**Status:** done
**Created:** 2026-09-05

## Why

The editable payment schedule in Contract and payment history in Commission
are visually dense but inefficient to scan and operate. Important actions and
totals appear after the table, date controls are cramped, and the Contract
accordion keeps unrelated content expanded while users edit payment rows.

## What changes

- Focus the Contract dialog on one accordion section at a time.
- Give both payment grids compact rows, explicit sequence columns, and a
  toolbar above populated data.
- Keep add actions and running totals visible before the rows.
- Improve Commission payment-history date, amount, and note controls.
- Provide a guided empty state for Commission payment history.

## Out of scope

- Changing payment validation, calculations, API payloads, or persistence.
- Redesigning read-only payment history outside create/edit dialogs.
- Changing unrelated Contract or Commission fields.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-09-05 | Use the existing dense-table direction established by Shipment logistics costs | It keeps operational grids consistent while retaining Astryx primitives. |
