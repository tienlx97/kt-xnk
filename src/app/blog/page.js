import { Heading } from '@astryxdesign/core/Heading';
import { Section } from '@astryxdesign/core/Section';
import { VStack } from '@astryxdesign/core/VStack';

import { loadAllPosts, PostList } from '../../features/blog/index.js';

export const metadata = {
  title: 'Blog · KT-XNK',
};

export default async function BlogIndexPage() {
  const posts = await loadAllPosts();

  return (
    <Section variant="transparent" paddingBlock={8}>
      <VStack gap={4}>
        <Heading level={1}>Blog</Heading>
        <PostList posts={posts} basePath="/blog" />
      </VStack>
    </Section>
  );
}
