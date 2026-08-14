import { readdir, readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import { extractToc } from '../../../shared/api/toc.js';
import remarkGroupContent from './remark-group-content.js';

/** @typedef {{ title: string, description?: string, date?: string }} PostFrontmatter */
/** @typedef {{ slug: string, absolutePath: string }} ContentEntry */

const contentDirectory = path.join(process.cwd(), 'content/docs');

/**
 * React Docs-style recursive content discovery. Files are the source of truth:
 * adding or deleting an MDX file automatically changes static params and the
 * Docs index without maintaining a second slug/import registry.
 * @param {string} directory
 * @returns {Promise<ContentEntry[]>}
 */
async function discoverEntries(directory = contentDirectory) {
  const directoryEntries = await readdir(directory, { withFileTypes: true });
  const entries = await Promise.all(
    directoryEntries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return discoverEntries(absolutePath);
      if (!entry.isFile() || !entry.name.endsWith('.mdx')) return [];
      return [
        {
          slug: path.basename(entry.name, '.mdx'),
          absolutePath,
        },
      ];
    }),
  );

  return entries.flat();
}

/**
 * @returns {Promise<ContentEntry[]>}
 */
async function getContentEntries() {
  const entries = await discoverEntries();
  const seenSlugs = new Set();

  for (const entry of entries) {
    if (seenSlugs.has(entry.slug)) {
      throw new Error(`Duplicate Docs slug: ${entry.slug}`);
    }
    seenSlugs.add(entry.slug);
  }

  return entries;
}

/**
 * Compile trusted repository MDX at build/request time, following the same
 * trust model as react.dev's compileMDX utility. Never pass user-submitted MDX
 * to this function because evaluation executes JavaScript from the document.
 * @param {ContentEntry} entry
 */
async function compileEntry(entry) {
  const source = await readFile(entry.absolutePath, 'utf8');
  const [module, toc] = await Promise.all([
    evaluate(source, {
      ...runtime,
      baseUrl: pathToFileURL(entry.absolutePath),
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGroupContent,
      ],
      rehypePlugins: [rehypeSlug],
    }),
    extractToc(entry.absolutePath),
  ]);

  return {
    slug: entry.slug,
    Content: module.default,
    frontmatter: /** @type {PostFrontmatter} */ (module.frontmatter),
    toc,
  };
}

export async function getDocsPostSlugs() {
  const entries = await getContentEntries();
  return entries
    .filter((entry) => entry.slug !== 'index')
    .map((entry) => entry.slug)
    .sort();
}

/**
 * @param {string} slug
 */
export async function loadPost(slug) {
  const entries = await getContentEntries();
  const entry = entries.find((candidate) => candidate.slug === slug);
  return entry ? compileEntry(entry) : null;
}

export async function loadDocsLanding() {
  const landing = await loadPost('index');
  if (!landing) {
    throw new Error('Missing Docs landing page: content/docs/index.mdx');
  }
  return landing;
}
