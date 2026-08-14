'use client';

import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';

const styles = stylex.create({
  action: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-accent-muted'],
    },
    color: colorVars['--color-text-accent'],
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
    <Button
      label={isCopied ? 'Đã sao chép' : 'Sao chép liên kết'}
      variant="ghost"
      size="sm"
      icon={<Icon icon="copy" size="sm" color="inherit" />}
      onClick={handleCopy}
      xstyle={styles.action}
    />
  );
}
