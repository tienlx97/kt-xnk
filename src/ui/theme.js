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
    '--color-accent': '#b91a24', // MD3 primary
    '--color-background-body': '#fff8f7', // MD3 background
    '--color-background-surface': '#fcf1ef', // MD3 surfaceContainerLow
    '--color-background-card': '#f6ebea', // MD3 surfaceContainer
    '--color-text-primary': '#211a19', // MD3 onSurface
    '--color-text-secondary': '#544340', // MD3 onSurfaceVariant
    '--color-border': '#d7c2bf', // MD3 outlineVariant
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
