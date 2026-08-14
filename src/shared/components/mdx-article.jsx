import { Grid } from '@astryxdesign/core/Grid';
import { spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
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
      default: spacingVars['--spacing-5'],
      '@media (min-width: 40rem)': spacingVars['--spacing-12'],
    },
  },
  bodyInner: {
    marginInline: 'auto',
    maxWidth: '80rem',
    width: '100%',
  },
  prose: {
    marginInline: {
      default: 0,
      '@media (min-width: 96rem)': 'auto',
    },
    maxWidth: '56rem',
    width: '100%',
  },
  layoutGrid: {
    alignItems: 'start',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 96rem)': 'minmax(0, 1fr) 20rem',
    },
    width: '100%',
  },
  main: {
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
    <Grid gap={0} xstyle={styles.layoutGrid}>
      <VStack data-mdx-main gap={6} xstyle={styles.main}>
        <MdxPageHeading
          title={frontmatter.title}
          date={frontmatter.date}
          breadcrumbs={breadcrumbs}
        />
        <VStack data-mdx-body gap={0} xstyle={styles.bodyOuter}>
          <VStack data-mdx-body-inner gap={0} xstyle={styles.bodyInner}>
            <VStack data-mdx-prose gap={4} xstyle={styles.prose}>
              <RenderContent components={components} />
            </VStack>
          </VStack>
        </VStack>
      </VStack>
      <TableOfContents items={toc} />
    </Grid>
  );
}
