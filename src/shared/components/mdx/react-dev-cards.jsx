/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';

const styles = stylex.create({
  cardLink: {
    borderRadius: '16px',
    color: 'var(--color-text-primary)',
    display: 'block',
    height: '100%',
    outline: {
      default: 'none',
      ':focus-visible': '2px solid var(--color-accent)',
    },
    outlineOffset: '2px',
    textDecoration: 'none',
    width: '100%',
  },
  card: {
    backgroundColor: {
      default: 'var(--color-background-card)',
      ':hover': 'var(--color-background-muted)',
    },
    borderColor: 'var(--color-border)',
    borderRadius: '16px',
    borderStyle: 'solid',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '20px',
    height: '100%',
    justifyContent: 'space-between',
    lineHeight: '32.5px',
    padding: '20px',
    width: '100%',
  },
  cardTitle: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: {
      default: '24px',
      '@media (min-width: 1024px)': '30px',
    },
    fontWeight: 600,
    lineHeight: 1.375,
    marginBlockEnd: '16px',
    marginBlockStart: 0,
    textDecoration: { ':is(a:hover *)': 'underline' },
  },
  metadata: {
    alignItems: 'center',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    fontSize: '17px',
    gap: '8px',
    lineHeight: '24px',
  },
  badge: {
    backgroundColor: 'var(--color-accent-muted)',
    borderRadius: '4px',
    color: 'var(--color-text-accent)',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.025em',
    lineHeight: '16px',
    paddingInline: '4px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  description: {
    color: 'var(--color-text-secondary)',
    display: 'block',
    fontSize: '17px',
    lineHeight: '30px',
  },
  readMore: {
    color: 'var(--color-text-accent)',
    fontSize: '17px',
    marginBlockStart: '16px',
    textDecoration: { ':is(a:hover *)': 'underline' },
  },
  learnMore: {
    alignItems: 'center',
    backgroundColor: 'var(--color-background-card)',
    borderColor: 'var(--color-border)',
    borderRadius: '16px',
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBlock: '64px',
    padding: '32px',
  },
  learnMoreTitle: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.25,
    margin: 0,
  },
  action: {
    alignItems: 'center',
    backgroundColor: {
      default: 'var(--color-accent)',
      ':hover': 'var(--color-text-accent)',
    },
    borderRadius: '9999px',
    color: 'var(--color-on-accent)',
    display: 'inline-flex',
    fontSize: '15px',
    fontWeight: 700,
    gap: '4px',
    lineHeight: '20px',
    marginBlockStart: '4px',
    paddingBlock: '8px',
    paddingInline: '16px',
    textDecoration: 'none',
  },
  divider: {
    borderBlockEndColor: 'var(--color-border)',
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '1px',
    borderBlockStartWidth: 0,
    marginBlockEnd: '56px',
  },
  learnCard: {
    backgroundColor: 'var(--color-background-card)',
    borderColor: 'var(--color-border)',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    marginBlockStart: '12px',
    padding: {
      default: '24px',
      '@media (min-width: 1280px)': '32px',
    },
    paddingBlockEnd: '32px',
  },
  learnCardTitle: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.25,
    margin: 0,
  },
  learnCardBody: { marginBlock: '16px' },
});

/** @param {{ title?: string, badge?: boolean, icon?: string, date?: string, url?: string, children?: import('react').ReactNode }} props */
export function BlogCard({ title, badge, icon, date, url = '#', children }) {
  return (
    <Link href={url} {...stylex.props(styles.cardLink)}>
      <div {...stylex.props(styles.card)}>
        <h2 {...stylex.props(styles.cardTitle)}>{title}</h2>
        <div>
          <div {...stylex.props(styles.metadata)}>
            {icon ? <CardIcon type={icon} /> : null}
            {date}
            {badge ? <span {...stylex.props(styles.badge)}>New</span> : null}
          </div>
          {children ? (
            <>
              <span {...stylex.props(styles.description)}>{children}</span>
              <span {...stylex.props(styles.readMore)}>Read more</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

/** @param {{ type: string }} props */
function CardIcon({ type }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
      {type === 'labs' ? (
        <path
          fill="currentColor"
          d="M9 2h6v2h-1v5.2l5.4 8.1A3 3 0 0 1 16.9 22H7.1a3 3 0 0 1-2.5-4.7L10 9.2V4H9V2Zm2.7 8.3L8.4 15h7.2l-3.3-4.7-.3-.5-.3.5Z"
        />
      ) : (
        <path
          fill="currentColor"
          d="M4 4h16v16H4V4Zm3 3v3h3V7H7Zm5 0v1h5V7h-5Zm0 3v1h5v-1h-5ZM7 13v1h10v-1H7Zm0 3v1h7v-1H7Z"
        />
      )}
    </svg>
  );
}

/** @param {{ path?: string, children: import('react').ReactNode }} props */
export function LearnMore({ path, children }) {
  return (
    <>
      <section {...stylex.props(styles.learnMore)}>
        <div>
          <h2 {...stylex.props(styles.learnMoreTitle)}>
            Ready to learn this topic?
          </h2>
          {children}
          {path ? <ActionLink path={path} label="Read More" /> : null}
        </div>
      </section>
      <hr {...stylex.props(styles.divider)} />
    </>
  );
}

/** @param {{ path: string }} props */
export function ReadBlogPost({ path }) {
  return <ActionLink path={path} label="Read Post" />;
}

/** @param {{ title: string, path: string, children: import('react').ReactNode }} props */
export function YouWillLearnCard({ title, path, children }) {
  return (
    <div {...stylex.props(styles.learnCard)}>
      <div>
        <h4 {...stylex.props(styles.learnCardTitle)}>{title}</h4>
        <div {...stylex.props(styles.learnCardBody)}>{children}</div>
      </div>
      <div>
        <ActionLink path={path} label="Read More" accessibleName={title} />
      </div>
    </div>
  );
}

/** @param {{ path: string, label: string, accessibleName?: string }} props */
function ActionLink({ path, label, accessibleName }) {
  return (
    <Link
      href={path}
      aria-label={accessibleName ?? label}
      {...stylex.props(styles.action)}
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
