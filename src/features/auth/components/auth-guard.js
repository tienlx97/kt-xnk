'use client';

import { Center } from '@astryxdesign/core/Center';
import { Spinner } from '@astryxdesign/core/Spinner';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { readAccessToken } from '../api/session.js';
import { useSession } from '../hooks/use-session.js';

const PUBLIC_PATH = '/login';

/**
 * Gates every route except `/login` behind a session — purely client-side
 * since there is no Next.js middleware/server check. A visitor's browser
 * still paints the server-rendered HTML for a protected route for a brief
 * moment before this runs and redirects; there is no server-side gate.
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const isPublicPath = pathname === PUBLIC_PATH;

  useEffect(() => {
    // Re-read localStorage directly here instead of trusting the
    // `isAuthenticated` value captured at render time: on a hard reload,
    // useSyncExternalStore's very first hydration-safe render always
    // reports "logged out" (it must match the server, which can't see
    // localStorage) and only self-corrects on the *next* render. An effect
    // tied to that first render's stale value would wrongly redirect an
    // already-authenticated visitor before the correction lands.
    if (!isPublicPath && readAccessToken() === null) {
      router.replace(`${PUBLIC_PATH}?next=${encodeURIComponent(pathname)}`);
    }
  }, [isPublicPath, pathname, router]);

  if (isPublicPath || isAuthenticated) {
    return children;
  }

  return (
    <Center axis="both" paddingBlock={10}>
      <Spinner size="lg" label="Đang kiểm tra đăng nhập..." />
    </Center>
  );
}
