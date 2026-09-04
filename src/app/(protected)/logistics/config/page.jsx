import { BreadcrumbItem, Breadcrumbs } from '@astryxdesign/core/Breadcrumbs';
import { VStack } from '@astryxdesign/core/VStack';

import { PageContentShell } from '@/shared/components/page-content-shell.jsx';
import { RouteHubList } from '@/shared/components/route-hub-list.jsx';

export const metadata = {
  title: 'Cấu hình · Logistics · KT-XNK',
};

const ITEMS = [
  {
    title: 'Nước',
    description: 'Danh mục nước xuất khẩu dùng trong hợp đồng.',
    href: '/logistics/countries',
  },
  {
    title: 'Cảng / Nơi',
    description: 'Danh mục cảng, nơi xếp/dỡ hàng dùng trong hợp đồng.',
    href: '/logistics/places',
  },
];

/**
 * Access is gated by `routeAccessRules` (`logistics:contracts:view`),
 * enforced in middleware before this renders. Lands here when the "Cấu
 * hình" sidebar group itself is clicked (`sidebarLogistics.json`), rather
 * than one of its children.
 */
export default function LogisticsConfigPage() {
  return (
    <PageContentShell>
      <VStack gap={4} hAlign="stretch">
        <Breadcrumbs>
          <BreadcrumbItem href="/logistics">Logistics</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Cấu hình</BreadcrumbItem>
        </Breadcrumbs>

        <RouteHubList items={ITEMS} />
      </VStack>
    </PageContentShell>
  );
}
