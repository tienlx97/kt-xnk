'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { createContext, use, useMemo } from 'react';

/** @typedef {import('../../api/toc.js').TocItem} TocItem */
/** @typedef {{ item: TocItem | null, children: TocNode[] }} TocNode */

const TocContext = createContext(/** @type {TocItem[]} */ ([]));

const styles = stylex.create({
  list: {
    listStyleType: 'disc',
    marginBlock: '12px',
    paddingInlineStart: '24px',
  },
  item: { lineHeight: 1.625, marginBlockEnd: '4px' },
  link: { color: 'var(--color-text-accent)' },
});

/** @param {{ items: TocItem[], children: import('react').ReactNode }} props */
export function MdxTocProvider({ items, children }) {
  return <TocContext value={items}>{children}</TocContext>;
}

export function InlineToc() {
  const toc = use(TocContext);
  const root = useMemo(() => calculateNestedToc(toc), [toc]);

  if (root.children.length < 2) return null;
  return <InlineTocItems items={root.children} />;
}

/** @param {{ items: TocNode[] }} props */
function InlineTocItems({ items }) {
  return (
    <ul {...stylex.props(styles.list)}>
      {items.map((node) => (
        <li key={node.item?.href} {...stylex.props(styles.item)}>
          <Link href={node.item?.href ?? '#'} {...stylex.props(styles.link)}>
            {node.item?.value}
          </Link>
          {node.children.length > 0 ? (
            <InlineTocItems items={node.children} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** @param {TocItem[]} toc @returns {TocNode} */
function calculateNestedToc(toc) {
  const ancestors = new Map();
  const root = /** @type {TocNode} */ ({ item: null, children: [] });

  for (const item of toc) {
    const parent = ancestors.get(item.depth - 1) ?? root;
    const node = /** @type {TocNode} */ ({ item, children: [] });
    parent.children.push(node);
    ancestors.set(item.depth, node);
  }

  return root;
}
