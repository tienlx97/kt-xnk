'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { ButtonGroup } from '@astryxdesign/core/ButtonGroup';
import { DropdownMenu } from '@astryxdesign/core/DropdownMenu';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Selector } from '@astryxdesign/core/Selector';
import { Skeleton } from '@astryxdesign/core/Skeleton';
import { pixel, proportional, Table } from '@astryxdesign/core/Table';
import { Heading, Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Toolbar } from '@astryxdesign/core/Toolbar';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

import { IconRefresh } from '../../../shared/components/icon/icon-refresh.jsx';
import {
  useCompaniesQuery,
  useDepartmentsQuery,
  usePositionsQuery,
} from '../hooks/use-org-directory.js';
import { useUsersQuery } from '../hooks/use-users-query.js';
import { CreateUserForm } from './create-user-form.jsx';
import { EditUserForm } from './edit-user-form.jsx';

const SKELETON_ROW_COUNT = 6;
const skeletonRows = Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => ({
  id: `skeleton-${index}`,
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
  // `CreateUserForm` stays mounted (not gated on `isCreateOpen`) once opened
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
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);

  const usersQuery = useUsersQuery({ page: pageIndex, pageSize });

  const companyNameById = toNameById(companiesQuery.data ?? []);
  const departmentNameById = toNameById(departmentsQuery.data ?? []);
  const positionNameById = toNameById(positionsQuery.data ?? []);

  const listResult = usersQuery.data;
  const users = listResult?.success ? listResult.users : [];

  // Search filters the page currently on screen, not the whole table: the
  // endpoint is paginated server-side and has no search parameter yet. Worth
  // adding one before the staff list outgrows a single page.
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = normalizedQuery
    ? users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
          fullName.includes(normalizedQuery) ||
          user.nationalId.toLowerCase().includes(normalizedQuery) ||
          (user.phone ?? '').toLowerCase().includes(normalizedQuery)
        );
      })
    : users;

  // Paging is the server's answer now, not a slice of a fully downloaded
  // table — the endpoint stopped returning every user at once
  // (see the API's docs/security.md, M-4).
  const totalUsers = listResult?.success ? listResult.totalCount : 0;
  const totalPages = Math.max(1, listResult?.success ? listResult.totalPages : 1);
  const currentPage = Math.min(pageIndex, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedUsers = filteredUsers;
  const rangeStart = totalUsers === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + pagedUsers.length, totalUsers);

  /** @param {string} value */
  function handleSearchChange(value) {
    setSearchQuery(value);
    setPageIndex(1);
  }

  /** @param {string} value */
  function handlePageSizeChange(value) {
    setPageSize(Number(value));
    setPageIndex(1);
  }

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').UserListItem & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'name',
      header: 'Tên',
      width: proportional(1.6),
      renderCell: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      key: 'position',
      header: 'Chức vụ',
      width: proportional(1.2),
      renderCell: (user) =>
        (user.positionId && positionNameById.get(user.positionId)) ?? '—',
    },
    {
      key: 'company',
      header: 'Tên đơn vị',
      width: proportional(1.6),
      renderCell: (user) =>
        (user.companyId && companyNameById.get(user.companyId)) ?? '—',
    },
    {
      key: 'department',
      header: 'Phòng ban',
      width: proportional(1.3),
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
          items={[{ label: 'Sửa', onClick: () => setEditingUser(user) }]}
        />
      ),
    },
  ];

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

      <VStack gap={0} hAlign="stretch">
        <Toolbar
          label="Thao tác danh sách người dùng"
          size="sm"
          startContent={
            <TextInput
              label="Tìm kiếm"
              isLabelHidden
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm theo tên, CCCD, SĐT..."
              startIcon="search"
              hasClear
              width={280}
            />
          }
          endContent={
            <>
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
                      label: 'Thêm từ Excel',
                      description: 'Tính năng đang phát triển',
                      isDisabled: true,
                    },
                  ]}
                />
              </ButtonGroup>
            </>
          }
        />

        <Table
          data={isLoadingUsers ? skeletonRows : pagedUsers}
          columns={isLoadingUsers ? skeletonColumns : columns}
          idKey="id"
          dividers="rows"
          hasHover
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
        <CreateUserForm
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => setIsCreateOpen(false)}
        />
      ) : null}

      {editingUser ? (
        <EditUserForm
          key={editingUser.id}
          isOpen={editingUser !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingUser(null);
          }}
          user={editingUser}
          onSuccess={() => setEditingUser(null)}
        />
      ) : null}
    </VStack>
  );
}
