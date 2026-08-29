'use client';

import { Avatar } from '@astryxdesign/core/Avatar';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { ButtonGroup } from '@astryxdesign/core/ButtonGroup';
import { DropdownMenu } from '@astryxdesign/core/DropdownMenu';
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

import {
  useCompaniesQuery,
  useDepartmentsQuery,
  usePositionsQuery,
} from '../hooks/use-org-directory.js';
import { useUsersQuery } from '../hooks/use-users-query.js';
import { ResetPasswordDialog } from './reset-password-dialog.jsx';
import { UserFormDialog } from './user-form-dialog.jsx';

/** @satisfies {ReadonlyArray<import('@astryxdesign/core/PowerSearch').FieldDefinition>} */
const BASE_SEARCH_FIELD_DEFS = [
  { key: 'fullName', type: 'string', label: 'Tên' },
  { key: 'nationalId', type: 'string', label: 'CCCD' },
  { key: 'phone', type: 'string', label: 'Số điện thoại' },
  { key: 'employeeCode', type: 'string', label: 'Mã nhân viên' },
];

const COLUMN_OPTIONS = [
  { key: 'name', label: 'Tên', isAlwaysVisible: true },
  { key: 'employeeCode', label: 'Mã nhân viên' },
  { key: 'company', label: 'Tên đơn vị' },
  { key: 'position', label: 'Chức vụ' },
  { key: 'department', label: 'Phòng ban' },
  { key: 'actions', label: 'Chức năng', isAlwaysVisible: true },
];
const ALL_COLUMN_KEYS = COLUMN_OPTIONS.map((column) => column.key);

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

/**
 * Placeholder rows shown while the page loads. `Table` infers its row type
 * from `data`, so these have to be full `UserListItem`s even though the
 * skeleton columns ignore every field but `id` — a bare `{ id }` makes the
 * two branches of the ternary disagree.
 * @type {import('../types/index.js').UserListItem[]}
 */
const skeletonRows = Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => ({
  id: `skeleton-${index}`,
  firstName: '',
  lastName: '',
  nationalId: '',
  employeeCode: '',
  phone: null,
  positionId: null,
  companyId: null,
  branchId: null,
  departmentIds: [],
  isAdmin: false,
}));
const DEFAULT_PAGE_SIZE = 100;
const PAGE_SIZE_OPTIONS = ['20', '50', '100'];

/**
 * Builds an id → name lookup so the table can render human-readable
 * Company/Department/Position names instead of raw GUIDs. Branch name is
 * deliberately not shown as a column: there's no "list all branches"
 * endpoint (only "list branches of one company"), so showing it here would
 * mean an extra fetch per distinct company in the list — Department name
 * already narrows the workplace down enough for a list view; the full
 * Company → Branch → Department chain is still visible/editable in the
 * edit dialog.
 * @param {Array<{ id: string, name: string }>} items
 */
function toNameById(items) {
  return new Map(items.map((item) => [item.id, item.name]));
}

export function UserList() {
  const companiesQuery = useCompaniesQuery();
  const departmentsQuery = useDepartmentsQuery();
  const positionsQuery = usePositionsQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // `UserFormDialog` stays mounted (not gated on `isCreateOpen`) once opened
  // so the Dialog can animate closed instead of vanishing — but never
  // mounted before the first open. Astryx's Calendar (inside the form's
  // "Ngày cấp CCCD" DateInput) formats its month label via
  // `Intl.DateTimeFormat(undefined, ...)`, which resolves to the runtime's
  // default locale: Node's server locale vs. the browser's — these differ
  // for a Vietnamese-locale browser, causing a hydration mismatch
  // ("August 2026" vs. "tháng 8 năm 2026") if the form is part of the
  // initial server-rendered HTML. Deferring its first mount to a client
  // click sidesteps that entirely: it never exists in the SSR'd tree.
  const [hasOpenedCreate, setHasOpenedCreate] = useState(false);
  const [editingUser, setEditingUser] = useState(
    /** @type {import('../types/index.js').UserListItem | null} */ (null),
  );
  const [resettingPasswordUser, setResettingPasswordUser] = useState(
    /** @type {import('../types/index.js').UserListItem | null} */ (null),
  );
  const [searchFilters, setSearchFilters] = useState(
    /** @type {import('@astryxdesign/core/PowerSearch').PowerSearchFilter[]} */ ([]),
  );
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [activeColumnKeys, setActiveColumnKeys] = useState(ALL_COLUMN_KEYS);
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

  const usersQuery = useUsersQuery({ page: pageIndex, pageSize });

  // Memoized so identity only changes when the underlying query data does —
  // PowerSearch rebuilds its field-typeahead source (and, seemingly, its
  // open/closed popover tracking with it) whenever `config` changes
  // reference, so recomputing these on every render was closing/breaking
  // the search dropdown on any unrelated re-render (e.g. a background
  // refetch) while it was open.
  const companyOptions = useMemo(
    () =>
      (companiesQuery.data ?? []).map((company) => ({
        value: company.id,
        label: company.name,
      })),
    [companiesQuery.data],
  );
  const departmentOptions = useMemo(
    () =>
      (departmentsQuery.data ?? []).map((department) => ({
        value: department.id,
        label: department.name,
      })),
    [departmentsQuery.data],
  );
  const companyNameById = toNameById(companiesQuery.data ?? []);
  const departmentNameById = toNameById(departmentsQuery.data ?? []);
  const positionNameById = toNameById(positionsQuery.data ?? []);

  const listResult = usersQuery.data;
  const users = listResult?.success ? listResult.users : [];

  // Company/department options load asynchronously, so the field defs that
  // depend on them are recomputed once the queries resolve rather than
  // frozen at module scope like the rest of SEARCH_FIELD_DEFS.
  const searchFieldDefs = useMemo(
    () =>
      /** @satisfies {ReadonlyArray<import('@astryxdesign/core/PowerSearch').FieldDefinition>} */ ([
        ...BASE_SEARCH_FIELD_DEFS,
        {
          key: 'companyId',
          type: 'enum',
          label: 'Đơn vị',
          enumValues: companyOptions,
        },
        {
          key: 'departmentIds',
          type: 'enum_list',
          label: 'Phòng ban',
          enumValues: departmentOptions,
        },
      ]),
    [companyOptions, departmentOptions],
  );
  const { config: baseSearchConfig, applyFilters } = usePowerSearchConfig(
    searchFieldDefs,
    'Người dùng',
  );
  const searchConfig = useMemo(
    () => ({ ...baseSearchConfig, contentSearchFieldKey: 'fullName' }),
    [baseSearchConfig],
  );

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').UserListItem & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'name',
      header: 'Tên',
      width: proportional(1.6),
      filter: 'fullName',
      renderCell: (user) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        return (
          <HStack gap={2} vAlign="center">
            <Avatar size="sm" name={fullName} tooltip={false} />
            <Text>{fullName}</Text>
          </HStack>
        );
      },
    },
    {
      key: 'employeeCode',
      header: 'Mã nhân viên',
      width: proportional(1),
      filter: 'employeeCode',
      renderCell: (user) => user.employeeCode || '—',
    },
    {
      key: 'company',
      header: 'Tên đơn vị',
      width: proportional(1.6),
      filter: 'companyId',
      renderCell: (user) =>
        (user.companyId && companyNameById.get(user.companyId)) ?? '—',
    },
    {
      key: 'position',
      header: 'Chức vụ',
      width: proportional(1.2),
      renderCell: (user) =>
        (user.positionId && positionNameById.get(user.positionId)) ?? '—',
    },
    {
      key: 'department',
      header: 'Phòng ban',
      width: proportional(1.3),
      filter: 'departmentIds',
      renderCell: (user) =>
        departmentNameById.get(user.departmentIds[0] ?? '') ?? '—',
    },
    {
      key: 'actions',
      header: 'Chức năng',
      width: pixel(130),
      align: 'end',
      renderCell: (user) => (
        <DropdownMenu
          button={{ label: 'Thao tác', variant: 'ghost', size: 'sm' }}
          alignment="end"
          items={[
            { label: 'Sửa', onClick: () => setEditingUser(user) },
            {
              label: 'Đặt lại mật khẩu',
              onClick: () => setResettingPasswordUser(user),
            },
          ]}
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
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').UserListItem & Record<string, unknown>>} */ (
      useTableFiltering({
        filters: headerFilters,
        onFilterChange: (key, value) => {
          setHeaderFilter(key, value);
          setPageIndex(1);
        },
        searchConfig,
      })
    );

  // Search filters the page currently on screen, not the whole table: the
  // endpoint is paginated server-side and has no search parameter yet. Worth
  // adding one before the staff list outgrows a single page.
  const searchableUsers = users.map((user) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    phone: user.phone ?? '',
  }));
  const filteredUsers =
    /** @type {import('../types/index.js').UserListItem[]} */
    (
      /** @type {any} */ (
        applyFilters(
          [
            ...searchFilters,
            .../** @type {any} */ (
              toSearchFilters(headerFilters, columns, searchConfig)
            ),
          ],
          /** @type {any} */ (searchableUsers),
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
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').UserListItem & Record<string, unknown>>} */ (
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
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').UserListItem & Record<string, unknown>>} */ (
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

  // Paging is the server's answer now, not a slice of a fully downloaded
  // table — the endpoint stopped returning every user at once
  // (see the API's docs/security.md, M-4).
  const totalUsers = listResult?.success ? listResult.totalCount : 0;
  const totalPages = Math.max(
    1,
    listResult?.success ? listResult.totalPages : 1,
  );
  const currentPage = Math.min(pageIndex, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedUsers = filteredUsers;
  const rangeStart = totalUsers === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + pagedUsers.length, totalUsers);

  /** @param {ReadonlyArray<import('@astryxdesign/core/PowerSearch').PowerSearchFilter>} filters */
  function handleSearchFiltersChange(filters) {
    setSearchFilters([...filters]);
    setPageIndex(1);
  }

  /**
   * Quick filter chip: the closed Selector trigger doubles as the chip, so
   * setting or clearing it just writes/removes a clause in the same filter
   * array PowerSearch itself edits. Department is stored as an id array on
   * the user, so it writes an "is any of" clause with one value rather than
   * an "is" clause, which is what an array field needs to match.
   * @param {'companyId' | 'departmentIds'} field
   * @param {string | null} value
   */
  function setQuickFilter(field, value) {
    setSearchFilters((current) => {
      const rest = current.filter((filter) => filter.field !== field);
      if (value == null) {
        return rest;
      }
      return [
        ...rest,
        field === 'departmentIds'
          ? {
              field,
              operator: 'is_any_of',
              value: { type: 'enum_list', value: [value] },
            }
          : { field, operator: 'is', value: { type: 'enum', value } },
      ];
    });
    setPageIndex(1);
  }

  /** @param {string} field */
  function getQuickFilterValue(field) {
    const active = searchFilters.find((filter) => filter.field === field);
    if (!active) {
      return null;
    }
    const filterValue = /** @type {any} */ (active.value).value;
    return String(Array.isArray(filterValue) ? filterValue[0] : filterValue);
  }

  /** @param {string} value */
  function handlePageSizeChange(value) {
    setPageSize(Number(value));
    setPageIndex(1);
  }

  const isLoadingUsers = usersQuery.isLoading;

  // Same headers/widths as the real columns so the table frame doesn't
  // shift once data arrives — only the cell content is swapped for a
  // shimmer bar (the actions column stays empty, there's nothing to fake).
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
        <Heading level={1}>Người dùng</Heading>
        <Text color="secondary">
          Danh sách toàn bộ người dùng trong hệ thống.
        </Text>
      </VStack>

      {listResult && !listResult.success ? (
        <Banner status="error" title={listResult.message} container="card" />
      ) : null}

      <VStack gap={0} hAlign="stretch" style={stickyBackgroundStyle}>
        <Toolbar
          label="Thao tác danh sách người dùng"
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
                  placeholder="Tìm tên, CCCD..."
                  resultCount={filteredUsers.length}
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
                  isLoading={usersQuery.isFetching}
                  onClick={() => usersQuery.refetch()}
                />
                <ButtonGroup label="Thêm người dùng" size="md">
                  <Button
                    label="Thêm"
                    variant="primary"
                    onClick={() => {
                      setHasOpenedCreate(true);
                      setIsCreateOpen(true);
                    }}
                  />
                  <DropdownMenu
                    button={{
                      label: 'Tuỳ chọn thêm khác',
                      variant: 'primary',
                      icon: <Icon icon="chevronDown" size="sm" />,
                      isIconOnly: true,
                    }}
                    alignment="end"
                    items={[
                      {
                        // No `description` field on DropdownMenuItemData —
                        // the menu cannot render one, so the hint goes in
                        // the label.
                        label: 'Thêm từ Excel (đang phát triển)',
                        isDisabled: true,
                      },
                    ]}
                  />
                </ButtonGroup>
              </HStack>
            </HStack>
          }
        />

        <HStack gap={2} vAlign="center" wrap="wrap" xstyle={styles.filterRow}>
          <Selector
            label="Lọc theo đơn vị"
            isLabelHidden
            placeholder="Đơn vị"
            size="sm"
            hasClear
            options={companyOptions}
            value={getQuickFilterValue('companyId')}
            renderValue={(option) => `Đơn vị là ${option.label ?? option.value}`}
            xstyle={
              getQuickFilterValue('companyId') ? styles.filterFill : undefined
            }
            onChange={(next) => setQuickFilter('companyId', next)}
          />
          <Selector
            label="Lọc theo phòng ban"
            isLabelHidden
            placeholder="Phòng ban"
            size="sm"
            hasClear
            options={departmentOptions}
            value={getQuickFilterValue('departmentIds')}
            renderValue={(option) =>
              `Phòng ban là ${option.label ?? option.value}`
            }
            xstyle={
              getQuickFilterValue('departmentIds')
                ? styles.filterFill
                : undefined
            }
            onChange={(next) => setQuickFilter('departmentIds', next)}
          />
        </HStack>

        <Table
          data={isLoadingUsers ? skeletonRows : pagedUsers}
          columns={isLoadingUsers ? skeletonColumns : columns}
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
            Tổng số: {totalUsers}
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
        <UserFormDialog
          mode="create"
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => setIsCreateOpen(false)}
        />
      ) : null}

      {editingUser ? (
        <UserFormDialog
          mode="edit"
          key={editingUser.id}
          isOpen={editingUser !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingUser(null);
          }}
          user={editingUser}
          onSuccess={() => setEditingUser(null)}
        />
      ) : null}

      {resettingPasswordUser ? (
        <ResetPasswordDialog
          key={resettingPasswordUser.id}
          isOpen={resettingPasswordUser !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setResettingPasswordUser(null);
          }}
          user={resettingPasswordUser}
        />
      ) : null}
    </VStack>
  );
}
