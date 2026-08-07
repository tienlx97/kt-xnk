import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ACCESS_TOKEN_KEY } from '../../features/auth/index.js';

/**
 * Server-side gate for every route in this group (everything except
 * `/login`, which stays outside it). Reading the cookie here and calling
 * `redirect()` happens during server rendering, before any child page's
 * Server Component body ever runs — so, unlike a client-side check, a
 * logged-out visitor's protected page content is never generated at all,
 * not just hidden after the fact (verified with `curl`, no JS).
 * @param {{ children: import('react').ReactNode }} props
 */
export default async function ProtectedLayout({ children }) {
  const cookieStore = await cookies();
  if (!cookieStore.get(ACCESS_TOKEN_KEY)) {
    redirect('/login');
  }

  return children;
}
