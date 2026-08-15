'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { Heading, Text } from '@astryxdesign/core/Text';
import { colorVars, radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import {
  A11y,
  Autoplay,
  Keyboard,
  Navigation,
  Pagination,
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { formatLongDate } from '../api/date.js';
import { featuredNews } from '../config/news.js';

const styles = stylex.create({
  swiper: {
    // Pagination dots sit inside the slide (over the photo), so the swiper
    // needs no extra block padding underneath for them.
    borderRadius: radiusVars['--radius-container'],
    overflow: 'hidden',
    width: '100%',
  },
  slide: {
    // `position: relative` is what makes `next/image` `fill` legal here:
    // the filled image resolves against the nearest positioned ancestor.
    height: {
      default: '400px',
      '@media (min-width: 640px)': '440px',
      '@media (min-width: 1024px)': '500px',
    },
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  photo: {
    height: '100%',
    inset: 0,
    objectFit: 'cover',
    position: 'absolute',
    width: '100%',
  },
  // Measured, not guessed: with the previous `--color-overlay`-based scrim
  // (40% alpha at its strongest) the white headline was unreadable over the
  // bright engineering-drawing slide. `--color-overlay` cannot be made
  // stronger — its alpha is baked into the token — so the scrim mixes the
  // opaque `--color-background-inverted` down to an explicit alpha instead.
  //
  // Two layers:
  //   1. a bottom ramp that stays ~70%+ opaque across the whole copy block
  //      (which occupies roughly the bottom 45% of the slide) before fading
  //      out at 82%, so the photo still reads at the top;
  //   2. a flat 16% wash over the entire slide, which is what makes the
  //      white prev/next arrows visible at mid-height, where the ramp has
  //      already fallen to zero.
  //
  // The ramp is breakpoint-dependent because the copy block is: measured at
  // 390px it fills 58% of the slide's height (heading wraps to three lines),
  // versus roughly 45% from 640px up. The mobile stops are pushed higher so
  // the badge and date at the TOP of that block still sit on a dark base.
  scrim: {
    backgroundImage: {
      default: `linear-gradient(to top, color-mix(in srgb, ${colorVars['--color-background-inverted']} 90%, transparent), color-mix(in srgb, ${colorVars['--color-background-inverted']} 76%, transparent) 52%, color-mix(in srgb, ${colorVars['--color-background-inverted']} 34%, transparent) 76%, transparent 96%), linear-gradient(color-mix(in srgb, ${colorVars['--color-background-inverted']} 16%, transparent), color-mix(in srgb, ${colorVars['--color-background-inverted']} 16%, transparent))`,
      '@media (min-width: 640px)': `linear-gradient(to top, color-mix(in srgb, ${colorVars['--color-background-inverted']} 88%, transparent), color-mix(in srgb, ${colorVars['--color-background-inverted']} 70%, transparent) 34%, color-mix(in srgb, ${colorVars['--color-background-inverted']} 30%, transparent) 58%, transparent 82%), linear-gradient(color-mix(in srgb, ${colorVars['--color-background-inverted']} 16%, transparent), color-mix(in srgb, ${colorVars['--color-background-inverted']} 16%, transparent))`,
    },
    inset: 0,
    position: 'absolute',
  },
  body: {
    color: colorVars['--color-on-dark'],
    inset: 0,
    paddingBlock: {
      default: '20px',
      '@media (min-width: 640px)': '32px',
      '@media (min-width: 1024px)': '40px',
    },
    // Wider than the block padding on mobile so the headline — which wraps
    // to three full-width lines at 390px — clears Swiper's prev/next
    // arrows. They are vertically centred and sit about 10px in from each
    // edge, so at the previous 20px inset the third line ran underneath
    // them. Swiper renders those arrows itself, so its own `top-offset`
    // variable would be the alternative fix, but StyleX rejects custom
    // properties as `stylex.create` keys and the variable therefore cannot
    // be made responsive.
    paddingInline: {
      default: '42px',
      '@media (min-width: 640px)': '32px',
      '@media (min-width: 1024px)': '40px',
    },
    position: 'absolute',
  },
  copy: {
    maxWidth: '44rem',
  },
  // Astryx's tinted Badge variants (the ones used for the same `category`
  // in NewsHighlights, where they sit on a white card) are illegible here:
  // a pastel tint on a photo scrim all but disappears — that was the
  // reported "Badge đang rất khó nhìn". Badge has no `xstyle` prop to
  // override its background, so this is a hand-rolled solid pill instead,
  // same precedent as the dateChip in upcoming-events.jsx and the
  // durationChip in video-clips.jsx.
  //
  // Solid `--color-error` + `--color-on-error` (not plain white text) is
  // deliberate, not just "add red": white/near-white text is already
  // ~19:1 against the scrim, so the earlier badge/CTA were never a
  // contrast failure, only a visual-hierarchy one. Red TEXT directly on
  // the scrim would in fact be a contrast failure — `--color-error`
  // (#b4271f) measures ~2.9:1 on the darkest part of the scrim, well under
  // WCAG AA's 4.5:1 for text. Using red only as a solid chip background
  // keeps the white-on-red pairing at full contrast while still reading as
  // "red" at a glance.
  // `color` is set on the container, not the individual Text/Icon, so both
  // can just use `color="inherit"` — deliberately not relying on
  // `--color-on-error` and `--color-on-dark` happening to both be white.
  chip: {
    backgroundColor: colorVars['--color-error'],
    borderRadius: radiusVars['--radius-full'],
    color: colorVars['--color-on-error'],
    flexShrink: 0,
    paddingBlock: '4px',
    paddingInline: '10px',
  },
  // Same red chip treatment as `chip`, sized for a CTA row instead of a
  // label: the "Đọc tiếp" link was plain white text and read as static
  // caption copy rather than an action. A solid pill makes it look — and
  // behave, the whole card is already the click target — like a button.
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: colorVars['--color-error'],
    borderRadius: radiusVars['--radius-full'],
    color: colorVars['--color-on-error'],
    paddingBlock: '8px',
    paddingInline: '16px',
  },
});

/**
 * Full-bleed featured-news carousel — the first thing an employee sees.
 * Slides come from the `isFeatured` entries in `config/news.js`.
 *
 * Each slide is a single `ClickableCard`, so the whole photo is the
 * navigation target and there is exactly one focusable link per slide.
 * A nested `Link` would have been a second tab stop pointing at the same
 * URL, and Astryx `Link` has no style hook for the on-dark palette anyway.
 */
export function HeroCarousel() {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, Keyboard, A11y]}
      autoplay={{
        delay: 7000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      keyboard={{ enabled: true }}
      navigation
      pagination={{ clickable: true }}
      loop
      a11y={{
        prevSlideMessage: 'Tin trước đó',
        nextSlideMessage: 'Tin tiếp theo',
        paginationBulletMessage: 'Đi tới tin {{index}}',
      }}
      // Swiper's own theme vars. They have to be plain CSS custom properties
      // on `style` — they target DOM Swiper renders internally, and StyleX
      // rejects custom-property keys inside `stylex.create`.
      //
      // `--swiper-theme-color` only colours the ACTIVE bullet and the
      // arrows; inactive bullets default to black at 0.2 opacity, which over
      // a photo is invisible — the carousel looked like it had a single dot.
      style={{
        '--swiper-navigation-size': '22px',
        '--swiper-pagination-bullet-inactive-color': 'var(--color-on-dark)',
        '--swiper-pagination-bullet-inactive-opacity': '0.45',
        '--swiper-theme-color': 'var(--color-on-dark)',
      }}
      {...stylex.props(styles.swiper)}
    >
      {featuredNews.map(
        ({ id, category, date, title, excerpt, image, href }, index) => (
          <SwiperSlide key={id}>
            <ClickableCard
              href={href}
              label={title}
              padding={0}
              variant="transparent"
              xstyle={styles.slide}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1280px) 1184px, 100vw"
                // Only the first slide is above the fold on load; the rest
                // stay lazy so the hero costs one image, not four.
                priority={index === 0}
                {...stylex.props(styles.photo)}
              />
              <VStack xstyle={styles.scrim} />
              <VStack justify="end" xstyle={styles.body}>
                <VStack gap={3} xstyle={styles.copy}>
                  <HStack gap={2} vAlign="center" wrap="wrap">
                    <HStack xstyle={styles.chip}>
                      <Text type="supporting" color="inherit" weight="bold">
                        {category}
                      </Text>
                    </HStack>
                    <Text type="supporting" color="inherit" weight="medium">
                      {formatLongDate(date)}
                    </Text>
                  </HStack>
                  <Heading level={2} type="display-2" color="inherit">
                    {title}
                  </Heading>
                  <Text
                    type="large"
                    color="inherit"
                    display="block"
                    maxLines={2}
                  >
                    {excerpt}
                  </Text>
                  <HStack gap={1} vAlign="center" xstyle={styles.cta}>
                    <Text type="label" color="inherit" weight="bold">
                      Đọc tiếp
                    </Text>
                    <Icon icon="chevronRight" size="sm" color="inherit" />
                  </HStack>
                </VStack>
              </VStack>
            </ClickableCard>
          </SwiperSlide>
        ),
      )}
    </Swiper>
  );
}
