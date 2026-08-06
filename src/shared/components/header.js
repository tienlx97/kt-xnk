'use client';

import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';

/** @typedef {import('../types/index.js').NavLink} NavLink */

/**
 * @param {{ siteName: string, navLinks: NavLink[] }} props
 */
export function Header({ siteName, navLinks }) {
  return (
    <header>
      <TopNav
        label="Điều hướng chính"
        heading={<TopNavHeading heading={siteName} headingHref="/" />}
        startContent={navLinks.map((link) => (
          <TopNavItem key={link.href} label={link.label} href={link.href} />
        ))}
      />
    </header>
  );
}
