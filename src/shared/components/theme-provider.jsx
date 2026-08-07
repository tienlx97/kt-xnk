'use client';

import './theme.built.css';

import { LinkProvider } from '@astryxdesign/core/Link';
import { Theme } from '@astryxdesign/core/theme';
import NextLink from 'next/link';

import { ktXnkTheme } from './kt-xnk.js';

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function ThemeProvider({ children }) {
  return (
    <LinkProvider component={NextLink}>
      <Theme theme={ktXnkTheme} mode="light">
        {children}
      </Theme>
    </LinkProvider>
  );
}
