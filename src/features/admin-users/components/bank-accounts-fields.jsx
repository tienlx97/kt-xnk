'use client';

import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { Selector } from '@astryxdesign/core/Selector';
import { pixel, proportional, Table } from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

import { IconTrash } from '../../../shared/components/icon/icon-trash.jsx';

/**
 * "Tài khoản ngân hàng" grid — shared by `CreateUserForm`/`EditUserForm`.
 * Purely a controlled view over `useBankAccountRows`'s state; it never
 * calls the API itself (see that hook's doc comment for why). Rendered as
 * a real `Table` (bordered grid with a header row) rather than stacked
 * inputs, per the reference layout — each cell is an inline input/select,
 * not a `renderCell` reading plain text, since this table is always
 * editable, never a read view.
 * @param {{
 *   rows: import('../types/index.js').BankAccountRow[],
 *   vietnamBanks: import('../types/index.js').VietnamBank[],
 *   onAddRow: () => void,
 *   onRemoveRow: (rowKey: string) => void,
 *   onClearRows: () => void,
 *   onUpdateRowField: (rowKey: string, field: 'vietnamBankId' | 'accountNumber' | 'branch', value: string) => void,
 *   onSetPrimaryRow: (rowKey: string) => void,
 * }} props
 */
export function BankAccountsFields({
  rows,
  vietnamBanks,
  onAddRow,
  onRemoveRow,
  onClearRows,
  onSetPrimaryRow,
  onUpdateRowField,
}) {
  const bankOptions = vietnamBanks.map((bank) => ({
    value: bank.id,
    label: `${bank.shortName} — ${bank.name}`,
  }));

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').BankAccountRow & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'accountNumber',
      header: 'Số tài khoản',
      width: proportional(1),
      renderCell: (row) => (
        <TextInput
          label="Số tài khoản"
          isLabelHidden
          value={row.accountNumber}
          onChange={(value) =>
            onUpdateRowField(row.rowKey, 'accountNumber', value)
          }
        />
      ),
    },
    {
      key: 'vietnamBankId',
      header: 'Tên ngân hàng',
      width: proportional(1.4),
      renderCell: (row) => (
        <Selector
          label="Ngân hàng"
          isLabelHidden
          placeholder="Chọn ngân hàng"
          value={row.vietnamBankId}
          onChange={(value) =>
            onUpdateRowField(row.rowKey, 'vietnamBankId', value ?? '')
          }
          options={bankOptions}
        />
      ),
    },
    {
      key: 'branch',
      header: 'Chi nhánh',
      width: proportional(1),
      renderCell: (row) => (
        <TextInput
          label="Chi nhánh"
          isLabelHidden
          value={row.branch}
          onChange={(value) => onUpdateRowField(row.rowKey, 'branch', value)}
        />
      ),
    },
    {
      key: 'isPrimary',
      header: 'Mặc định',
      width: pixel(100),
      align: 'center',
      // Each row is its own single-item RadioList rather than one RadioList
      // spanning the column — Table renders each cell independently, so
      // there's no single DOM parent to share a group under. Mutual
      // exclusivity (only one row primary at a time) is already enforced
      // by `onSetPrimaryRow`/`useBankAccountRows`, not by radio grouping.
      renderCell: (row) => (
        <RadioList
          label="Đặt làm tài khoản mặc định"
          isLabelHidden
          size="sm"
          value={row.isPrimary ? row.rowKey : ''}
          onChange={() => onSetPrimaryRow(row.rowKey)}
        >
          <RadioListItem label="Mặc định" value={row.rowKey} />
        </RadioList>
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
    <VStack gap={3} hAlign="stretch">
      {rows.length > 0 ? (
        <Table data={rows} columns={columns} idKey="rowKey" dividers="grid" />
      ) : (
        <Text color="secondary">Chưa có tài khoản ngân hàng nào.</Text>
      )}

      <HStack gap={2}>
        <Button
          label="Thêm dòng"
          type="button"
          variant="secondary"
          size="sm"
          onClick={onAddRow}
        />
        {rows.length > 0 ? (
          <Button
            label="Xoá tất cả"
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearRows}
          />
        ) : null}
      </HStack>
    </VStack>
  );
}
