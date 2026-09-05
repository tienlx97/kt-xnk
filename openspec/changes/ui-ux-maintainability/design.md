# Design

Keep the established teal/red brand, light theme, typography, and Astryx tokens.
The audience is staff working with contracts, shipments, payments, and users.
Optimize for reading rows and completing forms with reachable actions.

Use available-width responsive Grid for field groups: two columns when there
is room, one on narrow forms. Tables retain horizontal scrolling within their
own boundary. Search, filter state, empty feedback, and pagination should give
clear recovery paths. Preserve pinned fullscreen form headers/footers.

Extract by responsibility, not arbitrary line count. List entrypoints compose
queries, table configuration, expanded panels, and sibling dialogs. Field
sections remain in their feature; reusable layout belongs in shared components.
Pure list metadata belongs in config. Keep existing feature public exports.
