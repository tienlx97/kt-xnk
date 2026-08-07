import { Section } from '@astryxdesign/core/Section';
import { notFound } from 'next/navigation';

import { blogPostSlugs, loadPost } from '../../../../features/blog/index.js';
import { MdxArticle } from '../../../../shared/components/mdx-article.js';

export function generateStaticParams() {
  return blogPostSlugs.map((slug) => ({ slug }));
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
export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  return (
    <Section variant="transparent" paddingBlock={8}>
      <MdxArticle
        frontmatter={post.frontmatter}
        toc={post.toc}
        Content={post.Content}
      />
    </Section>
  );
}
