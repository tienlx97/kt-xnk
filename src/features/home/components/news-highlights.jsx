'use client';

import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Badge } from '@astryxdesign/core/Badge';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack } from '@astryxdesign/core/HStack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { colorVars, radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { formatLongDate } from '../api/date.js';
import { latestNews } from '../config/news.js';
import { SectionHeading } from './section-heading.jsx';

const ALL_FILTER = 'Tất cả';

// Filter pills, derived from the data instead of hand-maintained: adding a
// new `category` to news.js automatically gets a pill here, so the two
// can't drift out of sync the way a separately-typed pill list would.
const categories = [ALL_FILTER, ...new Set(latestNews.map((n) => n.category))];

const styles = stylex.create({
  pill: {
    borderRadius: radiusVars['--radius-full'],
    paddingBlock: '6px',
    paddingInline: '14px',
  },
  pillActive: {
    backgroundColor: colorVars['--color-accent'],
    color: colorVars['--color-on-accent'],
  },
  pillInactive: {
    backgroundColor: colorVars['--color-background-muted'],
    color: colorVars['--color-text-primary'],
  },
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
 * The "Tin tức" grid: every news item not promoted to the hero, filterable
 * by category — a pattern lifted from the reference intranet template's
 * "All News / Announcements / Events / …" pills. Client-rendered because
 * the filter needs local state; the underlying data is still the same
 * statically-imported `latestNews` array, so there's no fetch/loading
 * state to manage.
 *
 * This is deliberately the ONLY editorial-content section on the page —
 * an earlier pass had a second "Hoạt động" (Activities) photo-gallery
 * section, which the user asked to fold into this one rather than compete
 * with it for attention. Activity-style updates (team building, site
 * visits, training) just become `news` entries with an appropriate
 * category instead of living in a separate gallery.
 */
export function NewsHighlights() {
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);

  const visibleNews = useMemo(
    () =>
      activeCategory === ALL_FILTER
        ? latestNews
        : latestNews.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  return (
    <VStack gap={5}>
      <SectionHeading
        id="tin-tuc"
        title="Tin tức"
        description="Hoạt động, dự án và thông tin mới nhất từ các công ty thành viên."
        linkHref="/docs"
        linkLabel="Xem tất cả tin"
      />
      <HStack
        gap={2}
        wrap="wrap"
        role="group"
        aria-label="Lọc tin tức theo chuyên mục"
      >
        {categories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <ClickableCard
              key={category}
              label={category}
              onClick={() => setActiveCategory(category)}
              padding={0}
              variant="transparent"
              xstyle={[
                styles.pill,
                isActive ? styles.pillActive : styles.pillInactive,
              ]}
            >
              <Text
                type="supporting"
                color="inherit"
                weight={isActive ? 'bold' : 'normal'}
              >
                {category}
              </Text>
            </ClickableCard>
          );
        })}
      </HStack>
      <Grid columns={{ minWidth: 280, max: 3 }} gap={4}>
        {visibleNews.map(
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
