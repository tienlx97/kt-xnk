import * as stylex from '@stylexjs/stylex';

// Light theme only — no dark-mode variant by design (see openspec/project.md).
export const colors = stylex.defineVars({
  background: '#ffffff',
  surface: '#f5f5f7',
  text: '#111114',
  textMuted: '#5b5b63',
  border: '#e2e2e6',
  accent: '#2f6feb',
  accentText: '#ffffff',
});

export const spacing = stylex.defineVars({
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
});
