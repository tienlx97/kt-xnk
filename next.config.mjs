import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // .mdx pages live alongside .js pages under src/app (/blog/*, /tutorial/*).
  pageExtensions: ['js', 'jsx', 'mdx'],
  // NOT setting turbopack.root: this repo lives inside /home/capybara, which
  // also has its own unrelated pnpm-lock.yaml one level up, so Turbopack's
  // root inference picks the wrong directory and warns on every
  // `next dev`/`next build`. Pinning turbopack.root explicitly (tried
  // 2026-08-06) silences the warning but crashes Turbopack's Babel-loader
  // path resolution instead ("Resource path ... needs to be on project
  // filesystem", panics on HMR for any Babel-processed file — i.e. anything
  // StyleX touches). A cosmetic warning beats a fatal crash — see
  // harness/PROGRESS.md for the panic log and revert reasoning.
};

// remark-frontmatter parses the leading `---` YAML block; remark-mdx-frontmatter
// turns it into a `frontmatter` export each .mdx page can read (title, date,
// description, ...) instead of hand-writing `export const metadata = {...}`.
// Plugins are passed as module-specifier strings, not imported function
// references — Turbopack's loader options must be JSON-serializable, and
// @next/mdx's loader resolves + imports string entries itself.
const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-mdx-frontmatter'],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
