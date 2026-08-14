import { colorVars, spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

import { imageStyles } from './image-styles.js';

const styles = stylex.create({
  figure: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-2'],
    margin: 0,
  },
  caption: {
    color: colorVars['--color-text-secondary'],
    fontFamily: 'var(--font-family-body)',
    fontSize: '17px',
    lineHeight: 1.25,
    textAlign: 'center',
  },
});

/** @param {{ src: string, alt: string, caption?: string }} props */
export function Figure({ src, alt, caption }) {
  return (
    <figure {...stylex.props(styles.figure)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- authored MDX has no intrinsic dimensions */}
      <img src={src} alt={alt} {...stylex.props(imageStyles.img)} />
      {caption ? (
        <figcaption {...stylex.props(styles.caption)}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
