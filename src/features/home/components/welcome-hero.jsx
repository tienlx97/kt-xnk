import { FeaturedNewsCarousel } from './featured-news-carousel.jsx';

/**
 * The page's opening band: just the featured-news carousel/swiper.
 *
 * Previously this band also carried a greeting and a "quick launch"
 * shortcuts panel (and, before that, a dark full-bleed color treatment).
 * Both were removed per explicit feedback — keep only the swiper here; the
 * carousel itself lives in `FeaturedNewsCarousel`, split out as its own
 * 'use client' component so the client-only Swiper boundary stays small.
 */
export function WelcomeHero() {
  return <FeaturedNewsCarousel />;
}
