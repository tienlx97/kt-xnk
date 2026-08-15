/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';

import { IconCanary } from '../icon/icon-canary';
import { IconNote } from '../icon/icon-note';
import { IconPitfall } from '../icon/icon-pitfall';
import { IconRocket } from '../icon/icon-rocket';
import { IconWarning } from '../icon/icon-warning';

const styles = stylex.create({
  callout: {
    borderRadius: {
      default: 0,
      '@media (min-width: 640px)': '16px',
    },
    color: 'var(--color-text-primary)',
    marginBlock: '32px',
    marginInline: {
      default: '-20px',
      '@media (min-width: 640px)': 0,
    },
    paddingBlockEnd: '16px',
    paddingBlockStart: '32px',
    paddingInline: {
      default: '20px',
      '@media (min-width: 640px)': '32px',
    },
    position: 'relative',
  },
  note: { backgroundColor: 'var(--color-accent-muted)' },
  warning: { backgroundColor: 'var(--color-warning-muted)' },
  deprecated: { backgroundColor: 'var(--color-error-muted)' },
  neutral: { backgroundColor: 'var(--color-background-muted)' },
  major: { backgroundColor: 'var(--color-background-blue)' },
  title: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: 'var(--font-family-heading)',
    fontSize: '24px',
    fontWeight: 700,
    gap: '8px',
    lineHeight: '30px',
    margin: 0,
  },
  titleNote: { color: 'var(--color-text-accent)' },
  titleWarning: { color: 'var(--color-warning)' },
  titleDeprecated: { color: 'var(--color-error)' },
  titleNeutral: { color: 'var(--color-text-secondary)' },
  content: { paddingBlock: '8px' },
  icon: { height: '20px', width: '20px' },
  badge: {
    alignItems: 'center',
    backgroundColor: 'var(--color-background-muted)',
    borderRadius: '4px',
    color: 'var(--color-text-secondary)',
    display: 'inline-flex',
    fontFamily: 'var(--font-family-heading)',
    fontSize: '17px',
    fontWeight: 700,
    gap: '4px',
    lineHeight: '24px',
    paddingBlock: '2px',
    paddingInline: '4px',
  },
  badgeBlue: {
    backgroundColor: 'var(--color-background-blue)',
    paddingInline: '8px',
  },
});

const variants = {
  deprecated: {
    title: 'Deprecated',
    Icon: IconWarning,
    containerStyle: styles.deprecated,
    titleStyle: styles.titleDeprecated,
  },
  note: {
    title: 'Note',
    Icon: IconNote,
    containerStyle: styles.note,
    titleStyle: styles.titleNote,
  },
  rc: {
    title: 'RC',
    Icon: IconCanary,
    containerStyle: styles.neutral,
    titleStyle: styles.titleNeutral,
  },
  canary: {
    title: 'Canary',
    Icon: IconCanary,
    containerStyle: styles.neutral,
    titleStyle: styles.titleNeutral,
  },
  experimental: {
    title: 'Experimental Feature',
    Icon: IconCanary,
    containerStyle: styles.note,
    titleStyle: styles.titleNote,
  },
  pitfall: {
    title: 'Pitfall',
    Icon: IconPitfall,
    containerStyle: styles.warning,
    titleStyle: styles.titleWarning,
  },
  wip: {
    title: 'Under Construction',
    Icon: IconNote,
    containerStyle: styles.warning,
    titleStyle: styles.titleWarning,
  },
  major: {
    title: 'React 19',
    Icon: IconRocket,
    containerStyle: styles.major,
    titleStyle: styles.titleNote,
  },
  rsc: {
    title: 'React Server Components',
    Icon: null,
    containerStyle: styles.major,
    titleStyle: styles.titleNote,
  },
};

/** @param {{ type?: keyof typeof variants, title?: string, children: import('react').ReactNode }} props */
function Callout({ type = 'note', title, children }) {
  const variant = variants[type];

  return (
    <div
      data-mdx-callout={type}
      {...stylex.props(styles.callout, variant.containerStyle)}
    >
      <h3 {...stylex.props(styles.title, variant.titleStyle)}>
        <CalloutIcon type={type} />
        {title ?? variant.title}
      </h3>
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  );
}

/** @param {{ type: string }} props */
function CalloutIcon({ type }) {
  const { Icon } = variants[type];
  if (!Icon) return null;

  return <Icon aria-hidden="true" {...stylex.props(styles.icon)} />;
}

/** @param {{ title?: string, children: import('react').ReactNode }} props */
export const Note = ({ title, children }) => (
  <Callout type="note" title={title}>
    {children}
  </Callout>
);

/** @param {{ children: import('react').ReactNode }} props */
export const Pitfall = ({ children }) => (
  <Callout type="pitfall">{children}</Callout>
);

/** @param {{ children: import('react').ReactNode }} props */
export const Deprecated = ({ children }) => (
  <Callout type="deprecated">{children}</Callout>
);

/** @param {{ children: import('react').ReactNode }} props */
export const Wip = ({ children }) => <Callout type="wip">{children}</Callout>;

/** @param {{ children: import('react').ReactNode }} props */
export const RC = ({ children }) => <Callout type="rc">{children}</Callout>;

/** @param {{ children: import('react').ReactNode }} props */
export const Canary = ({ children }) => (
  <Callout type="canary">{children}</Callout>
);

/** @param {{ children: import('react').ReactNode }} props */
export const Experimental = ({ children }) => (
  <Callout type="experimental">{children}</Callout>
);

/** @param {{ children: import('react').ReactNode }} props */
export const NextMajor = ({ children }) => (
  <Callout type="major">{children}</Callout>
);

/** @param {{ children: import('react').ReactNode }} props */
export const RSC = ({ children }) => <Callout type="rsc">{children}</Callout>;

/** @param {{ title: string }} props */
export const CanaryBadge = ({ title }) => (
  <span title={title} {...stylex.props(styles.badge)}>
    Canary only
  </span>
);

/** @param {{ title: string }} props */
export const ExperimentalBadge = ({ title }) => (
  <span title={title} {...stylex.props(styles.badge)}>
    Experimental only
  </span>
);

/** @param {{ title: string }} props */
export const NextMajorBadge = ({ title }) => (
  <span title={title} {...stylex.props(styles.badge, styles.badgeBlue)}>
    React 19
  </span>
);

/** @param {{ title: string }} props */
export const RSCBadge = ({ title }) => (
  <span title={title} {...stylex.props(styles.badge, styles.badgeBlue)}>
    RSC
  </span>
);
