'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

/**
 * Landing page for the `logistics:view`-gated `/logistics` route
 * (`shared/config/site.js`'s top nav link, `shared/config/route-access.js`'s
 * middleware rule). Placeholder content only — no logistics data/API exists
 * yet; this establishes the route and its permission gate so both can be
 * built out feature-by-feature later without touching the nav/gate wiring
 * again.
 */
export function LogisticsOverview() {
  return (
    <VStack gap={4} hAlign="stretch">
      <VStack gap={1}>
        <Heading level={1}>Logistics</Heading>
        <Text color="secondary">
          Khu vực dành riêng cho bộ phận Logistics.
        </Text>
      </VStack>

      <Banner
        status="info"
        title="Đang xây dựng"
        description="Trang này hiện chỉ là khung — nghiệp vụ Logistics sẽ được bổ sung sau."
        container="card"
      />
    </VStack>
  );
}
