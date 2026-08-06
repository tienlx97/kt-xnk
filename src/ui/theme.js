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
});
