import { blogPostSlugs } from '../config/posts.js';

/** @typedef {{ title: string, description?: string, date?: string }} PostFrontmatter */

// Static import() targets so bundlers (Turbopack included) can always
// analyze and split them — a template-literal path built from `slug` can't
// be resolved reliably the same way.
/** @type {Record<string, () => Promise<{default: import('react').ComponentType, frontmatter: PostFrontmatter}>>} */
const loaders = {
  'xin-chao-mdx': () => import('./posts/xin-chao-mdx.mdx'),
};

/**
 * @param {string} slug
 * @returns {Promise<{slug: string, Content: import('react').ComponentType, frontmatter: PostFrontmatter} | null>}
 */
export async function loadPost(slug) {
  const load = loaders[slug];
  if (!load) return null;
  const { default: Content, frontmatter } = await load();
  return { slug, Content, frontmatter };
}

/**
 * All posts, newest first.
 */
export async function loadAllPosts() {
  const posts = await Promise.all(blogPostSlugs.map(loadPost));
  return posts
    .filter((post) => post !== null)
    .sort((a, b) =>
      (a.frontmatter.date ?? '') < (b.frontmatter.date ?? '') ? 1 : -1
    );
}
