import { spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

// Padding/width contract for routes that self-manage their own `<main>`
// padding instead of `ProtectedAppShell`'s flat `paddedMain` — currently
// `/admin/*`. Shares the /docs MDX shell's inset scale (react.dev's
// Page.tsx/Tailwind defaults: <640px 20px inset, >=640px 48px inset) but
// caps content wider, at 110rem instead of docs' 80rem — /admin's data
// tables (e.g. the users list) need the extra columns' worth of room that
// prose content doesn't.
//
// The inset values are deliberately a duplicate of `mdx-article.jsx`'s
// `bodyOuter`/`bodyInner` values, not a shared import from there:
// `docs-shell-contract.test.js` pins those exact literal strings ('20px',
// '48px') as living inside the docs-shell file set itself
// (`assert.match(combinedSource, ...)` over `mdx-article.jsx` et al.), so
// moving them out would fail that test. Keep both in sync by hand if
// react.dev's own inset scale ever changes (the max-width is intentionally
// independent, see above).
export const pageContentShellStyles = stylex.create({
  outer: {
    paddingBlockEnd: spacingVars['--spacing-12'],
    paddingInline: {
      default: '20px',
      '@media (min-width: 640px)': '48px',
    },
  },
  inner: {
    marginInline: 'auto',
    maxWidth: '110rem',
    width: '100%',
  },
});

/**
 * Convenience wrapper for non-MDX pages that want the same padding/width
 * contract as `/docs` (see `pageContentShellStyles` above) — `/admin/*`'s
 * standard page shell.
 * @param {{ children: import('react').ReactNode }} props
 */
export function PageContentShell({ children }) {
  return (
    <div {...stylex.props(pageContentShellStyles.outer)}>
      <div {...stylex.props(pageContentShellStyles.inner)}>{children}</div>
    </div>
  );
}
