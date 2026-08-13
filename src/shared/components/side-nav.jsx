'use client';

import { Divider } from '@astryxdesign/core/Divider';
import {
  SideNav,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { VStack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import { isNavLinkActive } from '../api/nav.js';

/** @typedef {import('../types/index.js').NavLink} NavLink */

/**
 * @param {{ navLinks: NavLink[], titles?: string[] }} props
 */
export function AppSideNav({ navLinks, titles = [] }) {
  const pathname = usePathname();

  return (
    <SideNav key={pathname}>
      <SideNavSection title="Điều hướng" isHeaderHidden>
        {navLinks.map((link) => {
          const isActive = isNavLinkActive(pathname, link.href);

          return (
            <SideNavItem
              key={link.href}
              label={link.label}
              href={link.children ? undefined : link.href}
              isSelected={pathname === link.href}
              collapsible={
                link.children ? { defaultIsCollapsed: !isActive } : false
              }
            >
              {link.children?.map((child) => (
                <SideNavItem
                  key={child.href}
                  label={child.label}
                  href={child.href}
                  isSelected={pathname === child.href}
                />
              ))}
            </SideNavItem>
          );
        })}
      </SideNavSection>
      {titles.length > 0 && (
        <VStack gap={2} paddingInline={2} paddingBlock={1}>
          {titles.map((title) => (
            <Fragment key={title}>
              <Divider />
              <Text type="supporting" weight="semibold">
                {title}
              </Text>
            </Fragment>
          ))}
        </VStack>
      )}
    </SideNav>
  );
}
