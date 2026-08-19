'use client';

import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

/**
 * "Thông tin liên hệ" tab content: phone + address — mirrors the reference
 * layout's grouping (phone and address together, separate from the
 * always-visible identity/org fields above the tab strip).
 * @param {{
 *   values: import('../types/index.js').CreateUserFormValues | import('../types/index.js').EditUserFormValues,
 *   setField: (field: string, value: string) => void,
 *   fieldStatuses: Record<string, { type: 'error', message: string } | undefined>,
 * }} props
 */
export function UserContactFields({ values, setField, fieldStatuses }) {
  return (
    <VStack gap={3} hAlign="stretch">
      <TextInput
        label="Số điện thoại"
        value={values.phone}
        onChange={(value) => setField('phone', value)}
        placeholder="Số 10 chữ số, bắt đầu bằng 0"
        isRequired
        status={fieldStatuses.phone}
        statusVariant="tooltip"
      />

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
  );
}
