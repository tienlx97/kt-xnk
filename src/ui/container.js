import * as stylex from '@stylexjs/stylex';

import { spacing } from './tokens.stylex.js';

const styles = stylex.create({
  container: {
    marginInline: 'auto',
    maxWidth: 960,
    paddingInline: spacing.lg,
  },
});

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function Container({ children }) {
  return <div {...stylex.props(styles.container)}>{children}</div>;
}
