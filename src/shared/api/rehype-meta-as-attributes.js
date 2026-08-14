/**
 * Preserve fenced-code metadata as a `meta` prop on the generated `<code>`.
 * This is the same bridge used by react.dev's MDX compiler for line and inline
 * highlighting directives.
 */
export default function rehypeMetaAsAttributes() {
  /** @param {{ type?: string, tagName?: string, data?: { meta?: string }, properties?: Record<string, unknown>, children?: unknown[] }} tree */
  return function transform(tree) {
    visit(tree);
  };
}

/** @param {unknown} value */
function visit(value) {
  if (!value || typeof value !== 'object') return;
  const node =
    /** @type {{ tagName?: string, data?: { meta?: string }, properties?: Record<string, unknown>, children?: unknown[] }} */ (
      value
    );

  if (node.tagName === 'code' && node.data?.meta) {
    node.properties ??= {};
    node.properties.meta = node.data.meta;
  }

  for (const child of node.children ?? []) visit(child);
}
