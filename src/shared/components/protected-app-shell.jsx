'use client';

import { AppShell } from '@astryxdesign/core/AppShell';
import { MobileNav } from '@astryxdesign/core/MobileNav';
import { usePathname } from 'next/navigation';

import { isNavLinkActive } from '../api/nav.js';
import { Footer } from './footer.jsx';
import { Header } from './header.jsx';
import { AppSideNav } from './side-nav.jsx';

/** @typedef {import('../types/index.js').NavLink} NavLink */

const SIDE_NAV_ROUTES = ['/tutorial', '/docs'];

/**
 * Route-aware application frame. AppShell must receive `undefined` for
 * sideNav outside content routes so it removes the desktop column and mobile
 * drawer entirely rather than reserving space for a component that returns
 * null.
 * @param {{
 *   children: import('react').ReactNode,
 *   endContent?: import('react').ReactNode,
 *   navLinks: NavLink[],
 *   sideNavRouteTrees: import('../types/index.js').SidebarRouteTree[],
 *   site: { name: string },
 *   year: number,
 * }} props
 */
export function ProtectedAppShell({
  children,
  endContent,
  navLinks,
  sideNavRouteTrees,
  site,
  year,
}) {
  const pathname = usePathname();
  const hasSideNav = SIDE_NAV_ROUTES.some((href) =>
    isNavLinkActive(pathname, href),
  );
  const sideNav = hasSideNav ? (
    <AppSideNav routeTrees={sideNavRouteTrees} />
  ) : undefined;

  return (
    <AppShell
      height="auto"
      variant="surface"
      contentPadding={6}
      topNav={
        <Header
          siteName={site.name}
          navLinks={navLinks}
          endContent={endContent}
        />
      }
      sideNav={sideNav}
      mobileNav={
        hasSideNav
          ? {
              breakpoint: 'lg',
              hasToggle: false,
              content: (
                <MobileNav header="Điều hướng" side="start" width={320}>
                  {sideNav}
                </MobileNav>
              ),
            }
          : false
      }
    >
      {children}
      <Footer siteName={site.name} year={year} />
    </AppShell>
  );
}
