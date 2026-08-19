'use client';

import { useState } from 'react';

import { createUserSchema } from '../config/create-user-schema.js';
import { useCreateUserMutation } from './use-create-user-mutation.js';
import {
  useBranchesQuery,
  useCompaniesQuery,
  useDepartmentsQuery,
  usePositionsQuery,
} from './use-org-directory.js';

/** @type {import('../types/index.js').CreateUserFormValues} */
const EMPTY_VALUES = {
  nationalId: '',
  firstName: '',
  lastName: '',
  password: '',
  phone: '',
  addressType: 'NewUnits',
  province: '',
  district: '',
  ward: '',
  addressDetail: '',
  positionId: '',
  companyId: '',
  branchId: '',
  departmentId: '',
};

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

/**
 * Company → Branch → Department is a cascade: picking a new Company clears
 * the (now stale) Branch and Department, and picking a new Branch clears
 * the (now stale) Department. Switching address type to `NewUnits` clears
 * `district` too, since the backend rejects a non-empty district for that
 * type (post-2025-merger units have no district level).
 * @param {import('../types/index.js').CreateUserFormValues} values
 * @param {keyof import('../types/index.js').CreateUserFormValues} field
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
 * @param {string} token
 * @param {{ onSuccess?: () => void }} [options]
 */
export function useCreateUserForm(token, { onSuccess } = {}) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const companiesQuery = useCompaniesQuery();
  const branchesQuery = useBranchesQuery(values.companyId);
  const departmentsQuery = useDepartmentsQuery();
  const positionsQuery = usePositionsQuery();
  const createUserMutation = useCreateUserMutation(token);

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
        /** @type {keyof import('../types/index.js').CreateUserFormValues} */ (
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
    setSubmitSuccess('');

    const result = createUserSchema.safeParse(values);
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
    const createResult = await createUserMutation.mutateAsync(result.data);

    if (!createResult.success) {
      setSubmitError(createResult.message ?? 'Tạo người dùng thất bại');
      return;
    }

    setSubmitSuccess('Đã tạo người dùng thành công.');
    setValues(EMPTY_VALUES);
    onSuccess?.();
  }

  return {
    values,
    setField,
    fieldStatuses: {
      nationalId: fieldStatus(fieldErrors.nationalId),
      firstName: fieldStatus(fieldErrors.firstName),
      lastName: fieldStatus(fieldErrors.lastName),
      password: fieldStatus(fieldErrors.password),
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
    submitSuccess,
    isSubmitting: createUserMutation.isPending,
    companies: companiesQuery.data ?? [],
    branches: branchesQuery.data ?? [],
    departments: departmentsInBranch,
    positions: positionsQuery.data ?? [],
    handleSubmit,
  };
}
