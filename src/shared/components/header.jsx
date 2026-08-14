'use client';

import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import {
  colorVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isNavLinkActive } from '../api/nav.js';

/** @typedef {import('../types/index.js').NavLink} NavLink */

const styles = stylex.create({
  nav: {
    alignItems: 'center',
    backgroundColor: colorVars['--color-background-surface'],
    display: 'flex',
    fontFamily: 'var(--font-family-body)',
    height: {
      default: '64px',
    },
    paddingInline: {
      default: spacingVars['--spacing-4'],
      '@media (max-width: 1023px)': spacingVars['--spacing-3'],
    },
    width: '100%',
  },
  brandArea: {
    minWidth: 0,
  },
  logoLink: {
    alignItems: 'center',
    borderRadius: radiusVars['--radius-element'],
    display: 'inline-flex',
    flexShrink: 0,
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    outlineOffset: spacingVars['--spacing-1'],
    transform: {
      default: 'scale(1)',
      ':active': 'scale(0.95)',
    },
  },
  logo: {
    height: {
      default: '2.5rem',
      '@media (max-width: 639px)': '2rem',
    },
    maxWidth: {
      default: null,
      '@media (max-width: 639px)': '7.5rem',
    },
    objectFit: 'contain',
    width: 'auto',
  },
  mobileToggle: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-background-muted'],
      ':active': colorVars['--color-overlay-pressed'],
    },
    borderRadius: radiusVars['--radius-full'],
    borderWidth: 0,
    color: colorVars['--color-icon-primary'],
    cursor: 'pointer',
    display: {
      default: 'none',
      '@media (max-width: 1023px)': 'inline-flex',
    },
    height: spacingVars['--spacing-10'],
    justifyContent: 'center',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    padding: 0,
    width: spacingVars['--spacing-10'],
  },
  primaryList: {
    alignItems: 'center',
    display: {
      default: 'flex',
      '@media (max-width: 1023px)': 'none',
    },
    gap: spacingVars['--spacing-1-5'],
    justifyContent: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  primaryItem: {
    margin: 0,
    padding: 0,
  },
  primaryLink: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-background-muted'],
    },
    borderRadius: radiusVars['--radius-full'],
    color: colorVars['--color-text-primary'],
    display: 'inline-flex',
    fontSize: '0.9375rem',
    fontWeight: fontWeightVars['--font-weight-normal'],
    lineHeight: 1.5,
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    paddingBlock: spacingVars['--spacing-1-5'],
    paddingInline: spacingVars['--spacing-4'],
    textDecoration: 'none',
    transform: {
      default: 'scale(1)',
      ':active': 'scale(0.95)',
    },
  },
  selectedPrimaryLink: {
    backgroundColor: {
      default: colorVars['--color-accent-muted'],
      ':hover': colorVars['--color-accent-muted'],
    },
    color: colorVars['--color-text-accent'],
    fontWeight: fontWeightVars['--font-weight-medium'],
  },
  endArea: {
    marginInlineStart: 'auto',
  },
});

/**
 * React Docs-inspired top navigation implemented directly with semantic
 * markup and StyleX rather than Astryx TopNav components.
 * @param {{
 *   siteName: string,
 *   navLinks: NavLink[],
 *   endContent?: import('react').ReactNode,
 *   isMobileNavOpen: boolean,
 *   onMobileNavToggle: () => void,
 * }} props
 */
export function Header({
  siteName,
  navLinks,
  endContent,
  isMobileNavOpen,
  onMobileNavToggle,
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Điều hướng chính" {...stylex.props(styles.nav)}>
      <HStack gap={2} vAlign="center" xstyle={styles.brandArea}>
        <button
          type="button"
          aria-label={isMobileNavOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={isMobileNavOpen}
          onClick={onMobileNavToggle}
          {...stylex.props(styles.mobileToggle)}
        >
          <Icon icon={isMobileNavOpen ? 'close' : 'menu'} size="md" />
        </button>
        <Link href="/" aria-label={siteName} {...stylex.props(styles.logoLink)}>
          <Image
            src="/images/logo-dn-group.png"
            alt={siteName}
            width={132}
            height={38}
            priority
            {...stylex.props(styles.logo)}
          />
        </Link>
      </HStack>

      <HStack gap={2} vAlign="center" xstyle={styles.endArea}>
        <ul {...stylex.props(styles.primaryList)}>
          {navLinks.map((link) => {
            const isSelected = isNavLinkActive(pathname, link.href);

            return (
              <li key={link.href} {...stylex.props(styles.primaryItem)}>
                <Link
                  href={link.href}
                  aria-current={isSelected ? 'page' : undefined}
                  {...stylex.props(
                    styles.primaryLink,
                    isSelected && styles.selectedPrimaryLink,
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {endContent}
      </HStack>
    </nav>
  );
}
