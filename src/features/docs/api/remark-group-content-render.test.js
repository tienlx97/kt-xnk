import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { evaluate } from '@mdx-js/mdx';
import { createElement } from 'react';
import * as runtime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';

import remarkGroupContent from './remark-group-content.js';

const fixtureUrl = new URL('./fixtures/content-width.mdx', import.meta.url);

function widthComponent(width) {
  return function WidthComponent({ children }) {
    return createElement('div', { 'data-test-width': width }, children);
  };
}

test('renders fixture DOM as MaxWidth, FullWidth, MaxWidth in source order', async () => {
  const source = await readFile(fixtureUrl, 'utf8');
  const evaluatedModule = await evaluate(source, {
    ...runtime,
    baseUrl: fixtureUrl,
    remarkPlugins: [remarkGroupContent],
  });
  const markup = renderToStaticMarkup(
    createElement(evaluatedModule.default, {
      components: {
        MaxWidth: widthComponent('max'),
        FullWidth: widthComponent('full'),
      },
    }),
  );

  assert.match(
    markup,
    /^<div data-test-width="max">.*trước.*<\/div>\s*<div data-test-width="full">.*toàn bộ.*<\/div>\s*<div data-test-width="max">.*sau.*<\/div>$/,
  );
});
