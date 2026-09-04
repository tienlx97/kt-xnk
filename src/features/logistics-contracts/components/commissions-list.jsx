'use client';

import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { List, ListItem } from '@astryxdesign/core/List';
import { MetadataList } from '@astryxdesign/core/MetadataList';
import { pixel, useTableRowExpansion } from '@astryxdesign/core/Table';
import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { FileText, Pencil, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  AdvanceTable,
  AdvanceTableErrorBanner,
} from '@/shared/components/advance-table.jsx';
import {
  createRowExpansionInteractionPlugin,
  expandableRowStyles,
  UnderlinedMetadataListItem as MetadataListItem,
} from '@/shared/components/expandable-row-styles.jsx';

import { labelForCommissionAnnexType } from '../config/commission-annex-types.js';
import { formatMoney } from '../config/currencies.js';
import { useCommissionAnnexesQuery } from '../hooks/use-commission-annexes-query.js';
import { useCommissionsQuery } from '../hooks/use-commissions-query.js';
import { useContractsQuery } from '../hooks/use-contracts-query.js';
import { useCustomersQuery } from '../hooks/use-customers-query.js';
import { CommissionAnnexFormDialog } from './commission-annex-form-dialog.jsx';
import { CommissionFormDialog } from './commission-form-dialog.jsx';
import { CommissionPaymentQuickAddDialog } from './commission-payment-quick-add-dialog.jsx';

/** @param {string | null | undefined} value */
function orDash(value) {
  return value == null || value === '' ? '—' : value;
}

/**
 * Signed amount label for one annex row — same sign convention as
 * `grandTotal`'s `AmountIncrease`/`AmountDecrease` math below:
 * `InfoChange` never represents a value change, so it gets no sign.
 * @param {import('../types/index.js').CommissionAnnex} annex
 * @param {string} currency
 */
function annexAmountLabel(annex, currency) {
  const formatted = formatMoney(annex.amount, currency);
  if (annex.type === 'AmountIncrease') return `+ ${formatted}`;
  if (annex.type === 'AmountDecrease') return `− ${formatted}`;
  return formatted;
}

/** @satisfies {ReadonlyArray<import('@astryxdesign/core/PowerSearch').FieldDefinition>} */
const SEARCH_FIELD_DEFS = [
  { key: 'code', type: 'string', label: 'Mã' },
  { key: 'contractNumber', type: 'string', label: 'Số hợp đồng' },
  { key: 'projectName', type: 'string', label: 'Dự án' },
  { key: 'partyCustomerName', type: 'string', label: 'Bên nhận hoa hồng' },
];

const COLUMN_OPTIONS = [
  { key: 'code', label: 'Mã', isAlwaysVisible: true },
  { key: 'contractNumber', label: 'Số hợp đồng' },
  { key: 'projectName', label: 'Dự án' },
  { key: 'partyCustomerName', label: 'Bên nhận hoa hồng' },
  { key: 'value', label: 'Giá trị' },
  { key: 'signedDate', label: 'Ngày ký' },
  { key: 'sellerSigned', label: 'Bên bán đã ký' },
  { key: 'partySigned', label: 'Bên nhận hoa hồng đã ký' },
];
// The picker opens on this set rather than every column at once — same
// "start narrow, let the user opt in via Tuỳ chọn hiển thị" convention as
// `contracts-list.jsx`'s `DEFAULT_COLUMN_KEYS`.
const DEFAULT_COLUMN_KEYS = [
  'code',
  'contractNumber',
  'partyCustomerName',
  'value',
  'signedDate',
];

const SKELETON_ROW_COUNT = 6;
const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = ['10', '25', '50', '100'];

/**
 * A `Commission` plus the fields resolved client-side for display —
 * see the comment above `contractsById` in `CommissionsList` for why
 * these aren't already on the API response.
 * @typedef {import('../types/index.js').Commission & {
 *   contractNumber: string,
 *   projectName: string,
 *   currency: string,
 *   partyCustomerName: string,
 * }} CommissionListRow
 */

/** @type {CommissionListRow[]} */
const skeletonRows = Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => ({
  id: `skeleton-${index}`,
  contractId: '',
  year: 0,
  number: 0,
  code: '',
  signedDate: '',
  partyCustomerId: '',
  value: 0,
  sellerSigned: false,
  partySigned: false,
  paymentTerms: [],
  paymentHistory: [],
  contractNumber: '',
  projectName: '',
  currency: '',
  partyCustomerName: '',
}));

/**
 * Expanded row for one Commission — same layout/actions as the
 * "Commission" tab in `ContractExpandedDetails`
 * (`contracts-list.jsx`), just entered from this system-wide list instead
 * of from a specific contract's row.
 *
 * Dialog-opening is forwarded up to `CommissionsList` via
 * `onEdit`/`onAddAnnex`/`onEditAnnex` rather than owned here — see the
 * "Selector popover stacking" note above `CommissionsList` for why.
 * @param {{
 *   row: CommissionListRow,
 *   onEdit: () => void,
 *   onAddAnnex: () => void,
 *   onEditAnnex: (annex: import('../types/index.js').CommissionAnnex) => void,
 *   onAddPayment: () => void,
 * }} props
 */
function CommissionExpandedDetails({
  row,
  onEdit,
  onAddAnnex,
  onEditAnnex,
  onAddPayment,
}) {
  const annexesQuery = useCommissionAnnexesQuery(row.contractId);
  const annexes = annexesQuery.data?.success ? annexesQuery.data.annexes : [];

  // "Tổng cộng" = the commission's own `value` plus every annex's `amount`,
  // signed by its `type` — `AmountIncrease` adds, `AmountDecrease`
  // subtracts, `InfoChange` doesn't touch the value (matches
  // `docs/api/Commissions.md`'s note that annexes never mutate the
  // commission's own `Value`, so this total is a display-only rollup, not
  // something the backend also computes).
  const annexesTotal = annexes.reduce((total, annex) => {
    if (annex.type === 'AmountIncrease') return total + annex.amount;
    if (annex.type === 'AmountDecrease') return total - annex.amount;
    return total;
  }, 0);
  const grandTotal = row.value + annexesTotal;

  return (
    <VStack gap={4} hAlign="stretch" xstyle={expandableRowStyles.expandedPanel}>
      <HStack gap={3} vAlign="center">
        <HStack
          vAlign="center"
          hAlign="center"
          xstyle={expandableRowStyles.expandedIcon}
        >
          <Icon icon={FileText} size="md" />
        </HStack>
        <VStack gap={1}>
          <Heading level={3}>{row.code}</Heading>
          <Text color="secondary">
            {orDash(row.contractNumber)} · {orDash(row.partyCustomerName)}
          </Text>
        </VStack>
      </HStack>

      {/* Rows 1–2: one columns={4} grid — each row already has exactly 4
          items, so they line up naturally without needing padding cells
          (unlike the previous 2-item/3-item split). Same grid width as
          "Đợt thanh toán" below, so columns line up across all 3 rows. */}
      <MetadataList columns={4} label={{ position: 'top' }}>
        <MetadataListItem label="Mã">{row.code}</MetadataListItem>
        <MetadataListItem label="Số hợp đồng">
          {orDash(row.contractNumber)}
        </MetadataListItem>
        <MetadataListItem label="Dự án">
          {orDash(row.projectName)}
        </MetadataListItem>
        <MetadataListItem label="Giá trị">
          {formatMoney(row.value, row.currency)}
        </MetadataListItem>
        <MetadataListItem label="Trung gian">
          {orDash(row.partyCustomerName)}
        </MetadataListItem>
        <MetadataListItem label="Ngày ký">
          {orDash(row.signedDate)}
        </MetadataListItem>
        <MetadataListItem label="Bên nhận hoa hồng">
          {row.partySigned ? 'Đã ký' : 'Chưa ký'}
        </MetadataListItem>
        <MetadataListItem label="Bên bán">
          {row.sellerSigned ? 'Đã ký' : 'Chưa ký'}
        </MetadataListItem>
      </MetadataList>

      {/* Row 3: Đợt thanh toán */}
      <MetadataList
        title="Đợt thanh toán"
        columns={4}
        label={{ position: 'top' }}
        style={{ fontWeight: 'bold' }}
      >
        {row.paymentTerms.length === 0 ? (
          <MetadataListItem label="Đợt thanh toán">—</MetadataListItem>
        ) : (
          row.paymentTerms.map((term, index) => (
            <MetadataListItem key={term.id} label={`Đợt ${index + 1}`}>
              {term.paymentRatioPercent}% · {orDash(term.paymentCondition)}
            </MetadataListItem>
          ))
        )}
      </MetadataList>

      <HStack hAlign="between" vAlign="center">
        <Text weight="semibold">Lịch sử thanh toán</Text>
        <Button
          label="Thêm nhanh"
          variant="secondary"
          size="sm"
          icon={<Icon icon={Plus} />}
          onClick={onAddPayment}
        />
      </HStack>

      <MetadataList columns={4} label={{ position: 'top' }}>
        {row.paymentHistory.length === 0 ? (
          <MetadataListItem label="Lịch sử thanh toán">—</MetadataListItem>
        ) : (
          row.paymentHistory.map((payment) => (
            <MetadataListItem key={payment.id} label={payment.paymentDate}>
              {formatMoney(payment.amount, row.currency)}
              {payment.note ? ` · ${payment.note}` : ''}
            </MetadataListItem>
          ))
        )}
      </MetadataList>

      <HStack hAlign="between" vAlign="center">
        <Text weight="semibold">Phụ lục</Text>
        <Button
          label="Thêm phụ lục"
          variant="secondary"
          size="sm"
          icon={<Icon icon={Plus} />}
          onClick={onAddAnnex}
        />
      </HStack>

      {annexes.length === 0 ? (
        <Text color="secondary">Chưa có phụ lục</Text>
      ) : (
        <List hasDividers density="compact">
          {annexes.map((annex) => (
            <ListItem
              key={annex.id}
              label={`${annex.annexCode} · ${labelForCommissionAnnexType(annex.type)}`}
              description={[
                `Ký ${annex.signedDate}`,
                `Bên bán: ${annex.sellerSigned ? 'đã ký' : 'chưa ký'}`,
                `Bên nhận hoa hồng: ${annex.partySigned ? 'đã ký' : 'chưa ký'}`,
              ].join(' · ')}
              endContent={
                <HStack gap={1} vAlign="center">
                  <Text weight="semibold">
                    {annexAmountLabel(annex, row.currency)}
                  </Text>
                  <IconButton
                    label={`Sửa ${annex.annexCode}`}
                    tooltip="Sửa phụ lục"
                    icon={<Icon icon={Pencil} size="sm" />}
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditAnnex(annex)}
                  />
                </HStack>
              }
            />
          ))}
        </List>
      )}

      <HStack hAlign="between" vAlign="center">
        <Text weight="semibold">Tổng cộng:</Text>
        <Text weight="semibold">{formatMoney(grandTotal, row.currency)}</Text>
      </HStack>

      <Divider />

      <HStack hAlign="end">
        <Button
          label="Sửa Commission"
          variant="secondary"
          size="sm"
          icon={<Icon icon={Pencil} />}
          onClick={onEdit}
        />
      </HStack>
    </VStack>
  );
}

/**
 * Selector popover stacking: same bug and fix as `contracts-list.jsx`'s
 * "Selector popover stacking" note above `ContractsList` — Astryx's
 * `Selector` portals its dropdown outside the nearest "unsafe host"
 * ancestor (`<table>`, `<tr>`, ...), so a `*FormDialog` with a `Selector`
 * field declared inside this table's own `renderExpanded` callback
 * (`CommissionFormDialog` and `CommissionAnnexFormDialog` both
 * have one) gets its dropdown portaled to the table's scroll wrapper and
 * stacked underneath the dialog — clicks land on the dialog instead of the
 * option. Both dialogs are therefore rendered HERE, a sibling of
 * `AdvanceTable`, with only trigger callbacks (`onEdit`, `onAddAnnex`,
 * `onEditAnnex`) passed down to `CommissionExpandedDetails`. Do not
 * move a `*FormDialog` back inside `renderExpanded`.
 */
export function CommissionsList() {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [expandedCommissionId, setExpandedCommissionId] = useState(
    /** @type {string | null} */ (null),
  );
  const [editingCommissionRow, setEditingCommissionRow] = useState(
    /** @type {CommissionListRow | null} */ (null),
  );
  const [annexDialog, setAnnexDialog] = useState(
    /** @type {{ contractId: string, annex?: import('../types/index.js').CommissionAnnex } | null} */ (
      null
    ),
  );
  const [paymentDialog, setPaymentDialog] = useState(
    /** @type {CommissionListRow | null} */ (null),
  );

  const commissionsQuery = useCommissionsQuery({
    page: pageIndex,
    pageSize,
  });
  const listResult = commissionsQuery.data;
  const commissions = listResult?.success
    ? listResult.commissions
    : [];

  // Neither field the table needs to display alongside a Commission
  // — the parent contract's number/project/currency, and the commission
  // recipient's name — comes back on `CommissionResponse` itself
  // (see `docs/api/Commissions.md`, BE-kt-xnk); both are resolved
  // client-side from the Contract/Customer catalogs, same pattern as
  // `banksById`/`countriesById` in `contracts-list.jsx`. `pageSize: 100` is
  // the contracts list's own effective ceiling — fine while every contract
  // fits on one page; a contract past the first 100 would show its number
  // as "—" here until this grows real cross-page resolution.
  const contractsQuery = useContractsQuery({ page: 1, pageSize: 100 });
  const contractsById = useMemo(
    () =>
      new Map(
        (contractsQuery.data?.success ? contractsQuery.data.contracts : []).map(
          (contract) => [contract.id, contract],
        ),
      ),
    [contractsQuery.data],
  );

  const customersQuery = useCustomersQuery();
  const customersById = useMemo(
    () =>
      new Map(
        (customersQuery.data?.success ? customersQuery.data.customers : []).map(
          (customer) => [customer.id, customer],
        ),
      ),
    [customersQuery.data],
  );

  const searchableCommissions = commissions.map((commission) => {
    const contract = contractsById.get(commission.contractId);
    return {
      ...commission,
      contractNumber: contract?.contractNumber ?? '',
      projectName: contract?.projectName ?? '',
      currency: contract?.currency ?? '',
      partyCustomerName:
        customersById.get(commission.partyCustomerId)?.companyName ?? '',
    };
  });

  /** @type {import('@astryxdesign/core/Table').TableColumn<CommissionListRow>[]} */
  const columns = [
    {
      key: 'code',
      header: 'Mã',
      width: pixel(120),
      filter: 'code',
      renderCell: (row) => row.code,
    },
    {
      key: 'contractNumber',
      header: 'Số hợp đồng',
      width: pixel(140),
      filter: 'contractNumber',
      renderCell: (row) => orDash(row.contractNumber),
    },
    {
      key: 'projectName',
      header: 'Dự án',
      width: pixel(160),
      filter: 'projectName',
      renderCell: (row) => orDash(row.projectName),
    },
    {
      key: 'partyCustomerName',
      header: 'Bên nhận hoa hồng',
      width: pixel(200),
      filter: 'partyCustomerName',
      renderCell: (row) => orDash(row.partyCustomerName),
    },
    {
      key: 'value',
      header: 'Giá trị',
      width: pixel(140),
      align: 'end',
      renderCell: (row) => formatMoney(row.value, row.currency),
    },
    {
      key: 'signedDate',
      header: 'Ngày ký',
      width: pixel(120),
      renderCell: (row) => orDash(row.signedDate),
    },
    {
      key: 'sellerSigned',
      header: 'Bên bán đã ký',
      width: pixel(130),
      renderCell: (row) => (row.sellerSigned ? 'Đã ký' : 'Chưa ký'),
    },
    {
      key: 'partySigned',
      header: 'Bên nhận hoa hồng đã ký',
      width: pixel(170),
      renderCell: (row) => (row.partySigned ? 'Đã ký' : 'Chưa ký'),
    },
  ];

  const expandedKeys = useMemo(
    () => new Set(expandedCommissionId ? [expandedCommissionId] : []),
    [expandedCommissionId],
  );
  const expansionPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<CommissionListRow>} */ (
      useTableRowExpansion({
        expandedKeys,
        onToggle: (id) =>
          setExpandedCommissionId((current) => (current === id ? null : id)),
        getRowKey: (row) => row.id,
        getIsItemExpandable: (row) => !row.id.startsWith('skeleton-'),
        renderExpanded: (row) => (
          <CommissionExpandedDetails
            row={row}
            onEdit={() => setEditingCommissionRow(row)}
            onAddAnnex={() => setAnnexDialog({ contractId: row.contractId })}
            onEditAnnex={(annex) =>
              setAnnexDialog({ contractId: row.contractId, annex })
            }
            onAddPayment={() => setPaymentDialog(row)}
          />
        ),
      })
    );
  const rowInteractionPlugin = useMemo(
    /** @returns {import('@astryxdesign/core/Table').TablePlugin<CommissionListRow>} */
    () =>
      createRowExpansionInteractionPlugin({
        expandedId: expandedCommissionId,
        onToggle: (id) =>
          setExpandedCommissionId((current) => (current === id ? null : id)),
        isExpandable: (row) => !row.id.startsWith('skeleton-'),
      }),
    [expandedCommissionId],
  );

  const totalCommissions = listResult?.success
    ? listResult.totalCount
    : 0;
  const totalPages = Math.max(
    1,
    listResult?.success ? listResult.totalPages : 1,
  );

  return (
    <VStack gap={4} hAlign="stretch">
      <Heading level={1}>Commission</Heading>

      {listResult && !listResult.success ? (
        <AdvanceTableErrorBanner message={listResult.message} />
      ) : null}

      <AdvanceTable
        toolbarLabel="Thao tác danh sách Commission"
        searchFieldDefs={SEARCH_FIELD_DEFS}
        entityLabel="Commission"
        contentSearchFieldKey="code"
        searchPlaceholder="Tìm mã, số hợp đồng..."
        columnOptions={COLUMN_OPTIONS}
        initialColumnKeys={DEFAULT_COLUMN_KEYS}
        defaultColumnKeys={DEFAULT_COLUMN_KEYS}
        tableColumns={columns}
        data={searchableCommissions}
        idKey="id"
        isLoading={commissionsQuery.isLoading}
        skeletonRows={skeletonRows}
        extraPlugins={{
          expansion: expansionPlugin,
          rowInteraction: rowInteractionPlugin,
        }}
        onRefresh={() => commissionsQuery.refetch()}
        isRefreshing={commissionsQuery.isFetching}
        pagination={{
          pageIndex,
          pageSize,
          totalCount: totalCommissions,
          totalPages,
          onPageIndexChange: setPageIndex,
          onPageSizeChange: setPageSize,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
        }}
      />

      {/* Rendered here, a sibling of `AdvanceTable`, rather than inside
          `renderExpanded` — see the note above this component for why. */}

      {editingCommissionRow ? (
        <CommissionFormDialog
          key={editingCommissionRow.id}
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingCommissionRow(null);
          }}
          contractId={editingCommissionRow.contractId}
          currency={editingCommissionRow.currency}
          commission={editingCommissionRow}
          onSuccess={() => setEditingCommissionRow(null)}
        />
      ) : null}

      {annexDialog ? (
        <CommissionAnnexFormDialog
          key={annexDialog.annex?.id ?? 'create'}
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setAnnexDialog(null);
          }}
          contractId={annexDialog.contractId}
          annex={annexDialog.annex}
          onSuccess={() => setAnnexDialog(null)}
        />
      ) : null}

      {paymentDialog ? (
        <CommissionPaymentQuickAddDialog
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setPaymentDialog(null);
          }}
          contractId={paymentDialog.contractId}
          commission={paymentDialog}
          currency={paymentDialog.currency}
          onSuccess={() => setPaymentDialog(null)}
        />
      ) : null}
    </VStack>
  );
}
