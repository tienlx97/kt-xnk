# Proposal: UI/UX and component maintainability

**Status:** done
**Created:** 2026-09-05

## Why

The user requests a system-wide interface review, UX improvements, then smaller,
maintainable component files. Operational screens have grown beyond the site's
original documentation focus. Fixed form rows and large multi-purpose modules
make the experience harder to use on narrow screens and harder to change safely.

## What changes

- Audit every route family and shared UI; record evidence and prioritize findings.
- Improve responsive form layouts and shared table feedback/navigation.
- Extract cohesive form sections, detail panels, and table UI into named files
  within existing feature boundaries, preserving public exports and API behavior.
- Verify browser flows and the full gate, recording limitations explicitly.

## Out of scope

Backend/API changes, new business workflows, replacing Astryx, redesigning the
approved documentation theme, and changes to archived specifications.
