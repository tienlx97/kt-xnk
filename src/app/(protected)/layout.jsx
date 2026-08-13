import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ACCESS_TOKEN_KEY, UserMenu } from '../../features/auth/index.js';
import { ProtectedAppShell } from '../../shared/components/protected-app-shell.jsx';
import { site, topNavLinks } from '../../shared/config/site.js';
import sidebarPost from '../../sidebarPost.json';
import sidebarTutorial from '../../sidebarTutorial.json';

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

  return (
    <ProtectedAppShell
      endContent={<UserMenu />}
      navLinks={topNavLinks}
      sideNavRouteTrees={[sidebarTutorial, sidebarPost]}
      site={site}
      year={new Date().getFullYear()}
    >
      {children}
    </ProtectedAppShell>
  );
}
