'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { StackItem } from '@astryxdesign/core/Stack';
import { Heading, Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

import { useEditUserForm } from '../hooks/use-edit-user-form.js';
import { UserOrgAndAddressFields } from './user-org-address-fields.jsx';

/**
 * @param {{
 *   token: string,
 *   user: import('../types/index.js').UserListItem,
 *   onSuccess?: () => void,
 * }} props
 */
export function EditUserForm({ token, user, onSuccess }) {
  const {
    values,
    setField,
    fieldStatuses,
    submitError,
    isSubmitting,
    companies,
    branches,
    departments,
    positions,
    handleSubmit,
  } = useEditUserForm(token, user, { onSuccess });

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={5} hAlign="stretch">
        {submitError ? (
          <Banner status="error" title={submitError} container="card" />
        ) : null}

        <VStack gap={3} hAlign="stretch">
          <Heading level={3}>Thông tin cá nhân</Heading>

          <VStack gap={1}>
            <Text type="label" color="secondary">
              Căn cước công dân
            </Text>
            <Text>{user.nationalId}</Text>
          </VStack>

          <HStack gap={3}>
            <StackItem size="fill">
              <TextInput
                label="Họ"
                value={values.lastName}
                onChange={(value) => setField('lastName', value)}
                isRequired
                status={fieldStatuses.lastName}
                statusVariant="tooltip"
              />
            </StackItem>
            <StackItem size="fill">
              <TextInput
                label="Tên"
                value={values.firstName}
                onChange={(value) => setField('firstName', value)}
                isRequired
                status={fieldStatuses.firstName}
                statusVariant="tooltip"
              />
            </StackItem>
          </HStack>

          <TextInput
            label="Số điện thoại"
            value={values.phone}
            onChange={(value) => setField('phone', value)}
            placeholder="Số 10 chữ số, bắt đầu bằng 0"
            isRequired
            status={fieldStatuses.phone}
            statusVariant="tooltip"
          />
        </VStack>

        <UserOrgAndAddressFields
          values={values}
          setField={setField}
          fieldStatuses={fieldStatuses}
          companies={companies}
          branches={branches}
          departments={departments}
          positions={positions}
        />

        <Button
          label="Lưu thay đổi"
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
        />
      </VStack>
    </form>
  );
}
