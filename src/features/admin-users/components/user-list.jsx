'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { pixel, proportional, Table } from '@astryxdesign/core/Table';
import { Heading, Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

import {
  useCompaniesQuery,
  useDepartmentsQuery,
  usePositionsQuery,
} from '../hooks/use-org-directory.js';
import { useUsersQuery } from '../hooks/use-users-query.js';
import { CreateUserForm } from './create-user-form.jsx';
import { EditUserForm } from './edit-user-form.jsx';

const DIALOG_WIDTH = 560;

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

/** @param {{ token: string }} props */
export function UserList({ token }) {
  const usersQuery = useUsersQuery(token);
  const companiesQuery = useCompaniesQuery();
  const departmentsQuery = useDepartmentsQuery();
  const positionsQuery = usePositionsQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(
    /** @type {import('../types/index.js').UserListItem | null} */ (null),
  );

  const companyNameById = toNameById(companiesQuery.data ?? []);
  const departmentNameById = toNameById(departmentsQuery.data ?? []);
  const positionNameById = toNameById(positionsQuery.data ?? []);

  const listResult = usersQuery.data;
  const users = listResult?.success ? listResult.users : [];

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').UserListItem & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'name',
      header: 'Họ tên',
      width: proportional(1.6),
      renderCell: (user) => `${user.lastName} ${user.firstName}`,
    },
    {
      key: 'nationalId',
      header: 'CCCD',
      width: proportional(1.3),
    },
    {
      key: 'phone',
      header: 'SĐT',
      width: proportional(1),
      renderCell: (user) => user.phone ?? '—',
    },
    {
      key: 'company',
      header: 'Công ty',
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
      key: 'position',
      header: 'Chức vụ',
      width: proportional(1.2),
      renderCell: (user) =>
        (user.positionId && positionNameById.get(user.positionId)) ?? '—',
    },
    {
      key: 'actions',
      header: '',
      width: pixel(90),
      align: 'end',
      renderCell: (user) => (
        <Button
          label="Sửa"
          size="sm"
          variant="secondary"
          onClick={() => setEditingUser(user)}
        />
      ),
    },
  ];

  return (
    <VStack gap={4} hAlign="stretch">
      <HStack hAlign="between" vAlign="center" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>Người dùng</Heading>
          <Text color="secondary">Danh sách toàn bộ người dùng trong hệ thống.</Text>
        </VStack>
        <Button
          label="Tạo mới"
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
        />
      </HStack>

      {listResult && !listResult.success ? (
        <Banner status="error" title={listResult.message} container="card" />
      ) : null}

      <Table
        data={users}
        columns={columns}
        idKey="id"
        dividers="rows"
        hasHover
      />

      <Dialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        purpose="form"
        width={DIALOG_WIDTH}
      >
        <Layout
          header={
            <DialogHeader
              title="Tạo người dùng"
              onOpenChange={setIsCreateOpen}
            />
          }
          content={
            <LayoutContent padding={6}>
              <CreateUserForm
                token={token}
                onSuccess={() => setIsCreateOpen(false)}
              />
            </LayoutContent>
          }
        />
      </Dialog>

      <Dialog
        isOpen={editingUser !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingUser(null);
        }}
        purpose="form"
        width={DIALOG_WIDTH}
      >
        {editingUser ? (
          <Layout
            header={
              <DialogHeader
                title={`Sửa: ${editingUser.lastName} ${editingUser.firstName}`}
                onOpenChange={() => setEditingUser(null)}
              />
            }
            content={
              <LayoutContent padding={6}>
                <EditUserForm
                  key={editingUser.id}
                  token={token}
                  user={editingUser}
                  onSuccess={() => setEditingUser(null)}
                />
              </LayoutContent>
            }
          />
        ) : null}
      </Dialog>
    </VStack>
  );
}
