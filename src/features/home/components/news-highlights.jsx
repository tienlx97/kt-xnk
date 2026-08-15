import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Badge } from '@astryxdesign/core/Badge';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack } from '@astryxdesign/core/HStack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';

import { formatLongDate } from '../api/date.js';
import { latestNews } from '../config/news.js';
import { SectionHeading } from './section-heading.jsx';

const styles = stylex.create({
  card: {
    height: '100%',
    overflow: 'hidden',
  },
  media: {
    // The photo sits flush against the card's top edge, so only the top
    // corners are rounded — the card clips the rest.
    borderStartEndRadius: radiusVars['--radius-container'],
    borderStartStartRadius: radiusVars['--radius-container'],
    overflow: 'hidden',
  },
  photo: {
    objectFit: 'cover',
  },
});

/**
 * The "Tin tức" grid: every news item not promoted to the hero carousel,
 * newest first. Server-rendered — nothing here is interactive beyond each
 * card being a link.
 */
export function NewsHighlights() {
  return (
    <VStack gap={5}>
      <SectionHeading
        id="tin-tuc"
        title="Tin tức"
        description="Hoạt động, dự án và thông tin mới nhất từ các công ty thành viên."
        linkHref="/docs"
        linkLabel="Xem tất cả tin"
      />
      <Grid columns={{ minWidth: 280, max: 3 }} gap={4}>
        {latestNews.map(
          ({
            id,
            category,
            categoryVariant,
            date,
            title,
            excerpt,
            image,
            href,
          }) => (
            <ClickableCard
              key={id}
              href={href}
              label={title}
              padding={0}
              elevation="low"
              xstyle={styles.card}
            >
              <VStack height="100%">
                <VStack xstyle={styles.media}>
                  <AspectRatio ratio={16 / 10}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      {...stylex.props(styles.photo)}
                    />
                  </AspectRatio>
                </VStack>
                <VStack gap={2} padding={4}>
                  <HStack gap={2} vAlign="center" wrap="wrap">
                    <Badge label={category} variant={categoryVariant} />
                    <Text type="supporting">{formatLongDate(date)}</Text>
                  </HStack>
                  <Heading level={3} maxLines={2}>
                    {title}
                  </Heading>
                  <Text
                    type="body"
                    color="secondary"
                    display="block"
                    maxLines={3}
                  >
                    {excerpt}
                  </Text>
                </VStack>
              </VStack>
            </ClickableCard>
          ),
        )}
      </Grid>
    </VStack>
  );
}
