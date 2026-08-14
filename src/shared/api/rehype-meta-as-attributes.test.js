import assert from 'node:assert/strict';
import test from 'node:test';

import { compile } from '@mdx-js/mdx';

import rehypeMetaAsAttributes from './rehype-meta-as-attributes.js';

test('passes react.dev fenced-code metadata to the code component', async () => {
  const compiled = String(
    await compile('```jsx {1,3} [[1,1,"const"]]\nconst x = 1;\n```', {
      jsx: true,
      rehypePlugins: [rehypeMetaAsAttributes],
    }),
  );

  assert.match(
    compiled,
    /className="language-jsx" meta="\{1,3\} \[\[1,1,&quot;const&quot;\]\]"/u,
  );
});
