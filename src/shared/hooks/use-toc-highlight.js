'use client';

import { useEffect, useState } from 'react';

const TOP_OFFSET = 85;

/**
 * Mirrors react.dev's active-section rule: the last heading above the fixed
 * header offset is current, except that the final heading wins at page end.
 * Kept pure so the scroll behavior has a mechanical regression test.
 * @param {number[]} headingTops
 * @param {boolean} isAtPageEnd
 * @param {number} [topOffset]
 */
export function findActiveTocIndex(
  headingTops,
  isAtPageEnd,
  topOffset = TOP_OFFSET,
) {
  if (headingTops.length === 0) return -1;
  if (isAtPageEnd) return headingTops.length - 1;

  let index = -1;
  while (index < headingTops.length - 1) {
    if (headingTops[index + 1] >= topOffset) break;
    index += 1;
  }

  return Math.max(index, 0);
}

/**
 * React Docs-style TOC scroll highlighting, scoped to the hrefs actually
 * shown in the local TOC. Scroll work is coalesced into one animation frame.
 * @param {string[]} headingHrefs
 */
export function useTocHighlight(headingHrefs) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hrefKey = headingHrefs.join('\u0000');

  useEffect(() => {
    const hrefs = hrefKey ? hrefKey.split('\u0000') : [];
    const headings = hrefs.flatMap((href) => {
      const heading = document.getElementById(
        decodeURIComponent(href.slice(1)),
      );
      return heading ? [heading] : [];
    });
    /** @type {number | null} */
    let animationFrame = null;

    function updateActiveLink() {
      animationFrame = null;
      const pageHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY + window.innerHeight;
      const nextIndex = findActiveTocIndex(
        headings.map((heading) => heading.getBoundingClientRect().top),
        scrollPosition >= pageHeight,
      );

      if (nextIndex >= 0) {
        setCurrentIndex((previousIndex) =>
          previousIndex === nextIndex ? previousIndex : nextIndex,
        );
      }
    }

    function scheduleUpdate() {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateActiveLink);
      }
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateActiveLink();

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [hrefKey]);

  return currentIndex;
}
