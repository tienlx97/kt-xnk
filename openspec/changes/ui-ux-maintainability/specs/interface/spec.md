# Interface and maintainability requirements

## Responsive forms

Field groups reflow with available width. At 390px wide, controls and submit
actions remain reachable; at desktop width paired fields retain two columns.

## Lists

Empty results explain the state and offer recovery when filtering is active.
Zero-result pagination cannot request page zero. Search and list actions remain
usable at mobile width.

## Refactoring

Named extracted components preserve form values, dialog ownership, query/API
contracts, and feature isolation. Edit dialogs remain outside expanded table
content, including after extraction.

## Verification

Record desktop/mobile screenshots and representative interactions. Run full
verification before marking tasks complete. Do not claim untested routes or
states have passed.
