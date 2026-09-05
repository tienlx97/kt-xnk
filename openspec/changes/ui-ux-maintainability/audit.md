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
