'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle } from '@codemirror/language';
import { highlightTree, tags } from '@lezer/highlight';
import * as stylex from '@stylexjs/stylex';

import { getHighlightLines, getInlineHighlights } from '../../api/code-meta.js';

const languages =
  /** @type {Record<string, import('@codemirror/language').LanguageSupport>} */ ({
    css: css(),
    html: html(),
    js: javascript({ jsx: true, typescript: false }),
    javascript: javascript({ jsx: true, typescript: false }),
    jsx: javascript({ jsx: true, typescript: false }),
    ts: javascript({ jsx: false, typescript: true }),
    tsx: javascript({ jsx: true, typescript: true }),
  });

const highlightStyle = HighlightStyle.define([
  { tag: tags.link, class: 'link' },
  { tag: tags.emphasis, class: 'emphasis' },
  { tag: tags.strong, class: 'strong' },
  { tag: tags.keyword, class: 'keyword' },
  { tag: [tags.atom, tags.number, tags.bool], class: 'static' },
  { tag: tags.standard(tags.tagName), class: 'tag' },
  { tag: tags.variableName, class: 'plain' },
  { tag: tags.function(tags.variableName), class: 'definition' },
  {
    tag: [tags.definition(tags.function(tags.variableName)), tags.tagName],
    class: 'definition',
  },
  { tag: tags.propertyName, class: 'property' },
  { tag: [tags.literal, tags.inserted], class: 'string' },
  { tag: tags.punctuation, class: 'punctuation' },
  { tag: [tags.comment, tags.quote], class: 'comment' },
]);

const styles = stylex.create({
  root: {
    backgroundColor: 'var(--color-background-muted)',
    borderRadius: '16px',
    contain: 'content',
    direction: 'ltr',
    height: '100%',
    marginBlock: '32px',
    overflowX: 'auto',
    width: '100%',
  },
  noMargin: { marginBlock: 0 },
  noShadow: { backgroundColor: 'transparent' },
  pre: {
    alignItems: 'flex-start',
    display: 'flex',
    fontFamily: 'var(--font-family-code)',
    fontSize: '13.6px',
    lineHeight: '24px',
    margin: 0,
    minWidth: 'max-content',
    paddingBlock: '18px',
    paddingInline: '20px',
  },
  code: { display: 'block', flexGrow: 2 },
  line: { display: 'block', minHeight: '24px', paddingInline: '4px' },
  highlightedLine: {
    backgroundColor: 'var(--color-accent-muted)',
    marginInline: '-4px',
    paddingInline: '8px',
  },
  keyword: { color: 'var(--color-text-purple)' },
  static: { color: 'var(--color-text-blue)' },
  tag: { color: 'var(--color-text-green)' },
  plain: { color: 'var(--color-text-primary)' },
  definition: { color: 'var(--color-text-accent)' },
  property: { color: 'var(--color-text-blue)' },
  string: { color: 'var(--color-text-green)' },
  punctuation: { color: 'var(--color-text-secondary)' },
  comment: { color: 'var(--color-text-secondary)', fontStyle: 'italic' },
  link: { textDecoration: 'underline' },
  emphasis: { fontStyle: 'italic' },
  strong: { fontWeight: 700 },
  inlineStep: {
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '2px',
    borderRadius: '4px',
    paddingBlock: '1.5px',
    paddingInline: '4px',
  },
  step1: {
    backgroundColor: 'var(--color-background-blue)',
    borderBlockEndColor: 'var(--color-border-blue)',
    color: 'var(--color-text-blue)',
  },
  step2: {
    backgroundColor: 'var(--color-background-yellow)',
    borderBlockEndColor: 'var(--color-border-yellow)',
    color: 'var(--color-text-yellow)',
  },
  step3: {
    backgroundColor: 'var(--color-background-purple)',
    borderBlockEndColor: 'var(--color-border-purple)',
    color: 'var(--color-text-purple)',
  },
  step4: {
    backgroundColor: 'var(--color-background-green)',
    borderBlockEndColor: 'var(--color-border-green)',
    color: 'var(--color-text-green)',
  },
});

const syntaxStyles =
  /** @type {Record<string, import('@stylexjs/stylex').StyleXStyles>} */ ({
    link: styles.link,
    emphasis: styles.emphasis,
    strong: styles.strong,
    keyword: styles.keyword,
    static: styles.static,
    tag: styles.tag,
    plain: styles.plain,
    definition: styles.definition,
    property: styles.property,
    string: styles.string,
    punctuation: styles.punctuation,
    comment: styles.comment,
  });

/** @typedef {{ from: number, to: number, className: string }} HighlightRange */
/** @typedef {{ from: number, to: number, step: number }} InlineRange */

/**
 * @param {{ code: string, language?: string, meta?: string, noMargin?: boolean, noShadow?: boolean, onLineHover?: (lineNumber: number | null) => void }} props
 */
export function CodeBlock({
  code,
  language = 'js',
  meta = '',
  noMargin = false,
  noShadow = false,
  onLineHover,
}) {
  const normalizedCode = code.trimEnd();
  const lines = normalizedCode.split('\n');
  const parser = languages[language] ?? languages.js;
  const syntaxRanges = /** @type {HighlightRange[]} */ ([]);
  highlightTree(
    parser.language.parser.parse(normalizedCode),
    highlightStyle,
    (from, to, className) => {
      syntaxRanges.push({ from, to, className });
    },
  );
  const highlightedLines = new Set(getHighlightLines(meta));
  const inlineRanges = getInlineHighlights(meta, normalizedCode);
  const lineStarts = lines.map((_, index) =>
    lines.slice(0, index).reduce((total, line) => total + line.length + 1, 0),
  );

  return (
    <div
      data-mdx-code-block
      data-language={language}
      {...stylex.props(
        styles.root,
        noMargin && styles.noMargin,
        noShadow && styles.noShadow,
      )}
    >
      <pre translate="no" {...stylex.props(styles.pre)}>
        <code {...stylex.props(styles.code)}>
          {lines.map((line, index) => {
            const lineStart = lineStarts[index];
            const lineEnd = lineStart + line.length;

            return (
              <span
                key={`${index}-${line}`}
                data-code-line={index + 1}
                onMouseEnter={
                  onLineHover ? () => onLineHover(index + 1) : undefined
                }
                onMouseLeave={onLineHover ? () => onLineHover(null) : undefined}
                {...stylex.props(
                  styles.line,
                  highlightedLines.has(index + 1) && styles.highlightedLine,
                )}
              >
                {renderLine(
                  line,
                  lineStart,
                  lineEnd,
                  syntaxRanges,
                  inlineRanges,
                )}
                {index < lines.length - 1 ? '\n' : null}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

/**
 * @param {string} line
 * @param {number} lineStart
 * @param {number} lineEnd
 * @param {HighlightRange[]} syntaxRanges
 * @param {InlineRange[]} inlineRanges
 */
function renderLine(line, lineStart, lineEnd, syntaxRanges, inlineRanges) {
  const relevantSyntax = syntaxRanges.filter(
    (range) => range.from < lineEnd && range.to > lineStart,
  );
  const relevantInline = inlineRanges.filter(
    (range) => range.from < lineEnd && range.to > lineStart,
  );
  const boundaries = new Set([lineStart, lineEnd]);
  for (const range of [...relevantSyntax, ...relevantInline]) {
    boundaries.add(Math.max(lineStart, range.from));
    boundaries.add(Math.min(lineEnd, range.to));
  }
  const points = [...boundaries].sort((left, right) => left - right);

  return points.slice(0, -1).map((from, index) => {
    const to = points[index + 1];
    const text = line.slice(from - lineStart, to - lineStart);
    const inline = relevantInline.find(
      (range) => range.from <= from && range.to >= to,
    );
    const syntax = relevantSyntax.find(
      (range) => range.from <= from && range.to >= to,
    );
    if (inline) {
      const stepStyle = [
        styles.step1,
        styles.step2,
        styles.step3,
        styles.step4,
      ][inline.step - 1];
      return (
        <span
          key={`${from}-${to}`}
          data-step={inline.step}
          {...stylex.props(styles.inlineStep, stepStyle)}
        >
          {text}
        </span>
      );
    }
    if (syntax) {
      return (
        <span
          key={`${from}-${to}`}
          {...stylex.props(syntaxStyles[syntax.className] ?? styles.plain)}
        >
          {text}
        </span>
      );
    }
    return text;
  });
}
