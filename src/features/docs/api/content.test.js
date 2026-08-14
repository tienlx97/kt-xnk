import assert from 'node:assert/strict';
import test from 'node:test';

import { getDocsPostSlugs, loadPost } from './content.js';

test('discovers Docs posts recursively without a manual registry', async () => {
  const slugs = await getDocsPostSlugs();

  assert.equal(slugs.length, 17);
  assert.ok(slugs.includes('noi-quy-chung'));
  assert.ok(slugs.includes('may-tinh'));
});

test('compiles frontmatter and TOC from a discovered MDX document', async () => {
  const post = await loadPost('noi-quy-chung');

  assert.equal(post?.frontmatter.title, 'Nội quy chung');
  assert.ok(post?.toc.some((item) => item.value === 'Trách nhiệm của nhân viên'));
});
