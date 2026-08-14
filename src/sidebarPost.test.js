import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sidebar = JSON.parse(
  await readFile(new URL('./sidebarPost.json', import.meta.url), 'utf8'),
);

test('Docs sidebar exposes Nội quy and IT as expandable groups', () => {
  const groups = sidebar.routes.filter((route) => route.routes);

  assert.deepEqual(
    groups.map(({ title, path, routes }) => ({
      title,
      path,
      childCount: routes.length,
    })),
    [
      { title: 'NỘI QUY', path: '/docs', childCount: 7 },
      { title: 'IT', path: undefined, childCount: 9 },
    ],
  );
});
