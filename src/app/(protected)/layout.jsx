import { AppShell } from '@astryxdesign/core/AppShell';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ACCESS_TOKEN_KEY, UserMenu } from '../../features/auth/index.js';
import { loadAllPosts as loadAllBlogPosts } from '../../features/blog/index.js';
import { loadAllPosts as loadAllTutorialPosts } from '../../features/tutorial/index.js';
import { Footer } from '../../shared/components/footer.jsx';
import { Header } from '../../shared/components/header.jsx';
import { AppSideNav } from '../../shared/components/side-nav.jsx';
import { navLinks, sideNavTitles, site } from '../../shared/config/site.js';

/**
 * Server-side gate for every route in this group (everything except
 * `/login`, which stays outside it). Reading the cookie here and calling
 * `redirect()` happens during server rendering, before any child page's
 * Server Component body ever runs — so, unlike a client-side check, a
 * logged-out visitor's protected page content is never generated at all,
 * not just hidden after the fact (verified with `curl`, no JS).
 *
 * The app shell (top nav / side nav / footer) also lives here rather than
 * the root layout, so `/login` renders on a bare page with no chrome —
 * the shell is part of what "being logged in" means, not site-wide chrome.
 * @param {{ children: import('react').ReactNode }} props
 */
export default async function ProtectedLayout({ children }) {
  const cookieStore = await cookies();
  if (!cookieStore.get(ACCESS_TOKEN_KEY)) {
    redirect('/login');
  }

  const [tutorialPosts, blogPosts] = await Promise.all([
    loadAllTutorialPosts(),
    loadAllBlogPosts(),
  ]);
  const sideNavLinks = navLinks.map((link) => {
    const posts =
      link.href === '/tutorial'
        ? tutorialPosts
        : link.href === '/blog'
          ? blogPosts
          : null;

    return posts
      ? {
          ...link,
          children: posts.map((post) => ({
            label: post.frontmatter.title,
            href: `${link.href}/${post.slug}`,
          })),
        }
      : link;
  });

  return (
    <AppShell
      height="auto"
      variant="elevated"
      contentPadding={6}
      topNav={
        <Header siteName={site.name} navLinks={[]} endContent={<UserMenu />} />
      }
      sideNav={<AppSideNav navLinks={sideNavLinks} titles={sideNavTitles} />}
    >
      {children}
      <Footer siteName={site.name} year={new Date().getFullYear()} />
    </AppShell>
  );
}
