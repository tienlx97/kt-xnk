import { BreadcrumbItem, Breadcrumbs } from '@astryxdesign/core/Breadcrumbs';
import { VStack } from '@astryxdesign/core/VStack';

import { PermissionCatalog } from '../../../../features/admin-users/index.js';
import { PageContentShell } from '../../../../shared/components/page-content-shell.jsx';

export const metadata = {
  title: 'Quyền cấp riêng · Quản trị · KT-XNK',
};

/**
 * Access is already gated: `routeAccessRules` requires `users:manage` for
 * everything under `/admin`, enforced in middleware before this renders.
 * The backend re-checks Admin on every call regardless — the route rule is
 * UX, not the security boundary.
 */
export default function PermissionsPage() {
  return (
    <PageContentShell>
      <VStack gap={4} hAlign="stretch">
        <Breadcrumbs>
          <BreadcrumbItem href="/admin">Quản trị</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Quyền cấp riêng</BreadcrumbItem>
        </Breadcrumbs>

        <PermissionCatalog />
      </VStack>
    </PageContentShell>
  );
}
