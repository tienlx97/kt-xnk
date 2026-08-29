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
import { Skeleton } from '@astryxdesign/core/Skeleton';
import { StackItem } from '@astryxdesign/core/Stack';
import {
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

import { useCustomersQuery } from '../hooks/use-customers-query.js';
import { CustomerFormDialog } from './customer-form-dialog.jsx';

/** @satisfies {ReadonlyArray<import('@astryxdesign/core/PowerSearch').FieldDefinition>} */
const SEARCH_FIELD_DEFS = [
  { key: 'companyName', type: 'string', label: 'Tên công ty' },
  { key: 'representativeName', type: 'string', label: 'Người đại diện' },
  { key: 'representativeTitle', type: 'string', label: 'Chức vụ' },
  { key: 'address', type: 'string', label: 'Địa chỉ' },
];

const COLUMN_OPTIONS = [
  { key: 'companyName', label: 'Tên công ty', isAlwaysVisible: true },
  { key: 'representativeName', label: 'Người đại diện' },
  { key: 'representativeTitle', label: 'Chức vụ' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'extraFields', label: 'Trường tùy ý' },
];
const ALL_COLUMN_KEYS = COLUMN_OPTIONS.map((column) => column.key);

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
});

const SKELETON_ROW_COUNT = 6;

const skeletonRows = Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => ({
  id: `skeleton-${index}`,
  companyName: '',
  representativeName: '',
  representativeTitle: '',
  address: '',
  extraFields: [],
}));

export function CustomersList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [hasOpenedCreate, setHasOpenedCreate] = useState(false);
  const [searchFilters, setSearchFilters] = useState(
    /** @type {import('@astryxdesign/core/PowerSearch').PowerSearchFilter[]} */ ([]),
  );
  const [activeColumnKeys, setActiveColumnKeys] = useState(ALL_COLUMN_KEYS);
  const [density, setDensity] = useState(
    /** @type {import('@astryxdesign/core/Table').TableDensity} */ (
      'balanced'
    ),
  );
  // Defaults mirror the previous hard-coded pin (identity column only, no
  // actions column here); the View options popover now makes both edges
  // adjustable.
  const [stickyStart, setStickyStart] = useState(
    /** @type {'none' | 'one' | 'two'} */ ('one'),
  );
  const [stickyEnd, setStickyEnd] = useState(
    /** @type {'none' | 'one' | 'two'} */ ('none'),
  );

  /** @param {ReadonlyArray<import('@astryxdesign/core/PowerSearch').PowerSearchFilter>} filters */
  function handleSearchFiltersChange(filters) {
    setSearchFilters([...filters]);
  }

  const customersQuery = useCustomersQuery();
  const listResult = customersQuery.data;
  const customers = listResult?.success ? listResult.customers : [];

  const { config: baseSearchConfig, applyFilters } = usePowerSearchConfig(
    SEARCH_FIELD_DEFS,
    'Khách hàng',
  );
  const searchConfig = useMemo(
    () => ({ ...baseSearchConfig, contentSearchFieldKey: 'companyName' }),
    [baseSearchConfig],
  );

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').Customer & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'companyName',
      header: 'Tên công ty',
      width: proportional(1.4),
      filter: 'companyName',
      renderCell: (customer) => customer.companyName,
    },
    {
      key: 'representativeName',
      header: 'Người đại diện',
      width: proportional(1),
      filter: 'representativeName',
      renderCell: (customer) => customer.representativeName || '—',
    },
    {
      key: 'representativeTitle',
      header: 'Chức vụ',
      width: proportional(0.8),
      filter: 'representativeTitle',
      renderCell: (customer) => customer.representativeTitle || '—',
    },
    {
      key: 'address',
      header: 'Địa chỉ',
      width: proportional(1.4),
      filter: 'address',
      renderCell: (customer) => customer.address || '—',
    },
    {
      key: 'extraFields',
      header: 'Trường tùy ý',
      width: proportional(1),
      renderCell: (customer) =>
        customer.extraFields.length > 0
          ? customer.extraFields
              .map((field) => `${field.key}: ${field.value}`)
              .join(', ')
          : '—',
    },
  ];

  // Per-column header filters (popover icon in the header), layered on top
  // of the search bar above — both write into the same PowerSearch filter
  // engine, so applyFilters ANDs them together.
  const { filters: headerFilters, onFilterChange: setHeaderFilter } =
    useTableFilterState();
  const filterPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Customer & Record<string, unknown>>} */ (
      useTableFiltering({
        filters: headerFilters,
        onFilterChange: setHeaderFilter,
        searchConfig,
      })
    );

  const searchableCustomers = customers.map((customer) => ({
    ...customer,
    representativeName: customer.representativeName ?? '',
    representativeTitle: customer.representativeTitle ?? '',
    address: customer.address ?? '',
  }));
  const filteredCustomers =
    /** @type {import('../types/index.js').Customer[]} */
    (
      /** @type {any} */ (
        applyFilters(
          [
            ...searchFilters,
            .../** @type {any} */ (
              toSearchFilters(headerFilters, columns, searchConfig)
            ),
          ],
          /** @type {any} */ (searchableCustomers),
        )
      )
    );

  const columnSettingsState = useTableColumnSettingsState({
    columns: COLUMN_OPTIONS,
    activeColumnKeys,
    onChangeActiveColumnKeys: (keys) => setActiveColumnKeys([...keys]),
  });
  const columnSettingsPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Customer & Record<string, unknown>>} */ (
      useTableColumnSettings(columnSettingsState.columnSettingsConfig)
    );
  // Pins whichever edge columns the View options popover currently asks
  // for, computed from the table's own visible/ordered column keys so the
  // pin always tracks what "first/last column(s)" actually means on screen.
  const stickyColumnsPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Customer & Record<string, unknown>>} */ (
      useTableStickyColumns({
        startKeys: stickyColumnKeys(
          stickyStart,
          columnSettingsState.activeColumnKeys,
          false,
        ),
        endKeys: stickyColumnKeys(
          stickyEnd,
          columnSettingsState.activeColumnKeys,
          true,
        ),
      })
    );

  const isLoadingCustomers = customersQuery.isLoading;
  const skeletonColumns = columns.map((column, columnIndex) => ({
    ...column,
    renderCell: () => <Skeleton height={16} width="70%" index={columnIndex} />,
  }));

  return (
    <VStack gap={4} hAlign="stretch">
      <VStack gap={1}>
        <Heading level={1}>Khách hàng</Heading>
        <Text color="secondary">
          Danh mục Party A dùng chung khi tạo hợp đồng.
        </Text>
      </VStack>

      {listResult && !listResult.success ? (
        <Banner status="error" title={listResult.message} container="card" />
      ) : null}

      <VStack gap={0} hAlign="stretch" style={stickyBackgroundStyle}>
        <Toolbar
          label="Thao tác danh sách khách hàng"
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
                  placeholder="Tìm công ty, địa chỉ..."
                  resultCount={filteredCustomers.length}
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
                  isLoading={customersQuery.isFetching}
                  onClick={() => customersQuery.refetch()}
                />
                <Button
                  label="Thêm khách hàng"
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

        <Table
          data={isLoadingCustomers ? skeletonRows : filteredCustomers}
          columns={isLoadingCustomers ? skeletonColumns : columns}
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

        <HStack hAlign="between" vAlign="center">
          <Text type="supporting" color="secondary">
            Tổng số: {filteredCustomers.length}
          </Text>
        </HStack>
      </VStack>

      {hasOpenedCreate ? (
        <CustomerFormDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => setIsCreateOpen(false)}
        />
      ) : null}
    </VStack>
  );
}
