import { BreadcrumbItem, Breadcrumbs } from '@astryxdesign/core/Breadcrumbs';
import { VStack } from '@astryxdesign/core/VStack';

import { PageContentShell } from '@/shared/components/page-content-shell.jsx';
import { RouteHubList } from '@/shared/components/route-hub-list.jsx';

export const metadata = {
  title: 'Hợp đồng · Logistics · KT-XNK',
};

const ITEMS = [
  {
    title: 'Danh sách',
    description: 'Danh sách hợp đồng, phụ lục, đợt thanh toán và ngân hàng.',
    href: '/logistics/contracts',
  },
  {
    title: 'Shipment',
    description: 'Lô hàng gắn với từng hợp đồng và VGM.',
    href: '/logistics/shipments',
  },
  {
    title: 'Commission',
    description: 'Hoa hồng và phụ lục hoa hồng theo hợp đồng.',
    href: '/logistics/commissions',
  },
  {
    title: 'Khách hàng',
    description: 'Danh sách khách hàng và bên liên quan.',
    href: '/logistics/customers',
  },
];

/**
 * Access is gated by `routeAccessRules` (`logistics:contracts:view`),
 * enforced in middleware before this renders. Lands here when the "Hợp
 * đồng" sidebar group itself is clicked (`sidebarLogistics.json`), rather
 * than one of its children.
 */
export default function LogisticsContractsOverviewPage() {
  return (
    <PageContentShell>
      <VStack gap={4} hAlign="stretch">
        <Breadcrumbs>
          <BreadcrumbItem href="/logistics">Logistics</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Hợp đồng</BreadcrumbItem>
        </Breadcrumbs>

        <RouteHubList items={ITEMS} />
      </VStack>
    </PageContentShell>
  );
}
