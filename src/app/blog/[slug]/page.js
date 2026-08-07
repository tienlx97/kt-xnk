import { Heading } from '@astryxdesign/core/Heading';
import { Section } from '@astryxdesign/core/Section';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { notFound } from 'next/navigation';

import { blogPostSlugs, loadPost } from '../../../features/blog/index.js';

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

  const { Content, frontmatter } = post;

  return (
    <Section variant="transparent" paddingBlock={8}>
      <VStack gap={4}>
        <VStack gap={1}>
          <Heading level={1}>{frontmatter.title}</Heading>
          {frontmatter.date ? (
            <Text type="supporting">{frontmatter.date}</Text>
          ) : null}
        </VStack>
        <Content />
      </VStack>
    </Section>
  );
}
