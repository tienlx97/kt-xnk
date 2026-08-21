'use client';

import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Selector } from '@astryxdesign/core/Selector';
import { StackItem } from '@astryxdesign/core/Stack';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

import { IconPlus } from '../../../shared/components/icon/icon-plus.jsx';
import {
  useCreateBranchMutation,
  useCreateCompanyMutation,
  useCreateDepartmentMutation,
  useCreatePositionMutation,
} from '../hooks/use-org-directory.js';
import { CreateOrgItemDialog } from './create-org-item-dialog.jsx';

/**
 * A Selector plus its "+ Thêm mới" trigger, laid out as one row so the
 * button sits at the same height as the field rather than below/beside the
 * label. No `disabledMessage` prop exists on `IconButton` (that's a
 * Selector/TextInput-only affordance) and a disabled control swallows the
 * hover events an external Tooltip needs, so the "why" for a disabled add
 * button is left to the Selector beside it, which already shows one via its
 * own `disabledMessage`.
 * @param {{
 *   selector: import('react').ReactNode,
 *   addLabel: string,
 *   isAddDisabled?: boolean,
 *   onAdd: () => void,
 * }} props
 */
function SelectorWithAdd({ selector, addLabel, isAddDisabled = false, onAdd }) {
  return (
    <HStack gap={2} vAlign="end">
      <StackItem size="fill">{selector}</StackItem>
      <IconButton
        label={addLabel}
        tooltip={addLabel}
        icon={<Icon icon={IconPlus} size="sm" />}
        type="button"
        variant="secondary"
        isDisabled={isAddDisabled}
        onClick={onAdd}
      />
    </HStack>
  );
}

/**
 * "Nơi làm việc" (Company/Branch/Department/Position) — stays visible
 * outside the tab strip in both `CreateUserForm`/`EditUserForm`, laid out
 * as its own section (not sharing a row with the identity fields), with
 * each field on its own row.
 *
 * Each Selector has a "+ Thêm mới" button beside it that opens
 * `CreateOrgItemDialog` — Admin-only backend endpoints
 * (`CreateCompanyCommand` etc.), safe here because this form only ever
 * renders inside `/admin/users`. Creating a Branch/Department targets the
 * currently selected Company/Branch (the button is disabled until that
 * parent is chosen, same as the Selector itself), and the newly created
 * item is auto-selected via `setField` so the Admin doesn't have to find it
 * in the list again.
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
  const [openDialog, setOpenDialog] = useState(
    /** @type {'company' | 'branch' | 'department' | 'position' | null} */ (
      null
    ),
  );

  const createCompanyMutation = useCreateCompanyMutation();
  const createBranchMutation = useCreateBranchMutation(values.companyId);
  const createDepartmentMutation = useCreateDepartmentMutation();
  const createPositionMutation = useCreatePositionMutation();

  return (
    <VStack gap={3}>
      <SelectorWithAdd
        addLabel="Thêm công ty"
        onAdd={() => setOpenDialog('company')}
        selector={
          <Selector
            label="Công ty"
            hasSearch
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
        }
      />

      <SelectorWithAdd
        addLabel="Thêm chi nhánh"
        isAddDisabled={!values.companyId}
        onAdd={() => setOpenDialog('branch')}
        selector={
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
        }
      />

      <SelectorWithAdd
        addLabel="Thêm phòng ban"
        isAddDisabled={!values.branchId}
        onAdd={() => setOpenDialog('department')}
        selector={
          <Selector
            label="Phòng ban"
            hasSearch
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
        }
      />

      <SelectorWithAdd
        addLabel="Thêm chức vụ"
        onAdd={() => setOpenDialog('position')}
        selector={
          <Selector
            label="Chức vụ"
            hasSearch
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
        }
      />

      <CreateOrgItemDialog
        isOpen={openDialog === 'company'}
        onOpenChange={(isOpen) => setOpenDialog(isOpen ? 'company' : null)}
        title="Thêm công ty"
        label="Tên công ty"
        isSubmitting={createCompanyMutation.isPending}
        onSubmit={(name) => createCompanyMutation.mutateAsync(name)}
        onCreated={(id) => setField('companyId', id)}
      />

      <CreateOrgItemDialog
        isOpen={openDialog === 'branch'}
        onOpenChange={(isOpen) => setOpenDialog(isOpen ? 'branch' : null)}
        title="Thêm chi nhánh"
        label="Tên chi nhánh"
        isSubmitting={createBranchMutation.isPending}
        onSubmit={(name) => createBranchMutation.mutateAsync(name)}
        onCreated={(id) => setField('branchId', id)}
      />

      <CreateOrgItemDialog
        isOpen={openDialog === 'department'}
        onOpenChange={(isOpen) => setOpenDialog(isOpen ? 'department' : null)}
        title="Thêm phòng ban"
        label="Tên phòng ban"
        isSubmitting={createDepartmentMutation.isPending}
        onSubmit={(name) =>
          createDepartmentMutation.mutateAsync({ branchId: values.branchId, name })
        }
        onCreated={(id) => setField('departmentId', id)}
      />

      <CreateOrgItemDialog
        isOpen={openDialog === 'position'}
        onOpenChange={(isOpen) => setOpenDialog(isOpen ? 'position' : null)}
        title="Thêm chức vụ"
        label="Tên chức vụ"
        isSubmitting={createPositionMutation.isPending}
        onSubmit={(name) => createPositionMutation.mutateAsync(name)}
        onCreated={(id) => setField('positionId', id)}
      />
    </VStack>
  );
}
