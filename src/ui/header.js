import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';

import { Container } from './container.js';
import { colors, spacing } from './tokens.stylex.js';

/** @typedef {import('../types/index.js').NavLink} NavLink */

const styles = stylex.create({
  header: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
  bar: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBlock: spacing.md,
  },
  brand: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 700,
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: spacing.md,
  },
  link: {
    color: {
      default: colors.textMuted,
      ':hover': colors.text,
    },
    fontSize: 14,
    textDecoration: 'none',
  },
});

/**
 * @param {{ siteName: string, navLinks: NavLink[] }} props
 */
export function Header({ siteName, navLinks }) {
  return (
    <header {...stylex.props(styles.header)}>
      <Container>
        <div {...stylex.props(styles.bar)}>
          <Link href="/" {...stylex.props(styles.brand)}>
            {siteName}
          </Link>
          <nav {...stylex.props(styles.nav)}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...stylex.props(styles.link)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
