import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { Link } from '@astryxdesign/core/Link';
import { Heading, Text } from '@astryxdesign/core/Text';
import { colorVars, radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  panel: {
    backgroundColor: colorVars['--color-accent-muted'],
    borderRadius: radiusVars['--radius-container'],
  },
  copy: {
    maxWidth: '46rem',
  },
});

/**
 * The page's opening band and its only `<h1>`.
 *
 * Kept deliberately slim: the featured-news carousel directly below is the
 * page's visual centrepiece, and two full-height banners stacked would just
 * push every actual portal task below the fold. This one exists to name the
 * site — the top nav shows only the logo mark — and to give the document a
 * single top-level heading.
 *
 * @param {{ title: string, slogan?: string, subtitle?: string }} props
 */
export function WelcomeBanner({ title, slogan, subtitle }) {
  return (
    <HStack
      gap={5}
      padding={6}
      justify="between"
      vAlign="center"
      wrap="wrap"
      xstyle={styles.panel}
    >
      <VStack gap={2} xstyle={styles.copy}>
        <Heading level={1} type="display-3">
          {title}
        </Heading>
        {slogan ? (
          <Text type="label" color="accent" display="block" weight="bold">
            {slogan}
          </Text>
        ) : null}
        {subtitle ? (
          <Text type="body" color="secondary" display="block">
            {subtitle}
          </Text>
        ) : null}
      </VStack>
      <Link href="/docs" isStandalone>
        Khám phá tài liệu nội bộ
        <Icon icon="chevronRight" size="sm" />
      </Link>
    </HStack>
  );
}
