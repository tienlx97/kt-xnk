'use client';

import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { Lightbox } from '@astryxdesign/core/Lightbox';
import { Text } from '@astryxdesign/core/Text';
import { colorVars, radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useState } from 'react';

import { formatLongDate } from '../api/date.js';
import { activities } from '../config/activities.js';
import { SectionHeading } from './section-heading.jsx';

const styles = stylex.create({
  tile: {
    borderRadius: radiusVars['--radius-container'],
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    objectFit: 'cover',
  },
  // Same correction as the hero scrim: `--color-overlay` tops out at 40%
  // alpha, which left two-line titles unreadable over the bright photos
  // (the office and factory shots in particular). Mixing the opaque
  // `--color-background-inverted` down to an explicit alpha gives a ramp
  // that is still ~63% opaque behind the title's FIRST line — the previous
  // version faded to fully transparent exactly there.
  //
  // `paddingBlockStart` is larger than the other insets so the ramp has
  // room to fade above the text instead of cutting off at it.
  caption: {
    backgroundImage: `linear-gradient(to top, color-mix(in srgb, ${colorVars['--color-background-inverted']} 92%, transparent), color-mix(in srgb, ${colorVars['--color-background-inverted']} 80%, transparent) 55%, color-mix(in srgb, ${colorVars['--color-background-inverted']} 30%, transparent) 85%, transparent)`,
    color: colorVars['--color-on-dark'],
    insetBlockEnd: 0,
    insetInline: 0,
    paddingBlockStart: '30px',
    position: 'absolute',
  },
});

// Lightbox takes a flat media list, so the caption is composed once here
// instead of on every open.
const lightboxMedia = activities.map(({ title, date, image }) => ({
  src: image.src,
  alt: image.alt,
  caption: `${title} · ${formatLongDate(date)}`,
}));

/**
 * "Hoạt động" — a photo gallery of internal activities. Clicking any tile
 * opens the fullscreen lightbox at that index, and prev/next then walks the
 * whole set without closing.
 *
 * This is the one home-page section that genuinely needs client state (the
 * open index), which is why it is the only gallery component marked
 * `'use client'`; the grid itself would otherwise be static markup.
 */
export function ActivityGallery() {
  // `null` means closed; a number is the gallery index being viewed.
  const [openIndex, setOpenIndex] = useState(
    /** @type {number | null} */ (null),
  );

  return (
    <VStack gap={5}>
      <SectionHeading
        id="hoat-dong"
        title="Hoạt động"
        description="Khoảnh khắc từ các sự kiện, chuyến công tác và hoạt động nội bộ."
      />
      <Grid columns={{ minWidth: 160, max: 4 }} gap={3}>
        {activities.map(({ id, title, date, image }, index) => (
          <ClickableCard
            key={id}
            label={`Xem ảnh: ${title}`}
            onClick={() => setOpenIndex(index)}
            padding={0}
            variant="transparent"
            xstyle={styles.tile}
          >
            <AspectRatio ratio={1}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                {...stylex.props(styles.photo)}
              />
            </AspectRatio>
            <VStack gap={0.5} padding={3} justify="end" xstyle={styles.caption}>
              <Text
                type="label"
                color="inherit"
                weight="bold"
                display="block"
                maxLines={2}
              >
                {title}
              </Text>
              <Text type="supporting" color="inherit" display="block">
                {formatLongDate(date)}
              </Text>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>
      <Lightbox
        isOpen={openIndex !== null}
        onOpenChange={(isOpen) =>
          setOpenIndex(isOpen ? (openIndex ?? 0) : null)
        }
        media={lightboxMedia}
        index={openIndex ?? 0}
        onIndexChange={setOpenIndex}
        hasZoom
      />
    </VStack>
  );
}
