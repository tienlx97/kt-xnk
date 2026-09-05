# ADR-0005: Split UI by responsibility within feature boundaries

Date: 2026-09-05
Status: accepted

## Context

The user requested a large interface review followed by smaller, maintainable
components. ContractsList had reached 1668 lines, combining list configuration,
expanded tabs, tables, queries, and edit-dialog ownership. Repeated fixed form
rows also caused internal clipping at mobile widths.

## Decision

Keep each feature's public index and existing API/form controllers. Split UI
into list orchestration, expanded detail panels, named tabs, and field sections.
Move static column/filter/skeleton definitions to the feature's config layer.
Shared FormGrid and FormSection own repeated form layout. AdvanceTable composes
separate search dialog, pagination, and column-configuration components.

Keep edit dialogs outside table expansion DOM (ADR-0004). Form values remain
in existing controllers; extracted fields receive controlled values/callbacks.
Transient drag state belongs to the column panel, while selected columns and
density remain in the parent table. Do not split small leaf components merely
to reach a line-count target.

## Consequences

More named files make responsibility and navigation explicit. Some orchestration
files remain several hundred lines because they coordinate multiple workflows;
future changes can extract a cohesive behavior when needed. Typecheck,
dependency-cruiser, existing API/unit tests, browser interactions, and the form
geometry probe protect behavior and boundaries. No API contract is changed.

This ADR records the implemented decision; it was written during final review,
after extraction. Future large refactors should record the decision before edits,
as required by `harness/ENTROPY.md`.
