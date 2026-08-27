# Proposal: Logistics Contracts + Customers UI

**Status:** done
**Created:** 2026-08-27

## Why

`BE-kt-xnk` shipped a full contract-management backend (`Contract` +
`Customer`/`NotifyPartyContact`/`ConsigneeContact`/`ContractBank` catalogs,
`logistics:contracts:view`/`manage` permissions) with no frontend consumer.
User asked for a Logistics side nav (`/logistics/contracts`,
`/logistics/customers`), a Contracts list with a create modal supporting
quick-add bank/customer, and a Customers list + add.

## What changes

- `sidebarLogistics.json` (new route tree) wired into
  `protected-app-shell.jsx`'s `SIDE_NAV_ROUTES`/`hasSelfManagedPadding` and
  `(protected)/layout.jsx`'s `sideNavRouteTrees` — `/logistics/*` gets the
  same 2-column side-nav layout `/admin/*` already has.
- `route-access.js` gains `/logistics/contracts`/`/logistics/customers`
  rules (`logistics:contracts:view`), ordered before the existing broader
  `/logistics` rule since `middleware.js` takes the first matching rule.
- New feature `src/features/logistics-contracts/`: `ContractsList` (table +
  Toolbar + create/edit `Dialog`), `CustomersList` (table + Toolbar + create
  `Dialog`). The Contract form covers header fields, Party A (pick an
  existing `Customer`, snapshotted server-side on save, or type one inline —
  both with a quick-add dialog), payment terms (repeatable rows, a live
  running-total `Badge` flags anything but 100%), and bank references
  (checklist of the `ContractBank` catalog + quick-add).
- Two new routes: `app/(protected)/logistics/{contracts,customers}/page.jsx`.

## Out of scope

- Notify Party/Consignee on the Contract form (sent as `null` — the backend
  accepts that) — not asked for yet.
- Standalone list pages for NotifyPartyContacts/ConsigneeContacts/
  ContractBanks — banks get create-only via the in-form quick-add, same as
  Company/Branch/Department/Position never getting their own admin-users
  list page.
- Delete/update on any of the 4 catalogs (matches the backend's own scope).
- Resolving a contract's `BranchId` to a human-readable name in edit mode
  (shown as the raw id) — no "get branch by id" endpoint exists; would need
  fetching every company's branches to find a match.
