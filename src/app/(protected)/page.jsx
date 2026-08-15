import { Section } from '@astryxdesign/core/Section';
import { colorVars, radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

import {
  AnnouncementsBoard,
  Ecosystem,
  NewsHighlights,
  UpcomingEvents,
  VideoClips,
  WelcomeHero,
} from '../../features/home/index.js';

// Centered 80rem content column. Inline padding is deliberately NOT set
// here: `ProtectedAppShell` already gives non-MDX routes a 24px `padding`
// on `<main>` (its `paddedMain` style). See the react.dev docs shell's
// /docs layout for the same contract applied to MDX routes, which opt out
// of `paddedMain` and so set their own inline padding — this route does not
// opt out, so adding its own padding on top would double it.
const styles = stylex.create({
  content: {
    marginInline: 'auto',
  },
  // Tinted bands break the page into alternating pale/white groups so the
  // sections read as distinct movements instead of one long scroll. Padding
  // is responsive because a 24px inset on a 390px screen costs more of the
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
        <WelcomeHero />
        <NewsHighlights />
        <VStack gap={10} xstyle={styles.band}>
          <AnnouncementsBoard />
          <UpcomingEvents />
        </VStack>
        <VStack xstyle={styles.band}>
          <VideoClips />
        </VStack>
        <Ecosystem />
      </VStack>
    </Section>
  );
}
