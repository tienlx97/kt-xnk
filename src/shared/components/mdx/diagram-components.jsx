/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';
import { Children, isValidElement } from 'react';

import { CodeBlock } from './code-block.jsx';

const styles = stylex.create({
  twoColumn: {
    display: 'grid',
    gap: '16px 32px',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 1024px)': 'repeat(2, minmax(0, 1fr))',
    },
    marginBlock: '32px',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0,
  },
  illustration: { paddingBlock: '16px' },
  diagram: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBlockStart: {
      default: '40px',
      ':first-child': 0,
      '@media (min-width: 640px)': 0,
    },
    padding: {
      default: 0,
      '@media (min-width: 640px)': '40px',
    },
  },
  diagramImage: {
    display: 'block',
    height: 'auto',
    maxWidth: '100%',
  },
  imageThemeDark: {
    display: {
      default: 'none',
      ':is([data-theme="dark"] *)': 'block',
    },
  },
  imageThemeLight: {
    display: {
      default: 'block',
      ':is([data-theme="dark"] *)': 'none',
    },
  },
  captionWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  caption: {
    color: 'var(--color-text-secondary)',
    fontSize: {
      default: '17px',
      '@media (min-width: 1024px)': '20px',
    },
    lineHeight: 1.25,
    maxWidth: '32rem',
    padding: {
      default: '4px',
      '@media (min-width: 640px)': '8px',
    },
    textAlign: 'center',
  },
  diagramGroup: {
    alignItems: {
      default: 'flex-start',
      '@media (min-width: 640px)': 'center',
    },
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (min-width: 640px)': 'row',
    },
    justifyContent: 'center',
    paddingBlock: '8px',
    width: '100%',
  },
});

/** @param {{ children: import('react').ReactNode, flip?: boolean }} props */
export function CodeDiagram({ children, flip = false }) {
  const childArray = Children.toArray(children);
  const illustrations = childArray.filter(isImageElement);
  const content = childArray.map((child, index) => {
    if (isMdxElement(child, 'pre')) {
      const codeProps = getCodeProps(
        /** @type {import('react').ReactElement} */ (child),
      );
      return (
        <CodeBlock key={`code-${index}`} {...codeProps} noMargin noShadow />
      );
    }
    return isImageElement(child) ? null : child;
  });
  const contentColumn = <div {...stylex.props(styles.center)}>{content}</div>;
  const imageColumn = (
    <div {...stylex.props(styles.illustration)}>{illustrations}</div>
  );

  return (
    <section {...stylex.props(styles.twoColumn)}>
      {flip ? imageColumn : contentColumn}
      {flip ? contentColumn : imageColumn}
    </section>
  );
}

/** @param {{ name?: string, src?: string, alt: string, height?: number, width?: number, children?: import('react').ReactNode, captionPosition?: 'top' | 'bottom' | null }} props */
export function Diagram({
  name,
  src,
  alt,
  height,
  width,
  children,
  captionPosition,
}) {
  const caption = children ? (
    <div {...stylex.props(styles.captionWrapper)}>
      <figcaption {...stylex.props(styles.caption)}>{children}</figcaption>
    </div>
  ) : null;
  const image = src ? (
    <DiagramImage src={src} alt={alt} height={height} width={width} />
  ) : (
    <>
      <div {...stylex.props(styles.imageThemeDark)}>
        <DiagramImage
          src={`/images/docs/diagrams/${name}.dark.png`}
          alt={alt}
          height={height}
          width={width}
        />
      </div>
      <div {...stylex.props(styles.imageThemeLight)}>
        <DiagramImage
          src={`/images/docs/diagrams/${name}.png`}
          alt={alt}
          height={height}
          width={width}
        />
      </div>
    </>
  );

  return (
    <figure {...stylex.props(styles.diagram)}>
      {captionPosition === 'top' ? caption : null}
      {image}
      {!captionPosition || captionPosition === 'bottom' ? caption : null}
    </figure>
  );
}

/** @param {{ src: string, alt: string, height?: number, width?: number }} props */
function DiagramImage({ src, alt, height, width }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- authored diagram dimensions are preserved.
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      {...stylex.props(styles.diagramImage)}
    />
  );
}

/** @param {{ children: import('react').ReactNode }} props */
export function DiagramGroup({ children }) {
  return <div {...stylex.props(styles.diagramGroup)}>{children}</div>;
}

/** @param {{ children: import('react').ReactNode }} props */
export function PackageImport({ children }) {
  const childArray = Children.toArray(children);
  const terminal = childArray.filter((child) => !isMdxElement(child, 'pre'));
  const code = childArray.map((child, index) => {
    if (!isMdxElement(child, 'pre')) return null;
    return (
      <CodeBlock
        key={`package-code-${index}`}
        {...getCodeProps(/** @type {import('react').ReactElement} */ (child))}
        noMargin
        noShadow
      />
    );
  });

  return (
    <section {...stylex.props(styles.twoColumn)}>
      <div {...stylex.props(styles.center)}>{terminal}</div>
      <div {...stylex.props(styles.center)}>{code}</div>
    </section>
  );
}

/** @param {unknown} child */
function isImageElement(child) {
  return isMdxElement(child, 'img');
}

/** @param {unknown} child @param {string} name */
function isMdxElement(child, name) {
  if (!isValidElement(child)) return false;
  const component =
    /** @type {string | (import('react').ElementType & { mdxName?: string })} */ (
      child.type
    );
  return (
    component === name ||
    (typeof component !== 'string' && component.mdxName === name)
  );
}

/** @param {import('react').ReactElement} element */
function getCodeProps(element) {
  const elementProps = /** @type {{ children?: import('react').ReactNode }} */ (
    element.props
  );
  const codeChild =
    /** @type {{ props?: { className?: string, children?: import('react').ReactNode, meta?: string } }} */ (
      elementProps.children
    );
  const className = codeChild?.props?.className ?? '';
  return {
    code: String(codeChild?.props?.children ?? '').replace(/\n$/u, ''),
    language: className.replace('language-', '') || 'plaintext',
    meta: codeChild?.props?.meta ?? '',
  };
}
