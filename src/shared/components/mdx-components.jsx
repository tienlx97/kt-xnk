import * as stylex from '@stylexjs/stylex';
import NextLink from 'next/link';

import { Intro } from './intro.jsx';
import { CodeBlock } from './mdx/code-block.jsx';
import {
  ConsoleBlock,
  ConsoleBlockMulti,
  ConsoleLogLine,
} from './mdx/console-block.jsx';
import { FullWidth, MaxWidth } from './mdx/content-width.jsx';
import { DeepDive } from './mdx/deep-dive.jsx';
import {
  CodeDiagram,
  Diagram,
  DiagramGroup,
  PackageImport,
} from './mdx/diagram-components.jsx';
import { ErrorDecoder } from './mdx/error-decoder.jsx';
import { Figure } from './mdx/figure.jsx';
import {
  Challenges,
  Hint as GuidedHint,
  Recipes,
  Solution as GuidedSolution,
} from './mdx/guided-learning.jsx';
import { HeadingAnchorIcon } from './mdx/heading-anchor-icon.jsx';
import { imageStyles } from './mdx/image-styles.js';
import { InlineToc } from './mdx/inline-toc.jsx';
import { LanguageList } from './mdx/language-list.jsx';
import {
  Canary,
  CanaryBadge,
  Deprecated,
  Experimental,
  ExperimentalBadge,
  NextMajor,
  NextMajorBadge,
  Note,
  Pitfall,
  RC,
  RSC,
  RSCBadge,
  Wip,
} from './mdx/react-dev-callouts.jsx';
import {
  BlogCard,
  LearnMore,
  ReadBlogPost,
  YouWillLearnCard,
} from './mdx/react-dev-cards.jsx';
import {
  Illustration,
  IllustrationBlock,
} from './mdx/react-dev-illustrations.jsx';
import { CodeStep, Math, MathI, Recap } from './mdx/react-dev-primitives.jsx';
import { TeamMember } from './mdx/team-member.jsx';
import { TerminalBlock } from './mdx/terminal-block.jsx';
import {
  borderVars,
  colorVars,
  fontWeightVars,
  radiusVars,
  spacingVars,
  typographyVars,
} from './mdx/tokens.stylex.js';
import { YouWillLearn } from './mdx/you-will-learn.jsx';
import { YouTubeEmbed } from './mdx/youtube-embed.jsx';

// List/ListItem require a string `label`, not arbitrary rich children, so
// they don't cover free-form MDX content — ul/ol/li stay native elements,
// just restyled: the app reset strips default markers/spacing, so
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
    lineHeight: 1.625,
    marginBlock: spacingVars['--spacing-1'],
  },
});

const contentStyles = stylex.create({
  heading: {
    color: colorVars['--color-text-primary'],
    fontFamily: typographyVars['--font-family-heading'],
    fontWeight: fontWeightVars['--font-weight-bold'],
    lineHeight: '50px',
    margin: 0,
    paddingInlineEnd: spacingVars['--spacing-5'],
    scrollMarginTop: `calc(4rem + ${spacingVars['--spacing-5']})`,
  },
  h1: { fontSize: '40px' },
  h2: { fontSize: '28px', lineHeight: '40px' },
  h3: { fontSize: '24px', lineHeight: '36px' },
  h4: { fontSize: '20px', lineHeight: '36px' },
  h5: { fontSize: '17px', lineHeight: '36px' },
  h6: { fontSize: '15px', lineHeight: '30px' },
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
    fontFamily: {
      default: typographyVars['--font-family-body'],
      ':is([data-mdx-intro] *)': typographyVars['--font-family-heading'],
    },
    fontSize: {
      default: '17px',
      ':is([data-mdx-intro] *)': '20px',
    },
    fontWeight: {
      default: fontWeightVars['--font-weight-medium'],
      ':is([data-mdx-intro] *)': fontWeightVars['--font-weight-medium'],
    },
    lineHeight: {
      default: '30px',
      ':is([data-mdx-intro] *)': '32.5px',
    },
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  inlineCode: {
    backgroundColor: colorVars['--color-background-muted'],
    borderRadius: radiusVars['--radius-element'],
    fontFamily: 'var(--font-family-code)',
    fontSize: 'calc(1em - 10%)',
    paddingBlock: spacingVars['--spacing-0-5'],
    paddingInline: spacingVars['--spacing-1'],
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
 * @param {{ children: { props?: { className?: string, children?: import('react').ReactNode, meta?: string } } }} props
 */
function Pre({ children }) {
  const className = children?.props?.className ?? '';
  const language = className.replace('language-', '') || 'plaintext';
  const code = String(children?.props?.children ?? '').replace(/\n$/, '');
  const meta = children?.props?.meta ?? '';

  return <CodeBlock code={code} language={language} meta={meta} />;
}

Pre.mdxName = 'pre';

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

/** @param {{ src?: string, alt?: string }} props */
function MdxImage({ src, alt }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- MDX supports authored image sources.
    <img src={src} alt={alt} {...stylex.props(imageStyles.img)} />
  );
}

MdxImage.mdxName = 'img';

/** @param {{ children: import('react').ReactNode }} props */
function MdxHint({ children }) {
  return <GuidedHint mdxType="Hint">{children}</GuidedHint>;
}

/** @param {{ children: import('react').ReactNode }} props */
function MdxSolution({ children }) {
  return <GuidedSolution mdxType="Solution">{children}</GuidedSolution>;
}

/**
 * Maps the HTML elements MDX compiles headings/paragraphs/links/etc. into
 * local authoring components. This registry and its component tree use local
 * semantic UI plus StyleX only; Astryx imports are prohibited in this surface.
 * @param {Record<string, import('react').ComponentType>} components
 */
export function useMDXComponents(components) {
  const mdxComponents = {
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
      <p {...stylex.props(contentStyles.paragraph)}>{children}</p>
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
    img: MdxImage,
    // Authoring components for callouts, expandable sections, captioned
    // images, and video embeds — see src/shared/components/mdx/.
    Note,
    Pitfall,
    Deprecated,
    Wip,
    RC,
    Canary,
    Experimental,
    ExperimentalBadge,
    CanaryBadge,
    NextMajor,
    NextMajorBadge,
    RSC,
    RSCBadge,
    DeepDive,
    YouWillLearn,
    YouWillLearnCard,
    BlogCard,
    LearnMore,
    ReadBlogPost,
    Math,
    MathI,
    Recap,
    CodeStep,
    Illustration,
    IllustrationBlock,
    InlineToc,
    Challenges,
    Recipes,
    Hint: MdxHint,
    Solution: MdxSolution,
    CodeDiagram,
    ConsoleBlock,
    ConsoleBlockMulti,
    ConsoleLogLine,
    Diagram,
    DiagramGroup,
    PackageImport,
    TerminalBlock,
    Figure,
    YouTubeEmbed,
    YouTubeIframe: YouTubeEmbed,
    Intro,
    FullWidth,
    MaxWidth,
    LanguageList,
    TeamMember,
    ErrorDecoder,
  };

  // react.dev tags every mapping so parent authoring components can inspect
  // compiled MDX children (for example PackageImport locating a fenced block).
  for (const [name, Component] of Object.entries(mdxComponents)) {
    /** @type {import('react').ComponentType & { mdxName?: string }} */ (
      Component
    ).mdxName = name;
  }

  return { ...mdxComponents, ...components };
}
