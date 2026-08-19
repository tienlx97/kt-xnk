'use client';

import { useState } from 'react';

import { updateUserSchema } from '../config/update-user-schema.js';
import {
  useBranchesQuery,
  useCompaniesQuery,
  useDepartmentsQuery,
  usePositionsQuery,
} from './use-org-directory.js';
import { useUpdateUserMutation } from './use-update-user-mutation.js';

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

/**
 * Same cascade rules as `use-create-user-form.js`'s `applyFieldChange` —
 * see there for why.
 * @param {import('../types/index.js').EditUserFormValues} values
 * @param {keyof import('../types/index.js').EditUserFormValues} field
 * @param {string} value
 */
function applyFieldChange(values, field, value) {
  const next = { ...values, [field]: value };

  if (field === 'companyId') {
    next.branchId = '';
    next.departmentId = '';
  }
  if (field === 'branchId') {
    next.departmentId = '';
  }
  if (field === 'addressType' && value === 'NewUnits') {
    next.district = '';
  }

  return next;
}

/**
 * @param {import('../types/index.js').UserListItem} user
 * @returns {import('../types/index.js').EditUserFormValues}
 */
function toFormValues(user) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? '',
    addressType: user.addressType ?? 'NewUnits',
    province: user.province ?? '',
    district: user.district ?? '',
    ward: user.ward ?? '',
    addressDetail: user.addressDetail ?? '',
    positionId: user.positionId ?? '',
    companyId: user.companyId ?? '',
    branchId: user.branchId ?? '',
    departmentId: user.departmentIds[0] ?? '',
  };
}

/**
 * @param {string} token
 * @param {import('../types/index.js').UserListItem} user
 * @param {{ onSuccess?: () => void }} [options]
 */
export function useEditUserForm(token, user, { onSuccess } = {}) {
  const [values, setValues] = useState(() => toFormValues(user));
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');

  const companiesQuery = useCompaniesQuery();
  const branchesQuery = useBranchesQuery(values.companyId);
  const departmentsQuery = useDepartmentsQuery();
  const positionsQuery = usePositionsQuery();
  const updateUserMutation = useUpdateUserMutation(token);

  const departmentsInBranch = (departmentsQuery.data ?? []).filter(
    (department) => department.branchId === values.branchId,
  );

  /**
   * @param {string} field
   * @param {string} value
   */
  function setField(field, value) {
    setValues((current) =>
      applyFieldChange(
        current,
        /** @type {keyof import('../types/index.js').EditUserFormValues} */ (
          field
        ),
        value,
      ),
    );
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} event */
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    const result = updateUserSchema.safeParse(values);
    if (!result.success) {
      /** @type {Record<string, string>} */
      const nextFieldErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!nextFieldErrors[key]) {
          nextFieldErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    const updateResult = await updateUserMutation.mutateAsync({
      userId: user.id,
      values: result.data,
    });

    if (!updateResult.success) {
      setSubmitError(updateResult.message ?? 'Cập nhật người dùng thất bại');
      return;
    }

    onSuccess?.();
  }

  return {
    values,
    setField,
    fieldStatuses: {
      firstName: fieldStatus(fieldErrors.firstName),
      lastName: fieldStatus(fieldErrors.lastName),
      phone: fieldStatus(fieldErrors.phone),
      province: fieldStatus(fieldErrors.province),
      district: fieldStatus(fieldErrors.district),
      ward: fieldStatus(fieldErrors.ward),
      addressDetail: fieldStatus(fieldErrors.addressDetail),
      positionId: fieldStatus(fieldErrors.positionId),
      companyId: fieldStatus(fieldErrors.companyId),
      branchId: fieldStatus(fieldErrors.branchId),
      departmentId: fieldStatus(fieldErrors.departmentId),
    },
    submitError,
    isSubmitting: updateUserMutation.isPending,
    companies: companiesQuery.data ?? [],
    branches: branchesQuery.data ?? [],
    departments: departmentsInBranch,
    positions: positionsQuery.data ?? [],
    handleSubmit,
  };
}
