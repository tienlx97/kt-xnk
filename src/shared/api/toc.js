import { readFile } from 'node:fs/promises';

import remarkFlexibleToc from 'remark-flexible-toc';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

/** @typedef {{ value: string, href: string, depth: number }} TocItem */

/**
 * Extracts a heading-based table of contents from a raw .mdx file by
 * parsing it directly with remark (the compiled MDX component from
 * @next/mdx only exposes rendered JSX, not the AST). Uses the same
 * slugger (github-slugger, via remark-flexible-toc) as the rehype-slug
 * plugin wired into next.config.mjs, so hrefs here match the `id`s
 * rendered on the actual headings.
 * @param {string} absoluteFilePath
 * @returns {Promise<TocItem[]>}
 */
export async function extractToc(absoluteFilePath) {
  const source = await readFile(absoluteFilePath, 'utf8');

  /** @type {import('remark-flexible-toc').TocItem[]} */
  const toc = [];
  /** @type {import('remark-flexible-toc').FlexibleTocOptions} */
  const tocOptions = { tocRef: toc, skipLevels: [1] };
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkFlexibleToc, tocOptions);

  const tree = processor.parse(source);
  await processor.run(tree);

  return toc;
}
