import { notFound } from 'next/navigation';

import MdxPrimitiveFixture from '../../../../shared/components/mdx/fixtures/primitives.mdx';
import { MdxArticle } from '../../../../shared/components/mdx-article.jsx';

const toc = [
  { value: 'Primitive typography', href: '#primitive-typography', depth: 2 },
  { value: 'Lifecycle callouts', href: '#lifecycle-callouts', depth: 2 },
  { value: 'Cards and actions', href: '#cards-and-actions', depth: 2 },
  { value: 'Illustrations', href: '#illustrations', depth: 2 },
];

export default function MdxPrimitivesFixturePage() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <MdxArticle
      frontmatter={{ title: 'MDX primitives fixture' }}
      toc={toc}
      Content={MdxPrimitiveFixture}
    />
  );
}
