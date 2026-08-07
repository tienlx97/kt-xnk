import { List, ListItem } from '@astryxdesign/core/List';

/** @typedef {import('../api/toc.js').TocItem} TocItem */

/**
 * @param {{ items: TocItem[] }} props
 */
export function TableOfContents({ items }) {
  if (items.length === 0) return null;

  return (
    <List header="Mục lục">
      {items.map((item) => (
        <ListItem key={item.href} href={item.href} label={item.value} />
      ))}
    </List>
  );
}
