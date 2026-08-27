'use client';

import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Selector } from '@astryxdesign/core/Selector';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

import { IconPlus } from '../../../shared/components/icon/icon-plus.jsx';
import { CustomerFields } from './customer-fields.jsx';
import { QuickCreateCustomerDialog } from './quick-create-customer-dialog.jsx';

/**
 * Party A: pick an existing `Customer` from the catalog (snapshotted into
 * the contract on save — see `docs/api/Contracts.md`, BE-kt-xnk) or type one
 * in inline. Picking one clears whatever was typed inline and vice versa —
 * the backend `PartyARequest` accepts exactly one of the two, never both.
 * @param {{
 *   customers: import('../types/index.js').Customer[],
 *   sourceCustomerId: string,
 *   inlineValues: import('../types/index.js').CustomerFormValues,
 *   fieldStatuses: Record<string, { type: 'error', message: string } | undefined>,
 *   onSelectExisting: (customerId: string) => void,
 *   onSwitchToInline: () => void,
 *   onInlineFieldChange: (field: keyof import('../types/index.js').CustomerFormValues, value: string) => void,
 *   extraFieldRows: ReturnType<typeof import('../hooks/use-extra-field-rows.js').useExtraFieldRows>,
 * }} props
 */
export function PartyAFields({
  customers,
  sourceCustomerId,
  inlineValues,
  fieldStatuses,
  onSelectExisting,
  onSwitchToInline,
  onInlineFieldChange,
  extraFieldRows,
}) {
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  const selectedCustomer = customers.find(
    (customer) => customer.id === sourceCustomerId,
  );

  return (
    <VStack gap={3} hAlign="stretch">
      <HStack gap={2} vAlign="end">
        <StackItem size="fill">
          <Selector
            label="Khách hàng có sẵn"
            hasSearch
            placeholder="Chọn khách hàng, hoặc bỏ trống để nhập mới bên dưới"
            value={sourceCustomerId}
            onChange={(value) => (value ? onSelectExisting(value) : onSwitchToInline())}
            options={customers.map((customer) => ({
              value: customer.id,
              label: customer.companyName,
            }))}
            width="100%"
          />
        </StackItem>
        <IconButton
          label="Thêm khách hàng"
          tooltip="Thêm khách hàng"
          icon={<Icon icon={IconPlus} size="sm" />}
          type="button"
          variant="secondary"
          onClick={() => setIsQuickCreateOpen(true)}
        />
      </HStack>

      {selectedCustomer ? (
        <VStack gap={1}>
          <Text type="supporting" color="secondary">
            Người đại diện: {selectedCustomer.representativeName || '—'} ·
            {' '}
            {selectedCustomer.representativeTitle || '—'}
          </Text>
          <Text type="supporting" color="secondary">
            Địa chỉ: {selectedCustomer.address || '—'}
          </Text>
        </VStack>
      ) : (
        <CustomerFields
          values={inlineValues}
          setField={onInlineFieldChange}
          fieldStatuses={fieldStatuses}
          extraFieldRows={extraFieldRows}
        />
      )}

      <QuickCreateCustomerDialog
        isOpen={isQuickCreateOpen}
        onOpenChange={setIsQuickCreateOpen}
        onCreated={(customer) => onSelectExisting(customer.id)}
      />
    </VStack>
  );
}
