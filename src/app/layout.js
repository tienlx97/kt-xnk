import './globals.css';
import { Header } from '../ui/header.js';
import { Footer } from '../ui/footer.js';
import { site, navLinks } from '../config/site.js';

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
        <Header siteName={site.name} navLinks={navLinks} />
        {children}
        <Footer siteName={site.name} year={new Date().getFullYear()} />
      </body>
    </html>
  );
}
