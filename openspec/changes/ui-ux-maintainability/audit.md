# UI audit — 2026-09-05

## Baseline

Browser: local Next dev server and seeded backend, Admin session. Desktop
1440×900; mobile 390×844. Evidence: `harness/runs/20260905-ui-ux-review/`.

| Surface | Observed baseline | Action |
|---|---|---|
| Login | Fixed 400px content width in source | Constrain width to viewport |
| Home, Docs | Mobile document width 390px | Preserve approved shell |
| Admin, Users, Permissions | Mobile document width 390px; Admin redirects to Users | Improve nested user field rows |
| Logistics landing | Mobile document width 390px | Preserve navigation |
| Contracts | Mobile document width 390px; fullscreen date fields overlap internally | Responsive field groups |
| Shipments, Commissions, Customers | Mobile document width 390px; shared table shell | Shared table UX + field layout |
| Config, Countries, Places | Mobile document width 390px | Shared table UX |
| Contracts overview | Mobile document width 390px | Preserve route composition |
| Design system | Mobile document width 440px at 390px viewport | Inspect showcase overflow |
| Shared table | Empty-page navigation compares page 1 with totalPages 0 | Clamp pagination, recovery feedback |
| Advanced filters | Fixed control widths plus first-row spacer | Improve narrow layout |

Document width alone does not prove usable inner controls. Contract screenshot
`contract-mobile-before.png` confirms overlapping date inputs and fragmented
country labels despite no document overflow. API mutation workflows and all
permission combinations are not covered by this baseline navigation sweep.

## Component inventory

Before changes: contracts-list 1668 lines; advance-table 792; commissions-list
730; table-view-options-popover 696; contract-form-dialog 590; shipments-list
503; shipment-fields 490. Main issue is mixed responsibilities, not line count
alone. Extract expanded details, form sections, and reusable table footer and
search dialog; retain state ownership in orchestrating components.

## Design decisions

Keep brand/theme and established fullscreen workspace. Use Astryx Grid's
available-width reflow for form fields, with 240px minimum tracks and at most
two columns. Labels remain above fields. Keep table overflow local and make
empty/filter recovery explicit. Do not split every small leaf component.

## Discovered

Architecture/project documentation still describes a static marketing site and
omits auth/admin/logistics. Update current inventory during final documentation.
Existing library-generated Selector required ARIA needs separate diagnosis if
it remains in the final accessibility scan.

## Final verification

- Full gate passed: `harness/runs/20260905-145851-7541/`.
- 114/114 tests pass; dependency-cruiser: 515 modules, no violations.
- Shared JS gzip: 168.7 kB, below the 250 kB budget.
- Mobile sweep: 16 requested URLs, including the legacy Users/new redirect
  and a real Docs article. Every resulting page measured 390px document width
  at a 390px viewport; no Next error overlay was detected.
- Desktop sweep: 11 representative pages measured 1440px document width at
  1440px viewport. Screenshots: `final-desktop-*` in the evidence directory.
- Login: separate unauthenticated browser session, mobile screenshot inspected.
- Contract/User/Shipment form geometry: no overlapping/clipped controls in the
  checked sections; fullscreen submit action remained visible. Contract edit
  retained an unsaved project name when switching accordion sections.
- Contract info/Commission tabs and Commission edit dropdown were exercised.
  Mouse selection in the edit dialog worked after extraction.
- Column options: remove/add/restore exercised. Mobile popover now measures
  374px within 390px, with stacked scrollable panels and an opaque background.
- Search-to-empty/reset and date filter layout were exercised. Pagination
  zero/stale-page cases are covered by unit tests.

| Main file | Before | After |
|---|---:|---:|
| contracts-list.jsx | 1668 | 596 |
| contract-form-dialog.jsx | 590 | 138 |
| shipment-fields.jsx | 490 | 138 |
| table-view-options-popover.jsx | 696 | 288 |
| advance-table.jsx | 792 | 649 |

The extracted files are mapped in `docs/ui-components.md`. Line count is an
inventory measurement, not an arbitrary acceptance threshold.

### Limits

Navigation sweeps measure route rendering and document width, not every inner
state. Form checks used seeded local data and did not save business records.
All role/permission combinations, full create-save API round trips, production
Web Vitals, and line coverage were not measured. Browser axe commands returned
zero evaluated passes, so those results are inconclusive and are not counted
as accessibility certification. Existing MDX fixture tests remain in the full
gate; each fixture route was not manually reviewed. No claim of exhaustive
state coverage is made.
