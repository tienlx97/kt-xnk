'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import {
  PowerSearch,
  usePowerSearchConfig,
} from '@astryxdesign/core/PowerSearch';
import { Selector } from '@astryxdesign/core/Selector';
import { Skeleton } from '@astryxdesign/core/Skeleton';
import { StackItem } from '@astryxdesign/core/Stack';
import {
  pixel,
  proportional,
  Table,
  toSearchFilters,
  useTableColumnSettings,
  useTableColumnSettingsState,
  useTableFiltering,
  useTableFilterState,
  useTableStickyColumns,
} from '@astryxdesign/core/Table';
import { Heading, Text } from '@astryxdesign/core/Text';
import { colorVars } from '@astryxdesign/core/theme/tokens.stylex';
import { Toolbar } from '@astryxdesign/core/Toolbar';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import { useMemo, useState } from 'react';

import { IconRefresh } from '@/shared/components/icon/icon-refresh.jsx';
import {
  stickyColumnKeys,
  TableViewOptionsPopover,
} from '@/shared/components/table-view-options-popover.jsx';

import { currencyOptions, formatMoney } from '../config/currencies.js';
import { incotermOptions } from '../config/incoterms.js';
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
  { key: 'actions', label: 'Chức năng', isAlwaysVisible: true },
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
  'actions',
];
/**
 * Actions is `isAlwaysVisible` (can't be removed) but the columns popover
 * still lets it be dragged around — this keeps it pinned as the last key
 * no matter how the column order changes, which is what lets the sticky
 * end pin below always target it.
 * @param {string[]} keys
 * @returns {string[]}
 */
function withActionsLast(keys) {
  return keys.includes('actions')
    ? [...keys.filter((key) => key !== 'actions'), 'actions']
    : keys;
}

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

// A pinned cell paints an opaque background of its own; without this it
// defaults to the card surface token, which mismatches the page's own
// surface token in dark mode (see useTableStickyColumns). Plain `style`,
// not `xstyle` — `@stylexjs/valid-styles` rejects raw `--*` keys.
const stickyBackgroundStyle = /** @type {import('react').CSSProperties} */ ({
  '--table-sticky-background': colorVars['--color-background-surface'],
});

const styles = stylex.create({
  // Fills the StackItem it sits in rather than a fixed/expand-on-focus
  // width — the search bar claims the toolbar's full remaining width, same
  // as the reference table template.
  search: {
    width: '100%',
  },
  // Toolbar's start slot only stretches its own box to the row's full
  // width (see `startOnly` — it applies once `endContent` is unset); the
  // row inside it still defaults to shrink-to-fit like any flex item, so
  // this is what actually lets the StackItem(fill) search bar claim that
  // width.
  toolbarPrimary: {
    flexGrow: 1,
    minWidth: 0,
  },
  // Keeps the end cluster (view options, refresh, create) from shrinking
  // when the search bar next to it grows to fill the row.
  toolbarEnd: {
    flexShrink: 0,
  },
  filterRow: {
    rowGap: 6,
  },
  // Fills the trigger once a quick filter is set, the same wash Selector's
  // own pressed/active state uses, so a set chip reads as "on" at a glance.
  filterFill: {
    backgroundColor: colorVars['--color-overlay-pressed'],
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

export function ContractsList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [hasOpenedCreate, setHasOpenedCreate] = useState(false);
  const [editingContract, setEditingContract] = useState(
    /** @type {import('../types/index.js').Contract | null} */ (null),
  );
  const [searchFilters, setSearchFilters] = useState(
    /** @type {import('@astryxdesign/core/PowerSearch').PowerSearchFilter[]} */ ([]),
  );
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [activeColumnKeys, setActiveColumnKeys] = useState(DEFAULT_COLUMN_KEYS);
  const [density, setDensity] = useState(
    /** @type {import('@astryxdesign/core/Table').TableDensity} */ (
      'balanced'
    ),
  );
  // Defaults mirror the previous hard-coded pin (identity column + actions
  // column); the View options popover now makes both edges adjustable.
  const [stickyStart, setStickyStart] = useState(
    /** @type {'none' | 'one' | 'two'} */ ('one'),
  );
  const [stickyEnd, setStickyEnd] = useState(
    /** @type {'none' | 'one' | 'two'} */ ('one'),
  );

  const contractsQuery = useContractsQuery({ page: pageIndex, pageSize });
  const listResult = contractsQuery.data;
  const contracts = listResult?.success ? listResult.contracts : [];

  const { config: baseSearchConfig, applyFilters } = usePowerSearchConfig(
    SEARCH_FIELD_DEFS,
    'Hợp đồng',
  );
  const searchConfig = useMemo(
    () => ({ ...baseSearchConfig, contentSearchFieldKey: 'contractNumber' }),
    [baseSearchConfig],
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
    {
      key: 'actions',
      header: 'Chức năng',
      width: pixel(110),
      align: 'end',
      renderCell: (contract) => (
        <Button
          label="Sửa"
          variant="ghost"
          size="sm"
          onClick={() => setEditingContract(contract)}
        />
      ),
    },
  ];

  // Per-column header filters (popover icon in the header), layered on top
  // of the search bar and quick-filter chips above — all three write into
  // the same PowerSearch filter engine, so applyFilters ANDs them together.
  const { filters: headerFilters, onFilterChange: setHeaderFilter } =
    useTableFilterState();
  const filterPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Contract & Record<string, unknown>>} */ (
      useTableFiltering({
        filters: headerFilters,
        onFilterChange: (key, value) => {
          setHeaderFilter(key, value);
          setPageIndex(1);
        },
        searchConfig,
      })
    );

  const searchableContracts = contracts.map((contract) => ({
    ...contract,
    partyACompanyName: contract.partyA.companyName,
  }));
  const filteredContracts =
    /** @type {import('../types/index.js').Contract[]} */
    (
      /** @type {any} */ (
        applyFilters(
          [
            ...searchFilters,
            .../** @type {any} */ (
              toSearchFilters(headerFilters, columns, searchConfig)
            ),
          ],
          /** @type {any} */ (searchableContracts),
        )
      )
    );

  const columnSettingsState = useTableColumnSettingsState({
    columns: COLUMN_OPTIONS,
    activeColumnKeys,
    onChangeActiveColumnKeys: (keys) =>
      setActiveColumnKeys(withActionsLast([...keys])),
  });
  const columnSettingsPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Contract & Record<string, unknown>>} */ (
      useTableColumnSettings(columnSettingsState.columnSettingsConfig)
    );
  // Pins whichever edge columns the View options popover currently asks
  // for, computed from the table's own visible/ordered column keys so the
  // pin always tracks what "first/last column(s)" actually means on screen.
  // Actions is pinned to the end regardless of that setting — it's always
  // the last column (see withActionsLast), and losing the "Sửa" action
  // off-screen behind a horizontal scroll is worse than a fixed column the
  // sticky-end radio can't turn off.
  const requestedEndKeys = stickyColumnKeys(
    stickyEnd,
    columnSettingsState.activeColumnKeys,
    true,
  );
  const stickyColumnsPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Contract & Record<string, unknown>>} */ (
      useTableStickyColumns({
        startKeys: stickyColumnKeys(
          stickyStart,
          columnSettingsState.activeColumnKeys,
          false,
        ),
        endKeys:
          requestedEndKeys.length > 0
            ? requestedEndKeys
            : columnSettingsState.activeColumnKeys.includes('actions')
              ? ['actions']
              : [],
      })
    );

  const totalContracts = listResult?.success ? listResult.totalCount : 0;
  const totalPages = Math.max(
    1,
    listResult?.success ? listResult.totalPages : 1,
  );
  const currentPage = Math.min(pageIndex, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const rangeStart = totalContracts === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(
    pageStart + filteredContracts.length,
    totalContracts,
  );

  /** @param {ReadonlyArray<import('@astryxdesign/core/PowerSearch').PowerSearchFilter>} filters */
  function handleSearchFiltersChange(filters) {
    setSearchFilters([...filters]);
    setPageIndex(1);
  }

  /**
   * Quick filter chip: the closed Selector trigger doubles as the chip, so
   * setting or clearing it just writes/removes an "is" clause in the same
   * filter array PowerSearch itself edits.
   * @param {string} field
   * @param {string | null} value
   */
  function setQuickFilter(field, value) {
    setSearchFilters((current) => {
      const rest = current.filter((filter) => filter.field !== field);
      return value == null
        ? rest
        : [...rest, { field, operator: 'is', value: { type: 'enum', value } }];
    });
    setPageIndex(1);
  }

  /** @param {string} field */
  function getQuickFilterValue(field) {
    const active = searchFilters.find((filter) => filter.field === field);
    return active ? String(/** @type {any} */ (active.value).value) : null;
  }

  /** @param {string} value */
  function handlePageSizeChange(value) {
    setPageSize(Number(value));
    setPageIndex(1);
  }

  const isLoadingContracts = contractsQuery.isLoading;
  const skeletonColumns = columns.map((column, columnIndex) => ({
    ...column,
    renderCell:
      column.key === 'actions'
        ? () => null
        : () => <Skeleton height={16} width="70%" index={columnIndex} />,
  }));

  return (
    <VStack gap={4} hAlign="stretch">
      <VStack gap={1}>
        <Heading level={1}>Hợp đồng</Heading>
        <Text color="secondary">Danh sách hợp đồng của phòng Logistics.</Text>
      </VStack>

      {listResult && !listResult.success ? (
        <Banner status="error" title={listResult.message} container="card" />
      ) : null}

      <VStack gap={0} hAlign="stretch" style={stickyBackgroundStyle}>
        <Toolbar
          label="Thao tác danh sách hợp đồng"
          size="sm"
          startContent={
            // Everything lives in the one slot: Toolbar only stretches a
            // slot to fill the row when it's the sole slot present, so the
            // search bar's "fill the row" behavior depends on `endContent`
            // being unset and this StackItem doing the actual growing.
            <HStack
              gap={3}
              vAlign="center"
              wrap="wrap"
              xstyle={styles.toolbarPrimary}
            >
              <StackItem size="fill">
                <PowerSearch
                  config={searchConfig}
                  filters={searchFilters}
                  onChange={handleSearchFiltersChange}
                  placeholder="Tìm số HĐ, dự án..."
                  resultCount={filteredContracts.length}
                  size="sm"
                  startIcon="search"
                  xstyle={styles.search}
                />
              </StackItem>
              <HStack gap={2} vAlign="center" xstyle={styles.toolbarEnd}>
                <TableViewOptionsPopover
                  columns={COLUMN_OPTIONS}
                  activeColumnKeys={[...columnSettingsState.activeColumnKeys]}
                  onChangeActiveColumnKeys={
                    columnSettingsState.setActiveColumnKeys
                  }
                  defaultColumnKeys={DEFAULT_COLUMN_KEYS}
                  density={density}
                  onChangeDensity={(value) =>
                    setDensity(
                      /** @type {import('@astryxdesign/core/Table').TableDensity} */ (
                        value
                      ),
                    )
                  }
                  stickyStart={stickyStart}
                  onChangeStickyStart={(value) =>
                    setStickyStart(
                      /** @type {'none' | 'one' | 'two'} */ (value),
                    )
                  }
                  stickyEnd={stickyEnd}
                  onChangeStickyEnd={(value) =>
                    setStickyEnd(/** @type {'none' | 'one' | 'two'} */ (value))
                  }
                />
                <IconButton
                  label="Tải lại danh sách"
                  tooltip="Tải lại"
                  icon={<Icon icon={IconRefresh} size="sm" />}
                  variant="ghost"
                  size="sm"
                  isLoading={contractsQuery.isFetching}
                  onClick={() => contractsQuery.refetch()}
                />
                <Button
                  label="Tạo hợp đồng"
                  variant="primary"
                  onClick={() => {
                    setHasOpenedCreate(true);
                    setIsCreateOpen(true);
                  }}
                />
              </HStack>
            </HStack>
          }
        />

        <HStack gap={2} vAlign="center" wrap="wrap" xstyle={styles.filterRow}>
          <Selector
            label="Lọc theo Incoterm"
            isLabelHidden
            placeholder="Incoterm"
            size="sm"
            hasClear
            options={incotermOptions}
            value={getQuickFilterValue('incoterm')}
            renderValue={(option) =>
              `Incoterm là ${option.label ?? option.value}`
            }
            xstyle={getQuickFilterValue('incoterm') ? styles.filterFill : undefined}
            onChange={(next) => setQuickFilter('incoterm', next)}
          />
          <Selector
            label="Lọc theo đơn vị tiền tệ"
            isLabelHidden
            placeholder="Đơn vị tiền tệ"
            size="sm"
            hasClear
            options={currencyOptions}
            value={getQuickFilterValue('currency')}
            renderValue={(option) =>
              `Tiền tệ là ${option.label ?? option.value}`
            }
            xstyle={getQuickFilterValue('currency') ? styles.filterFill : undefined}
            onChange={(next) => setQuickFilter('currency', next)}
          />
        </HStack>

        <Table
          data={isLoadingContracts ? skeletonRows : filteredContracts}
          columns={isLoadingContracts ? skeletonColumns : columns}
          idKey="id"
          density={density}
          dividers="rows"
          hasHover
          plugins={{
            columnSettings: columnSettingsPlugin,
            stickyColumns: stickyColumnsPlugin,
            filter: filterPlugin,
          }}
        />

        <HStack hAlign="between" vAlign="center" wrap="wrap" gap={3}>
          <Text type="supporting" color="secondary">
            Tổng số: {totalContracts}
          </Text>
          <HStack gap={4} vAlign="center" wrap="wrap">
            <HStack gap={2} vAlign="center">
              <Text type="supporting" color="secondary">
                Số dòng/trang
              </Text>
              <Selector
                label="Số dòng/trang"
                isLabelHidden
                size="sm"
                variant="ghost"
                options={PAGE_SIZE_OPTIONS}
                value={String(pageSize)}
                onChange={handlePageSizeChange}
                width={80}
              />
            </HStack>
            <Text type="supporting" color="secondary">
              {rangeStart}-{rangeEnd}
            </Text>
            <HStack gap={0} vAlign="center">
              <IconButton
                label="Trang đầu"
                icon={<Icon icon="chevronsLeft" size="sm" />}
                variant="ghost"
                size="sm"
                isDisabled={currentPage === 1}
                onClick={() => setPageIndex(1)}
              />
              <IconButton
                label="Trang trước"
                icon={<Icon icon="chevronLeft" size="sm" />}
                variant="ghost"
                size="sm"
                isDisabled={currentPage === 1}
                onClick={() => setPageIndex((page) => Math.max(1, page - 1))}
              />
              <IconButton
                label="Trang sau"
                icon={<Icon icon="chevronRight" size="sm" />}
                variant="ghost"
                size="sm"
                isDisabled={currentPage === totalPages}
                onClick={() =>
                  setPageIndex((page) => Math.min(totalPages, page + 1))
                }
              />
              <IconButton
                label="Trang cuối"
                icon={<Icon icon="chevronsRight" size="sm" />}
                variant="ghost"
                size="sm"
                isDisabled={currentPage === totalPages}
                onClick={() => setPageIndex(totalPages)}
              />
            </HStack>
          </HStack>
        </HStack>
      </VStack>

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
