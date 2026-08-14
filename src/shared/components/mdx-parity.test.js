import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const matrix = JSON.parse(
  await readFile(
    new URL(
      '../../../openspec/changes/react-dev-docs-shell/mdx-component-matrix.json',
      import.meta.url,
    ),
    'utf8',
  ),
);
const dependencyMap = JSON.parse(
  await readFile(
    new URL(
      '../../../openspec/changes/react-dev-mdx-components-parity/upstream-dependencies.json',
      import.meta.url,
    ),
    'utf8',
  ),
);
const localSource = await readFile(
  new URL('./mdx-components.jsx', import.meta.url),
  'utf8',
);

const upstreamComponents = [
  'p',
  'strong',
  'blockquote',
  'ol',
  'ul',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'hr',
  'a',
  'img',
  'BlogCard',
  'code',
  'pre',
  'CodeDiagram',
  'ConsoleBlock',
  'ConsoleBlockMulti',
  'ConsoleLogLine',
  'DeepDive',
  'Diagram',
  'DiagramGroup',
  'FullWidth',
  'MaxWidth',
  'Pitfall',
  'Deprecated',
  'Wip',
  'Illustration',
  'IllustrationBlock',
  'Intro',
  'InlineToc',
  'LanguageList',
  'LearnMore',
  'Math',
  'MathI',
  'Note',
  'RC',
  'Canary',
  'Experimental',
  'ExperimentalBadge',
  'CanaryBadge',
  'NextMajor',
  'NextMajorBadge',
  'RSC',
  'RSCBadge',
  'PackageImport',
  'ReadBlogPost',
  'Recap',
  'Recipes',
  'Sandpack',
  'SandpackRSC',
  'SandpackWithHTMLOutput',
  'TeamMember',
  'TerminalBlock',
  'YouWillLearn',
  'YouWillLearnCard',
  'Challenges',
  'Hint',
  'Solution',
  'CodeStep',
  'YouTubeIframe',
  'ErrorDecoder',
];

test('classifies every component in the pinned react.dev MDX registry', () => {
  const names = matrix.upstreamComponents.map(({ name }) => name);
  assert.deepEqual(names.toSorted(), upstreamComponents.toSorted());
  assert.equal(new Set(names).size, names.length);

  for (const entry of matrix.upstreamComponents) {
    assert.ok(matrix.statuses.includes(entry.status), `${entry.name} status`);
    assert.ok(entry.note.length > 0, `${entry.name} note`);
    if (entry.status === 'supported' || entry.status === 'adapted') {
      assert.ok(entry.localName, `${entry.name} localName`);
    } else {
      assert.equal(
        entry.localName,
        null,
        `${entry.name} must not claim local UI`,
      );
    }
  }
});

test('assigns every upstream MDX component to one implementation task', () => {
  const assignedNames = dependencyMap.groups.flatMap(
    ({ components }) => components,
  );

  assert.deepEqual(assignedNames.toSorted(), upstreamComponents.toSorted());
  assert.equal(new Set(assignedNames).size, assignedNames.length);
  for (const group of dependencyMap.groups) {
    assert.match(group.task, /^\d+\.\d+$/u);
    assert.ok(group.externalDependencies.length > 0, group.name);
  }
});

test('supported and adapted matrix entries exist in the local MDX map', () => {
  for (const { name, status, localName } of matrix.upstreamComponents) {
    if (status !== 'supported' && status !== 'adapted') continue;
    const escapedName = localName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mapEntry = new RegExp(`\\b${escapedName}\\s*(?::|,)`);
    assert.match(localSource, mapEntry, `${name} → ${localName}`);
  }

  for (const { name } of matrix.localExtensions) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(localSource, new RegExp(`\\b${escapedName}\\s*(?::|,)`), name);
  }
});
