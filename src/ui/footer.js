import * as stylex from '@stylexjs/stylex';

import { Container } from './container.js';
import { colors, spacing } from './tokens.stylex.js';

const styles = stylex.create({
  footer: {
    borderTopColor: colors.outlineVariant,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    marginTop: spacing.xl,
    paddingBlock: spacing.lg,
  },
  text: {
    color: colors.onSurfaceVariant,
    fontSize: 13,
  },
});

/**
 * @param {{ siteName: string, year: number }} props
 */
export function Footer({ siteName, year }) {
  return (
    <footer {...stylex.props(styles.footer)}>
      <Container>
        <p {...stylex.props(styles.text)}>
          © {year} {siteName}
        </p>
      </Container>
    </footer>
  );
}
