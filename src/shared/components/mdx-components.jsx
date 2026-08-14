import {
  borderVars,
  colorVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
  typeScaleVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import NextLink from 'next/link';

import { Intro } from './intro.jsx';
import { FullWidth, MaxWidth } from './mdx/content-width.jsx';
import { DeepDive } from './mdx/deep-dive.jsx';
import { Figure } from './mdx/figure.jsx';
import { HeadingAnchorIcon } from './mdx/heading-anchor-icon.jsx';
import { imageStyles } from './mdx/image-styles.js';
import { Note } from './mdx/note.jsx';
import { Pitfall } from './mdx/pitfall.jsx';
import { YouWillLearn } from './mdx/you-will-learn.jsx';
import { YouTubeEmbed } from './mdx/youtube-embed.jsx';

// List/ListItem require a string `label`, not arbitrary rich children, so
// they don't cover free-form MDX content — ul/ol/li stay native elements,
// just restyled: the Astryx reset strips default markers/spacing, so
// unstyled they'd render as unbulleted, unindented paragraphs.
const listStyles = stylex.create({
  ol: {
    listStyleType: 'decimal',
    marginBlock: spacingVars['--spacing-4'],
    paddingInlineStart: spacingVars['--spacing-6'],
  },
  ul: {
    listStyleType: 'disc',
    marginBlock: spacingVars['--spacing-4'],
    paddingInlineStart: spacingVars['--spacing-6'],
  },
  li: {
    marginBlock: spacingVars['--spacing-1'],
  },
});

const contentStyles = stylex.create({
  heading: {
    color: colorVars['--color-text-primary'],
    fontFamily: typographyVars['--font-family-heading'],
    fontWeight: fontWeightVars['--font-weight-bold'],
    lineHeight: 1.25,
    margin: 0,
    paddingInlineEnd: spacingVars['--spacing-5'],
    scrollMarginTop: `calc(4rem + ${spacingVars['--spacing-5']})`,
  },
  h1: { fontSize: '3rem' },
  h2: { fontSize: '1.5rem' },
  h3: { fontSize: '1.25rem' },
  h4: { fontSize: '1.125rem' },
  h5: { fontSize: '1rem' },
  h6: { fontSize: '0.875rem' },
  headingAnchor: {
    color: colorVars['--color-text-accent'],
    display: 'inline-block',
    height: 0,
    textDecoration: 'none',
    width: 0,
  },
  sectionHeading: {
    borderBlockEndColor: colorVars['--color-accent-muted'],
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: borderVars['--border-width'],
    paddingBlockEnd: spacingVars['--spacing-2'],
  },
  link: {
    color: colorVars['--color-text-accent'],
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    textDecorationColor: colorVars['--color-accent'],
    textDecorationLine: 'underline',
    textDecorationThickness: borderVars['--border-width'],
    textUnderlineOffset: spacingVars['--spacing-0-5'],
  },
  blockquote: {
    backgroundColor: colorVars['--color-accent-muted'],
    borderInlineStartColor: colorVars['--color-accent'],
    borderRadius: radiusVars['--radius-container'],
    paddingBlock: spacingVars['--spacing-3'],
    paddingInlineEnd: spacingVars['--spacing-4'],
    paddingInlineStart: spacingVars['--spacing-6'],
  },
  paragraph: {
    fontFamily: typographyVars['--font-family-body'],
    fontSize: '1.0625rem',
    lineHeight: 1.5,
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  inlineCode: {
    backgroundColor: colorVars['--color-background-muted'],
    borderRadius: radiusVars['--radius-element'],
    fontFamily: 'var(--font-family-code)',
    fontSize: '0.875em',
    paddingBlock: spacingVars['--spacing-0-5'],
    paddingInline: spacingVars['--spacing-1'],
  },
  codeBlock: {
    backgroundColor: colorVars['--color-background-muted'],
    borderColor: colorVars['--color-border'],
    borderRadius: radiusVars['--radius-container'],
    borderStyle: 'solid',
    borderWidth: borderVars['--border-width'],
    fontFamily: 'var(--font-family-code)',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    margin: 0,
    overflowX: 'auto',
    padding: spacingVars['--spacing-4'],
    whiteSpace: 'pre',
  },
  divider: {
    borderBlockEndColor: colorVars['--color-border'],
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: borderVars['--border-width'],
    borderBlockStartWidth: 0,
    marginBlock: spacingVars['--spacing-6'],
  },
  emphasis: {
    color: colorVars['--color-text-accent'],
  },
  introParagraph: {
    fontFamily: {
      default: null,
      ':is([data-mdx-intro] *)': typographyVars['--font-family-heading'],
    },
    fontSize: {
      default: null,
      ':is([data-mdx-intro] *)': typeScaleVars['--text-large-size'],
    },
    fontWeight: {
      default: null,
      ':is([data-mdx-intro] *)': fontWeightVars['--font-weight-normal'],
    },
    lineHeight: {
      default: null,
      ':is([data-mdx-intro] *)': typeScaleVars['--text-supporting-leading'],
    },
  },
});

/**
 * React.dev-style MDX heading with an in-page permalink for h2-h6.
 * @param {{
 *   level: 1 | 2 | 3 | 4 | 5 | 6,
 *   id?: string,
 *   children: import('react').ReactNode,
 *   xstyle?: import('@stylexjs/stylex').StyleXStyles,
 * }} props
 */
function MdxHeading({ level, id, children, xstyle }) {
  const label =
    typeof children === 'string'
      ? `Liên kết đến mục ${children}`
      : 'Liên kết đến mục này';
  const hasPageAnchor = level !== 1 && Boolean(id);
  const HeadingTag = /** @type {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} */ (
    `h${level}`
  );
  const levelStyle = [
    contentStyles.h1,
    contentStyles.h2,
    contentStyles.h3,
    contentStyles.h4,
    contentStyles.h5,
    contentStyles.h6,
  ][level - 1];

  return (
    <HeadingTag
      id={id}
      data-mdx-heading
      {...stylex.props(contentStyles.heading, levelStyle, xstyle)}
    >
      {children}
      {hasPageAnchor ? (
        <a
          href={`#${id}`}
          aria-label={label}
          title={label}
          {...stylex.props(contentStyles.headingAnchor)}
        >
          <HeadingAnchorIcon />
        </a>
      ) : null}
    </HeadingTag>
  );
}

/**
 * Reads the language + code string off the `<code>` element MDX nests
 * inside a fenced block, so CodeBlock (which takes `code` as a string prop,
 * not children) can render it.
 * @param {{ children: { props?: { className?: string, children?: import('react').ReactNode } } }} props
 */
function Pre({ children }) {
  const className = children?.props?.className ?? '';
  const language = className.replace('language-', '') || 'plaintext';
  const code = String(children?.props?.children ?? '').replace(/\n$/, '');

  return (
    <pre data-language={language} {...stylex.props(contentStyles.codeBlock)}>
      <code>{code}</code>
    </pre>
  );
}

/**
 * @param {{ href?: string, children: import('react').ReactNode }} props
 */
function MdxLink({ href, children }) {
  return (
    <NextLink href={href ?? '#'} {...stylex.props(contentStyles.link)}>
      {children}
    </NextLink>
  );
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
function MdxBlockquote({ children }) {
  return (
    <blockquote {...stylex.props(contentStyles.blockquote)}>
      {children}
    </blockquote>
  );
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
function MdxStrong({ children }) {
  return <strong {...stylex.props(contentStyles.emphasis)}>{children}</strong>;
}

/** @param {{ children: import('react').ReactNode }} props */
function MdxCode({ children }) {
  return <code {...stylex.props(contentStyles.inlineCode)}>{children}</code>;
}

/**
 * Maps the HTML elements MDX compiles headings/paragraphs/links/etc. into
 * local authoring components. Astryx primitives remain intentional here, but
 * the MDX authoring policy also permits native or local react.dev-style UI.
 * @param {Record<string, import('react').ComponentType>} components
 */
export function useMDXComponents(components) {
  return {
    // `id` comes from rehype-slug (see next.config.mjs) — it's what TOC
    // hrefs (src/shared/api/toc.js) anchor-link to.
    /** @param {{ id?: string, children: import('react').ReactNode }} props */
    h1: ({ id, children }) => (
      <MdxHeading level={1} id={id}>
        {children}
      </MdxHeading>
    ),
    /** @param {{ id?: string, children: import('react').ReactNode }} props */
    h2: ({ id, children }) => (
      <MdxHeading level={2} id={id} xstyle={contentStyles.sectionHeading}>
        {children}
      </MdxHeading>
    ),
    /** @param {{ id?: string, children: import('react').ReactNode }} props */
    h3: ({ id, children }) => (
      <MdxHeading level={3} id={id}>
        {children}
      </MdxHeading>
    ),
    /** @param {{ id?: string, children: import('react').ReactNode }} props */
    h4: ({ id, children }) => (
      <MdxHeading level={4} id={id}>
        {children}
      </MdxHeading>
    ),
    /** @param {{ id?: string, children: import('react').ReactNode }} props */
    h5: ({ id, children }) => (
      <MdxHeading level={5} id={id}>
        {children}
      </MdxHeading>
    ),
    /** @param {{ id?: string, children: import('react').ReactNode }} props */
    h6: ({ id, children }) => (
      <MdxHeading level={6} id={id}>
        {children}
      </MdxHeading>
    ),
    /** @param {{ children: import('react').ReactNode }} props */
    p: ({ children }) => (
      <p
        {...stylex.props(contentStyles.paragraph, contentStyles.introParagraph)}
      >
        {children}
      </p>
    ),
    a: MdxLink,
    strong: MdxStrong,
    blockquote: MdxBlockquote,
    code: MdxCode,
    pre: Pre,
    hr: () => <hr {...stylex.props(contentStyles.divider)} />,
    /** @param {{ children: import('react').ReactNode }} props */
    ul: ({ children }) => <ul {...stylex.props(listStyles.ul)}>{children}</ul>,
    /** @param {{ children: import('react').ReactNode }} props */
    ol: ({ children }) => <ol {...stylex.props(listStyles.ol)}>{children}</ol>,
    /** @param {{ children: import('react').ReactNode }} props */
    li: ({ children }) => <li {...stylex.props(listStyles.li)}>{children}</li>,
    // Plain markdown images (`![]()`) — a raw `<img>` slips through the
    // no-raw-markup rule otherwise. Same treatment as the opt-in `Figure`
    // component below, minus the caption.
    /** @param {{ src?: string, alt?: string }} props */
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element -- see comment above
      <img src={src} alt={alt} {...stylex.props(imageStyles.img)} />
    ),
    // Authoring components for callouts, expandable sections, captioned
    // images, and video embeds — see src/shared/components/mdx/.
    Note,
    Pitfall,
    DeepDive,
    YouWillLearn,
    Figure,
    YouTubeEmbed,
    Intro,
    FullWidth,
    MaxWidth,
    ...components,
  };
}
