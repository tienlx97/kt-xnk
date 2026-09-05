import { LogisticsOverview } from '@/features/logistics/index.js';
import { PageContentShell } from '@/shared/components/page-content-shell.jsx';

export const metadata = {
  title: 'Logistics · KT-XNK',
};

/**
 * Access is already gated: `routeAccessRules` requires `logistics:view` for
 * everything under `/logistics`, enforced in middleware before this
 * renders. The backend re-checks the permission on any real Logistics
 * endpoint once one exists — the route rule here is UX, not the security
 * boundary.
 */
export default function LogisticsPage() {
  return (
    <PageContentShell isFullWidth>
      <LogisticsOverview />
    </PageContentShell>
  );
}
