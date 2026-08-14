/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext } from 'react';

/** @typedef {{ code: string, name: string, enName: string }} LanguageItem */

// KT-XNK is a single-language internal site, so there is no real translation
// program to source from. This placeholder mirrors react.dev's `Languages`
// context shape so the component keeps its upstream contract — an author
// wiring up a real translation program can supply a real list via a
// `LanguagesContext` provider higher in the tree.
/** @type {LanguageItem[]} */
const placeholderLanguages = [
  { code: 'vi', name: 'Tiếng Việt', enName: 'Vietnamese' },
  { code: 'en', name: 'Tiếng Anh', enName: 'English' },
  { code: 'ja', name: 'Tiếng Nhật', enName: 'Japanese' },
];

const placeholderFinished = ['en'];

export const LanguagesContext = createContext(
  /** @type {LanguageItem[]} */ (placeholderLanguages),
);

const styles = stylex.create({
  link: {
    color: 'var(--color-text-accent)',
    textDecoration: { ':hover': 'underline' },
  },
});

/**
 * Translation-status listing ported from react.dev's inline `LanguageList`
 * (defined in `MDXComponents.tsx`). Filters the ambient `LanguagesContext`
 * by completion status, same as upstream.
 * @param {{ progress: 'complete' | 'in-progress' }} props
 */
export function LanguageList({ progress }) {
  const allLanguages = useContext(LanguagesContext) ?? [];
  const languages = allLanguages
    .filter(
      ({ code }) =>
        code !== 'vi' &&
        (progress === 'complete'
          ? placeholderFinished.includes(code)
          : !placeholderFinished.includes(code)),
    )
    .sort((a, b) => a.enName.localeCompare(b.enName));

  return (
    <ul>
      {languages.map(({ code, name, enName }) => (
        <li key={code}>
          <a
            href={`https://${code}.example.com/`}
            {...stylex.props(styles.link)}
          >
            {enName} ({name})
          </a>{' '}
          &mdash;{' '}
          <a
            href={`https://github.com/example-org/${code}-docs`}
            {...stylex.props(styles.link)}
          >
            Đóng góp
          </a>
        </li>
      ))}
    </ul>
  );
}
