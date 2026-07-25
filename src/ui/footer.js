import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from './tokens.stylex.js';
import { Container } from './container.js';

const styles = stylex.create({
  footer: {
    borderTopColor: colors.border,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    marginTop: spacing.xl,
    paddingBlock: spacing.lg,
  },
  text: {
    color: colors.textMuted,
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
