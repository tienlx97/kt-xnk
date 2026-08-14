import { notFound } from 'next/navigation';

import MdxCodeFixture from '../../../../shared/components/mdx/fixtures/code.mdx';
import { MdxArticle } from '../../../../shared/components/mdx-article.jsx';

const toc = [
  { value: 'Syntax and line states', href: '#syntax-and-line-states', depth: 2 },
  { value: 'Console and terminal', href: '#console-and-terminal', depth: 2 },
  { value: 'Diagrams', href: '#diagrams', depth: 2 },
  { value: 'Package import', href: '#package-import', depth: 2 },
];

export default function MdxCodeFixturePage() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <MdxArticle
      frontmatter={{ title: 'MDX code fixture' }}
      toc={toc}
      Content={MdxCodeFixture}
    />
  );
}
