'use client';

import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Grid } from '@astryxdesign/core/Grid';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

/**
 * Destination cards for a sidebar group's overview page — `sidebarLogistics
 * .json` gives a group (e.g. "Hợp đồng", "Cấu hình") its own `path` so
 * clicking the group itself, not just one of its children, lands somewhere;
 * this renders that landing page as a grid of links to the group's routes.
 * @param {{ items: Array<{ title: string, description?: string, href: string }> }} props
 */
export function RouteHubList({ items }) {
  return (
    <Grid columns={{ minWidth: 240, max: 3 }} gap={4}>
      {items.map((item) => (
        <ClickableCard key={item.href} href={item.href} label={item.title}>
          <HStack hAlign="between" vAlign="center" gap={2}>
            <VStack gap={1}>
              <Text weight="semibold">{item.title}</Text>
              {item.description ? (
                <Text type="supporting">{item.description}</Text>
              ) : null}
            </VStack>
            <Icon icon="chevronRight" color="secondary" />
          </HStack>
        </ClickableCard>
      ))}
    </Grid>
  );
}
