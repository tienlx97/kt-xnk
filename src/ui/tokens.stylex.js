import * as stylex from '@stylexjs/stylex';

// Light theme only — no dark-mode variant by design (see openspec/project.md).
// Brand hues sampled from public/images/logo-dn-group.png:
// primary red #c2252a, secondary teal #247768. All white-on-color pairings
// below are verified ≥ 4.5:1 contrast (WCAG AA for normal text).
export const colors = stylex.defineVars({
  // Neutrals
  background: '#ffffff',
  surface: '#f5f5f7',
  border: '#e2e2e6',
  borderStrong: '#c7c7cf',
  text: '#111114',
  textMuted: '#5b5b63',
  textOnPrimary: '#ffffff',
  textOnSecondary: '#ffffff',

  // Primary — brand red
  primary: '#c2252a',
  primaryHover: '#ab2125',
  primaryActive: '#971d21',
  primarySurface: '#fbf2f2',

  // Secondary — brand teal
  secondary: '#247768',
  secondaryHover: '#20695c',
  secondaryActive: '#1c5d51',
  secondarySurface: '#edf4f3',

  // Semantic states (aliased to brand hues where it makes sense)
  success: '#247768',
  warning: '#b45309',
  danger: '#c2252a',
  info: '#2f6feb',
});

export const spacing = stylex.defineVars({
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
});
