'use client';

import { Dialog } from '@astryxdesign/core/Dialog';

/**
 * Shared `Dialog` wrapper so every form dialog in the app opens at the same
 * fixed distance from the top of the viewport instead of Astryx's default
 * vertical centering — a dialog whose height changes as sections expand/
 * collapse (see e.g. `ContractFormDialog`) visibly jumps up and down when
 * centered; anchoring `top` keeps it still. Also centralizes the "wider and
 * taller than the Astryx default (400×75vh)" sizing the user asked for, so
 * every dialog in the app shares one policy instead of each feature picking
 * its own numbers.
 *
 * A thin pass-through over Astryx `Dialog` — every other prop (`purpose`,
 * `variant`, etc.) is forwarded as-is; callers still render their own
 * `Layout`/`DialogHeader`/`LayoutContent`/`LayoutFooter` structure inside it
 * exactly as they would inside a bare `Dialog`.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   children: import('react').ReactNode,
 *   width?: number | string,
 *   maxHeight?: number | string,
 *   topOffset?: number | string,
 *   purpose?: 'required' | 'form' | 'info',
 * } & Record<string, unknown>} props
 */
export function CommonDialog({
  isOpen,
  onOpenChange,
  children,
  width = 720,
  maxHeight = '85vh',
  topOffset = 72,
  purpose = 'form',
  ...rest
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      purpose={purpose}
      width={width}
      maxHeight={maxHeight}
      // Astryx's `position` prop replaces the default centering
      // `margin: auto` with `margin: 0` the moment any position is given
      // (see `Dialog.tsx`'s `dynamicStyles.position`) — fine for corner
      // anchoring, but we want top-anchored *and* horizontally centered.
      // Pinning both logical insets to 0 and restoring `marginInline: auto`
      // via `style` (inline styles win over the component's stylex class)
      // re-centers it without touching `transform`, which the open/close
      // animation already animates — overriding that in `style` would fight
      // the animation instead of just the resting position.
      position={{ top: topOffset, start: 0, end: 0 }}
      style={{ marginInline: 'auto' }}
      {...rest}
    >
      {children}
    </Dialog>
  );
}
