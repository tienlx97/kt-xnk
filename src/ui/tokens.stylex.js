import * as stylex from '@stylexjs/stylex';

// Light theme only — no dark-mode variant by design (see openspec/project.md).
// Role names and tone mapping follow Material Design 3 (light scheme):
// https://m3.material.io/styles/color/roles
//
// Seeds sampled from public/images/logo-dn-group.png: primary red #c2252a,
// secondary teal #247768. Tertiary (#7d6a02) is derived by rotating the
// primary hue +60° in CIE Lab space; error (#b3261e) is a standalone seed so
// brand red and "something failed" red stay visually distinct. Each seed was
// expanded into a 13-stop tonal palette in Lab space (tone = L*, hue/chroma
// held constant) so the tone→role mapping below (e.g. primary = tone 40,
// primaryContainer = tone 90) keeps ≥ 4.5:1 contrast (WCAG AA) on every
// on-color pairing, regardless of hue.
export const colors = stylex.defineVars({
  // Primary — brand red
  primary: '#b91a24',
  onPrimary: '#fffefd',
  primaryContainer: '#fddbd5',
  onPrimaryContainer: '#3e0500',

  // Secondary — brand teal
  secondary: '#126a5c',
  onSecondary: '#fdffff',
  secondaryContainer: '#a1f2df',
  onSecondaryContainer: '#00201a',

  // Tertiary — derived accent (+60° hue from primary)
  tertiary: '#6e5d04',
  onTertiary: '#fffffc',
  tertiaryContainer: '#fee17f',
  onTertiaryContainer: '#221b00',

  // Error — standalone seed, kept distinct from brand primary
  error: '#b4271f',
  onError: '#fffefc',
  errorContainer: '#ffdbd3',
  onErrorContainer: '#3a0b00',

  // Surfaces & background
  background: '#fff8f7',
  onBackground: '#211a19',
  surface: '#fff8f7',
  onSurface: '#211a19',
  surfaceVariant: '#f3dedb',
  onSurfaceVariant: '#544340',
  surfaceDim: '#e2d8d6',
  surfaceBright: '#fff8f7',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#fcf1ef',
  surfaceContainer: '#f6ebea',
  surfaceContainerHigh: '#f1e6e4',
  surfaceContainerHighest: '#ebe0de',

  // Outlines, inverse & scrim
  outline: '#857370',
  outlineVariant: '#d7c2bf',
  inverseSurface: '#372f2d',
  inverseOnSurface: '#f9eeed',
  inversePrimary: '#ffb4a9',
  shadow: '#070000',
  scrim: '#070000',
});

export const spacing = stylex.defineVars({
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
});
