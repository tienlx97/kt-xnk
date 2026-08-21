'use client';

import { useEditUserForm } from './use-edit-user-form.js';

/**
 * Edit-user half of the v2 dialog's contract — see
 * `use-create-user-form-v2.js` for why this wraps the v1 hook instead of
 * reimplementing it.
 * @param {import('../types/index.js').UserListItem} user
 * @param {{ onSuccess?: () => void }} [options]
 * @returns {import('../types/index.js').UserFormV2Controller}
 */
export function useEditUserFormV2(user, { onSuccess } = {}) {
  const form = useEditUserForm(user, { onSuccess });

  return {
    ...form,
    mode: 'edit',
    title: 'CẬP NHẬT NHÂN VIÊN',
    submitLabel: 'Lưu thay đổi',
    // `PUT /users/{id}` doesn't accept a password — it has its own reset
    // endpoint (see `update-user-schema.js`). NationalId (CCCD) IS editable
    // now; EmployeeCode (the actual login identifier) is what's immutable.
    password: null,
    editableNationalId: form.values.nationalId,
    readOnlyEmployeeCode: user.employeeCode,
    permissionsFieldsProps: {
      userId: user.id,
      extraPermissions: form.extraPermissions,
      isLoading: form.isLoadingUser,
    },
    concurrentSessionsProps: form.concurrentSessionsProps,
  };
}
