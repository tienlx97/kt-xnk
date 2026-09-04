# Tasks

- [x] 1.1 `src/shared/components/fullscreen-panel.jsx`: `FullscreenPanel`
      component — maximize/restore toggle, `createPortal` to
      `document.body`, Escape-to-close, body scroll lock
- [x] 1.2 `app/(protected)/logistics/contracts/page.jsx`: wrap
      `PageContentShell` in `FullscreenPanel`
- [x] 1.3 `pnpm lint` / `pnpm typecheck` clean (fixed one lint error:
      `useSyncExternalStore`-based hydration check instead of a
      setState-in-effect `isMounted` flag, mirroring `mdx/error-decoder
      .jsx`'s existing idiom); `./harness/verify.sh` full pass
- [x] 1.4 Live-verified 2026-09-03 in the browser on `/logistics/contracts`:
      maximize button appears top-right of the page content; clicking it
      hides the top nav and side nav entirely and the content fills the
      viewport; a table row still expands correctly while maximized;
      Escape restores the normal layout with nav and side nav back.
