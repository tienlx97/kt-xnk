import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import {
  colorVars,
  fontWeightVars,
  spacingVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';

import { CopyPageLinkButton } from './copy-page-link-button.jsx';

const styles = stylex.create({
  breadcrumbList: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  breadcrumbItem: {
    alignItems: 'center',
    display: 'flex',
    marginBlockEnd: spacingVars['--spacing-3'],
    marginBlockStart: spacingVars['--spacing-0-5'],
  },
  breadcrumbText: {
    color: colorVars['--color-text-accent'],
    fontFamily: 'var(--font-family-body)',
    fontSize: '0.8125rem',
    fontWeight: fontWeightVars['--font-weight-bold'],
    letterSpacing: '0.025em',
    lineHeight: 1.5,
    marginInlineEnd: spacingVars['--spacing-1'],
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    textDecoration: {
      default: 'none',
      ':hover': 'underline',
    },
    textTransform: 'uppercase',
  },
  breadcrumbChevron: {
    color: colorVars['--color-icon-accent'],
    flexShrink: 0,
    marginInlineEnd: spacingVars['--spacing-1'],
  },
  outer: {
    paddingBlockStart: `calc(${spacingVars['--spacing-3']} + ${spacingVars['--spacing-0-5']})`,
    paddingInline: {
      default: spacingVars['--spacing-5'],
      '@media (min-width: 40rem)': spacingVars['--spacing-12'],
    },
  },
  inner: {
    marginInline: {
      default: 0,
      '@media (min-width: 96rem)': 'auto',
    },
    maxWidth: '56rem',
    width: '100%',
  },
  title: {
    fontSize: 'var(--font-size-5xl)',
    fontWeight: fontWeightVars['--font-weight-bold'],
    lineHeight: 1.25,
    overflowWrap: 'anywhere',
  },
});

/**
 * Breadcrumb presentation ported from react.dev's Breadcrumbs.tsx.
 * @param {{ items: Array<{label: string, href?: string, isCurrent?: boolean}> }} props
 */
function MdxBreadcrumbs({ items }) {
  return (
    <nav aria-label="Đường dẫn tài liệu">
      <ol {...stylex.props(styles.breadcrumbList)}>
        {items.map((item, index) => (
          <li
            key={`${item.href ?? 'current'}-${item.label}`}
            {...stylex.props(styles.breadcrumbItem)}
          >
            {item.href && !item.isCurrent ? (
              <Link href={item.href} {...stylex.props(styles.breadcrumbText)}>
                {item.label}
              </Link>
            ) : (
              <Text as="span" type="supporting" xstyle={styles.breadcrumbText}>
                {item.label}
              </Text>
            )}
            {index < items.length - 1 ? (
              <Icon
                icon="chevronRight"
                size="md"
                xstyle={styles.breadcrumbChevron}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * React Docs-inspired heading for rendered MDX pages.
 * @param {{
 *   title: string,
 *   date?: string,
 *   breadcrumbs?: Array<{label: string, href?: string, isCurrent?: boolean}>,
 * }} props
 */
export function MdxPageHeading({ title, date, breadcrumbs = [] }) {
  return (
    <VStack data-mdx-page-heading gap={0} xstyle={styles.outer}>
      <VStack data-mdx-page-heading-inner gap={3} xstyle={styles.inner}>
        <HStack hAlign="between" vAlign="start" gap={3} wrap="wrap">
          <StackItem size="fill">
            {breadcrumbs.length > 0 ? (
              <MdxBreadcrumbs items={breadcrumbs} />
            ) : null}
          </StackItem>
          <CopyPageLinkButton />
        </HStack>
        <Heading level={1} textWrap="balance" xstyle={styles.title}>
          {title}
        </Heading>
        {date ? <Text type="supporting">Cập nhật ngày {date}</Text> : null}
      </VStack>
    </VStack>
  );
}
