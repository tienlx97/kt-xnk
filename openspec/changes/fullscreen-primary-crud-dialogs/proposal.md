# Proposal: Fullscreen Primary CRUD Dialogs

**Status:** done
**Created:** 2026-09-05

## Why

The Shipment create/edit flow established a useful full-viewport workspace for
large operational forms. Contract, Commission, and Admin User forms contain
similarly dense content, but still use constrained dialogs that provide less
working space and can shift or crowd controls as sections expand.

## What changes

- Use Astryx's native fullscreen dialog variant for create/edit Contract.
- Use the same fullscreen frame for create/edit Commission.
- Use the same fullscreen frame for create/edit User on `/admin/users`.
- Keep the header and action footer visible while the form content scrolls.

## Out of scope

- Redesigning form fields, sections, validation, or save behavior.
- Changing confirmation, password reset, quick-create, annex, or other dialogs.
- Updating unused legacy User form components outside the `/admin/users` flow.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-09-05 | Reuse the Shipment fullscreen shell pattern | It is already live-verified in this project and provides consistent dialog behavior. |
