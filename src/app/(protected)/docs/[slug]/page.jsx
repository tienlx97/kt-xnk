import { notFound } from 'next/navigation';

import {
  getDocsPostSlugs,
  loadPost,
} from '../../../../features/docs/index.js';
import { getSidebarBreadcrumbs } from '../../../../shared/api/nav.js';
import { MdxArticle } from '../../../../shared/components/mdx-article.jsx';
import sidebarPost from '../../../../sidebarPost.json';

export async function generateStaticParams() {
  const slugs = await getDocsPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * @param {{ params: Promise<{ slug: string }> }} props
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return {};
  return {
    title: `${post.frontmatter.title} · KT-XNK`,
    description: post.frontmatter.description,
  };
}

/**
 * @param {{ params: Promise<{ slug: string }> }} props
 */
export default async function DocsPostPage({ params }) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();
  const breadcrumbs = getSidebarBreadcrumbs(sidebarPost, `/docs/${slug}`);

  return (
    <MdxArticle
      frontmatter={post.frontmatter}
      toc={post.toc}
      Content={post.Content}
      breadcrumbs={breadcrumbs}
    />
  );
}
