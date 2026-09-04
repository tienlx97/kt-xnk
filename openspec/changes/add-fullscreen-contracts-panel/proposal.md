# Proposal: Fullscreen toggle for the Contracts page

**Status:** done
**Created:** 2026-09-03

## Why

User idea (Vietnamese, with an annotated screenshot circling the page
content below the top nav): add a maximize button that, on click, makes
the circled content fill the whole viewport — covering both the top nav
and the side nav, not just growing within the content column.

## What changes

New `FullscreenPanel` (`src/shared/components/fullscreen-panel.jsx`) —
deliberately shared, not feature-local, so any page can opt a section
into this later, not just Contracts. Wraps `children` with a maximize/
restore `IconButton`. Maximized, the content is portalled to
`document.body` (`createPortal`) as a `position: fixed; inset: 0`
overlay above `ProtectedAppShell`'s header (z-index 40) — portalling out
of `<main>` is required, not just a high z-index, because `<main>` has
`isolation: isolate` (`protected-app-shell.jsx`), which traps any
`position: fixed` descendant's stacking order *below* the header's own
stacking context regardless of the z-index given to it. Escape key and
the restore button both exit; body scroll is locked while maximized
(same pattern as the mobile nav overlay in `protected-app-shell.jsx`).

`app/(protected)/logistics/contracts/page.jsx` wraps its existing
`PageContentShell` in `<FullscreenPanel label="danh sách hợp đồng">` —
the only page wired up so far, matching the screenshot.

## Not changing

No other page opted in yet — `FullscreenPanel` is generic and reusable,
but this change only wires it to Contracts, per what was actually shown.
