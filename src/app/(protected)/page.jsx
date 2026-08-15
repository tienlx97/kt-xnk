import { Section } from '@astryxdesign/core/Section';
import { colorVars, radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

import {
  ActivityGallery,
  AnnouncementsBoard,
  Ecosystem,
  HeroCarousel,
  NewsHighlights,
  QuickLinks,
  UpcomingEvents,
  VideoClips,
} from '../../features/home/index.js';

// Centered 80rem content column. Inline padding is deliberately NOT set
// here: `ProtectedAppShell` already gives non-MDX routes a 24px `padding`
// on `<main>` (its `paddedMain` style). The page used to add another
// 20px/48px on top, which double-padded every section — measured at 390px
// the content column was 302px inside a 342px main, and that missing 40px
// was enough to drop the activity gallery from two columns to one. The
// /docs layout sets its own inline padding because MDX routes opt out of
// `paddedMain`; this route does not.
const styles = stylex.create({
  content: {
    marginInline: 'auto',
  },
  // Tinted bands break the page into alternating pale/white groups so eight
  // sections read as four movements instead of one long scroll. Padding is
  // responsive because a 24px inset on a 390px screen costs more of the
  // content width than it earns in separation.
  band: {
    backgroundColor: colorVars['--color-background-muted'],
    borderRadius: radiusVars['--radius-container'],
    padding: {
      default: '16px',
      '@media (min-width: 640px)': '24px',
    },
  },
});

export default function HomePage() {
  return (
    <Section
      variant="transparent"
      padding={0}
      paddingBlock={8}
      maxWidth="80rem"
      xstyle={styles.content}
    >
      <VStack gap={10}>
        {/* <WelcomeBanner
          title="Cổng thông tin nội bộ"
          slogan={site.slogan}
          subtitle={site.description}
        /> */}
        <HeroCarousel />
        <QuickLinks />
        <NewsHighlights />
        <VStack gap={10} xstyle={styles.band}>
          <AnnouncementsBoard />
          <UpcomingEvents />
        </VStack>
        <ActivityGallery />
        <VStack xstyle={styles.band}>
          <VideoClips />
        </VStack>
        <Ecosystem />
      </VStack>
    </Section>
  );
}
