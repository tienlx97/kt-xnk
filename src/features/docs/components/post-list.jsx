import { List, ListItem } from '@astryxdesign/core/List';

/**
 * @param {{
 *   posts: Array<{ slug: string, frontmatter: { title: string, description?: string } }>,
 *   basePath: string,
 * }} props
 */
export function PostList({ posts, basePath }) {
  return (
    <List>
      {posts.map((post) => (
        <ListItem
          key={post.slug}
          href={`${basePath}/${post.slug}`}
          label={post.frontmatter.title}
          description={post.frontmatter.description}
        />
      ))}
    </List>
  );
}
