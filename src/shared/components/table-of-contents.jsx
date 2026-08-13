import { Heading } from '@astryxdesign/core/Heading';
import {
  colorVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';

/** @typedef {import('../api/toc.js').TocItem} TocItem */

const styles = stylex.create({
  toc: {
    display: {
      default: 'block',
      '@media (max-width: 1023px)': 'none',
    },
    fontFamily: 'var(--font-family-body)',
    maxHeight: 'calc(100vh - var(--appshell-header-height, 0px) - 48px)',
    overflowY: 'auto',
    position: 'sticky',
    top: 'calc(var(--appshell-header-height, 0px) + 24px)',
  },
  heading: {
    color: colorVars['--color-text-secondary'],
    fontFamily: 'var(--font-family-body)',
    fontSize: '0.8125rem',
    fontWeight: fontWeightVars['--font-weight-bold'],
    letterSpacing: '0.025em',
    lineHeight: 1.5,
    margin: 0,
    marginBlockEnd: spacingVars['--spacing-3'],
    paddingInline: spacingVars['--spacing-4'],
    textTransform: 'uppercase',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    margin: 0,
    padding: 0,
  },
  link: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-background-muted'],
    },
    borderRadius: `${radiusVars['--radius-container']} 0 0 ${radiusVars['--radius-container']}`,
    color: colorVars['--color-text-secondary'],
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: fontWeightVars['--font-weight-normal'],
    lineHeight: 1.5,
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    paddingBlock: spacingVars['--spacing-1'],
    paddingInline: spacingVars['--spacing-2'],
    textDecoration: 'none',
  },
});

/**
 * React Docs-style right-rail table of contents. Its 13px UI typography stays
 * independent from the 17px article body scale.
 * @param {{ items: TocItem[] }} props
 */
export function TableOfContents({ items }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Mục lục" {...stylex.props(styles.toc)}>
      <Heading level={2} accessibilityLevel={2} xstyle={styles.heading}>
        Mục lục
      </Heading>
      <ul {...stylex.props(styles.list)}>
        {items.map((item) => (
          <li key={item.href} {...stylex.props(styles.item)}>
            <Link href={item.href} {...stylex.props(styles.link)}>
              {item.value}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
