/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';

import { IconBluesky } from '../icon/icon-bluesky.jsx';
import { IconGitHub } from '../icon/icon-github.jsx';
import { IconLink } from '../icon/icon-link.jsx';
import { IconThreads } from '../icon/icon-threads.jsx';
import { IconTwitter } from '../icon/icon-twitter.jsx';

const styles = stylex.create({
  wrapper: {
    paddingBlockEnd: {
      default: '24px',
      '@media (min-width: 640px)': '40px',
    },
  },
  layout: {
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 640px)': 'row',
    },
  },
  photo: {
    borderRadius: '8px',
    display: {
      default: 'none',
      '@media (min-width: 640px)': 'block',
    },
    flexBasis: '40%',
    height: '250px',
    overflow: 'hidden',
    position: 'relative',
    width: '300px',
  },
  photoMobile: {
    borderRadius: '8px',
    display: {
      default: 'block',
      '@media (min-width: 640px)': 'none',
    },
    flexBasis: '40%',
    flexGrow: 1,
    minHeight: '300px',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  image: {
    objectFit: 'cover',
  },
  body: {
    flexBasis: '60%',
    paddingInlineStart: {
      default: 0,
      '@media (min-width: 640px)': '24px',
    },
  },
  name: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.25,
    marginBlock: {
      default: '4px 0',
      '@media (min-width: 640px)': '0',
    },
  },
  title: {
    color: 'var(--color-text-primary)',
  },
  groups: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8px',
    marginBlock: '12px',
  },
  groupBadge: {
    alignItems: 'center',
    backgroundColor: 'var(--color-accent-muted)',
    borderRadius: '9999px',
    color: 'var(--color-text-accent)',
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    paddingBlock: '4px',
    paddingInline: '12px',
    whiteSpace: 'nowrap',
  },
  leadMark: {
    color: 'var(--color-warning)',
    paddingInlineStart: '4px',
  },
  socials: {
    color: 'var(--color-text-secondary)',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: '15px',
  },
  socialLink: {
    alignItems: 'center',
    color: {
      default: 'var(--color-text-secondary)',
      ':hover': 'var(--color-text-primary)',
    },
    display: 'flex',
    flexDirection: 'row',
    marginInlineEnd: '16px',
    textDecoration: { ':hover': 'underline' },
  },
  socialIcon: {
    paddingInlineEnd: '4px',
  },
});

/** @param {{ group: string }} props */
function GroupBadges({ group }) {
  const groups = group
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (groups.length === 0) return null;

  return (
    <div {...stylex.props(styles.groups)}>
      {groups.map((entry) => {
        const isLead = entry.endsWith('*');
        const label = isLead ? entry.slice(0, -1).trim() : entry;
        return (
          <span key={entry} {...stylex.props(styles.groupBadge)}>
            {label}
            {isLead ? (
              <span
                aria-label="Thành viên hội đồng lãnh đạo"
                title="Thành viên hội đồng lãnh đạo"
                {...stylex.props(styles.leadMark)}
              >
                ★
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

/**
 * @param {{ href: string, label: string, children: import('react').ReactNode }} props
 */
function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      {...stylex.props(styles.socialLink)}
    >
      {children}
    </a>
  );
}

/**
 * Team-directory profile ported from react.dev's `components/MDX/TeamMember.tsx`.
 * KT-XNK has no equivalent product-team roster, so this renders whatever
 * name/title/photo/social props the author supplies.
 * @param {{
 *   name: string,
 *   title: string,
 *   permalink: string,
 *   children?: import('react').ReactNode,
 *   photo: string,
 *   twitter?: string,
 *   threads?: string,
 *   bsky?: string,
 *   github?: string,
 *   personal?: string,
 *   group?: string,
 * }} props
 */
export function TeamMember({
  name,
  title,
  permalink,
  children,
  photo,
  github,
  twitter,
  threads,
  bsky,
  personal,
  group,
}) {
  if (name == null || title == null || permalink == null) {
    const identifier = name ?? title ?? permalink ?? 'unknown';
    throw new Error(`Thiếu name, title, hoặc permalink cho ${identifier}`);
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.layout)}>
        <div {...stylex.props(styles.photo)}>
          <Image
            src={photo}
            alt={name}
            fill
            sizes="300px"
            {...stylex.props(styles.image)}
          />
        </div>
        <div {...stylex.props(styles.photoMobile)}>
          <Image
            src={photo}
            alt={name}
            fill
            sizes="100vw"
            {...stylex.props(styles.image)}
          />
        </div>
        <div {...stylex.props(styles.body)}>
          <h3 id={permalink} {...stylex.props(styles.name)}>
            {name}
          </h3>
          {title ? <div {...stylex.props(styles.title)}>{title}</div> : null}
          {group ? <GroupBadges group={group} /> : null}
          {children}
          <div {...stylex.props(styles.socials)}>
            {twitter ? (
              <SocialLink
                href={`https://twitter.com/${twitter}`}
                label={`${name} trên Twitter`}
              >
                <IconTwitter {...stylex.props(styles.socialIcon)} />
                {twitter}
              </SocialLink>
            ) : null}
            {threads ? (
              <SocialLink
                href={`https://threads.net/${threads}`}
                label={`${name} trên Threads`}
              >
                <IconThreads {...stylex.props(styles.socialIcon)} />
                {threads}
              </SocialLink>
            ) : null}
            {bsky ? (
              <SocialLink
                href={`https://bsky.app/profile/${bsky}`}
                label={`${name} trên Bluesky`}
              >
                <IconBluesky {...stylex.props(styles.socialIcon)} />
                {bsky}
              </SocialLink>
            ) : null}
            {github ? (
              <SocialLink
                href={`https://github.com/${github}`}
                label="Hồ sơ GitHub"
              >
                <IconGitHub {...stylex.props(styles.socialIcon)} />
                {github}
              </SocialLink>
            ) : null}
            {personal ? (
              <SocialLink href={`https://${personal}`} label="Trang cá nhân">
                <IconLink {...stylex.props(styles.socialIcon)} />
                {personal}
              </SocialLink>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
