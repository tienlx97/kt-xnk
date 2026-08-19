'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { StackItem } from '@astryxdesign/core/Stack';
import { Heading } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

import { generateRandomPassword } from '../config/generate-password.js';
import { useCreateUserForm } from '../hooks/use-create-user-form.js';
import { UserOrgAndAddressFields } from './user-org-address-fields.jsx';

/** @param {{ token: string, onSuccess?: () => void }} props */
export function CreateUserForm({ token, onSuccess }) {
  const {
    values,
    setField,
    fieldStatuses,
    submitError,
    submitSuccess,
    isSubmitting,
    companies,
    branches,
    departments,
    positions,
    handleSubmit,
  } = useCreateUserForm(token, { onSuccess });

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={5} hAlign="stretch">
        {submitError ? (
          <Banner status="error" title={submitError} container="card" />
        ) : null}
        {submitSuccess ? (
          <Banner status="success" title={submitSuccess} container="card" />
        ) : null}

        <VStack gap={3} hAlign="stretch">
          <Heading level={3}>Thông tin cá nhân</Heading>

          <TextInput
            label="Căn cước công dân"
            value={values.nationalId}
            onChange={(value) => setField('nationalId', value)}
            placeholder="Nhập số CCCD (12 số)"
            isRequired
            status={fieldStatuses.nationalId}
            statusVariant="tooltip"
          />

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

          <HStack gap={2}>
            <StackItem size="fill">
              <TextInput
                label="Mật khẩu tạm"
                description="Hiển thị dạng chữ thường để Admin đọc/copy gửi cho nhân viên"
                value={values.password}
                onChange={(value) => setField('password', value)}
                type="text"
                placeholder="Tối thiểu 8 ký tự, có hoa/thường/số/ký tự đặc biệt"
                isRequired
                status={fieldStatuses.password}
                statusVariant="tooltip"
              />
            </StackItem>
            <StackItem crossAlignSelf="end">
              <Button
                label="Ngẫu nhiên"
                type="button"
                variant="secondary"
                onClick={() => setField('password', generateRandomPassword())}
              />
            </StackItem>
          </HStack>
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
          label="Tạo người dùng"
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
        />
      </VStack>
    </form>
  );
}
