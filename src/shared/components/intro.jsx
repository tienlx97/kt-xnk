import {
  colorVars,
  fontWeightVars,
  typeScaleVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  intro: {
    color: colorVars['--color-text-primary'],
    display: 'block',
    fontFamily: typographyVars['--font-family-heading'],
    fontSize: typeScaleVars['--text-large-size'],
    fontWeight: fontWeightVars['--font-weight-normal'],
    lineHeight: typeScaleVars['--text-supporting-leading'],
  },
});

/**
 * Lead paragraph for MDX articles, adapted from react.dev's `<Intro>` using
 * semantic local markup and StyleX typography variables.
 * @param {{ children?: import('react').ReactNode }} props
 */
export function Intro({ children }) {
  return (
    <div data-mdx-intro {...stylex.props(styles.intro)}>
      {children}
    </div>
  );
}
