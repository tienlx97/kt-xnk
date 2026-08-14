'use client';

import { colorVars, spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { isNavLinkActive } from '../api/nav.js';
import { Footer } from './footer.jsx';
import { Header } from './header.jsx';
import { AppSideNav } from './side-nav.jsx';

/** @typedef {import('../types/index.js').NavLink} NavLink */

const SIDE_NAV_ROUTES = ['/tutorial', '/docs'];

const styles = stylex.create({
  root: {
    backgroundColor: colorVars['--color-background-surface'],
    color: colorVars['--color-text-primary'],
    minHeight: '100vh',
  },
  topNav: {
    insetBlockStart: 0,
    position: 'sticky',
    zIndex: 40,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    minHeight: 'calc(100vh - 64px)',
  },
  docsLayout: {
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 1024px)': '20rem minmax(0, 1fr)',
    },
  },
  desktopSideNav: {
    display: {
      default: 'none',
      '@media (min-width: 1024px)': 'block',
    },
    minWidth: 0,
    position: 'relative',
    zIndex: 10,
  },
  desktopSideNavInner: {
    height: 'calc(100vh - 64px)',
    insetBlockStart: '64px',
    overflowY: 'auto',
    position: 'sticky',
  },
  main: {
    isolation: 'isolate',
    minWidth: 0,
  },
  paddedMain: {
    padding: spacingVars['--spacing-6'],
  },
  mobileOverlay: {
    backgroundColor: colorVars['--color-background-surface'],
    display: {
      default: 'block',
      '@media (min-width: 1024px)': 'none',
    },
    insetBlockEnd: 0,
    insetBlockStart: '64px',
    insetInline: 0,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    position: 'fixed',
    zIndex: 30,
  },
});

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
  const [openMobileNavPathname, setOpenMobileNavPathname] = useState(
    /** @type {string | null} */ (null),
  );
  const isMobileNavOpen = openMobileNavPathname === pathname;
  const hasSideNav = SIDE_NAV_ROUTES.some((href) =>
    isNavLinkActive(pathname, href),
  );
  const hasMdxLayout =
    pathname === '/docs' ||
    pathname.startsWith('/docs/') ||
    pathname.startsWith('/tutorial/');
  const closeMobileNav = () => setOpenMobileNavPathname(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const closeAtDesktop = () => {
      if (!media.matches) setOpenMobileNavPathname(null);
    };

    closeAtDesktop();
    media.addEventListener('change', closeAtDesktop);
    return () => media.removeEventListener('change', closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingInlineEnd = document.body.style.paddingInlineEnd;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingInlineEnd = `${scrollbarWidth}px`;
    }

    /** @param {KeyboardEvent} event */
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpenMobileNavPathname(null);
    };
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingInlineEnd = previousPaddingInlineEnd;
    };
  }, [isMobileNavOpen]);

  return (
    <div {...stylex.props(styles.root)}>
      <header {...stylex.props(styles.topNav)}>
        <Header
          siteName={site.name}
          navLinks={navLinks}
          endContent={endContent}
          isMobileNavOpen={isMobileNavOpen}
          onMobileNavToggle={() =>
            setOpenMobileNavPathname((openPathname) =>
              openPathname === pathname ? null : pathname,
            )
          }
        />
      </header>

      <div {...stylex.props(styles.layout, hasMdxLayout && styles.docsLayout)}>
        {hasSideNav ? (
          <aside
            aria-label="Điều hướng tài liệu trên máy tính"
            {...stylex.props(styles.desktopSideNav)}
          >
            <div {...stylex.props(styles.desktopSideNavInner)}>
              <AppSideNav
                routeTrees={sideNavRouteTrees}
                onNavigate={closeMobileNav}
              />
            </div>
          </aside>
        ) : null}

        <main
          {...stylex.props(styles.main, !hasMdxLayout && styles.paddedMain)}
        >
          {children}
          <Footer siteName={site.name} year={year} />
        </main>
      </div>

      {hasSideNav && isMobileNavOpen ? (
        <aside
          aria-label="Điều hướng tài liệu trên thiết bị di động"
          {...stylex.props(styles.mobileOverlay)}
        >
          <AppSideNav
            routeTrees={sideNavRouteTrees}
            onNavigate={closeMobileNav}
          />
        </aside>
      ) : null}
    </div>
  );
}
