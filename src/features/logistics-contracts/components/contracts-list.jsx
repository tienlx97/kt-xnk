'use client';

import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { List, ListItem } from '@astryxdesign/core/List';
import {
  MetadataList,
  MetadataListItem,
} from '@astryxdesign/core/MetadataList';
import {
  pixel,
  proportional,
  useTableRowExpansion,
} from '@astryxdesign/core/Table';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import { FileText, Pencil, Printer, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  AdvanceTable,
  AdvanceTableErrorBanner,
} from '@/shared/components/advance-table.jsx';
import {
  createRowExpansionInteractionPlugin,
  expandableRowStyles,
} from '@/shared/components/expandable-row-styles.jsx';

import { currencyOptions, formatMoney } from '../config/currencies.js';
import { incotermOptions } from '../config/incoterms.js';
import { useContractBanksQuery } from '../hooks/use-contract-banks-query.js';
import { useContractsQuery } from '../hooks/use-contracts-query.js';
import { ContractFormDialog } from './contract-form-dialog.jsx';

/** @satisfies {ReadonlyArray<import('@astryxdesign/core/PowerSearch').FieldDefinition>} */
const SEARCH_FIELD_DEFS = [
  { key: 'contractNumber', type: 'string', label: 'Số hợp đồng' },
  { key: 'projectName', type: 'string', label: 'Dự án' },
  { key: 'partyACompanyName', type: 'string', label: 'Khách hàng' },
  { key: 'contractValue', type: 'number', label: 'Giá trị' },
  {
    key: 'currency',
    type: 'enum',
    label: 'Đơn vị tiền tệ',
    enumValues: currencyOptions,
  },
  {
    key: 'incoterm',
    type: 'enum',
    label: 'Incoterm',
    enumValues: incotermOptions,
  },
];

const COLUMN_OPTIONS = [
  { key: 'contractNumber', label: 'Số hợp đồng', isAlwaysVisible: true },
  { key: 'projectName', label: 'Dự án' },
  { key: 'partyA', label: 'Khách hàng' },
  { key: 'contractValue', label: 'Giá trị' },
  { key: 'incoterm', label: 'Incoterm' },
  { key: 'createdDate', label: 'Ngày tạo' },
  { key: 'quotationDate', label: 'Ngày báo giá' },
  { key: 'category', label: 'Hạng mục' },
  { key: 'exportCountry', label: 'Nước xuất khẩu' },
  { key: 'portOfLoading', label: 'Cảng xếp hàng' },
  { key: 'portOrPlaceOfDestination', label: 'Cảng/nơi đến' },
  { key: 'paymentTerms', label: 'Đợt thanh toán' },
  { key: 'bankIds', label: 'Ngân hàng thụ hưởng' },
];
// The picker opens on this set rather than every column at once — the API
// carries more fields than a first glance needs, and starting from the
// pre-existing default keeps today's screen unchanged for anyone who
// already has it open.
const DEFAULT_COLUMN_KEYS = [
  'contractNumber',
  'projectName',
  'partyA',
  'contractValue',
  'incoterm',
  'createdDate',
];

/** @param {string | null | undefined} value */
function orDash(value) {
  return value == null || value === '' ? '—' : value;
}

/** @param {import('../types/index.js').PaymentTerm[]} terms */
function formatPaymentTerms(terms) {
  if (terms.length === 0) {
    return '—';
  }
  if (terms.length === 1) {
    return `${terms[0].paymentRatioPercent}% ${terms[0].paymentCondition}`;
  }
  return `${terms.length} đợt`;
}

const styles = stylex.create({
  projectNameHeading: {
    textTransform: 'uppercase',
  },
});

const SKELETON_ROW_COUNT = 6;
const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = ['10', '25', '50', '100'];

/** @type {import('../types/index.js').Contract[]} */
const skeletonRows = Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => ({
  id: `skeleton-${index}`,
  contractNumber: '',
  createdDate: '',
  quotationDate: '',
  projectName: '',
  category: '',
  exportCountry: '',
  portOfLoading: '',
  portOrPlaceOfDestination: '',
  contractValue: 0,
  currency: '',
  incoterm: 'EXW',
  incotermYear: 0,
  branchId: '',
  seller: {
    companyName: '',
    representativeName: null,
    representativeTitle: null,
    address: null,
    sourceSellerId: null,
    extraFields: [],
  },
  partyA: {
    companyName: '',
    representativeName: null,
    representativeTitle: null,
    address: null,
    sourceCustomerId: null,
    extraFields: [],
  },
  notifyParty: null,
  consignee: null,
  paymentTerms: [],
  bankIds: [],
}));

/** @typedef {'info' | 'seller' | 'customer' | 'banks'} ExpandedTab */

/**
 * @param {object} props
 * @param {import('../types/index.js').Contract} props.contract
 * @param {(contract: import('../types/index.js').Contract) => void} props.onEdit
 * @param {Map<string, import('../types/index.js').ContractBank>} props.banksById
 */
function ContractExpandedDetails({ contract, onEdit, banksById }) {
  const [activeTab, setActiveTab] = useState(
    /** @type {ExpandedTab} */ ('info'),
  );

  return (
    <VStack gap={4} hAlign="stretch" xstyle={expandableRowStyles.expandedPanel}>
      <HStack hAlign="between" vAlign="start" gap={4} wrap="wrap">
        <HStack gap={3} vAlign="center">
          <HStack
            vAlign="center"
            hAlign="center"
            xstyle={expandableRowStyles.expandedIcon}
          >
            <Icon icon={FileText} size="md" />
          </HStack>
          <VStack gap={1}>
            <Heading level={3} xstyle={styles.projectNameHeading}>
              {contract.projectName}
            </Heading>
            <Text color="secondary">
              {contract.contractNumber} · {contract.partyA.companyName}
            </Text>
          </VStack>
        </HStack>
        <HStack gap={2} vAlign="center" wrap="wrap">
          <Token
            label={`${contract.incoterm} ${contract.incotermYear}`}
            color="blue"
            size="sm"
          />
          {contract.currency && (
            <Token label={contract.currency} color="gray" size="sm" />
          )}
        </HStack>
      </HStack>

      <TabList
        value={activeTab}
        onChange={(value) => setActiveTab(/** @type {ExpandedTab} */ (value))}
        hasDivider
        size="sm"
      >
        <Tab value="info" label="Thông tin" />
        <Tab value="seller" label="Bên bán" />
        <Tab value="customer" label="Khách hàng" />
        <Tab
          value="banks"
          label="Ngân hàng"
          endContent={
            contract.bankIds.length > 0
              ? String(contract.bankIds.length)
              : undefined
          }
        />
      </TabList>

      {activeTab === 'info' && (
        <VStack gap={4} hAlign="stretch">
          <MetadataList columns={4} label={{ position: 'top' }}>
            <MetadataListItem label="Số hợp đồng">
              {contract.contractNumber}
            </MetadataListItem>
            <MetadataListItem label="Dự án">
              {contract.projectName}
            </MetadataListItem>
            <MetadataListItem label="Giá trị">
              {formatMoney(contract.contractValue, contract.currency)}
            </MetadataListItem>
            <MetadataListItem label="Ngày tạo">
              {orDash(contract.createdDate)}
            </MetadataListItem>
            <MetadataListItem label="Ngày báo giá">
              {orDash(contract.quotationDate)}
            </MetadataListItem>
            <MetadataListItem label="Hạng mục">
              {orDash(contract.category)}
            </MetadataListItem>
            <MetadataListItem label="Nước xuất khẩu">
              {orDash(contract.exportCountry)}
            </MetadataListItem>
            <MetadataListItem label="Cảng xếp hàng">
              {orDash(contract.portOfLoading)}
            </MetadataListItem>
            <MetadataListItem label="Cảng/nơi đến">
              {orDash(contract.portOrPlaceOfDestination)}
            </MetadataListItem>
          </MetadataList>

          <MetadataList
            title="Đợt thanh toán"
            columns={4}
            label={{ position: 'top' }}
          >
            {contract.paymentTerms.length === 0 ? (
              <MetadataListItem label="Đợt thanh toán">—</MetadataListItem>
            ) : (
              contract.paymentTerms.map((term, index) => (
                <MetadataListItem key={term.id} label={`Đợt ${index + 1}`}>
                  {term.paymentRatioPercent}% · {orDash(term.paymentCondition)}
                </MetadataListItem>
              ))
            )}
          </MetadataList>
        </VStack>
      )}

      {activeTab === 'seller' && (
        <MetadataList columns={4} label={{ position: 'top' }}>
          <MetadataListItem label="Tên công ty">
            {contract.seller.companyName}
          </MetadataListItem>
          <MetadataListItem label="Người đại diện">
            {orDash(contract.seller.representativeName)}
          </MetadataListItem>
          <MetadataListItem label="Chức vụ">
            {orDash(contract.seller.representativeTitle)}
          </MetadataListItem>
          <MetadataListItem label="Địa chỉ">
            {orDash(contract.seller.address)}
          </MetadataListItem>
          {contract.seller.extraFields.map((field) => (
            <MetadataListItem key={field.key} label={field.key}>
              {orDash(field.value)}
            </MetadataListItem>
          ))}
        </MetadataList>
      )}

      {activeTab === 'customer' && (
        <MetadataList columns={4} label={{ position: 'top' }}>
          <MetadataListItem label="Tên công ty">
            {contract.partyA.companyName}
          </MetadataListItem>
          <MetadataListItem label="Người đại diện">
            {orDash(contract.partyA.representativeName)}
          </MetadataListItem>
          <MetadataListItem label="Chức vụ">
            {orDash(contract.partyA.representativeTitle)}
          </MetadataListItem>
          <MetadataListItem label="Địa chỉ">
            {orDash(contract.partyA.address)}
          </MetadataListItem>
          {contract.partyA.extraFields.map((field) => (
            <MetadataListItem key={field.key} label={field.key}>
              {orDash(field.value)}
            </MetadataListItem>
          ))}
        </MetadataList>
      )}

      {activeTab === 'banks' &&
        (contract.bankIds.length === 0 ? (
          <Text color="secondary">Chưa có ngân hàng thụ hưởng</Text>
        ) : (
          <List hasDividers density="compact">
            {contract.bankIds.map((bankId) => {
              const bank = banksById.get(bankId);
              return (
                <ListItem
                  key={bankId}
                  label={bank?.bankName ?? bankId}
                  description={
                    bank
                      ? [bank.beneficiary, bank.bankAccountNumber]
                          .filter(Boolean)
                          .join(' · ') || undefined
                      : undefined
                  }
                />
              );
            })}
          </List>
        ))}

      <Divider />

      <HStack hAlign="between" vAlign="center">
        <Button
          label="Xoá"
          variant="ghost"
          size="sm"
          icon={<Icon icon={Trash2} />}
          isDisabled
          tooltip="Chưa hỗ trợ"
        />
        <HStack gap={2}>
          <Button
            label="In"
            variant="secondary"
            size="sm"
            icon={<Icon icon={Printer} />}
            isDisabled
            tooltip="Chưa hỗ trợ"
          />
          <Button
            label="Sửa hợp đồng"
            variant="primary"
            size="sm"
            icon={<Icon icon={Pencil} />}
            onClick={() => onEdit(contract)}
          />
        </HStack>
      </HStack>
    </VStack>
  );
}

export function ContractsList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [hasOpenedCreate, setHasOpenedCreate] = useState(false);
  const [editingContract, setEditingContract] = useState(
    /** @type {import('../types/index.js').Contract | null} */ (null),
  );
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [expandedContractId, setExpandedContractId] = useState(
    /** @type {string | null} */ (null),
  );

  const contractsQuery = useContractsQuery({ page: pageIndex, pageSize });
  const listResult = contractsQuery.data;
  const contracts = listResult?.success ? listResult.contracts : [];

  const banksQuery = useContractBanksQuery();
  const banksById = useMemo(
    () =>
      new Map(
        (banksQuery.data?.success ? banksQuery.data.banks : []).map((bank) => [
          bank.id,
          bank,
        ]),
      ),
    [banksQuery.data],
  );

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').Contract & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'contractNumber',
      header: 'Số hợp đồng',
      width: pixel(140),
      filter: 'contractNumber',
      renderCell: (contract) => contract.contractNumber,
    },
    {
      key: 'projectName',
      header: 'Dự án',
      width: proportional(1.4),
      filter: 'projectName',
      renderCell: (contract) => contract.projectName,
    },
    {
      key: 'partyA',
      header: 'Khách hàng',
      width: proportional(1.4),
      filter: 'partyACompanyName',
      renderCell: (contract) => contract.partyA.companyName,
    },
    {
      key: 'contractValue',
      header: 'Giá trị',
      width: proportional(1),
      align: 'end',
      filter: 'contractValue',
      renderCell: (contract) =>
        formatMoney(contract.contractValue, contract.currency),
    },
    {
      key: 'incoterm',
      header: 'Incoterm',
      // Wider than the header text alone needs — the filter plugin appends
      // an icon after it, and header cells always truncate (never wrap).
      width: pixel(140),
      filter: 'incoterm',
      renderCell: (contract) => `${contract.incoterm} ${contract.incotermYear}`,
    },
    {
      key: 'createdDate',
      header: 'Ngày tạo',
      width: pixel(120),
      renderCell: (contract) => contract.createdDate,
    },
    {
      key: 'quotationDate',
      header: 'Ngày báo giá',
      // Header cells always truncate (never wrap), so a column whose header
      // is longer than its data needs its own pixel floor rather than
      // proportional() — the 120px proportional minimum fits "2026-08-27"
      // fine but clips the label itself.
      width: pixel(140),
      renderCell: (contract) => orDash(contract.quotationDate),
    },
    {
      key: 'category',
      header: 'Hạng mục',
      width: pixel(130),
      renderCell: (contract) => orDash(contract.category),
    },
    {
      key: 'exportCountry',
      header: 'Nước xuất khẩu',
      width: pixel(160),
      renderCell: (contract) => orDash(contract.exportCountry),
    },
    {
      key: 'portOfLoading',
      header: 'Cảng xếp hàng',
      width: pixel(150),
      renderCell: (contract) => orDash(contract.portOfLoading),
    },
    {
      key: 'portOrPlaceOfDestination',
      header: 'Cảng/nơi đến',
      width: pixel(140),
      renderCell: (contract) => orDash(contract.portOrPlaceOfDestination),
    },
    {
      key: 'paymentTerms',
      header: 'Đợt thanh toán',
      width: pixel(160),
      renderCell: (contract) => formatPaymentTerms(contract.paymentTerms),
    },
    {
      key: 'bankIds',
      header: 'Ngân hàng thụ hưởng',
      width: pixel(200),
      renderCell: (contract) =>
        contract.bankIds.length === 0
          ? '—'
          : `${contract.bankIds.length} ngân hàng`,
    },
  ];

  const searchableContracts = contracts.map((contract) => ({
    ...contract,
    partyACompanyName: contract.partyA.companyName,
  }));

  const expandedKeys = useMemo(
    () => new Set(expandedContractId ? [expandedContractId] : []),
    [expandedContractId],
  );
  const expansionPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Contract & Record<string, unknown>>} */ (
      useTableRowExpansion({
        expandedKeys,
        onToggle: (contractId) =>
          setExpandedContractId((current) =>
            current === contractId ? null : contractId,
          ),
        getRowKey: (contract) => contract.id,
        getIsItemExpandable: (contract) => !contract.id.startsWith('skeleton-'),
        renderExpanded: (contract) => (
          <ContractExpandedDetails
            contract={contract}
            onEdit={setEditingContract}
            banksById={banksById}
          />
        ),
      })
    );
  const rowInteractionPlugin = useMemo(
    /** @returns {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Contract & Record<string, unknown>>} */
    () =>
      createRowExpansionInteractionPlugin({
        expandedId: expandedContractId,
        onToggle: (contractId) =>
          setExpandedContractId((current) =>
            current === contractId ? null : contractId,
          ),
        isExpandable: (contract) => !contract.id.startsWith('skeleton-'),
      }),
    [expandedContractId],
  );

  const totalContracts = listResult?.success ? listResult.totalCount : 0;
  const totalPages = Math.max(
    1,
    listResult?.success ? listResult.totalPages : 1,
  );

  const isLoadingContracts = contractsQuery.isLoading;

  return (
    <VStack gap={4} hAlign="stretch">
      <HStack hAlign="between" vAlign="start" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>Hợp đồng</Heading>
        </VStack>
        <Button
          label="Tạo hợp đồng"
          variant="primary"
          onClick={() => {
            setHasOpenedCreate(true);
            setIsCreateOpen(true);
          }}
        />
      </HStack>

      {listResult && !listResult.success ? (
        <AdvanceTableErrorBanner message={listResult.message} />
      ) : null}

      <AdvanceTable
        toolbarLabel="Thao tác danh sách hợp đồng"
        searchFieldDefs={SEARCH_FIELD_DEFS}
        entityLabel="Hợp đồng"
        contentSearchFieldKey="contractNumber"
        searchPlaceholder="Tìm số HĐ, dự án..."
        columnOptions={COLUMN_OPTIONS}
        initialColumnKeys={DEFAULT_COLUMN_KEYS}
        defaultColumnKeys={DEFAULT_COLUMN_KEYS}
        tableColumns={columns}
        data={searchableContracts}
        idKey="id"
        isLoading={isLoadingContracts}
        skeletonRows={skeletonRows}
        extraPlugins={{
          expansion: expansionPlugin,
          rowInteraction: rowInteractionPlugin,
        }}
        onRefresh={() => contractsQuery.refetch()}
        isRefreshing={contractsQuery.isFetching}
        pagination={{
          pageIndex,
          pageSize,
          totalCount: totalContracts,
          totalPages,
          onPageIndexChange: setPageIndex,
          onPageSizeChange: setPageSize,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
        }}
      />

      {hasOpenedCreate ? (
        <ContractFormDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => setIsCreateOpen(false)}
        />
      ) : null}

      {editingContract ? (
        <ContractFormDialog
          key={editingContract.id}
          isOpen={editingContract !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingContract(null);
          }}
          contract={editingContract}
          onSuccess={() => setEditingContract(null)}
        />
      ) : null}
    </VStack>
  );
}
