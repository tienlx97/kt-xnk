import './globals.css';

import { navLinks, site } from '../config/site.js';
import { Footer } from '../ui/footer.js';
import { Header } from '../ui/header.js';
import { ThemeProvider } from '../ui/theme-provider.js';

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
