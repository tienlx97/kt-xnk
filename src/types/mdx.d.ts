// Ambient module for .mdx imports (compiled by @next/mdx). Frontmatter shape
// matches what remark-mdx-frontmatter emits — every post is expected to
// declare at least title/description/date (see content/docs/ and feature MDX files).
declare module '*.mdx' {
  import type { ComponentType } from 'react';

  export const frontmatter: {
    title: string;
    description?: string;
    date?: string;
  };

  const MDXContent: ComponentType;
  export default MDXContent;
}
