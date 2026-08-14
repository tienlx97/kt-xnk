import assert from 'node:assert/strict';
import test from 'node:test';

import { getDocsPostSlugs, loadDocsLanding, loadPost } from './content.js';

test('discovers Docs posts recursively without a manual registry', async () => {
  const slugs = await getDocsPostSlugs();

  assert.equal(slugs.length, 16);
  assert.ok(slugs.includes('noi-quy-chung'));
  assert.ok(slugs.includes('may-tinh'));
});

test('compiles frontmatter and TOC from a discovered MDX document', async () => {
  const post = await loadPost('noi-quy-chung');

  assert.equal(post?.frontmatter.title, 'Nội quy chung');
  assert.ok(post?.toc.some((item) => item.value === 'Trách nhiệm của nhân viên'));
});

test('loads the Docs landing article without exposing an /docs/index route', async () => {
  const [landing, slugs] = await Promise.all([
    loadDocsLanding(),
    getDocsPostSlugs(),
  ]);

  assert.equal(landing.frontmatter.title, 'Tài liệu nội bộ công ty');
  assert.ok(landing.toc.some((item) => item.value === 'NỘI QUY'));
  assert.ok(landing.toc.some((item) => item.value === 'IT'));
  assert.ok(!slugs.includes('index'));
});
