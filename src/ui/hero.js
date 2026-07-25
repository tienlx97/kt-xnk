import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from './tokens.stylex.js';

const styles = stylex.create({
  hero: {
    paddingBlock: spacing.xl,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 40,
    fontWeight: 800,
    margin: 0,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 18,
    marginTop: spacing.sm,
  },
});

/**
 * @param {{ title: string, subtitle?: string }} props
 */
export function Hero({ title, subtitle }) {
  return (
    <section {...stylex.props(styles.hero)}>
      <h1 {...stylex.props(styles.title)}>{title}</h1>
      {subtitle ? <p {...stylex.props(styles.subtitle)}>{subtitle}</p> : null}
    </section>
  );
}
