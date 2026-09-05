'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Collapsible, CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { Skeleton } from '@astryxdesign/core/Skeleton';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

import { useCreateUserFormV2 } from '../hooks/use-create-user-form-v2.js';
import { useEditUserFormV2 } from '../hooks/use-edit-user-form-v2.js';
import { BankAccountsFields } from './bank-accounts-fields.jsx';
import { CreateUserPermissionsFields } from './create-user-permissions-fields.jsx';
import { UserEmployeeFields } from './user-employee-fields.jsx';
import { UserIdentityFields } from './user-identity-fields.jsx';
import { UserOrgFields } from './user-org-fields.jsx';
import { UserPermissionsFields } from './user-permissions-fields.jsx';
import { UserSessionFields } from './user-session-fields.jsx';

const styles = stylex.create({
  form: {
    height: '100%',
  },
});

/**
 * One collapsed section of the dialog. Each is its own Card, which is the
 * Astryx idiom for accordion layouts (`astryx component Collapsible`) — the
 * card gives the section its boundary, so the group doesn't also draw
 * dividers.
 * @param {{ value: string, title: string, children: import('react').ReactNode }} props
 */
function FormSection({ value, title, children }) {
  return (
    <Card>
      <Collapsible value={value} trigger={title}>
        <VStack gap={3} hAlign="stretch" paddingBlock={3}>
          {children}
        </VStack>
      </Collapsible>
    </Card>
  );
}

/**
 * The v2 create/edit dialog. Replaces v1's tab strip with a stack of cards:
 * one always-open card with the fields needed to identify the person, then
 * one collapsed card per topic. Both modes render exactly this — everything
 * that differs between creating and editing is resolved by the hook into the
 * `controller` contract (`types/index.js`, `UserFormV2Controller`), so there
 * is a single layout to maintain rather than two that drift apart.
 *
 * Sections are `type="multiple"` and start closed: an accordion that closes
 * the previous section would hide fields the Admin already filled in, and a
 * validation error on a closed section still has to be reachable.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   controller: import('../types/index.js').UserFormV2Controller,
 * }} props
 */
function UserFormDialogShell({ isOpen, onOpenChange, controller }) {
  const {
    mode,
    title,
    submitLabel,
    isLoadingUser,
    values,
    setField,
    fieldStatuses,
    password,
    editableNationalId,
    readOnlyEmployeeCode,
    submitError,
    submitSuccess,
    isSubmitting,
    companies,
    branches,
    departments,
    positions,
    vietnamBanks,
    oldProvinces,
    oldDistricts,
    oldWards,
    newProvinces,
    newWards,
    bankAccountRows,
    addBankAccountRow,
    removeBankAccountRow,
    clearBankAccountRows,
    updateBankAccountRowField,
    setPrimaryBankAccountRow,
    permissionsFieldsProps,
    createPermissionsFieldsProps,
    concurrentSessionsProps,
    handleSubmit,
  } = controller;

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      purpose="form"
      variant="fullscreen"
    >
      <form onSubmit={handleSubmit} {...stylex.props(styles.form)}>
        <Layout
          header={<DialogHeader title={title} onOpenChange={onOpenChange} />}
          content={
            <LayoutContent padding={6} isScrollable={false}>
              {/*
                The fullscreen frame has a fixed viewport height. This inner
                VStack fills the remaining content region and is its sole
                scroll owner, so expanding cards never moves the header or
                footer and doesn't create a redundant nested scrollbar.

                In edit mode the list row is a slim projection, so the form is
                empty until `GET /users/{id}` lands. Showing the blank form
                meanwhile would invite a save that erases every field the row
                omits — see `use-edit-user-form.js`.
              */}
              <VStack gap={4} hAlign="stretch" height="100%" isScrollable>
                {isLoadingUser ? (
                  <>
                    <Text color="secondary">
                      Đang tải thông tin người dùng…
                    </Text>
                    {[0, 1, 2, 3, 4, 5].map((row) => (
                      <Skeleton key={row} height={40} index={row} />
                    ))}
                  </>
                ) : (
                  <>
                    {submitError ? (
                      <Banner
                        status="error"
                        title={submitError}
                        container="card"
                      />
                    ) : null}
                    {submitSuccess ? (
                      <Banner
                        status="success"
                        title={submitSuccess}
                        container="card"
                      />
                    ) : null}

                    <Card>
                      <VStack gap={3} hAlign="stretch">
                        <Text type="large" weight="semibold">
                          Thông tin khởi tạo
                        </Text>
                        <UserIdentityFields
                          values={values}
                          setField={setField}
                          fieldStatuses={fieldStatuses}
                          password={password}
                        />
                      </VStack>
                    </Card>

                    <CollapsibleGroup type="multiple" defaultValue={[]}>
                      <VStack gap={3} hAlign="stretch">
                        <FormSection value="work" title="Thông tin công việc">
                          <UserOrgFields
                            values={values}
                            setField={setField}
                            fieldStatuses={fieldStatuses}
                            companies={companies}
                            branches={branches}
                            departments={departments}
                            positions={positions}
                          />
                        </FormSection>

                        <FormSection value="bank" title="Thông tin ngân hàng">
                          <BankAccountsFields
                            rows={bankAccountRows}
                            vietnamBanks={vietnamBanks}
                            onAddRow={addBankAccountRow}
                            onRemoveRow={removeBankAccountRow}
                            onClearRows={clearBankAccountRows}
                            onUpdateRowField={updateBankAccountRowField}
                            onSetPrimaryRow={setPrimaryBankAccountRow}
                          />
                        </FormSection>

                        <FormSection
                          value="employee"
                          title="Thông tin nhân viên"
                        >
                          <UserEmployeeFields
                            values={values}
                            setField={setField}
                            fieldStatuses={fieldStatuses}
                            editableNationalId={editableNationalId}
                            readOnlyEmployeeCode={readOnlyEmployeeCode}
                            oldProvinces={oldProvinces}
                            oldDistricts={oldDistricts}
                            oldWards={oldWards}
                            newProvinces={newProvinces}
                            newWards={newWards}
                          />
                        </FormSection>

                        {/* Create mode leaves this null — granting a permission
                          to an account that doesn't exist yet is meaningless. */}
                        {permissionsFieldsProps ? (
                          <FormSection value="permissions" title="Phân quyền">
                            <UserPermissionsFields
                              {...permissionsFieldsProps}
                            />
                          </FormSection>
                        ) : null}

                        {createPermissionsFieldsProps ? (
                          <FormSection value="permissions" title="Phân quyền">
                            <CreateUserPermissionsFields
                              {...createPermissionsFieldsProps}
                            />
                          </FormSection>
                        ) : null}

                        {concurrentSessionsProps ? (
                          <FormSection value="sessions" title="Phiên đăng nhập">
                            <UserSessionFields {...concurrentSessionsProps} />
                          </FormSection>
                        ) : null}
                      </VStack>
                    </CollapsibleGroup>
                  </>
                )}
              </VStack>
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <HStack hAlign="end" gap={2}>
                <Button
                  label="Hủy"
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                />
                <Button
                  label={submitLabel}
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  isDisabled={mode === 'edit' && isLoadingUser}
                />
              </HStack>
            </LayoutFooter>
          }
        />
      </form>
    </Dialog>
  );
}

/**
 * Mode wrappers exist only because hooks can't be called conditionally: each
 * one calls its own hook and hands the same contract to the same shell.
 * @param {{ isOpen: boolean, onOpenChange: (isOpen: boolean) => void, onSuccess?: () => void }} props
 */
function CreateUserFormDialog({ isOpen, onOpenChange, onSuccess }) {
  const controller = useCreateUserFormV2({ onSuccess });

  return (
    <UserFormDialogShell
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      controller={controller}
    />
  );
}

/**
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   user: import('../types/index.js').UserListItem,
 *   onSuccess?: () => void,
 * }} props
 */
function EditUserFormDialog({ isOpen, onOpenChange, user, onSuccess }) {
  const controller = useEditUserFormV2(user, { onSuccess });

  return (
    <UserFormDialogShell
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      controller={controller}
    />
  );
}

/**
 * v2 of `CreateUserForm`/`EditUserForm`, now a single dialog. `mode="edit"`
 * requires `user`; the create flow has no record to edit yet.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   onSuccess?: () => void,
 * } & (
 *   { mode: 'create', user?: undefined } |
 *   { mode: 'edit', user: import('../types/index.js').UserListItem }
 * )} props
 */
export function UserFormDialog({
  mode,
  user,
  isOpen,
  onOpenChange,
  onSuccess,
}) {
  if (mode === 'edit') {
    return (
      <EditUserFormDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        user={user}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <CreateUserFormDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}
