import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const shellSource = await readFile(
  new URL('./protected-app-shell.jsx', import.meta.url),
  'utf8',
);
const headerSource = await readFile(
  new URL('./header.jsx', import.meta.url),
  'utf8',
);

test('uses the react.dev shell geometry without Astryx shell UI', () => {
  assert.doesNotMatch(shellSource, /@astryxdesign\/core\/(AppShell|MobileNav)/);
  assert.match(shellSource, /minHeight: 'calc\(100vh - 64px\)'/);
  assert.match(
    shellSource,
    /'@media \(min-width: 1024px\)': '20rem minmax\(0, 1fr\)'/,
  );
  assert.match(shellSource, /insetBlockStart: '64px'/);
  assert.match(headerSource, /default: '64px'/);
});

test('keeps the exact react.dev mobile-to-desktop boundary', () => {
  assert.match(shellSource, /matchMedia\('\(max-width: 1023px\)'\)/);
  assert.match(shellSource, /'@media \(min-width: 1024px\)'/);
});
