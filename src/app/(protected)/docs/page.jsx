import { loadDocsLanding } from '@/features/docs/index.js';
import { MdxArticle } from '@/shared/components/mdx-article.jsx';

export const metadata = {
  title: 'Tài liệu · KT-XNK',
  description: 'Tài liệu nội bộ dành cho nhân viên công ty.',
};

export default async function DocsIndexPage() {
  const landing = await loadDocsLanding();

  return (
    <MdxArticle
      frontmatter={landing.frontmatter}
      toc={landing.toc}
      Content={landing.Content}
    />
  );
}
