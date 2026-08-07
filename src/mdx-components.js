import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Code } from '@astryxdesign/core/Code';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Divider } from '@astryxdesign/core/Divider';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import { spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import * as stylex from '@stylexjs/stylex';

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
  return <Link href={href}>{children}</Link>;
}

/**
 * Maps the HTML elements MDX compiles headings/paragraphs/links/etc. into
 * onto real Astryx components, per this project's no-raw-markup rule.
 * @param {Record<string, import('react').ComponentType>} components
 */
export function useMDXComponents(components) {
  return {
    /** @param {{ children: import('react').ReactNode }} props */
    h1: ({ children }) => <Heading level={1}>{children}</Heading>,
    /** @param {{ children: import('react').ReactNode }} props */
    h2: ({ children }) => <Heading level={2}>{children}</Heading>,
    /** @param {{ children: import('react').ReactNode }} props */
    h3: ({ children }) => <Heading level={3}>{children}</Heading>,
    /** @param {{ children: import('react').ReactNode }} props */
    h4: ({ children }) => <Heading level={4}>{children}</Heading>,
    /** @param {{ children: import('react').ReactNode }} props */
    h5: ({ children }) => <Heading level={5}>{children}</Heading>,
    /** @param {{ children: import('react').ReactNode }} props */
    h6: ({ children }) => <Heading level={6}>{children}</Heading>,
    /** @param {{ children: import('react').ReactNode }} props */
    p: ({ children }) => (
      <Text as="p" type="body">
        {children}
      </Text>
    ),
    a: MdxLink,
    blockquote: Blockquote,
    code: Code,
    pre: Pre,
    hr: Divider,
    /** @param {{ children: import('react').ReactNode }} props */
    ul: ({ children }) => <ul {...stylex.props(listStyles.ul)}>{children}</ul>,
    /** @param {{ children: import('react').ReactNode }} props */
    ol: ({ children }) => <ol {...stylex.props(listStyles.ol)}>{children}</ol>,
    /** @param {{ children: import('react').ReactNode }} props */
    li: ({ children }) => <li {...stylex.props(listStyles.li)}>{children}</li>,
    ...components,
  };
}
