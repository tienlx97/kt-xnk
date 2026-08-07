'use client';

import { TopNav, TopNavHeading, TopNavItem } from '@astryxdesign/core/TopNav';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { isNavLinkActive } from '../api/nav.js';

/** @typedef {import('../types/index.js').NavLink} NavLink */

/**
 * @param {{ siteName: string, navLinks: NavLink[], endContent?: import('react').ReactNode }} props
 */
export function Header({ siteName, navLinks, endContent }) {
  const pathname = usePathname();

  return (
    <TopNav
      label="Điều hướng chính"
      endContent={endContent}
      heading={
        <TopNavHeading
          headingHref="/"
          logo={
            <Image
              src="/images/logo-dn-group.png"
              alt={siteName}
              width={132}
              height={38}
              priority
            />
          }
        />
      }
      startContent={navLinks.map((link) => (
        <TopNavItem
          key={link.href}
          label={link.label}
          href={link.href}
          isSelected={isNavLinkActive(pathname, link.href)}
        />
      ))}
    />
  );
}
