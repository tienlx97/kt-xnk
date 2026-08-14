'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Licensed under the MIT license in the upstream react.dev repository.
 */

import * as stylex from '@stylexjs/stylex';
import {
  Children,
  isValidElement,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

const styles = stylex.create({
  outer: { marginInline: 'auto', paddingBlock: '16px', width: '100%' },
  card: {
    backgroundColor: 'var(--color-background-muted)',
    borderRadius: {
      default: 0,
      '@media (min-width: 640px)': '16px',
    },
    boxShadow: 'inset 0 0 0 1px var(--color-border)',
    marginInline: { default: '-20px', '@media (min-width: 640px)': 0 },
  },
  header: {
    paddingBlockEnd: 0,
    paddingBlockStart: '8px',
    paddingInline: { default: '20px', '@media (min-width: 640px)': '32px' },
  },
  title: {
    color: 'var(--color-text-accent)',
    fontSize: '28px',
    lineHeight: '40px',
    marginBlock: '8px',
  },
  recipeTitle: { color: 'var(--color-text-purple)', fontSize: '20px' },
  navigation: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  tabsViewport: { overflow: 'hidden' },
  tabs: { display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth' },
  tab: {
    backgroundColor: 'transparent',
    borderBlockEndColor: 'transparent',
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: '4px',
    borderBlockStartWidth: 0,
    borderInlineWidth: 0,
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    flexShrink: 0,
    font: 'inherit',
    fontSize: '16px',
    marginInlineEnd: '16px',
    paddingBlock: '8px',
    whiteSpace: 'nowrap',
  },
  activeTab: {
    borderBlockEndColor: 'var(--color-accent)',
    color: 'var(--color-text-accent)',
  },
  recipeActiveTab: {
    borderBlockEndColor: 'var(--color-text-purple)',
    color: 'var(--color-text-purple)',
  },
  arrows: {
    display: 'flex',
    paddingBlockEnd: '8px',
    paddingInlineStart: '8px',
  },
  arrow: {
    backgroundColor: 'var(--color-background)',
    borderColor: 'var(--color-border)',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    height: '32px',
    paddingInline: '8px',
  },
  arrowStart: { borderEndStartRadius: '8px', borderStartStartRadius: '8px' },
  arrowEnd: { borderEndEndRadius: '8px', borderStartEndRadius: '8px' },
  arrowDisabled: { color: 'var(--color-text-disabled)', cursor: 'default' },
  challenge: {
    padding: { default: '20px', '@media (min-width: 640px)': '32px' },
  },
  challengeTitle: {
    color: 'var(--color-text-primary)',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '30px',
    marginBlockEnd: '8px',
    marginBlockStart: 0,
  },
  count: {
    display: { default: 'block', '@media (min-width: 768px)': 'inline' },
    fontWeight: 700,
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBlockStart: '16px',
  },
  actionGroup: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  button: {
    alignItems: 'center',
    backgroundColor: 'var(--color-background)',
    borderColor: 'var(--color-border)',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    display: 'inline-flex',
    font: 'inherit',
    fontWeight: 700,
    minHeight: '40px',
    paddingInline: '14px',
  },
  activeButton: {
    backgroundColor: 'var(--color-accent)',
    borderColor: 'var(--color-accent)',
    color: 'var(--color-on-dark)',
  },
  recipeButton: {
    backgroundColor: 'var(--color-text-purple)',
    borderColor: 'var(--color-text-purple)',
  },
  reveal: { marginBlockStart: '24px' },
  solutionTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBlockEnd: '16px',
    marginBlockStart: 0,
  },
});

/** @typedef {{ id: string, name: import('react').ReactNode, order: number, content: import('react').ReactNode[], solution: import('react').ReactNode, hint?: import('react').ReactNode }} ChallengeContents */

/** @param {{ children: import('react').ReactNode, isRecipes?: boolean, noTitle?: boolean, titleText?: string, titleId?: string }} props */
export function Challenges({
  children,
  isRecipes = false,
  noTitle = false,
  titleText = isRecipes ? 'Try out some examples' : 'Try out some challenges',
  titleId = isRecipes ? 'examples' : 'challenges',
}) {
  const challenges = useMemo(
    () => parseChallengeContents(children),
    [children],
  );
  const hash = useSyncExternalStore(subscribeHash, getHash, getServerHash);
  const hashIndex = challenges.findIndex(({ id }) => id === hash);
  const [selectedIndex, setSelectedIndex] = useState(
    /** @type {number | null} */ (null),
  );
  const activeIndex = selectedIndex ?? (hashIndex >= 0 ? hashIndex : 0);
  const currentChallenge = challenges[activeIndex];
  const scrollAnchorRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  if (!currentChallenge) return null;

  /** @param {number} index @param {boolean} [smooth] */
  const selectChallenge = (index, smooth = false) => {
    setSelectedIndex(index);
    if (smooth) {
      window.requestAnimationFrame(() =>
        scrollAnchorRef.current?.scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        }),
      );
    }
  };

  return (
    <section {...stylex.props(styles.outer)}>
      <div {...stylex.props(styles.card)}>
        <div ref={scrollAnchorRef} {...stylex.props(styles.header)}>
          {!noTitle ? (
            <h2
              id={titleId}
              {...stylex.props(styles.title, isRecipes && styles.recipeTitle)}
            >
              {titleText}
            </h2>
          ) : null}
          {challenges.length > 1 ? (
            <ChallengeNavigation
              challenges={challenges}
              activeIndex={activeIndex}
              isRecipes={isRecipes}
              onSelect={selectChallenge}
            />
          ) : null}
        </div>
        <Challenge
          key={currentChallenge.id}
          currentChallenge={currentChallenge}
          totalChallenges={challenges.length}
          isRecipes={isRecipes}
          onNext={() => selectChallenge(activeIndex + 1, true)}
          hasNext={activeIndex < challenges.length - 1}
        />
      </div>
    </section>
  );
}

/** @param {Omit<Parameters<typeof Challenges>[0], 'isRecipes'>} props */
export function Recipes(props) {
  return <Challenges {...props} isRecipes />;
}

/** @param {{ children: import('react').ReactNode, mdxType?: 'Hint' }} props */
export function Hint({ children }) {
  return <div>{children}</div>;
}

/** @param {{ children: import('react').ReactNode, mdxType?: 'Solution' }} props */
export function Solution({ children }) {
  return <div>{children}</div>;
}

/** @param {{ challenges: ChallengeContents[], activeIndex: number, isRecipes: boolean, onSelect: (index: number) => void }} props */
function ChallengeNavigation({ challenges, activeIndex, isRecipes, onSelect }) {
  const tabsRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  /** @param {number} index */
  const select = (index) => {
    onSelect(index);
    const button = tabsRef.current?.children[index];
    if (button instanceof HTMLElement)
      tabsRef.current?.scrollTo({
        left: button.offsetLeft,
        behavior: 'smooth',
      });
  };

  return (
    <div {...stylex.props(styles.navigation)}>
      <div {...stylex.props(styles.tabsViewport)}>
        <div ref={tabsRef} role="tablist" {...stylex.props(styles.tabs)}>
          {challenges.map(({ id, name, order }, index) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => select(index)}
              {...stylex.props(
                styles.tab,
                index === activeIndex && styles.activeTab,
                index === activeIndex && isRecipes && styles.recipeActiveTab,
              )}
            >
              {order}. {name}
            </button>
          ))}
        </div>
      </div>
      <div {...stylex.props(styles.arrows)}>
        <ArrowButton
          direction="left"
          disabled={activeIndex === 0}
          onClick={() => select(activeIndex - 1)}
        />
        <ArrowButton
          direction="right"
          disabled={activeIndex === challenges.length - 1}
          onClick={() => select(activeIndex + 1)}
        />
      </div>
    </div>
  );
}

/** @param {{ direction: 'left' | 'right', disabled: boolean, onClick: () => void }} props */
function ArrowButton({ direction, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
      disabled={disabled}
      onClick={onClick}
      {...stylex.props(
        styles.arrow,
        direction === 'left' ? styles.arrowStart : styles.arrowEnd,
        disabled && styles.arrowDisabled,
      )}
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  );
}

/** @param {{ currentChallenge: ChallengeContents, totalChallenges: number, isRecipes: boolean, hasNext: boolean, onNext: () => void }} props */
function Challenge({
  currentChallenge,
  totalChallenges,
  isRecipes,
  hasNext,
  onNext,
}) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const toggleHint = () => {
    setShowHint((current) => !current);
    if (!showHint) setShowSolution(false);
  };
  const toggleSolution = () => {
    setShowSolution((current) => !current);
    if (!showSolution) setShowHint(false);
  };

  return (
    <article {...stylex.props(styles.challenge)}>
      <h4 id={currentChallenge.id} {...stylex.props(styles.challengeTitle)}>
        <span {...stylex.props(styles.count)}>
          {isRecipes ? 'Example' : 'Challenge'} {currentChallenge.order} of{' '}
          {totalChallenges}:{' '}
        </span>
        {currentChallenge.name}
      </h4>
      {currentChallenge.content}
      <div {...stylex.props(styles.actions)}>
        <div {...stylex.props(styles.actionGroup)}>
          {currentChallenge.hint ? (
            <button
              type="button"
              aria-expanded={showHint}
              onClick={toggleHint}
              {...stylex.props(styles.button, showHint && styles.activeButton)}
            >
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
          ) : null}
          {!isRecipes || currentChallenge.hint ? (
            <button
              type="button"
              aria-expanded={showSolution}
              onClick={toggleSolution}
              {...stylex.props(
                styles.button,
                showSolution && styles.activeButton,
              )}
            >
              {showSolution ? 'Hide solution' : 'Show solution'}
            </button>
          ) : null}
        </div>
        {hasNext ? (
          <button
            type="button"
            onClick={onNext}
            {...stylex.props(
              styles.button,
              styles.activeButton,
              isRecipes && styles.recipeButton,
            )}
          >
            Next {isRecipes ? 'Example' : 'Challenge'} →
          </button>
        ) : null}
      </div>
      {showHint ? (
        <div {...stylex.props(styles.reveal)}>{currentChallenge.hint}</div>
      ) : null}
      {showSolution ? (
        <div {...stylex.props(styles.reveal)}>
          <h3 {...stylex.props(styles.solutionTitle)}>Solution</h3>
          {currentChallenge.solution}
          <div {...stylex.props(styles.actions)}>
            <button
              type="button"
              onClick={() => setShowSolution(false)}
              {...stylex.props(styles.button)}
            >
              Close solution
            </button>
            {hasNext ? (
              <button
                type="button"
                onClick={onNext}
                {...stylex.props(styles.button, styles.activeButton)}
              >
                Next Challenge →
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

/** @param {import('react').ReactNode} children @returns {ChallengeContents[]} */
export function parseChallengeContents(children) {
  const contents = /** @type {ChallengeContents[]} */ ([]);
  let challenge = /** @type {Partial<ChallengeContents>} */ ({});
  let content = /** @type {import('react').ReactNode[]} */ ([]);

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const type = child.type;
    const props =
      /** @type {{ children?: import('react').ReactNode, id?: string, mdxType?: 'Hint' | 'Solution' }} */ (
        child.props
      );
    if (
      props.mdxType === 'Solution' ||
      type === Solution ||
      getMdxName(type) === 'Solution'
    ) {
      challenge.solution = child;
      challenge.content = content;
      if (challenge.id && challenge.name)
        contents.push(/** @type {ChallengeContents} */ (challenge));
      challenge = {};
      content = [];
    } else if (
      props.mdxType === 'Hint' ||
      type === Hint ||
      getMdxName(type) === 'Hint'
    ) {
      challenge.hint = child;
    } else if (type === 'h4' || getMdxName(type) === 'h4') {
      challenge.order = contents.length + 1;
      challenge.name = getHeadingLabel(props.children);
      challenge.id = props.id;
    } else {
      content.push(child);
    }
  });
  return contents;
}

/** @param {import('react').ReactNode} children */
function getHeadingLabel(children) {
  const label = Children.toArray(children).filter(
    (child) => !(isValidElement(child) && child.type === 'a'),
  );
  return label.length === 1 ? label[0] : label;
}

/** @param {string | import('react').JSXElementConstructor<unknown>} type */
function getMdxName(type) {
  return typeof type === 'string'
    ? type
    : /** @type {import('react').ComponentType & { mdxName?: string }} */ (type)
        .mdxName;
}

function getHash() {
  return window.location.hash.slice(1);
}
function getServerHash() {
  return '';
}
/** @param {() => void} callback */
function subscribeHash(callback) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
