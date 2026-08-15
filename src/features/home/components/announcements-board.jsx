import { Badge } from '@astryxdesign/core/Badge';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { List, ListItem } from '@astryxdesign/core/List';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

import { formatLongDate } from '../api/date.js';
import { announcements } from '../config/announcements.js';
import { SectionHeading } from './section-heading.jsx';

const styles = stylex.create({
  // Badges are as wide as their text, so a fixed lane keeps every title in
  // the list starting on the same vertical axis instead of stair-stepping.
  tagLane: {
    flexShrink: 0,
    width: '108px',
  },
});

// Pinned notices float to the top regardless of date; everything else stays
// newest-first. Sorting here rather than in the config file means editors
// only maintain `isPinned`, not the order of the array.
const orderedAnnouncements = [...announcements].sort((a, b) => {
  if (Boolean(a.isPinned) !== Boolean(b.isPinned)) return a.isPinned ? -1 : 1;
  return b.date.localeCompare(a.date);
});

/**
 * "Thông báo" — official internal notices as dense, dividered rows.
 *
 * Deliberately row-based rather than card-based: these are short
 * administrative lines people scan, which is exactly the case the house
 * rules reserve rows for.
 */
export function AnnouncementsBoard() {
  return (
    <VStack gap={4}>
      <SectionHeading
        id="thong-bao"
        title="Thông báo"
        linkHref="/docs"
        linkLabel="Xem tất cả"
      />
      <List hasDividers density="balanced">
        {orderedAnnouncements.map(
          ({ id, tag, tagVariant, date, title, href, isPinned }) => (
            <ListItem
              key={id}
              href={href}
              label={title}
              description={formatLongDate(date)}
              startContent={
                <VStack hAlign="start" xstyle={styles.tagLane}>
                  <Badge label={tag} variant={tagVariant} />
                </VStack>
              }
              endContent={
                <HStack gap={2} vAlign="center">
                  {isPinned ? <Badge label="Ghim" variant="info" /> : null}
                  <Icon icon="chevronRight" size="sm" color="secondary" />
                </HStack>
              }
            />
          ),
        )}
      </List>
    </VStack>
  );
}
