import { notFound } from 'next/navigation';

import MdxGuidedFixture from '@/shared/components/mdx/fixtures/guided-learning.mdx';
import { MdxArticle } from '@/shared/components/mdx-article.jsx';

const toc = [
  { value: 'Guided challenges', href: '#guided-challenges', depth: 2 },
  { value: 'Recipes', href: '#recipes', depth: 2 },
  { value: 'Expandable learning', href: '#expandable-learning', depth: 2 },
];

export default function MdxGuidedFixturePage() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <MdxArticle
      frontmatter={{ title: 'MDX guided-learning fixture' }}
      toc={toc}
      Content={MdxGuidedFixture}
    />
  );
}
