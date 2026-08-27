'use client';

import { HStack } from '@astryxdesign/core/HStack';
import { StackItem } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

import { ExtraFieldsEditor } from './extra-fields-editor.jsx';

/**
 * Shared Customer (Party A catalog) field-set — used both by the
 * standalone Customers-page create dialog and the quick-create dialog
 * embedded in the Contract form.
 * @param {{
 *   values: import('../types/index.js').CustomerFormValues,
 *   setField: (field: keyof import('../types/index.js').CustomerFormValues, value: string) => void,
 *   fieldStatuses: Record<string, { type: 'error', message: string } | undefined>,
 *   extraFieldRows: ReturnType<typeof import('../hooks/use-extra-field-rows.js').useExtraFieldRows>,
 * }} props
 */
export function CustomerFields({ values, setField, fieldStatuses, extraFieldRows }) {
  return (
    <VStack gap={3} hAlign="stretch">
      <TextInput
        label="Tên công ty"
        value={values.companyName}
        onChange={(value) => setField('companyName', value)}
        isRequired
        status={fieldStatuses.companyName}
        statusVariant="tooltip"
      />

      <HStack gap={3}>
        <StackItem size="fill">
          <TextInput
            label="Người đại diện"
            value={values.representativeName}
            onChange={(value) => setField('representativeName', value)}
          />
        </StackItem>
        <StackItem size="fill">
          <TextInput
            label="Chức vụ"
            value={values.representativeTitle}
            onChange={(value) => setField('representativeTitle', value)}
          />
        </StackItem>
      </HStack>

      <TextInput
        label="Địa chỉ"
        value={values.address}
        onChange={(value) => setField('address', value)}
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
