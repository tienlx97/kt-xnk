/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  math: {
    fontFamily: 'STIXGeneral-Regular, Georgia, serif',
    fontSize: '1.2rem',
  },
  mathItalic: {
    fontFamily: 'STIXGeneral-Italic, Georgia, serif',
    fontSize: '1.2rem',
  },
  recapTitle: {
    borderBlockEndColor: 'var(--color-accent-muted)',
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family-heading)',
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: '40px',
    margin: 0,
    paddingBlockEnd: '8px',
    scrollMarginTop: '84px',
  },
  codeStep: {
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '2px',
    borderRadius: '4px',
    paddingBlock: '1.5px',
    paddingInline: '6px',
    position: 'relative',
  },
  step1: {
    backgroundColor: 'var(--color-background-blue)',
    borderBlockEndColor: 'var(--color-border-blue)',
    color: 'var(--color-text-blue)',
  },
  step2: {
    backgroundColor: 'var(--color-background-yellow)',
    borderBlockEndColor: 'var(--color-border-yellow)',
    color: 'var(--color-text-yellow)',
  },
  step3: {
    backgroundColor: 'var(--color-background-purple)',
    borderBlockEndColor: 'var(--color-border-purple)',
    color: 'var(--color-text-purple)',
  },
  step4: {
    backgroundColor: 'var(--color-background-green)',
    borderBlockEndColor: 'var(--color-border-green)',
    color: 'var(--color-text-green)',
  },
  anchor: {
    color: 'var(--color-text-accent)',
    marginInlineStart: '8px',
    textDecoration: 'none',
  },
});

/** @param {{ children: import('react').ReactNode }} props */
export function Math({ children }) {
  return <span {...stylex.props(styles.math)}>{children}</span>;
}

/** @param {{ children: import('react').ReactNode }} props */
export function MathI({ children }) {
  return <span {...stylex.props(styles.mathItalic)}>{children}</span>;
}

/** @param {{ children: import('react').ReactNode }} props */
export function Recap({ children }) {
  return (
    <section>
      <h2 id="recap" {...stylex.props(styles.recapTitle)}>
        Recap
        <a
          href="#recap"
          aria-label="Link to Recap"
          {...stylex.props(styles.anchor)}
        >
          #
        </a>
      </h2>
      {children}
    </section>
  );
}

/** @param {{ children: import('react').ReactNode, step: number }} props */
export function CodeStep({ children, step }) {
  const stepStyle = [styles.step1, styles.step2, styles.step3, styles.step4][
    step - 1
  ];

  return (
    <span data-step={step} {...stylex.props(styles.codeStep, stepStyle)}>
      {children}
    </span>
  );
}
