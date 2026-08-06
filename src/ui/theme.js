import { defineTheme } from '@astryxdesign/core/theme';

// Material Design 3 light-scheme role values for the kt-xnk brand. Tonal
// palettes were generated in CIE Lab space (tone = L*) from the brand seeds
// sampled off public/images/logo-dn-group.png: primary red #c2252a,
// secondary teal #247768 — see harness/PROGRESS.md (2026-08-06) for the full
// derivation and contrast verification. Light theme only, per
// openspec/project.md, so every token below is a single value rather than
// Astryx's [light, dark] tuple form.
export const ktxnkTheme = defineTheme({
  name: 'kt-xnk',
  tokens: {
    // Accent (brand red) — drives primary buttons, focus rings, links,
    // and accent-colored icons.
    '--color-accent': '#b91a24', // MD3 primary
    '--color-accent-muted': '#fddbd5', // MD3 primaryContainer
    '--color-on-accent': '#fffefd', // MD3 onPrimary
    '--color-text-accent': '#b91a24', // MD3 primary — was defaulting to theme-neutral's dark gray, not the brand red, for accent-colored text/links
    '--color-icon-accent': '#b91a24', // MD3 primary — same gap as text-accent

    // Surfaces
    '--color-background-body': '#fff8f7', // MD3 background
    '--color-background-surface': '#fcf1ef', // MD3 surfaceContainerLow
    '--color-background-card': '#f6ebea', // MD3 surfaceContainer
    '--color-background-popover': '#f1e6e4', // MD3 surfaceContainerHigh — popovers/menus sit above cards

    // Text & icons
    '--color-text-primary': '#211a19', // MD3 onSurface
    '--color-text-secondary': '#544340', // MD3 onSurfaceVariant
    '--color-icon-primary': '#211a19', // MD3 onSurface
    '--color-icon-secondary': '#544340', // MD3 onSurfaceVariant

    // Borders
    '--color-border': '#d7c2bf', // MD3 outlineVariant
    '--color-border-emphasized': '#857370', // MD3 outline

    // Error / destructive — kept distinct from --color-accent, same as the
    // MD3 palette's standalone error seed (see harness/PROGRESS.md)
    '--color-error': '#b4271f', // MD3 error
    '--color-on-error': '#fffefc', // MD3 onError
    '--color-error-muted': '#ffdbd3', // MD3 errorContainer

    // Deliberately left at Astryx/theme-neutral defaults: --color-success /
    // --color-warning (and their muted/on- pairs) — universal status-color
    // conventions (green/amber) read faster than a brand-consistent
    // reinterpretation would. Same for the categorical tag colors
    // (--color-*-blue/cyan/gray/green/orange/pink/purple/red/teal/yellow)
    // and structural tokens (--color-neutral, --color-overlay*, --color-skeleton,
    // --color-track, --color-shadow, --color-tint-hover) — these aren't
    // brand identity, changing them would just be surprising.
  },
  // Astryx's Button `variant` prop is an emphasis level, not a brand hue —
  // `variant="primary"` already resolves to --color-accent above, but
  // `variant="secondary"` defaults to a neutral gray (--color-neutral), not
  // our brand teal. Override it to MD3's secondaryContainer/
  // onSecondaryContainer pairing — the same tonal-button pattern MD3 itself
  // uses for a "secondary but still branded, lower emphasis than primary"
  // button — instead of writing a custom Button component.
  components: {
    button: {
      'variant:secondary': {
        backgroundColor: '#a1f2df', // MD3 secondaryContainer
        color: '#00201a', // MD3 onSecondaryContainer
      },
    },
  },
});
