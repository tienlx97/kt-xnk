'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Switch } from '@astryxdesign/core/Switch';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

import { labelForPermission } from '../config/grantable-permissions.js';
import { useGrantablePermissionsQuery } from '../hooks/use-grantable-permissions-query.js';
import {
  useGrantUserPermissionMutation,
  useRevokeUserPermissionMutation,
} from '../hooks/use-user-permission-mutation.js';

/**
 * "Quyền" tab — grants/revokes permissions directly on this user,
 * independent of their role/department (see BE-kt-xnk,
 * `openspec/changes/add-user-permission-grants/proposal.md`). Each switch
 * takes effect immediately on toggle, not on the dialog's "Lưu thay đổi":
 * grant/revoke are separate API calls that rotate the target's session the
 * instant they run, so staging them behind the form's save button would
 * misrepresent when the change actually applies.
 * @param {{
 *   userId: string,
 *   extraPermissions: string[],
 *   isLoading: boolean,
 * }} props
 */
export function UserPermissionsFields({ userId, extraPermissions, isLoading }) {
  const [error, setError] = useState('');
  const grantablePermissionsQuery = useGrantablePermissionsQuery();
  const grantMutation = useGrantUserPermissionMutation(userId);
  const revokeMutation = useRevokeUserPermissionMutation(userId);

  if (isLoading || grantablePermissionsQuery.isLoading) {
    return <Text color="secondary">Đang tải quyền của người dùng…</Text>;
  }

  /**
   * @param {string} permission
   * @param {boolean} nextValue
   */
  async function togglePermission(permission, nextValue) {
    setError('');

    const result = nextValue
      ? await grantMutation.mutateAsync(permission)
      : await revokeMutation.mutateAsync(permission);

    if (!result.success) {
      setError(result.message);
    }
  }

  return (
    <VStack gap={4} hAlign="stretch">
      {error ? <Banner status="error" title={error} container="card" /> : null}

      <Text color="secondary">
        Quyền cấp riêng cho người dùng này, không phụ thuộc phòng ban. Bật/tắt
        có hiệu lực ngay, không cần bấm &quot;Lưu thay đổi&quot;.
      </Text>

      <VStack gap={3} hAlign="stretch">
        {(grantablePermissionsQuery.data ?? []).map((permission) => {
          const { label, description } = labelForPermission(permission);
          return (
            <Switch
              key={permission}
              label={label}
              description={description}
              value={extraPermissions.includes(permission)}
              changeAction={(checked) => togglePermission(permission, checked)}
              labelSpacing="spread"
            />
          );
        })}
      </VStack>
    </VStack>
  );
}
