/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext, useSyncExternalStore } from 'react';

const notInErrorDecoderContext = Symbol('not-in-error-decoder-context');

/** @typedef {{ errorMessage: string | null, errorCode: string | null }} ErrorDecoderParams */

export const ErrorDecoderContext = createContext(
  /** @type {ErrorDecoderParams | typeof notInErrorDecoderContext} */ (
    notInErrorDecoderContext
  ),
);

export function useErrorDecoderParams() {
  const params = useContext(ErrorDecoderContext);
  if (params === notInErrorDecoderContext) {
    throw new Error(
      'useErrorDecoderParams chỉ dùng được trong trang giải mã lỗi.',
    );
  }
  return params;
}

/**
 * @param {string} message
 * @param {Array<string | undefined>} argList
 * @param {string} [replacer]
 */
function replaceArgs(message, argList, replacer = '[thiếu tham số]') {
  let argIndex = 0;
  return message.replace(/%s/g, () => {
    const arg = argList[argIndex++];
    return arg === undefined ? replacer : arg;
  });
}

const urlRegex =
  /((?:https?(?::\/\/))(?:www\.)?(?:[a-zA-Z\d-_.]+(?:(?:\.|@)[a-zA-Z\d]{2,})|localhost)(?:(?:[-a-zA-Z\d:%_+.~#!?&//=@]*)(?:[,](?![\s]))*)*)/g;

const styles = stylex.create({
  code: {
    backgroundColor: 'var(--color-error-muted)',
    borderRadius: '8px',
    color: 'var(--color-error)',
    display: 'block',
    marginBlockStart: '20px',
    opacity: 0,
    paddingBlock: '16px',
    paddingInline: '24px',
    transitionDuration: '150ms',
    transitionProperty: 'opacity',
    whiteSpace: 'pre-line',
  },
  ready: {
    opacity: 1,
  },
});

/**
 * @param {string} text
 * @returns {import('react').ReactNode[]}
 */
function urlify(text) {
  const segments = text.split(urlRegex);
  return segments.map((segment, index) =>
    index % 2 === 1 ? (
      <a key={segment} target="_blank" rel="noopener noreferrer" href={segment}>
        {segment}
      </a>
    ) : (
      segment
    ),
  );
}

/** @param {() => void} onChange */
function subscribeToLocationSearch(onChange) {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}

function getLocationSearch() {
  return window.location.search;
}

function getServerLocationSearch() {
  // `%s` placeholders can't resolve from a query string during SSR/hydration,
  // so the client snapshot (read on mount) is what fills them in.
  return '';
}

function subscribeNever() {
  return () => {};
}

function getHydrated() {
  return true;
}

function getServerHydrated() {
  return false;
}

/**
 * @param {string} search
 * @returns {Array<string | undefined>}
 */
function parseQueryString(search) {
  const raw = search.startsWith('?') ? search.slice(1) : search;
  if (!raw) return [];

  /** @type {Array<string | undefined>} */
  const args = [];
  for (const query of raw.split('&')) {
    const decoded = decodeURIComponent(query);
    if (decoded.startsWith('args[')) {
      args.push(decoded.slice(decoded.indexOf(']=') + 2));
    }
  }
  return args;
}

/**
 * Runtime error-code decoder ported from react.dev's
 * `components/MDX/ErrorDecoder.tsx`. KT-XNK has no equivalent minified-error
 * database — an author wires a real one up by supplying `errorMessage`/
 * `errorCode` through `ErrorDecoderContext` (mirroring upstream's
 * getStaticProps-fed contract) from whatever page hosts the decoder.
 */
export function ErrorDecoder() {
  const { errorMessage } = useErrorDecoderParams();
  const hasParams = errorMessage?.includes('%s') ?? false;
  const search = useSyncExternalStore(
    subscribeToLocationSearch,
    getLocationSearch,
    getServerLocationSearch,
  );
  // `%s` placeholders read from the URL only resolve post-hydration, so the
  // code block stays hidden until the client snapshot is known-current —
  // mirrors upstream's post-mount `isReady` without a setState-in-effect.
  const isHydrated = useSyncExternalStore(
    subscribeNever,
    getHydrated,
    getServerHydrated,
  );
  const isReady = errorMessage == null || !hasParams || isHydrated;
  const message =
    errorMessage == null
      ? null
      : urlify(
          hasParams
            ? replaceArgs(errorMessage, parseQueryString(search))
            : errorMessage,
        );

  return (
    <code {...stylex.props(styles.code, isReady && styles.ready)}>
      <b>{message}</b>
    </code>
  );
}
