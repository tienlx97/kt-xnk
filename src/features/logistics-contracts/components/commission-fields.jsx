'use client';

import { Card } from '@astryxdesign/core/Card';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { DateInput } from '@astryxdesign/core/DateInput';
import { HStack } from '@astryxdesign/core/HStack';
import { Selector } from '@astryxdesign/core/Selector';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';

import { FormattedNumberTextInput } from '@/shared/components/formatted-number-text-input.jsx';

import { PaymentHistoryFields } from './payment-history-fields.jsx';
import { PaymentTermsFields } from './payment-terms-fields.jsx';

/**
 * One boxed sub-section of the form (Đợt thanh toán / Lịch sử thanh
 * toán) — a plain, non-collapsible `Card` with its own title, so the two
 * editable tables read as distinct groups instead of running straight
 * into each other with no visual break.
 * @param {{ title: string, children: import('react').ReactNode }} props
 */
function Section({ title, children }) {
  return (
    <Card padding={4}>
      <VStack gap={3} hAlign="stretch">
        <Text weight="semibold">{title}</Text>
        {children}
      </VStack>
    </Card>
  );
}

/**
 * `Commission` field-set. `year`/`number`/`code` are backend-assigned
 * and never editable — shown read-only in the dialog header when editing
 * (see `CommissionFormDialog`). Uses the parent contract's `currency`,
 * so there is no currency field here.
 * @param {{
 *   values: import('../types/index.js').CommissionFormValues,
 *   setField: <K extends keyof import('../types/index.js').CommissionFormValues>(field: K, value: import('../types/index.js').CommissionFormValues[K]) => void,
 *   fieldStatuses: Record<string, { type: 'error', message: string } | undefined>,
 *   customers: import('../types/index.js').Customer[],
 *   currency: string,
 *   paymentTermRows: ReturnType<typeof import('../hooks/use-payment-term-rows.js').usePaymentTermRows>,
 *   paymentHistoryRows: ReturnType<typeof import('../hooks/use-payment-history-rows.js').usePaymentHistoryRows>,
 * }} props
 */
export function CommissionFields({
  values,
  setField,
  fieldStatuses,
  customers,
  currency,
  paymentTermRows,
  paymentHistoryRows,
}) {
  return (
    <VStack gap={5} hAlign="stretch">
      <DateInput
        label="Ngày ký"
        value={
          /** @type {import('@astryxdesign/core/Calendar').ISODateString} */ (
            values.signedDate
          )
        }
        onChange={(value) => setField('signedDate', value ?? '')}
        isRequired
        status={fieldStatuses.signedDate}
        statusVariant="tooltip"
        width="100%"
      />

      <Selector
        label="Bên nhận hoa hồng"
        hasSearch
        placeholder="Chọn khách hàng"
        value={values.partyCustomerId}
        onChange={(value) => setField('partyCustomerId', value ?? '')}
        options={customers.map((customer) => ({
          value: customer.id,
          label: customer.companyName,
        }))}
        isRequired
        status={fieldStatuses.partyCustomerId}
        statusVariant="tooltip"
        width="100%"
      />

      <FormattedNumberTextInput
        label="Giá trị"
        value={values.value}
        onChange={(value) => setField('value', value)}
        units={currency || undefined}
        isRequired
        status={fieldStatuses.value}
        statusVariant="tooltip"
      />

      <HStack gap={4}>
        <CheckboxInput
          label="Bên bán đã ký"
          value={values.sellerSigned}
          onChange={(checked) => setField('sellerSigned', checked)}
        />
        <CheckboxInput
          label="Bên nhận hoa hồng đã ký"
          value={values.partySigned}
          onChange={(checked) => setField('partySigned', checked)}
        />
      </HStack>

      <Section title={'Đợt thanh toán'}>
        <PaymentTermsFields
          rows={paymentTermRows.rows}
          totalPercent={paymentTermRows.totalPercent}
          status={fieldStatuses.paymentTerms}
          contractValue={values.value}
          currency={currency}
          onAddRow={paymentTermRows.addRow}
          onRemoveRow={paymentTermRows.removeRow}
          onUpdateRowField={paymentTermRows.updateRowField}
        />
      </Section>

      <Section title="Lịch sử thanh toán">
        <PaymentHistoryFields
          rows={paymentHistoryRows.rows}
          status={fieldStatuses.paymentHistory}
          currency={currency}
          onAddRow={paymentHistoryRows.addRow}
          onRemoveRow={paymentHistoryRows.removeRow}
          onUpdateRowField={paymentHistoryRows.updateRowField}
        />
      </Section>
    </VStack>
  );
}
