import { colorVars, spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  outer: {
    paddingBlockStart: {
      default: '40px',
      '@media (min-width: 768px)': '48px',
      '@media (min-width: 1024px)': '40px',
    },
    paddingInline: {
      default: '20px',
      '@media (min-width: 640px)': '48px',
    },
  },
  divider: {
    borderBlockStartColor: colorVars['--color-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: '1px',
    margin: 0,
    marginInline: 'auto',
    maxWidth: '80rem',
  },
  content: {
    color: colorVars['--color-text-secondary'],
    fontFamily: 'var(--font-family-body)',
    fontSize: '0.875rem',
    marginInline: 'auto',
    maxWidth: '80rem',
    paddingBlock: {
      default: spacingVars['--spacing-12'],
      '@media (min-width: 768px)': '64px',
      '@media (min-width: 1024px)': '56px',
    },
  },
  copyright: {
    margin: 0,
  },
});

/**
 * @param {{ siteName: string, year: number }} props
 */
export function Footer({ siteName, year }) {
  return (
    <footer {...stylex.props(styles.outer)}>
      <hr {...stylex.props(styles.divider)} />
      <div {...stylex.props(styles.content)}>
        <p {...stylex.props(styles.copyright)}>
          © {year} {siteName}
        </p>
      </div>
    </footer>
  );
}
