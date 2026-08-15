import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { Heading, Text } from '@astryxdesign/core/Text';
import { colorVars, radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';

import { formatDateBadge, formatEventWhen } from '../api/date.js';
import { events } from '../config/events.js';
import { SectionHeading } from './section-heading.jsx';

const styles = stylex.create({
  card: {
    height: '100%',
    overflow: 'hidden',
  },
  media: {
    // Hidden on the narrowest screens: at ~320px of card width the photo
    // would eat a third of the row and squeeze the title to two words.
    display: {
      default: 'none',
      '@media (min-width: 480px)': 'block',
    },
    flexShrink: 0,
    position: 'relative',
    width: '132px',
  },
  photo: {
    objectFit: 'cover',
  },
  // A flex item defaults to `min-width: auto`, i.e. it refuses to shrink
  // below its content's intrinsic width. Inside this horizontal card that
  // meant the long "when" line pushed the row 99px wider than the card at
  // 390px, and the card's `overflow: hidden` clipped the titles rather than
  // letting `maxLines` ellipsize them. Both the row and the text column
  // need the override — clearing it on only one still leaves the other
  // refusing to shrink.
  body: {
    minWidth: 0,
  },
  details: {
    minWidth: 0,
  },
  // Day/month chip. On wide cards it sits over the photo; when the photo is
  // hidden it becomes the row's leading element, which is why it carries its
  // own opaque background rather than relying on the image behind it.
  dateChip: {
    backgroundColor: colorVars['--color-accent'],
    borderRadius: radiusVars['--radius-element'],
    color: colorVars['--color-on-accent'],
    flexShrink: 0,
    width: '56px',
  },
});

/**
 * "Sự kiện sắp tới" — the next internal events, as horizontal cards with a
 * prominent date chip. Card (rather than a row list) is deliberate here:
 * each entry carries a photo and four distinct facts, which is a widget,
 * not a dense data row.
 */
export function UpcomingEvents() {
  return (
    <VStack gap={5}>
      <SectionHeading
        id="su-kien"
        title="Sự kiện sắp tới"
        description="Lịch họp, đào tạo và các mốc quan trọng của toàn hệ sinh thái."
      />
      <Grid columns={{ minWidth: 340, max: 2 }} gap={4}>
        {events.map((event) => {
          const { day, month } = formatDateBadge(event.date);
          return (
            <Card
              key={event.id}
              elevation="low"
              padding={0}
              xstyle={styles.card}
            >
              <HStack height="100%">
                <VStack xstyle={styles.media}>
                  <Image
                    src={event.image.src}
                    alt={event.image.alt}
                    fill
                    sizes="132px"
                    {...stylex.props(styles.photo)}
                  />
                </VStack>
                <HStack gap={3} padding={4} vAlign="start" xstyle={styles.body}>
                  <VStack
                    paddingBlock={1.5}
                    hAlign="center"
                    xstyle={styles.dateChip}
                  >
                    <Text
                      type="display-3"
                      color="inherit"
                      weight="bold"
                      justify="center"
                      display="block"
                    >
                      {day}
                    </Text>
                    <Text
                      type="supporting"
                      color="inherit"
                      justify="center"
                      display="block"
                    >
                      {month}
                    </Text>
                  </VStack>
                  <VStack gap={1.5} xstyle={styles.details}>
                    <Heading level={3} maxLines={2}>
                      {event.title}
                    </Heading>
                    <HStack gap={1.5} vAlign="start">
                      <Icon icon="clock" size="xsm" color="secondary" />
                      <Text type="supporting" maxLines={2}>
                        {formatEventWhen(event)}
                      </Text>
                    </HStack>
                    <HStack gap={1.5} vAlign="start">
                      <Icon icon="info" size="xsm" color="secondary" />
                      <Text type="supporting" maxLines={2}>
                        {event.location}
                      </Text>
                    </HStack>
                    <Text type="supporting" color="accent" maxLines={1}>
                      {event.audience}
                    </Text>
                  </VStack>
                </HStack>
              </HStack>
            </Card>
          );
        })}
      </Grid>
    </VStack>
  );
}
