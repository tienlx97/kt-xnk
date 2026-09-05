import { BreadcrumbItem, Breadcrumbs } from '@astryxdesign/core/Breadcrumbs';
import { VStack } from '@astryxdesign/core/VStack';

import { ShipmentsList } from '@/features/logistics-contracts/index.js';
import { PageContentShell } from '@/shared/components/page-content-shell.jsx';

export const metadata = {
  title: 'Shipment · Logistics · KT-XNK',
};

/**
 * Access is gated by `routeAccessRules` (`logistics:contracts:view`),
 * enforced in middleware before this renders.
 */
export default function LogisticsShipmentsPage() {
  return (
    <PageContentShell isFullWidth>
      <VStack gap={4} hAlign="stretch">
        <Breadcrumbs>
          <BreadcrumbItem href="/logistics">Logistics</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Shipment</BreadcrumbItem>
        </Breadcrumbs>

        <ShipmentsList />
      </VStack>
    </PageContentShell>
  );
}
