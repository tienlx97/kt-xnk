import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Code } from '@astryxdesign/core/Code';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Divider } from '@astryxdesign/core/Divider';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
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
    paddingInlineEnd: spacingVars['--spacing-5'],
    scrollMarginTop: `calc(4rem + ${spacingVars['--spacing-5']})`,
  },
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
    textDecorationColor: colorVars['--color-accent'],
    textDecorationThickness: borderVars['--border-width'],
    textUnderlineOffset: spacingVars['--spacing-0-5'],
  },
  blockquote: {
    backgroundColor: colorVars['--color-accent-muted'],
    borderInlineStartColor: colorVars['--color-accent'],
    borderRadius: radiusVars['--radius-container'],
    paddingBlock: spacingVars['--spacing-3'],
    paddingInlineEnd: spacingVars['--spacing-4'],
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

  return (
    <Heading
      level={level}
      id={id}
      data-mdx-heading
      xstyle={[contentStyles.heading, xstyle]}
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
    </Heading>
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

  return <CodeBlock code={code} language={language} />;
}

/**
 * @param {{ href?: string, children: import('react').ReactNode }} props
 */
function MdxLink({ href, children }) {
  return (
    <Link
      href={href}
      color="accent"
      hasUnderline
      type="inherit"
      xstyle={contentStyles.link}
    >
      {children}
    </Link>
  );
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
function MdxBlockquote({ children }) {
  return <Blockquote xstyle={contentStyles.blockquote}>{children}</Blockquote>;
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
function MdxStrong({ children }) {
  return <strong {...stylex.props(contentStyles.emphasis)}>{children}</strong>;
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
      <Text as="p" type="body" xstyle={contentStyles.introParagraph}>
        {children}
      </Text>
    ),
    a: MdxLink,
    strong: MdxStrong,
    blockquote: MdxBlockquote,
    code: Code,
    pre: Pre,
    hr: Divider,
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
