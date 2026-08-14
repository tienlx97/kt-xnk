import {
  colorVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  pitfall: {
    backgroundColor: colorVars['--color-warning-muted'],
    borderInlineStartColor: colorVars['--color-warning'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: '4px',
    borderRadius: radiusVars['--radius-container'],
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-2'],
    padding: spacingVars['--spacing-5'],
  },
  title: {
    color: colorVars['--color-text-primary'],
    fontFamily: typographyVars['--font-family-heading'],
    fontSize: '1.125rem',
    fontWeight: fontWeightVars['--font-weight-bold'],
  },
});

/** @param {{ title?: string, children: import('react').ReactNode }} props */
export function Pitfall({ title = 'Cẩn thận', children }) {
  return (
    <aside aria-label={title} {...stylex.props(styles.pitfall)}>
      <strong {...stylex.props(styles.title)}>{title}</strong>
      {children}
    </aside>
  );
}
