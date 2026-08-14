'use client';

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
  mobileNav: {
    minHeight: '100%',
    width: '100%',
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
 * React Docs-style route group. Groups with an overview `path` keep the parent
 * row as a navigable link. Pure category groups omit `path` and use the full
 * row as a disclosure button.
 * @param {{ route: SidebarRouteItem, pathname: string, onNavigate: () => void }} props
 */
function SideNavGroup({ route, pathname, onNavigate }) {
  const routePath = route.path;
  const containsActiveRoute =
    (routePath ? isNavLinkActive(pathname, routePath) : false) ||
    (route.routes?.some((child) =>
      child.path ? isNavLinkActive(pathname, child.path) : false,
    ) ??
      false);
  const [isExpanded, setIsExpanded] = useState(containsActiveRoute);
  const isSelected = routePath ? pathname === routePath : false;
  const groupKey = routePath?.slice(1) ?? route.title ?? 'group';
  const childrenId = `side-nav-${groupKey.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-children`;

  const label = (
    <>
      <Text type="inherit" xstyle={styles.label}>
        {route.title}
      </Text>
      <Icon
        icon="chevronDown"
        size="sm"
        color="inherit"
        xstyle={[styles.chevron, isExpanded && styles.chevronExpanded]}
      />
    </>
  );

  return (
    <li {...stylex.props(styles.item)}>
      {routePath ? (
        <Link
          href={routePath}
          aria-current={isSelected ? 'page' : undefined}
          aria-controls={childrenId}
          aria-expanded={isExpanded}
          onClick={onNavigate}
          {...stylex.props(styles.row, isSelected && styles.selected)}
        >
          {label}
        </Link>
      ) : (
        <button
          type="button"
          aria-controls={childrenId}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          {...stylex.props(styles.row)}
        >
          {label}
        </button>
      )}
      {isExpanded && (
        <ul id={childrenId} {...stylex.props(styles.list, styles.nestedList)}>
          {route.routes?.map((child) => (
            <SideNavLink
              key={child.path}
              route={child}
              pathname={pathname}
              isChild
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * @param {{ route: SidebarRouteItem, pathname: string, isChild?: boolean, onNavigate: () => void }} props
 */
function SideNavLink({ route, pathname, isChild = false, onNavigate }) {
  const routePath = route.path ?? '/';
  const isSelected = pathname === routePath;

  return (
    <li {...stylex.props(styles.item)}>
      <Link
        href={routePath}
        aria-current={isSelected ? 'page' : undefined}
        onClick={onNavigate}
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
 * @param {{
 *   routeTrees: import('../types/index.js').SidebarRouteTree[],
 *   titles?: string[],
 *   isMobile?: boolean,
 *   onNavigate?: () => void,
 * }} props
 */
export function AppSideNav({
  routeTrees,
  titles = [],
  isMobile = false,
  onNavigate = () => {},
}) {
  const pathname = usePathname();
  const activeRouteTree = routeTrees.find((routeTree) =>
    isNavLinkActive(pathname, routeTree.path),
  );

  if (!activeRouteTree) return null;

  return (
    <nav
      aria-label="Điều hướng tài liệu"
      {...stylex.props(styles.nav, isMobile && styles.mobileNav)}
    >
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
              ) : route.routes ? (
                <SideNavGroup
                  route={route}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ) : !route.path ? null : (
                <SideNavLink
                  route={route}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
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
