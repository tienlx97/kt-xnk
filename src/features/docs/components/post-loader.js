import * as path from 'node:path';

import { extractToc } from '../../../shared/api/toc.js';
import { docsPostSlugs } from '../config/posts.js';

/** @typedef {{ title: string, description?: string, date?: string }} PostFrontmatter */

// process.cwd() (the project root, reliable in Next.js dev/build/start) —
// not `new URL('./posts/', import.meta.url)`: bundlers (Turbopack included)
// special-case `new URL(relative, import.meta.url)` as an asset-bundling
// directive and try to resolve './posts/' itself as a file, which fails.
const postsDir = path.join(process.cwd(), 'src/features/docs/components/posts');

// Static import() targets so bundlers (Turbopack included) can always
// analyze and split them — a template-literal path built from `slug` can't
// be resolved reliably the same way.
/** @type {Record<string, () => Promise<{default: import('react').ComponentType, frontmatter: PostFrontmatter}>>} */
const loaders = {
  'xin-chao-mdx': () => import('./posts/xin-chao-mdx.mdx'),
};

/**
 * @param {string} slug
 * @returns {Promise<{slug: string, Content: import('react').ComponentType, frontmatter: PostFrontmatter, toc: import('../../../shared/api/toc.js').TocItem[]} | null>}
 */
export async function loadPost(slug) {
  const load = loaders[slug];
  if (!load) return null;
  const [{ default: Content, frontmatter }, toc] = await Promise.all([
    load(),
    extractToc(path.join(postsDir, `${slug}.mdx`)),
  ]);
  return { slug, Content, frontmatter, toc };
}

/**
 * All posts, newest first.
 */
export async function loadAllPosts() {
  const posts = await Promise.all(docsPostSlugs.map(loadPost));
  return posts
    .filter((post) => post !== null)
    .sort((a, b) =>
      (a.frontmatter.date ?? '') < (b.frontmatter.date ?? '') ? 1 : -1,
    );
}
