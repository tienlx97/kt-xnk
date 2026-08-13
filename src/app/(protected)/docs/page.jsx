import { Heading } from '@astryxdesign/core/Heading';
import { Section } from '@astryxdesign/core/Section';
import { VStack } from '@astryxdesign/core/VStack';

import { loadAllPosts, PostList } from '../../../features/docs/index.js';

export const metadata = {
  title: 'Tài liệu · KT-XNK',
  description: 'Tài liệu nội bộ dành cho nhân viên công ty.',
};

export default async function DocsIndexPage() {
  const posts = await loadAllPosts();

  return (
    <Section variant="transparent" paddingBlock={8}>
      <VStack gap={4}>
        <Heading level={1}>Tài liệu công ty</Heading>
        <PostList posts={posts} basePath="/docs" />
      </VStack>
    </Section>
  );
}
