'use client';

import { useAppShellMobile } from '@astryxdesign/core/AppShell';
import { Icon } from '@astryxdesign/core/Icon';
import { Text } from '@astryxdesign/core/Text';
import {
  colorVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useState } from 'react';

import { isNavLinkActive } from '../api/nav.js';

/** @typedef {import('../types/index.js').SidebarRouteItem} SidebarRouteItem */

const styles = stylex.create({
  nav: {
    backgroundColor: colorVars['--color-background-surface'],
    color: colorVars['--color-text-secondary'],
    fontFamily: 'var(--font-family-body)',
    minHeight: '100%',
    paddingBlock: spacingVars['--spacing-4'],
    width: '20rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-0-5'],
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  nestedList: {
    paddingBlockStart: spacingVars['--spacing-0-5'],
  },
  item: {
    margin: 0,
    padding: 0,
  },
  row: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-background-muted'],
    },
    borderRadius: `0 ${radiusVars['--radius-container']} ${radiusVars['--radius-container']} 0`,
    borderWidth: 0,
    color: colorVars['--color-text-primary'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: '0.9375rem',
    fontWeight: fontWeightVars['--font-weight-bold'],
    justifyContent: 'space-between',
    lineHeight: 1.5,
    minHeight: spacingVars['--spacing-10'],
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    outlineOffset: '-2px',
    paddingBlock: spacingVars['--spacing-2'],
    paddingInlineEnd: spacingVars['--spacing-3'],
    paddingInlineStart: spacingVars['--spacing-5'],
    textAlign: 'start',
    textDecoration: 'none',
    width: '100%',
  },
  childRow: {
    color: colorVars['--color-text-secondary'],
    fontSize: '0.8125rem',
    fontWeight: fontWeightVars['--font-weight-normal'],
    lineHeight: 1.5,
    minHeight: spacingVars['--spacing-9'],
    paddingInlineStart: spacingVars['--spacing-8'],
  },
  selected: {
    backgroundColor: {
      default: colorVars['--color-accent-muted'],
      ':hover': colorVars['--color-accent-muted'],
    },
    color: colorVars['--color-text-accent'],
    fontWeight: fontWeightVars['--font-weight-bold'],
  },
  selectedChild: {
    fontSize: '0.8125rem',
  },
  label: {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  chevron: {
    flexShrink: 0,
    transitionDuration: '200ms',
    transitionProperty: 'transform',
    transitionTimingFunction: 'ease-in-out',
  },
  chevronExpanded: {
    transform: 'rotate(180deg)',
  },
  sectionHeader: {
    borderBlockStartColor: colorVars['--color-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: '1px',
    color: colorVars['--color-text-secondary'],
    fontSize: '0.8125rem',
    fontWeight: fontWeightVars['--font-weight-bold'],
    lineHeight: 1.5,
    marginBlockEnd: spacingVars['--spacing-1'],
    marginBlockStart: spacingVars['--spacing-4'],
    marginInline: spacingVars['--spacing-5'],
    paddingBlockStart: spacingVars['--spacing-3'],
  },
});

/**
 * React Docs-inspired expandable route group. The whole parent row is the
 * disclosure button, while article children remain real navigation links.
 * @param {{ route: SidebarRouteItem, pathname: string }} props
 */
function SideNavGroup({ route, pathname }) {
  const routePath = route.path ?? '/';
  const isRouteActive = isNavLinkActive(pathname, routePath);
  const [isExpanded, setIsExpanded] = useState(isRouteActive);
  const childrenId = `side-nav-${routePath.slice(1)}-children`;

  return (
    <li {...stylex.props(styles.item)}>
      <button
        type="button"
        aria-controls={childrenId}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        {...stylex.props(styles.row, isRouteActive && styles.selected)}
      >
        <Text type="inherit" xstyle={styles.label}>
          {route.title}
        </Text>
        <Icon
          icon="chevronDown"
          size="sm"
          color="inherit"
          xstyle={[styles.chevron, isExpanded && styles.chevronExpanded]}
        />
      </button>
      {isExpanded && (
        <ul id={childrenId} {...stylex.props(styles.list, styles.nestedList)}>
          {route.routes?.map((child) => (
            <SideNavLink
              key={child.path}
              route={child}
              pathname={pathname}
              isChild
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * @param {{ route: SidebarRouteItem, pathname: string, isChild?: boolean }} props
 */
function SideNavLink({ route, pathname, isChild = false }) {
  const routePath = route.path ?? '/';
  const isSelected = pathname === routePath;
  const { closeMobileNav } = useAppShellMobile();

  return (
    <li {...stylex.props(styles.item)}>
      <Link
        href={routePath}
        aria-current={isSelected ? 'page' : undefined}
        onClick={closeMobileNav}
        {...stylex.props(
          styles.row,
          isChild && styles.childRow,
          isSelected && styles.selected,
          isChild && isSelected && styles.selectedChild,
        )}
      >
        <Text type="inherit" xstyle={styles.label}>
          {route.title}
        </Text>
      </Link>
    </li>
  );
}

/**
 * Custom documentation sidebar based on react.dev's SidebarRouteTree and
 * SidebarLink structure, without Astryx SideNav components.
 * The registry schema intentionally matches react.dev's `sidebar*.json`
 * files: a root route tree containing links, nested `routes`, and optional
 * section-header records.
 * @param {{ routeTrees: import('../types/index.js').SidebarRouteTree[], titles?: string[] }} props
 */
export function AppSideNav({ routeTrees, titles = [] }) {
  const pathname = usePathname();
  const activeRouteTree = routeTrees.find((routeTree) =>
    isNavLinkActive(pathname, routeTree.path),
  );

  if (!activeRouteTree) return null;

  return (
    <nav aria-label="Điều hướng tài liệu" {...stylex.props(styles.nav)}>
      <ul {...stylex.props(styles.list)}>
        {activeRouteTree.routes.map((route, index) => {
          const routeKey =
            route.path ??
            route.sectionHeader ??
            route.title ??
            `route-${index}`;

          return (
            <Fragment key={`${routeKey}-${index}`}>
              {route.hasSectionHeader === true ? (
                <li role="presentation">
                  <Text as="h3" type="inherit" xstyle={styles.sectionHeader}>
                    {route.sectionHeader}
                  </Text>
                </li>
              ) : !route.path ? null : route.routes ? (
                <SideNavGroup route={route} pathname={pathname} />
              ) : (
                <SideNavLink route={route} pathname={pathname} />
              )}
            </Fragment>
          );
        })}
      </ul>
      {titles.map((title) => (
        <Text
          key={title}
          as="p"
          type="supporting"
          xstyle={styles.sectionHeader}
        >
          {title}
        </Text>
      ))}
    </nav>
  );
}
