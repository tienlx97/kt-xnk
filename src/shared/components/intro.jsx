import {
  colorVars,
  fontWeightVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  intro: {
    color: colorVars['--color-text-primary'],
    display: 'block',
    fontFamily: typographyVars['--font-family-heading'],
    fontSize: '20px',
    fontWeight: fontWeightVars['--font-weight-medium'],
    lineHeight: '32.5px',
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
