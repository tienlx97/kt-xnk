const FULL_WIDTH_COMPONENTS = new Set([
  'Sandpack',
  'FullWidth',
  'Illustration',
  'IllustrationBlock',
  'Challenges',
  'Recipes',
]);

/** @typedef {{ type: string, name?: string, children?: MdxAstNode[] }} MdxAstNode */

/** @param {MdxAstNode} node */
function isModuleNode(node) {
  return node.type === 'yaml' || node.type === 'mdxjsEsm';
}

/** @param {MdxAstNode} node */
function isFullWidthNode(node) {
  return (
    node.type === 'mdxJsxFlowElement' &&
    typeof node.name === 'string' &&
    FULL_WIDTH_COMPONENTS.has(node.name)
  );
}

/** @param {MdxAstNode[]} children */
function maxWidthNode(children) {
  return {
    type: 'mdxJsxFlowElement',
    name: 'MaxWidth',
    attributes: [],
    children,
  };
}

/**
 * AST equivalent of react.dev's `wrapChildrenInMaxWidthContainers`: ordinary
 * top-level content is grouped into consecutive MaxWidth runs, while named
 * rich blocks interrupt the run and retain the full 80rem content frame.
 * Frontmatter/export nodes stay at module scope and are never rendered.
 * @param {{ children?: MdxAstNode[] }} tree
 */
export function groupMdxContent(tree) {
  const groupedChildren = [];
  let maxWidthChildren = /** @type {MdxAstNode[]} */ ([]);

  function flushMaxWidth() {
    if (maxWidthChildren.length === 0) return;
    groupedChildren.push(maxWidthNode(maxWidthChildren));
    maxWidthChildren = [];
  }

  for (const child of tree.children ?? []) {
    if (isModuleNode(child)) {
      flushMaxWidth();
      groupedChildren.push(child);
    } else if (isFullWidthNode(child)) {
      flushMaxWidth();
      groupedChildren.push(child);
    } else {
      maxWidthChildren.push(child);
    }
  }

  flushMaxWidth();
  tree.children = groupedChildren;
}

export default function remarkGroupContent() {
  return groupMdxContent;
}
