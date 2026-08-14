import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { Text } from '@astryxdesign/core/Text';
import {
  borderVars,
  colorVars,
  radiusVars,
  spacingVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  note: {
    backgroundColor: colorVars['--color-accent-muted'],
    borderColor: colorVars['--color-border'],
    borderRadius: {
      default: radiusVars['--radius-none'],
      '@media (min-width: 40rem)': radiusVars['--radius-container'],
    },
    borderStyle: 'solid',
    borderWidth: borderVars['--border-width'],
    color: colorVars['--color-text-primary'],
    marginBlock: spacingVars['--spacing-4'],
    marginInline: {
      default: `calc(-1 * ${spacingVars['--spacing-5']})`,
      '@media (min-width: 40rem)': 0,
    },
    paddingBlock: spacingVars['--spacing-5'],
    paddingInline: {
      default: spacingVars['--spacing-5'],
      '@media (min-width: 40rem)': spacingVars['--spacing-6'],
    },
  },
  title: {
    color: colorVars['--color-text-accent'],
    fontFamily: typographyVars['--font-family-heading'],
  },
});

/**
 * React.dev-inspired informational callout for MDX content. It deliberately
 * stays server-rendered: a note is always visible and has no interaction to
 * hydrate. Astryx layout/icon/text primitives provide its structure while
 * StyleX theme tokens carry the KT-XNK visual identity.
 * @param {{ title?: string, children: import('react').ReactNode }} props
 */
export function Note({ title = 'Lưu ý', children }) {
  return (
    <VStack
      as="aside"
      role="note"
      aria-label={title}
      data-mdx-note
      gap={2}
      xstyle={styles.note}
    >
      <HStack as="header" gap={2} vAlign="center">
        <Icon icon="info" size="lg" color="accent" />
        <Text as="span" type="large" weight="bold" xstyle={styles.title}>
          {title}
        </Text>
      </HStack>
      {children}
    </VStack>
  );
}
