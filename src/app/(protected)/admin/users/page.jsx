import { BreadcrumbItem,Breadcrumbs } from '@astryxdesign/core/Breadcrumbs';
import { VStack } from '@astryxdesign/core/VStack';
import { cookies } from 'next/headers';

import { UserList } from '../../../../features/admin-users/index.js';
import { ACCESS_TOKEN_KEY } from '../../../../features/auth/index.js';
import { PageContentShell } from '../../../../shared/components/page-content-shell.jsx';

export const metadata = {
  title: 'Người dùng · Quản trị · KT-XNK',
};

/**
 * Same token-passed-down-as-a-prop contract as
 * `admin/users/new/page.jsx` used — see that file's comment for why
 * `features/admin-users` can't read the session cookie itself.
 */
export default async function UsersListPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_KEY)?.value ?? '';

  return (
    <PageContentShell>
      <VStack gap={4} hAlign="stretch">
        <Breadcrumbs>
          <BreadcrumbItem href="/admin">Quản trị</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Người dùng</BreadcrumbItem>
        </Breadcrumbs>

        <UserList token={token} />
      </VStack>
    </PageContentShell>
  );
}
