import { List, ListItem } from '@astryxdesign/core/List';
import * as stylex from '@stylexjs/stylex';

/** @typedef {import('../api/toc.js').TocItem} TocItem */

// 768px matches Astryx's own AppShell mobile-nav breakpoint ('md', the
// default) — "mobile" means the same thing here as it does for the rest of
// the shell. Sticky top clears the AppShell TopNav via the CSS variable it
// sets on its own root (--appshell-header-height), so this still lines up
// if the nav's height ever changes (e.g. a taller logo).
const styles = stylex.create({
  toc: {
    display: {
      default: 'block',
      '@media (max-width: 767px)': 'none',
    },
    position: 'sticky',
    top: 'calc(var(--appshell-header-height, 0px) + 24px)',
    maxHeight: 'calc(100vh - var(--appshell-header-height, 0px) - 48px)',
    overflowY: 'auto',
  },
});

/**
 * Right-rail "on this page" navigation for MDX post pages. Hidden on
 * mobile per product decision — narrow viewports get the content column
 * only, matching docs sites like react.dev.
 * @param {{ items: TocItem[] }} props
 */
export function TableOfContents({ items }) {
  if (items.length === 0) return null;

  return (
    <List header="Mục lục" xstyle={styles.toc}>
      {items.map((item) => (
        <ListItem key={item.href} href={item.href} label={item.value} />
      ))}
    </List>
  );
}
