'use client';

import {
  colorVars,
  fontWeightVars,
  radiusVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';

import { IconCopy } from './icon/icon-copy.jsx';

const styles = stylex.create({
  action: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-accent-muted'],
    },
    borderColor: colorVars['--color-border'],
    borderRadius: radiusVars['--radius-full'],
    borderStyle: 'solid',
    borderWidth: '1px',
    color: colorVars['--color-text-accent'],
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: 'var(--font-family-body)',
    fontSize: '0.8125rem',
    fontWeight: fontWeightVars['--font-weight-bold'],
    gap: '6px',
    lineHeight: 1.25,
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    paddingBlock: '4px',
    paddingInline: '12px',
  },
  icon: {
    display: 'block',
    height: '14px',
    width: '14px',
  },
});

export function CopyPageLinkButton() {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return undefined;
    const timer = globalThis.setTimeout(() => setIsCopied(false), 2000);
    return () => globalThis.clearTimeout(timer);
  }, [isCopied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(globalThis.location.href);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <button type="button" onClick={handleCopy} {...stylex.props(styles.action)}>
      <IconCopy aria-hidden="true" {...stylex.props(styles.icon)} />
      {isCopied ? 'Đã sao chép' : 'Sao chép liên kết'}
    </button>
  );
}
