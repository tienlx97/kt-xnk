import {
  colorVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  callout: {
    backgroundColor: colorVars['--color-background-muted'],
    borderColor: colorVars['--color-border'],
    borderRadius: radiusVars['--radius-container'],
    borderStyle: 'solid',
    borderWidth: '1px',
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-2'],
    padding: spacingVars['--spacing-4'],
  },
  title: {
    color: colorVars['--color-text-primary'],
    fontFamily: typographyVars['--font-family-heading'],
    fontSize: '1.5rem',
    fontWeight: fontWeightVars['--font-weight-bold'],
    lineHeight: 1.25,
    margin: 0,
  },
});

/** @param {{ title?: string, children: import('react').ReactNode }} props */
export function YouWillLearn({ title = 'Bạn sẽ học được', children }) {
  return (
    <aside aria-label={title} {...stylex.props(styles.callout)}>
      <h2 {...stylex.props(styles.title)}>{title}</h2>
      {children}
    </aside>
  );
}
