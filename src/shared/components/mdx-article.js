import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

import { TableOfContents } from './table-of-contents.js';

/** @typedef {import('../api/toc.js').TocItem} TocItem */

// Same 767px cutoff as TableOfContents's own display:none — below it the
// TOC column disappears, so the grid must also collapse to one track or
// the content column would stay squeezed into leftover space.
const styles = stylex.create({
  grid: {
    gridTemplateColumns: {
      default: 'minmax(0, 1fr) 280px',
      '@media (max-width: 767px)': '1fr',
    },
  },
});

/**
 * Two-column MDX post layout: content on the left, a sticky "on this page"
 * table of contents on the right (hidden on mobile) — same pattern as
 * docs sites like react.dev/learn.
 * @param {{
 *   frontmatter: { title: string, date?: string },
 *   toc: TocItem[],
 *   Content: import('react').ComponentType,
 * }} props
 */
export function MdxArticle({ frontmatter, toc, Content }) {
  return (
    <Grid gap={6} xstyle={styles.grid}>
      <VStack gap={4}>
        <VStack gap={1}>
          <Heading level={1}>{frontmatter.title}</Heading>
          {frontmatter.date ? (
            <Text type="supporting">{frontmatter.date}</Text>
          ) : null}
        </VStack>
        <Content />
      </VStack>
      <TableOfContents items={toc} />
    </Grid>
  );
}
