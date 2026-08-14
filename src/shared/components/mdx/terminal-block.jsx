'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';
import { Children, isValidElement, useEffect, useState } from 'react';

const styles = stylex.create({
  root: {
    backgroundColor: 'var(--color-text-secondary)',
    borderRadius: '8px',
    color: 'var(--color-on-dark)',
    height: '100%',
    overflow: 'hidden',
  },
  toolbar: {
    alignItems: 'center',
    backgroundColor: 'var(--color-text-primary)',
    display: 'flex',
    fontSize: '14px',
    justifyContent: 'space-between',
    paddingBlock: '2px',
    paddingInline: '16px',
  },
  toolbarLabel: { alignItems: 'center', display: 'inline-flex', gap: '8px' },
  icon: { display: 'inline-block', flexShrink: 0 },
  copy: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'var(--color-on-dark)',
    cursor: 'pointer',
    font: 'inherit',
    padding: 0,
  },
  pre: {
    direction: 'ltr',
    fontFamily: 'var(--font-family-code)',
    fontSize: '13.6px',
    lineHeight: '24px',
    margin: 0,
    overflowX: 'auto',
    paddingBlockEnd: '24px',
    paddingBlockStart: '16px',
    paddingInline: '32px',
    whiteSpace: 'pre',
  },
  warning: { color: 'var(--color-warning)' },
  error: { color: 'var(--color-error)' },
});

/** @param {{ level?: 'info' | 'warning' | 'error', children: import('react').ReactNode }} props */
export function TerminalBlock({ level = 'info', children }) {
  const message = getTerminalMessage(children);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.toolbar)}>
        <span {...stylex.props(styles.toolbarLabel)}>
          <TerminalIcon /> Terminal
        </span>
        <button
          type="button"
          aria-label="Copy terminal output"
          onClick={() => {
            void window.navigator.clipboard.writeText(message);
            setCopied(true);
          }}
          {...stylex.props(styles.copy)}
        >
          <CopyIcon /> {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre translate="no" dir="ltr" {...stylex.props(styles.pre)}>
        <code>
          {level === 'warning' ? (
            <span {...stylex.props(styles.warning)}>Warning: </span>
          ) : null}
          {level === 'error' ? (
            <span {...stylex.props(styles.error)}>Error: </span>
          ) : null}
          {message}
        </code>
      </pre>
    </div>
  );
}

function TerminalIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...stylex.props(styles.icon)}
    >
      <path d="M2.5 4.5L5.5 8l-3 3.5M7.5 11.5h6" stroke="currentColor" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      {...stylex.props(styles.icon)}
    >
      <rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" />
      <path d="M2.5 9.5h-1v-7a1 1 0 011-1h7v1" stroke="currentColor" />
    </svg>
  );
}

/** @param {import('react').ReactNode} children */
function getTerminalMessage(children) {
  const message = Children.toArray(children).map(readText).join('');
  if (message) return message;
  throw new Error('Expected TerminalBlock children to contain plain text.');
}

/** @param {import('react').ReactNode} child @returns {string} */
function readText(child) {
  if (typeof child === 'string' || typeof child === 'number') {
    return String(child);
  }
  if (!isValidElement(child)) return '';
  return Children.toArray(
    /** @type {{ children?: import('react').ReactNode }} */ (child.props)
      .children,
  )
    .map(readText)
    .join('');
}
