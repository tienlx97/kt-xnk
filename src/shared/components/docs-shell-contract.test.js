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
const sideNavSource = await readFile(
  new URL('./side-nav.jsx', import.meta.url),
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
  assert.match(headerSource, /height: '64px'/);
});

test('keeps the exact react.dev mobile-to-desktop boundary', () => {
  assert.match(shellSource, /matchMedia\('\(max-width: 1023px\)'\)/);
  assert.match(shellSource, /'@media \(min-width: 1024px\)'/);
});

test('implements TopNav with semantic UI and react.dev desktop behavior', () => {
  assert.doesNotMatch(
    headerSource,
    /@astryxdesign\/core\/(HStack|Icon|TopNav)/,
  );
  assert.match(headerSource, /backdropFilter: 'blur\(16px\) saturate\(200%\)'/);
  assert.match(headerSource, /transitionDuration: '300ms'/);
  assert.match(headerSource, /'@media \(min-width: 1919px\)'/);
  assert.match(headerSource, /aria-controls="mobile-docs-navigation"/);
});

test('manages mobile overlay focus without Astryx MobileNav state', () => {
  assert.match(shellSource, /mobileOverlayRef/);
  assert.match(shellSource, /firstInteractive\.focus\(\)/);
  assert.match(shellSource, /mobileToggleRef\.current\?\.focus\(\)/);
  assert.match(shellSource, /isMobile/);
});

test('ports the react.dev sidebar tree without Astryx UI primitives', () => {
  assert.doesNotMatch(
    sideNavSource,
    /@astryxdesign\/core\/(Icon|Text|SideNav)/,
  );
  assert.match(sideNavSource, /'@media \(min-width: 1024px\)': '20px'/);
  assert.match(
    sideNavSource,
    /'@media \(min-width: 1024px\)': '0 16px 16px 0'/,
  );
  assert.match(sideNavSource, /transitionDuration: '250ms'/);
  assert.match(sideNavSource, /gridTemplateRows: '1fr'/);
  assert.match(sideNavSource, /fontSize: '1rem'/);
});
