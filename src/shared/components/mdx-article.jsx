import { spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { useMDXComponents } from './mdx-components.jsx';
import { MdxPageHeading } from './mdx-page-heading.jsx';
import { TableOfContents } from './table-of-contents.jsx';

/** @typedef {import('../api/toc.js').TocItem} TocItem */

// Responsive contract derived from react.dev's Page.tsx/Tailwind defaults:
//   < 640px: 20px content inset
//   >= 640px: 48px content inset
//   < 1536px: content only
//   >= 1536px: main + 20rem TOC rail; heading/prose center inside main only
const styles = stylex.create({
  bodyOuter: {
    paddingBlockEnd: spacingVars['--spacing-12'],
    paddingInline: {
      default: '20px',
      '@media (min-width: 640px)': '48px',
    },
  },
  bodyInner: {
    marginInline: 'auto',
    maxWidth: '80rem',
    width: '100%',
  },
  prose: {
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
  layoutGrid: {
    alignItems: 'start',
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 1536px)': 'minmax(0, 1fr) 20rem',
    },
    width: '100%',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-6'],
    minWidth: 0,
  },
});

/**
 * Two-column MDX post layout: content on the left, a sticky "on this page"
 * table of contents on the right (hidden on mobile) — same pattern as
 * docs sites like react.dev/learn.
 * @param {{
 *   frontmatter: { title: string, date?: string },
 *   toc: TocItem[],
 *   Content: import('mdx/types').MDXContent | import('react').ComponentType,
 *   breadcrumbs?: Array<{label: string, href?: string, isCurrent?: boolean}>,
 * }} props
 */
export function MdxArticle({ frontmatter, toc, Content, breadcrumbs = [] }) {
  const components = useMDXComponents({});
  const RenderContent = /** @type {import('mdx/types').MDXContent} */ (Content);

  return (
    <div {...stylex.props(styles.layoutGrid)}>
      <div data-mdx-main {...stylex.props(styles.main)}>
        <MdxPageHeading
          title={frontmatter.title}
          date={frontmatter.date}
          breadcrumbs={breadcrumbs}
        />
        <div data-mdx-body {...stylex.props(styles.bodyOuter)}>
          <div data-mdx-body-inner {...stylex.props(styles.bodyInner)}>
            <div data-mdx-prose {...stylex.props(styles.prose)}>
              <RenderContent components={components} />
            </div>
          </div>
        </div>
      </div>
      <TableOfContents items={toc} />
    </div>
  );
}
