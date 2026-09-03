'use client';

import { HStack } from '@astryxdesign/core/HStack';
import { StackItem } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

import { ExtraFieldsEditor } from './extra-fields-editor.jsx';

/**
 * Shared ContractBank field-set — used both by the quick-create dialog
 * embedded in the Contract form and (if a standalone banks page is added
 * later) any future dedicated page.
 * @param {{
 *   values: import('../types/index.js').ContractBankFormValues,
 *   setField: (field: keyof import('../types/index.js').ContractBankFormValues, value: string) => void,
 *   fieldStatuses: Record<string, { type: 'error', message: string } | undefined>,
 *   extraFieldRows: ReturnType<typeof import('../hooks/use-extra-field-rows.js').useExtraFieldRows>,
 * }} props
 */
export function BankFields({ values, setField, fieldStatuses, extraFieldRows }) {
  return (
    <VStack gap={3} hAlign="stretch">
      <TextInput
        label="Tên ngân hàng"
        value={values.bankName}
        onChange={(value) => setField('bankName', value)}
        isRequired
        status={fieldStatuses.bankName}
        statusVariant="tooltip"
      />

      <HStack gap={3}>
        <StackItem size="fill">
          <TextInput
            label="Beneficiary"
            value={values.beneficiary}
            onChange={(value) => setField('beneficiary', value)}
          />
        </StackItem>
        <StackItem size="fill">
          <TextInput
            label="Số tài khoản"
            value={values.bankAccountNumber}
            onChange={(value) => setField('bankAccountNumber', value)}
          />
        </StackItem>
      </HStack>

      <HStack gap={3}>
        <StackItem size="fill">
          <TextInput
            label="Chi nhánh"
            value={values.branchName}
            onChange={(value) => setField('branchName', value)}
          />
        </StackItem>
        <StackItem size="fill">
          <TextInput
            label="Địa chỉ ngân hàng"
            value={values.bankAddress}
            onChange={(value) => setField('bankAddress', value)}
          />
        </StackItem>
      </HStack>

      <TextInput
        label="Swift Code"
        value={values.swiftCode}
        onChange={(value) => setField('swiftCode', value)}
      />

      <ExtraFieldsEditor
        rows={extraFieldRows.rows}
        onAddRow={extraFieldRows.addRow}
        onRemoveRow={extraFieldRows.removeRow}
        onUpdateRowField={extraFieldRows.updateRowField}
      />
    </VStack>
  );
}
