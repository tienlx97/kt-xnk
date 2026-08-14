import assert from 'node:assert/strict';
import test from 'node:test';

import { groupMdxContent } from './remark-group-content.js';

function node(type, name) {
  return name ? { type, name, children: [] } : { type, children: [] };
}

test('groups ordinary MDX runs and preserves full-width interruption order', () => {
  const yaml = node('yaml');
  const paragraphBefore = node('paragraph');
  const headingBefore = node('heading');
  const fullWidth = node('mdxJsxFlowElement', 'FullWidth');
  const paragraphAfter = node('paragraph');
  const tree = {
    children: [
      yaml,
      paragraphBefore,
      headingBefore,
      fullWidth,
      paragraphAfter,
    ],
  };

  groupMdxContent(tree);

  assert.equal(tree.children.length, 4);
  assert.equal(tree.children[0], yaml);
  assert.equal(tree.children[1].name, 'MaxWidth');
  assert.deepEqual(tree.children[1].children, [paragraphBefore, headingBefore]);
  assert.equal(tree.children[2], fullWidth);
  assert.equal(tree.children[3].name, 'MaxWidth');
  assert.deepEqual(tree.children[3].children, [paragraphAfter]);
});

test('recognizes every react.dev full-width interruption component', () => {
  for (const name of [
    'Sandpack',
    'FullWidth',
    'Illustration',
    'IllustrationBlock',
    'Challenges',
    'Recipes',
  ]) {
    const richBlock = node('mdxJsxFlowElement', name);
    const tree = { children: [node('paragraph'), richBlock, node('paragraph')] };
    groupMdxContent(tree);
    assert.deepEqual(
      tree.children.map((child) => child.name),
      ['MaxWidth', name, 'MaxWidth'],
    );
  }
});

test('keeps module exports outside rendered MaxWidth groups', () => {
  const exportNode = node('mdxjsEsm');
  const tree = { children: [exportNode, node('paragraph')] };
  groupMdxContent(tree);
  assert.equal(tree.children[0], exportNode);
  assert.equal(tree.children[1].name, 'MaxWidth');
});
