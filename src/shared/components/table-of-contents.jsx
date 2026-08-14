'use client';

import {
  colorVars,
  fontWeightVars,
  spacingVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useMemo } from 'react';

import { useTocHighlight } from '../hooks/use-toc-highlight.js';

/** @typedef {import('../api/toc.js').TocItem} TocItem */

const styles = stylex.create({
  toc: {
    display: {
      default: 'none',
      '@media (min-width: 1536px)': 'block',
    },
    fontFamily: 'var(--font-family-body)',
    insetInlineEnd: 0,
    marginBlockStart: `calc(-1 * (${spacingVars['--spacing-12']} + ${spacingVars['--spacing-4']}))`,
    paddingBlockStart: `calc(${spacingVars['--spacing-12']} + ${spacingVars['--spacing-8']})`,
    position: 'sticky',
    top: 0,
  },
  heading: {
    color: colorVars['--color-text-secondary'],
    fontFamily: 'var(--font-family-body)',
    fontSize: '0.8125rem',
    fontWeight: fontWeightVars['--font-weight-bold'],
    letterSpacing: '0.025em',
    lineHeight: '30px',
    margin: 0,
    marginBlockEnd: spacingVars['--spacing-3'],
    paddingInline: spacingVars['--spacing-4'],
    textTransform: 'uppercase',
    width: '100%',
  },
  scroller: {
    maxHeight: 'calc(100vh - 7.5rem)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    paddingInlineStart: spacingVars['--spacing-4'],
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-2'],
    listStyle: 'none',
    margin: 0,
    paddingBlockEnd: `calc(${spacingVars['--spacing-12']} + ${spacingVars['--spacing-4']})`,
    paddingBlockStart: 0,
    paddingInline: 0,
  },
  item: {
    borderEndEndRadius: 0,
    borderEndStartRadius: '12px',
    borderStartEndRadius: 0,
    borderStartStartRadius: '12px',
    fontSize: '0.8125rem',
    margin: 0,
    paddingInline: spacingVars['--spacing-2'],
  },
  activeItem: {
    backgroundColor: colorVars['--color-background-muted'],
  },
  nestedItem: {
    paddingInlineStart: spacingVars['--spacing-4'],
  },
  link: {
    color: {
      default: colorVars['--color-text-secondary'],
      ':hover': colorVars['--color-text-accent'],
    },
    display: 'block',
    fontWeight: fontWeightVars['--font-weight-normal'],
    lineHeight: 1.5,
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    paddingBlock: spacingVars['--spacing-2'],
    textDecoration: 'none',
  },
  activeLink: {
    color: colorVars['--color-text-accent'],
    fontWeight: fontWeightVars['--font-weight-bold'],
  },
});

/**
 * React Docs-style right-rail table of contents. Its 13px UI typography stays
 * independent from the 17px article body scale.
 * @param {{ items: TocItem[] }} props
 */
export function TableOfContents({ items }) {
  const visibleItems = useMemo(
    () => items.filter((item) => item.depth <= 3),
    [items],
  );
  const headingHrefs = useMemo(
    () => visibleItems.map((item) => item.href),
    [visibleItems],
  );
  const currentIndex = useTocHighlight(headingHrefs);

  if (visibleItems.length === 0) return null;

  return (
    <nav aria-label="Mục lục" {...stylex.props(styles.toc)}>
      <h2 {...stylex.props(styles.heading)}>Mục lục</h2>
      <div {...stylex.props(styles.scroller)}>
        <ul {...stylex.props(styles.list)}>
          {visibleItems.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <li
                key={item.href}
                {...stylex.props(
                  styles.item,
                  item.depth === 3 && styles.nestedItem,
                  isActive && styles.activeItem,
                )}
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? 'location' : undefined}
                  {...stylex.props(styles.link, isActive && styles.activeLink)}
                >
                  {item.value}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
