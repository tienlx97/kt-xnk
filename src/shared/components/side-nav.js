'use client';

import {
  SideNav,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { usePathname } from 'next/navigation';

import { isNavLinkActive } from '../api/nav.js';

/** @typedef {import('../types/index.js').NavLink} NavLink */

/**
 * @param {{ navLinks: NavLink[] }} props
 */
export function AppSideNav({ navLinks }) {
  const pathname = usePathname();

  return (
    <SideNav>
      <SideNavSection title="Điều hướng" isHeaderHidden>
        {navLinks.map((link) => (
          <SideNavItem
            key={link.href}
            label={link.label}
            href={link.href}
            isSelected={isNavLinkActive(pathname, link.href)}
          />
        ))}
      </SideNavSection>
    </SideNav>
  );
}
