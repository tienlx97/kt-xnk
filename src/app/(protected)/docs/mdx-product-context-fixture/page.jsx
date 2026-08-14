import * as stylex from '@stylexjs/stylex';
import { notFound } from 'next/navigation';

import { ErrorDecoder, ErrorDecoderContext } from '../../../../shared/components/mdx/error-decoder.jsx';
import MdxProductContextFixture from '../../../../shared/components/mdx/fixtures/product-context.mdx';
import { MdxArticle } from '../../../../shared/components/mdx-article.jsx';

const toc = [
  { value: 'Language list', href: '#language-list', depth: 2 },
  { value: 'Team member', href: '#team-member', depth: 2 },
];

const styles = stylex.create({
  errorDecoderDemo: {
    marginInline: 'auto',
    maxWidth: '80rem',
    paddingBlockEnd: '48px',
    paddingInline: {
      default: '20px',
      '@media (min-width: 640px)': '48px',
    },
    width: '100%',
  },
});

export default function MdxProductContextFixturePage() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <>
      <MdxArticle
        frontmatter={{ title: 'MDX product/context fixture' }}
        toc={toc}
        Content={MdxProductContextFixture}
      />
      <div {...stylex.props(styles.errorDecoderDemo)}>
        <ErrorDecoderContext
          value={{
            errorCode: '000',
            errorMessage: 'Thiếu tham số cấu hình: %s',
          }}
        >
          <ErrorDecoder />
        </ErrorDecoderContext>
      </div>
    </>
  );
}
