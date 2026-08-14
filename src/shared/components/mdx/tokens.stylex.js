import * as stylex from '@stylexjs/stylex';

// The MDX surface intentionally has no dependency on Astryx. These local
// StyleX variables bridge to the app theme's public CSS custom properties, so
// react.dev ports retain KT-XNK theming without importing Astryx token modules.
export const borderVars = stylex.defineVars({
  '--border-width': '1px',
});

export const colorVars = stylex.defineVars({
  '--color-accent': 'var(--color-accent)',
  '--color-accent-muted': 'var(--color-accent-muted)',
  '--color-background-muted': 'var(--color-background-muted)',
  '--color-border': 'var(--color-border)',
  '--color-icon-accent': 'var(--color-icon-accent)',
  '--color-text-accent': 'var(--color-text-accent)',
  '--color-text-primary': 'var(--color-text-primary)',
  '--color-text-secondary': 'var(--color-text-secondary)',
  '--color-warning': 'var(--color-warning)',
  '--color-warning-muted': 'var(--color-warning-muted)',
});

export const fontWeightVars = stylex.defineVars({
  '--font-weight-bold': '700',
  '--font-weight-medium': '500',
});

export const radiusVars = stylex.defineVars({
  '--radius-container': '12px',
  '--radius-element': '8px',
});

export const spacingVars = stylex.defineVars({
  '--spacing-0-5': '2px',
  '--spacing-1': '4px',
  '--spacing-2': '8px',
  '--spacing-3': '12px',
  '--spacing-4': '16px',
  '--spacing-5': '20px',
  '--spacing-6': '24px',
});

export const typographyVars = stylex.defineVars({
  '--font-family-body': 'var(--font-family-body)',
  '--font-family-heading': 'var(--font-family-heading)',
});
