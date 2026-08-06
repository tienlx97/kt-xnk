'use client';

import {
  SideNav,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { usePathname } from 'next/navigation';

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
            isSelected={pathname === link.href}
          />
        ))}
      </SideNavSection>
    </SideNav>
  );
}
