/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';
import { Children, isValidElement } from 'react';

const styles = stylex.create({
  illustration: {
    marginBlock: '64px',
    marginInline: {
      default: 0,
      '@media (min-width: 1536px)': 'auto',
    },
    maxWidth: {
      default: '56rem',
      '@media (min-width: 1536px)': '72rem',
    },
    position: 'relative',
  },
  figure: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBlock: '32px',
    marginInline: 0,
  },
  image: {
    borderRadius: '8px',
    display: 'block',
    height: 'auto',
    maxHeight: '300px',
    maxWidth: '100%',
    objectFit: 'contain',
  },
  caption: {
    color: 'var(--color-text-secondary)',
    lineHeight: 1.25,
    marginBlockStart: '16px',
    textAlign: 'center',
  },
  block: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 768px)': 'repeat(auto-fit, minmax(0, 1fr))',
    },
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  panel: {
    alignItems: 'center',
    backgroundColor: 'var(--color-background-surface)',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    marginBlock: '16px',
    padding: {
      default: '16px',
      '@media (min-width: 1280px)': '24px',
    },
  },
  credit: {
    color: 'var(--color-text-secondary)',
    fontSize: '14px',
    lineHeight: 1.25,
    textAlign: 'center',
  },
  creditLink: { color: 'var(--color-text-accent)' },
});

/** @param {{ caption?: string, src: string, alt: string, author?: string, authorLink?: string }} props */
export function Illustration({ caption, src, alt, author, authorLink }) {
  return (
    <div {...stylex.props(styles.illustration)}>
      <figure {...stylex.props(styles.figure)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- MDX sources provide arbitrary illustration assets. */}
        <img src={src} alt={alt} {...stylex.props(styles.image)} />
        {caption ? (
          <figcaption {...stylex.props(styles.caption)}>{caption}</figcaption>
        ) : null}
      </figure>
      <AuthorCredit author={author} authorLink={authorLink} />
    </div>
  );
}

/** @param {{ sequential?: boolean, author?: string, authorLink?: string, children: import('react').ReactNode }} props */
export function IllustrationBlock({
  sequential = false,
  author,
  authorLink,
  children,
}) {
  const images = Children.toArray(children).flatMap((child, index) => {
    if (!isValidElement(child)) return [];
    const info =
      /** @type {{ src?: string, alt?: string, caption?: string, height?: number }} */ (
        child.props
      );
    if (!info.src) return [];

    return [
      <figure key={`${info.src}-${index}`} {...stylex.props(styles.figure)}>
        <div {...stylex.props(styles.panel)}>
          {/* eslint-disable-next-line @next/next/no-img-element -- see Illustration. */}
          <img
            src={info.src}
            alt={info.alt ?? ''}
            height={info.height}
            {...stylex.props(styles.image)}
          />
        </div>
        {info.caption ? (
          <figcaption {...stylex.props(styles.caption)}>
            {info.caption}
          </figcaption>
        ) : null}
      </figure>,
    ];
  });
  const CollectionTag = sequential ? 'ol' : 'div';

  return (
    <div {...stylex.props(styles.illustration)}>
      <CollectionTag {...stylex.props(styles.block)}>
        {sequential
          ? images.map((image, index) => <li key={index}>{image}</li>)
          : images}
      </CollectionTag>
      <AuthorCredit author={author} authorLink={authorLink} />
    </div>
  );
}

/** @param {{ author?: string, authorLink?: string }} props */
function AuthorCredit({
  author = 'Rachel Lee Nabors',
  authorLink = 'https://nearestnabors.com/',
}) {
  return (
    <p {...stylex.props(styles.credit)}>
      <cite>
        Illustrated by{' '}
        {authorLink ? (
          <a
            href={authorLink}
            target="_blank"
            rel="noreferrer"
            {...stylex.props(styles.creditLink)}
          >
            {author}
          </a>
        ) : (
          author
        )}
      </cite>
    </p>
  );
}
