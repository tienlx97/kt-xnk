/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';
import { Children, isValidElement } from 'react';

const styles = stylex.create({
  root: {
    backgroundColor: 'var(--color-background-muted)',
    borderRadius: '8px',
    color: 'var(--color-text-secondary)',
    direction: 'ltr',
    marginBlockEnd: '16px',
    overflow: 'hidden',
  },
  toolbar: {
    alignItems: 'stretch',
    backgroundColor: 'var(--color-border)',
    display: 'flex',
    minHeight: '34px',
    width: '100%',
  },
  toolbarIcon: {
    borderInlineEndColor: 'var(--color-text-disabled)',
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: '1px',
    paddingBlock: '8px',
    paddingInline: '16px',
  },
  square: {
    backgroundColor: 'var(--color-text-disabled)',
    height: '17px',
    width: '15px',
  },
  tab: {
    borderBlockEndColor: 'var(--color-text-disabled)',
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '2px',
    fontSize: '14px',
    paddingInline: '16px',
  },
  toolbarFill: {
    alignItems: 'center',
    display: 'flex',
    gap: '8px',
    paddingInline: '16px',
  },
  toolbarBar: {
    backgroundColor: 'var(--color-text-disabled)',
    height: '17px',
    width: '60px',
  },
  toolbarBarWideOnly: {
    display: {
      default: 'none',
      '@media (min-width: 768px)': 'block',
    },
  },
  message: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: 'var(--font-family-code)',
    fontSize: '13.6px',
    lineHeight: '24px',
    paddingBlockEnd: '24px',
    paddingBlockStart: '16px',
    paddingInline: '16px',
  },
  logLine: {
    display: 'grid',
    fontFamily: 'var(--font-family-code)',
    fontSize: '13.6px',
    gridTemplateColumns: '18px minmax(0, 1fr)',
    lineHeight: 1.25,
    paddingBlockEnd: '8px',
    paddingBlockStart: '4px',
    paddingInlineEnd: '8px',
    paddingInlineStart: '16px',
  },
  multi: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
  error: {
    backgroundColor: 'var(--color-error-muted)',
    color: 'var(--color-error)',
  },
  warning: {
    backgroundColor: 'var(--color-warning-muted)',
    color: 'var(--color-warning)',
  },
  info: {
    backgroundColor: 'var(--color-background-muted)',
    color: 'var(--color-text-secondary)',
  },
  icon: { alignSelf: 'flex-start', marginBlockStart: '4px' },
  messageBody: { paddingInline: '12px' },
  logBody: { paddingBlockStart: '4px', paddingInline: '8px' },
});

/** @param {{ level?: 'warning' | 'error' | 'info', children: import('react').ReactNode }} props */
export function ConsoleBlock({ level = 'error', children }) {
  return (
    <div translate="no" dir="ltr" {...stylex.props(styles.root)}>
      <ConsoleToolbar />
      <div {...stylex.props(styles.message, getLevelStyle(level))}>
        <LevelIcon level={level} />
        <div {...stylex.props(styles.messageBody)}>{getMessage(children)}</div>
      </div>
    </div>
  );
}

/** @param {{ children: import('react').ReactNode }} props */
export function ConsoleBlockMulti({ children }) {
  return (
    <div translate="no" dir="ltr" {...stylex.props(styles.root)}>
      <ConsoleToolbar />
      <div {...stylex.props(styles.multi)}>{children}</div>
    </div>
  );
}

/** @param {{ level?: 'warning' | 'error' | 'info', children: import('react').ReactNode }} props */
export function ConsoleLogLine({ level = 'info', children }) {
  return (
    <div {...stylex.props(styles.logLine, getLevelStyle(level))}>
      <LevelIcon level={level} />
      <div {...stylex.props(styles.logBody)}>{getMessage(children)}</div>
    </div>
  );
}

function ConsoleToolbar() {
  return (
    <div aria-hidden="true" {...stylex.props(styles.toolbar)}>
      <div {...stylex.props(styles.toolbarIcon)}>
        <div {...stylex.props(styles.square)} />
      </div>
      <div {...stylex.props(styles.tab)}>Console</div>
      <div {...stylex.props(styles.toolbarFill)}>
        <div {...stylex.props(styles.toolbarBar)} />
        <div {...stylex.props(styles.toolbarBar, styles.toolbarBarWideOnly)} />
        <div {...stylex.props(styles.toolbarBar, styles.toolbarBarWideOnly)} />
      </div>
    </div>
  );
}

/** @param {{ level: 'warning' | 'error' | 'info' }} props */
function LevelIcon({ level }) {
  if (level === 'info') return <span aria-hidden="true" />;

  return (
    <span aria-hidden="true" {...stylex.props(styles.icon)}>
      {level === 'error' ? <ErrorIcon /> : <WarningIcon />}
    </span>
  );
}

function ErrorIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 3l6 6M9 3L3 9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1.7l4.7 8.1H1.3L6 1.7z" stroke="currentColor" />
      <path d="M6 4.3v2.8M6 8.6v.1" stroke="currentColor" />
    </svg>
  );
}

/** @param {import('react').ReactNode} children */
function getMessage(children) {
  if (typeof children === 'string') return children;
  if (isValidElement(children)) {
    return /** @type {{ children?: import('react').ReactNode }} */ (
      children.props
    ).children;
  }

  return Children.toArray(children)
    .map((child) =>
      typeof child === 'string'
        ? child
        : isValidElement(child)
          ? /** @type {{ children?: import('react').ReactNode }} */ (
              child.props
            ).children
          : '',
    )
    .join('');
}

/** @param {'warning' | 'error' | 'info'} level */
function getLevelStyle(level) {
  if (level === 'warning') return styles.warning;
  if (level === 'error') return styles.error;
  return styles.info;
}
