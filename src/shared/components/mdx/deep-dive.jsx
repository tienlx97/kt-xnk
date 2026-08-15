'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';
import {
  Children,
  isValidElement,
  useState,
  useSyncExternalStore,
} from 'react';

const styles = stylex.create({
  details: {
    backgroundColor: 'var(--color-background-purple)',
    borderRadius: '16px',
    boxShadow: 'inset 0 0 0 1px var(--color-border-purple)',
    marginBlock: '48px',
  },
  summary: { listStyle: 'none', padding: '32px' },
  label: {
    alignItems: 'center',
    color: 'var(--color-text-purple)',
    display: 'flex',
    fontSize: '14px',
    fontWeight: 700,
    marginBlockEnd: '16px',
    marginBlockStart: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: 'var(--color-text-primary)',
    fontSize: '20px',
    fontWeight: 700,
    margin: 0,
  },
  excerpt: { marginBlockStart: '16px' },
  button: {
    backgroundColor: 'var(--color-text-purple)',
    borderColor: 'var(--color-text-purple)',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: 'var(--color-on-dark)',
    cursor: 'pointer',
    font: 'inherit',
    fontWeight: 700,
    marginBlockStart: '16px',
    minHeight: '40px',
    paddingInline: '14px',
  },
  content: {
    borderBlockStartColor: 'var(--color-border-purple)',
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: '1px',
    padding: '32px',
  },
});

/** @param {{ title?: string, excerpt?: string, children: import('react').ReactNode }} props */
export function DeepDive({ title, excerpt, children }) {
  const childArray = Children.toArray(children);
  const first = childArray[0];
  const firstProps = isValidElement(first)
    ? /** @type {{ id?: string, children?: import('react').ReactNode }} */ (
        first.props
      )
    : {};
  const firstType = isValidElement(first) ? first.type : null;
  const hasAuthoredHeading =
    firstType === 'h4' ||
    (firstType !== null &&
      typeof firstType !== 'string' &&
      /** @type {import('react').ComponentType & { mdxName?: string }} */ (
        firstType
      ).mdxName === 'h4');
  const id = hasAuthoredHeading ? firstProps.id : undefined;
  const heading = hasAuthoredHeading ? firstProps.children : title;
  const body = hasAuthoredHeading ? childArray.slice(1) : children;
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const [manualOpen, setManualOpen] = useState(
    /** @type {boolean | null} */ (null),
  );
  const open = manualOpen ?? Boolean(id && hash === id);

  if (!heading)
    throw new Error(
      'DeepDive requires a title prop or an h4 as its first child.',
    );

  return (
    <details open={open} {...stylex.props(styles.details)}>
      <summary
        onClick={(event) => {
          if (
            !(event.target instanceof HTMLButtonElement) &&
            !(event.target instanceof HTMLAnchorElement)
          )
            event.preventDefault();
        }}
        {...stylex.props(styles.summary)}
      >
        <h5 {...stylex.props(styles.label)}>◆ Deep Dive</h5>
        <h4 id={id} {...stylex.props(styles.title)}>
          {heading}
        </h4>
        {excerpt ? (
          <div {...stylex.props(styles.excerpt)}>{excerpt}</div>
        ) : null}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setManualOpen(!open)}
          {...stylex.props(styles.button)}
        >
          {open ? '⌃ Hide Details' : '⌄ Show Details'}
        </button>
      </summary>
      <div {...stylex.props(styles.content)}>{body}</div>
    </details>
  );
}

function getHash() {
  return window.location.hash.slice(1);
}
function getServerHash() {
  return '';
}
/** @param {() => void} callback */
function subscribeHash(callback) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
