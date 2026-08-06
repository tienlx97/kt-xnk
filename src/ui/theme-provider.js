'use client';

import { LinkProvider } from '@astryxdesign/core/Link';
import { Theme } from '@astryxdesign/core/theme';
import NextLink from 'next/link';

import { ktxnkTheme } from './theme.js';

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function ThemeProvider({ children }) {
  return (
    <LinkProvider component={NextLink}>
      <Theme theme={ktxnkTheme} mode="light">
        {children}
      </Theme>
    </LinkProvider>
  );
}
