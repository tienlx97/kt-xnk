import {
  colorVars,
  fontWeightVars,
  spacingVars,
} from '@astryxdesign/core/theme/tokens.stylex';
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
    lineHeight: '30px',
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
    display: 'block',
    flexShrink: 0,
    height: '16px',
    marginInlineEnd: spacingVars['--spacing-1'],
    width: '16px',
  },
  outer: {
    paddingBlockStart: '14px',
    paddingInline: {
      default: '20px',
      '@media (min-width: 640px)': '48px',
    },
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-3'],
    marginInline: {
      default: 0,
      '@media (min-width: 1536px)': 'auto',
    },
    maxWidth: '56rem',
    width: '100%',
  },
  title: {
    color: colorVars['--color-text-primary'],
    fontFamily: 'var(--font-family-display)',
    fontSize: '40px',
    fontWeight: fontWeightVars['--font-weight-bold'],
    lineHeight: '50px',
    margin: 0,
    overflowWrap: 'anywhere',
    textWrap: 'balance',
  },
  headingActions: {
    alignItems: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacingVars['--spacing-3'],
    justifyContent: 'space-between',
  },
  breadcrumbGrow: {
    flex: '1',
    minWidth: 0,
  },
  date: {
    color: colorVars['--color-text-secondary'],
    fontFamily: 'var(--font-family-body)',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    margin: 0,
  },
});

function BreadcrumbChevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      {...stylex.props(styles.breadcrumbChevron)}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

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
              <span {...stylex.props(styles.breadcrumbText)}>{item.label}</span>
            )}
            {index < items.length - 1 ? <BreadcrumbChevron /> : null}
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
    <div data-mdx-page-heading {...stylex.props(styles.outer)}>
      <div data-mdx-page-heading-inner {...stylex.props(styles.inner)}>
        <div {...stylex.props(styles.headingActions)}>
          <div {...stylex.props(styles.breadcrumbGrow)}>
            {breadcrumbs.length > 0 ? (
              <MdxBreadcrumbs items={breadcrumbs} />
            ) : null}
          </div>
          <CopyPageLinkButton />
        </div>
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        {date ? (
          <p {...stylex.props(styles.date)}>Cập nhật ngày {date}</p>
        ) : null}
      </div>
    </div>
  );
}
