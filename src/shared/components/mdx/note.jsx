import * as stylex from '@stylexjs/stylex';

import {
  borderVars,
  colorVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
  typographyVars,
} from './tokens.stylex.js';

const styles = stylex.create({
  note: {
    backgroundColor: colorVars['--color-accent-muted'],
    borderColor: colorVars['--color-border'],
    borderRadius: {
      default: 0,
      '@media (min-width: 640px)': radiusVars['--radius-container'],
    },
    borderStyle: 'solid',
    borderWidth: borderVars['--border-width'],
    color: colorVars['--color-text-primary'],
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-2'],
    marginBlock: spacingVars['--spacing-4'],
    marginInline: {
      default: '-20px',
      '@media (min-width: 640px)': 0,
    },
    paddingBlock: spacingVars['--spacing-5'],
    paddingInline: {
      default: '20px',
      '@media (min-width: 640px)': spacingVars['--spacing-6'],
    },
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    gap: spacingVars['--spacing-2'],
  },
  icon: {
    color: colorVars['--color-icon-accent'],
    flexShrink: 0,
    height: '20px',
    width: '20px',
  },
  title: {
    color: colorVars['--color-text-accent'],
    fontFamily: typographyVars['--font-family-heading'],
    fontSize: '24px',
    fontWeight: fontWeightVars['--font-weight-bold'],
    lineHeight: '30px',
  },
});

/** @param {{ title?: string, children: import('react').ReactNode }} props */
export function Note({ title = 'Lưu ý', children }) {
  return (
    <aside
      role="note"
      aria-label={title}
      data-mdx-note
      {...stylex.props(styles.note)}
    >
      <header {...stylex.props(styles.header)}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          {...stylex.props(styles.icon)}
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
        <span {...stylex.props(styles.title)}>{title}</span>
      </header>
      {children}
    </aside>
  );
}
