import './globals.css';

import { AppShell } from '@astryxdesign/core/AppShell';

import { UserMenu } from '../features/auth/index.js';
import { Footer } from '../shared/components/footer.js';
import { Header } from '../shared/components/header.js';
import { QueryProvider } from '../shared/components/query-provider.js';
import { AppSideNav } from '../shared/components/side-nav.js';
import { ThemeProvider } from '../shared/components/theme-provider.js';
import { navLinks, site } from '../shared/config/site.js';

export const metadata = {
  title: site.name,
  description: site.description,
};

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <QueryProvider>
          <ThemeProvider>
            <AppShell
              height="auto"
              variant="elevated"
              contentPadding={6}
              topNav={<Header siteName={site.name} navLinks={[]} endContent={<UserMenu />} />}
              sideNav={<AppSideNav navLinks={navLinks} />}>
              {children}
              <Footer siteName={site.name} year={new Date().getFullYear()} />
            </AppShell>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
