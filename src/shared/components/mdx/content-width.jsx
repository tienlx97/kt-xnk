import { spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  maxWidth: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-4'],
    marginInline: {
      default: 0,
      '@media (min-width: 1536px)': 'auto',
    },
    maxWidth: '56rem',
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
});

/** @param {{ children: import('react').ReactNode }} props */
export function MaxWidth({ children }) {
  return (
    <div data-mdx-prose {...stylex.props(styles.maxWidth)}>
      {children}
    </div>
  );
}

/** @param {{ children: import('react').ReactNode }} props */
export function FullWidth({ children }) {
  return (
    <div data-mdx-full-width {...stylex.props(styles.fullWidth)}>
      {children}
    </div>
  );
}
