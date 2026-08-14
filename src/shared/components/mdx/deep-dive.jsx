import {
  colorVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  details: {
    borderColor: colorVars['--color-border'],
    borderRadius: radiusVars['--radius-container'],
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: spacingVars['--spacing-4'],
  },
  summary: {
    color: colorVars['--color-text-primary'],
    cursor: 'pointer',
    fontFamily: typographyVars['--font-family-heading'],
    fontSize: '20px',
    fontWeight: fontWeightVars['--font-weight-bold'],
    lineHeight: '36px',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
  },
  content: {
    marginBlockStart: spacingVars['--spacing-4'],
  },
});

/** @param {{ title: string, children: import('react').ReactNode }} props */
export function DeepDive({ title, children }) {
  return (
    <details {...stylex.props(styles.details)}>
      <summary {...stylex.props(styles.summary)}>{title}</summary>
      <div {...stylex.props(styles.content)}>{children}</div>
    </details>
  );
}
