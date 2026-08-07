import { Section } from '@astryxdesign/core/Section';
import { notFound } from 'next/navigation';

import {
  loadPost,
  tutorialPostSlugs,
} from '../../../../features/tutorial/index.js';
import { MdxArticle } from '../../../../shared/components/mdx-article.js';

export function generateStaticParams() {
  return tutorialPostSlugs.map((slug) => ({ slug }));
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
export default async function TutorialPostPage({ params }) {
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
