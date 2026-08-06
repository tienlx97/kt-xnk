import './globals.css';

import { Footer } from '../shared/components/footer.js';
import { Header } from '../shared/components/header.js';
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
        <ThemeProvider>
          <Header siteName={site.name} navLinks={navLinks} />
          {children}
          <Footer siteName={site.name} year={new Date().getFullYear()} />
        </ThemeProvider>
      </body>
    </html>
  );
}
