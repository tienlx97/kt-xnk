import assert from 'node:assert/strict';
import test from 'node:test';

import { getHighlightLines, getInlineHighlights } from './code-meta.js';

test('parses react.dev line-range metadata', () => {
  assert.deepEqual(getHighlightLines('{1-3,7}'), [1, 2, 3, 7]);
  assert.deepEqual(getHighlightLines('title="example"'), []);
});

test('returns whole-source offsets for inline highlights on later lines', () => {
  const code = 'const count = 0;\ncount + count';

  assert.deepEqual(
    getInlineHighlights(
      '[[1,1,"count"],[2,2,"count",0],[3,2,"count",6]]',
      code,
    ),
    [
      { from: 6, to: 11, step: 1 },
      { from: 17, to: 22, step: 2 },
      { from: 25, to: 30, step: 3 },
    ],
  );
});

test('requires fromIndex for ambiguous inline highlights', () => {
  assert.throws(
    () => getInlineHighlights('[[1,1,"value"]]', 'value + value'),
    /provide fromIndex/u,
  );
});
