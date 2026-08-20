'use client';

import { Selector } from '@astryxdesign/core/Selector';
import { VStack } from '@astryxdesign/core/VStack';

/**
 * "Nơi làm việc" (Company/Branch/Department/Position) — stays visible
 * outside the tab strip in both `CreateUserForm`/`EditUserForm`, laid out
 * as its own section (not sharing a row with the identity fields), with
 * each field on its own row.
 * @param {{
 *   values: import('../types/index.js').CreateUserFormValues | import('../types/index.js').EditUserFormValues,
 *   setField: (field: string, value: string) => void,
 *   fieldStatuses: Record<string, { type: 'error', message: string } | undefined>,
 *   companies: import('../types/index.js').Company[],
 *   branches: import('../types/index.js').Branch[],
 *   departments: import('../types/index.js').Department[],
 *   positions: import('../types/index.js').Position[],
 * }} props
 */
export function UserOrgFields({
  values,
  setField,
  fieldStatuses,
  companies,
  branches,
  departments,
  positions,
}) {
  return (
    <VStack gap={3}>
      <Selector
        label="Công ty"
        placeholder="Chọn công ty"
        value={values.companyId}
        onChange={(value) => setField('companyId', value ?? '')}
        options={companies.map((company) => ({
          value: company.id,
          label: company.name,
        }))}
        isRequired
        status={fieldStatuses.companyId}
        statusVariant="tooltip"
        width="100%"
      />

      <Selector
        label="Chi nhánh"
        placeholder="Chọn chi nhánh"
        value={values.branchId}
        onChange={(value) => setField('branchId', value ?? '')}
        options={branches.map((branch) => ({
          value: branch.id,
          label: branch.name,
        }))}
        isDisabled={!values.companyId}
        disabledMessage="Chọn công ty trước"
        isRequired
        status={fieldStatuses.branchId}
        statusVariant="tooltip"
        width="100%"
      />

      <Selector
        label="Phòng ban"
        placeholder="Chọn phòng ban"
        value={values.departmentId}
        onChange={(value) => setField('departmentId', value ?? '')}
        options={departments.map((department) => ({
          value: department.id,
          label: department.name,
        }))}
        isDisabled={!values.branchId}
        disabledMessage="Chọn chi nhánh trước"
        isRequired
        status={fieldStatuses.departmentId}
        statusVariant="tooltip"
        width="100%"
      />

      <Selector
        label="Chức vụ"
        placeholder="Chọn chức vụ"
        value={values.positionId}
        onChange={(value) => setField('positionId', value ?? '')}
        options={positions.map((position) => ({
          value: position.id,
          label: position.name,
        }))}
        isRequired
        status={fieldStatuses.positionId}
        statusVariant="tooltip"
        width="100%"
      />
    </VStack>
  );
}
