import { Heading } from '@astryxdesign/core/Heading';
import { Section } from '@astryxdesign/core/Section';
import { VStack } from '@astryxdesign/core/VStack';

import { loadAllPosts, PostList } from '../../features/tutorial/index.js';

export const metadata = {
  title: 'Tutorial · KT-XNK',
};

export default async function TutorialIndexPage() {
  const posts = await loadAllPosts();

  return (
    <Section variant="transparent" paddingBlock={8}>
      <VStack gap={4}>
        <Heading level={1}>Tutorial</Heading>
        <PostList posts={posts} basePath="/tutorial" />
      </VStack>
    </Section>
  );
}
