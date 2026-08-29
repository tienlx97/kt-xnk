'use client';

import { Badge } from '@astryxdesign/core/Badge';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
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
 * "Đợt thanh toán" grid — tỷ lệ % + điều kiện thanh toán per row, with a
 * running total that turns red once it drifts from 100 (the backend
 * rejects anything else, see `CreateContractCommandValidator`, BE-kt-xnk).
 * "Thành tiền" per row is a derived, read-only display (contractValue ×
 * paymentRatioPercent / 100) — not part of the submitted payload.
 * Purely a controlled view over `usePaymentTermRows`'s state.
 * @param {{
 *   rows: import('../types/index.js').PaymentTermRow[],
 *   totalPercent: number,
 *   status?: { type: 'error' | 'success', message: string },
 *   contractValue?: number,
 *   currency?: string,
 *   onAddRow: () => void,
 *   onRemoveRow: (rowKey: string) => void,
 *   onUpdateRowField: (rowKey: string, field: 'paymentRatioPercent' | 'paymentCondition', value: number | string) => void,
 * }} props
 */
export function PaymentTermsFields({
  rows,
  totalPercent,
  status,
  contractValue,
  currency,
  onAddRow,
  onRemoveRow,
  onUpdateRowField,
}) {
  const isTotalValid = Math.abs(totalPercent - 100) < 0.01;

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').PaymentTermRow & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'paymentRatioPercent',
      header: 'Tỷ lệ (%)',
      width: pixel(140),
      renderCell: (row) => (
        <NumberInput
          label="Tỷ lệ (%)"
          isLabelHidden
          value={row.paymentRatioPercent}
          onChange={(value) =>
            onUpdateRowField(row.rowKey, 'paymentRatioPercent', value)
          }
          min={0}
          max={100}
          step={0.01}
        />
      ),
    },
    {
      key: 'paymentCondition',
      header: 'Điều kiện thanh toán',
      width: proportional(1),
      renderCell: (row) => (
        <TextInput
          label="Điều kiện thanh toán"
          isLabelHidden
          value={row.paymentCondition}
          onChange={(value) =>
            onUpdateRowField(row.rowKey, 'paymentCondition', value)
          }
          placeholder="Ví dụ: L/C at sight, T/T..."
        />
      ),
    },
    {
      key: 'amount',
      header: 'Thành tiền',
      width: pixel(160),
      align: 'end',
      renderCell: (row) => {
        const amount =
          typeof contractValue === 'number' && !Number.isNaN(contractValue)
            ? (contractValue * (row.paymentRatioPercent || 0)) / 100
            : undefined;
        return (
          <Text
            type="body"
            color={amount === undefined ? 'secondary' : undefined}
            hasTabularNumbers
          >
            {amount === undefined ? '—' : formatMoney(amount, currency ?? '')}
          </Text>
        );
      },
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
          isDisabled={rows.length <= 1}
          onClick={() => onRemoveRow(row.rowKey)}
        />
      ),
    },
  ];

  return (
    <VStack gap={2} hAlign="stretch">
      <Table data={rows} columns={columns} idKey="rowKey" dividers="grid" />

      <HStack hAlign="between" vAlign="center">
        <Button
          label="Thêm đợt thanh toán"
          type="button"
          variant="secondary"
          size="sm"
          onClick={onAddRow}
        />
        {isTotalValid ? (
          <Text weight="semibold">Tổng: {totalPercent}%</Text>
        ) : (
          <Badge
            variant="error"
            label={`Tổng: ${totalPercent}% (phải bằng 100%)`}
          />
        )}
      </HStack>

      {status ? (
        <Banner status="error" title={status.message} container="card" />
      ) : null}
    </VStack>
  );
}
