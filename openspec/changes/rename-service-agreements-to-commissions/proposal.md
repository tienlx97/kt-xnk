# Rename Service Agreements to Commissions

## Why

The backend resource and API have been renamed from `ServiceAgreement` to
`Commission`. The frontend must use the same terminology and routes so the
logistics screens continue to load and mutate the resource.

## What changes

- Rename frontend types, APIs, hooks, schemas, components, and state from
  Service Agreement to Commission.
- Move the standalone page from `/logistics/service-agreements` to
  `/logistics/commissions` and update navigation/access configuration.
- Call `/api/v1/commissions` and contract-scoped `/commission` endpoints.
- Consume `commissionId` on annex responses and display Commission wording.

## Compatibility

This follows the backend's intentional breaking rename; the old frontend URL
and old backend routes are removed rather than aliased.

