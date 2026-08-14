import { Text } from '@astryxdesign/core/Text';
import {
  typeScaleVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  intro: {
    fontFamily: typographyVars['--font-family-heading'],
    lineHeight: typeScaleVars['--text-supporting-leading'],
  },
});

/**
 * Lead paragraph for MDX articles, adapted from react.dev's `<Intro>` using
 * Astryx typography instead of a raw div and Tailwind utility classes.
 * @param {{ children?: import('react').ReactNode }} props
 */
export function Intro({ children }) {
  return (
    <Text
      as="div"
      type="large"
      color="primary"
      data-mdx-intro
      display="block"
      weight="normal"
      xstyle={styles.intro}
    >
      {children}
    </Text>
  );
}
