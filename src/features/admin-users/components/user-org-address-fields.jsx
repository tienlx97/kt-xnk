'use client';

import { Divider } from '@astryxdesign/core/Divider';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import { Selector } from '@astryxdesign/core/Selector';
import { Heading } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

/**
 * "Nơi làm việc" (Company/Branch/Department/Position) + "Địa chỉ" sections
 * — identical between `CreateUserForm` and `EditUserForm`, only the
 * "Thông tin cá nhân" section above them differs (create has national ID +
 * password, edit doesn't).
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
export function UserOrgAndAddressFields({
  values,
  setField,
  fieldStatuses,
  companies,
  branches,
  departments,
  positions,
}) {
  return (
    <>
      <VStack gap={3} hAlign="stretch">
        <Heading level={3}>Nơi làm việc</Heading>

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
        />
      </VStack>

      <Divider />

      <VStack gap={3} hAlign="stretch">
        <Heading level={3}>Địa chỉ</Heading>

        <SegmentedControl
          label="Chuẩn địa chỉ"
          value={values.addressType}
          onChange={(value) => setField('addressType', value)}
        >
          <SegmentedControlItem value="NewUnits" label="Sau sáp nhập (Tỉnh/Xã)" />
          <SegmentedControlItem
            value="OldUnits"
            label="Trước sáp nhập (Tỉnh/Huyện/Xã)"
          />
        </SegmentedControl>

        <TextInput
          label="Tỉnh/Thành phố"
          value={values.province}
          onChange={(value) => setField('province', value)}
          isRequired
          status={fieldStatuses.province}
          statusVariant="tooltip"
        />

        {values.addressType === 'OldUnits' ? (
          <TextInput
            label="Quận/Huyện"
            value={values.district}
            onChange={(value) => setField('district', value)}
            isRequired
            status={fieldStatuses.district}
            statusVariant="tooltip"
          />
        ) : null}

        <TextInput
          label="Phường/Xã"
          value={values.ward}
          onChange={(value) => setField('ward', value)}
          isRequired
          status={fieldStatuses.ward}
          statusVariant="tooltip"
        />

        <TextInput
          label="Số nhà, tên đường"
          value={values.addressDetail}
          onChange={(value) => setField('addressDetail', value)}
          isRequired
          status={fieldStatuses.addressDetail}
          statusVariant="tooltip"
        />
      </VStack>
    </>
  );
}
