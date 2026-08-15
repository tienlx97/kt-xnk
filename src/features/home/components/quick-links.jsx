import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { Icon } from '@astryxdesign/core/Icon';
import { Heading, Text } from '@astryxdesign/core/Text';
import { colorVars, radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

import { quickLinks } from '../config/quick-links.js';
import { SectionHeading } from './section-heading.jsx';

const styles = stylex.create({
  // Solid brand teal rather than ClickableCard's built-in `variant="teal"`:
  // theme.js documents that categorical tag colour as deliberately NOT
  // rebranded to --color-accent, so using it here would drift from the logo.
  tile: {
    backgroundColor: colorVars['--color-accent'],
    borderRadius: radiusVars['--radius-container'],
    color: colorVars['--color-on-accent'],
    height: '100%',
  },
});

/**
 * "Truy cập nhanh" — the handful of documents employees look up most, as
 * solid brand tiles. Placed directly under the hero because a portal's job
 * is to shorten the path to routine tasks before it shows anything else.
 */
export function QuickLinks() {
  return (
    <VStack gap={5}>
      <SectionHeading
        id="truy-cap-nhanh"
        title="Truy cập nhanh"
        description="Những tài liệu và hướng dẫn được tra cứu nhiều nhất."
      />
      <Grid columns={{ minWidth: 170, max: 6 }} gap={3}>
        {quickLinks.map(({ icon, label, description, href }) => (
          <ClickableCard
            key={href}
            href={href}
            label={`${label} — ${description}`}
            padding={4}
            xstyle={styles.tile}
          >
            <VStack gap={5} justify="between" height="100%">
              <Icon icon={icon} color="inherit" size="lg" />
              <VStack gap={1}>
                <Heading level={3} color="inherit">
                  {label}
                </Heading>
                <Text
                  type="supporting"
                  color="inherit"
                  display="block"
                  maxLines={2}
                >
                  {description}
                </Text>
              </VStack>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>
    </VStack>
  );
}
