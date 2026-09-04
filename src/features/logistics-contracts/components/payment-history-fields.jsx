'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DateInput } from '@astryxdesign/core/DateInput';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { pixel, proportional, Table } from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

import { IconTrash } from '@/shared/components/icon/icon-trash.jsx';

import { formatMoney } from '../config/currencies.js';

/**
 * "Lịch sử thanh toán" grid for a Commission — actual payments made to the
 * third party (date/amount/note), separate from `PaymentTermsFields` (the
 * agreed schedule). Unlike payment terms there is no required total — a
 * Commission may have zero, partial, or fully-paid history at any time.
 * Purely a controlled view over `usePaymentHistoryRows`'s state.
 * @param {{
 *   rows: import('../types/index.js').CommissionPaymentRow[],
 *   status?: { type: 'error' | 'success', message: string },
 *   currency?: string,
 *   onAddRow: () => void,
 *   onRemoveRow: (rowKey: string) => void,
 *   onUpdateRowField: (rowKey: string, field: 'paymentDate' | 'amount' | 'note', value: number | string) => void,
 * }} props
 */
export function PaymentHistoryFields({
  rows,
  status,
  currency,
  onAddRow,
  onRemoveRow,
  onUpdateRowField,
}) {
  const total = rows.reduce((sum, row) => sum + (row.amount ?? 0), 0);

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').CommissionPaymentRow & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'paymentDate',
      header: 'Ngày thanh toán',
      width: pixel(180),
      renderCell: (row) => (
        <DateInput
          label="Ngày thanh toán"
          isLabelHidden
          value={
            /** @type {import('@astryxdesign/core/Calendar').ISODateString} */ (
              row.paymentDate || null
            )
          }
          onChange={(value) =>
            onUpdateRowField(row.rowKey, 'paymentDate', value ?? '')
          }
          format="system_date"
        />
      ),
    },
    {
      key: 'amount',
      header: 'Giá trị',
      width: pixel(180),
      renderCell: (row) => (
        <NumberInput
          label="Giá trị"
          isLabelHidden
          value={row.amount}
          onChange={(value) => onUpdateRowField(row.rowKey, 'amount', value)}
          min={0}
          step={0.01}
          units={currency || undefined}
        />
      ),
    },
    {
      key: 'note',
      header: 'Ghi chú',
      width: proportional(1),
      renderCell: (row) => (
        <TextInput
          label="Ghi chú"
          isLabelHidden
          value={row.note}
          onChange={(value) => onUpdateRowField(row.rowKey, 'note', value)}
          placeholder="Ghi chú (không bắt buộc)"
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      width: pixel(48),
      align: 'end',
      renderCell: (row) => (
        <IconButton
          label="Xoá dòng này"
          tooltip="Xoá"
          icon={<Icon icon={IconTrash} size="sm" />}
          type="button"
          variant="ghost"
          onClick={() => onRemoveRow(row.rowKey)}
        />
      ),
    },
  ];

  return (
    <VStack gap={2} hAlign="stretch">
      {rows.length === 0 ? (
        <Text color="secondary">Chưa có lần thanh toán nào</Text>
      ) : (
        <Table data={rows} columns={columns} idKey="rowKey" dividers="grid" />
      )}

      <HStack hAlign="between" vAlign="center">
        <Button
          label="Thêm lần thanh toán"
          type="button"
          variant="secondary"
          size="sm"
          onClick={onAddRow}
        />
        {rows.length > 0 ? (
          <Text weight="semibold">
            Tổng đã thanh toán: {formatMoney(total, currency ?? '')}
          </Text>
        ) : null}
      </HStack>

      {status ? (
        <Banner status="error" title={status.message} container="card" />
      ) : null}
    </VStack>
  );
}
