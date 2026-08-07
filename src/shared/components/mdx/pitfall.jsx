import { Banner } from '@astryxdesign/core/Banner';

/**
 * Warning callout for MDX content — react.dev's `<Pitfall>`, built on
 * Astryx's Banner instead of a custom-styled box.
 * @param {{ title?: string, children: import('react').ReactNode }} props
 */
export function Pitfall({ title = 'Cẩn thận', children }) {
  // Banner's `children` slot is a collapsed-by-default detail section
  // (chevron toggle) — wrong for a callout that should just always show its
  // content. `description` renders inline instead, no interaction needed.
  return <Banner status="warning" title={title} description={children} />;
}
