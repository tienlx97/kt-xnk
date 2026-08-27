'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Skeleton } from '@astryxdesign/core/Skeleton';
import { proportional, Table } from '@astryxdesign/core/Table';
import { Heading, Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Toolbar } from '@astryxdesign/core/Toolbar';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

import { IconRefresh } from '../../../shared/components/icon/icon-refresh.jsx';
import { useCustomersQuery } from '../hooks/use-customers-query.js';
import { CustomerFormDialog } from './customer-form-dialog.jsx';

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
  const [searchQuery, setSearchQuery] = useState('');

  const customersQuery = useCustomersQuery();
  const listResult = customersQuery.data;
  const customers = listResult?.success ? listResult.customers : [];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCustomers = normalizedQuery
    ? customers.filter((customer) =>
        `${customer.companyName} ${customer.representativeName ?? ''}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : customers;

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').Customer & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'companyName',
      header: 'Tên công ty',
      width: proportional(1.4),
      renderCell: (customer) => customer.companyName,
    },
    {
      key: 'representativeName',
      header: 'Người đại diện',
      width: proportional(1),
      renderCell: (customer) => customer.representativeName || '—',
    },
    {
      key: 'representativeTitle',
      header: 'Chức vụ',
      width: proportional(0.8),
      renderCell: (customer) => customer.representativeTitle || '—',
    },
    {
      key: 'address',
      header: 'Địa chỉ',
      width: proportional(1.4),
      renderCell: (customer) => customer.address || '—',
    },
    {
      key: 'extraFields',
      header: 'Trường tùy ý',
      width: proportional(1),
      renderCell: (customer) =>
        customer.extraFields.length > 0
          ? customer.extraFields.map((field) => `${field.key}: ${field.value}`).join(', ')
          : '—',
    },
  ];

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

      <VStack gap={0} hAlign="stretch">
        <Toolbar
          label="Thao tác danh sách khách hàng"
          size="sm"
          startContent={
            <TextInput
              label="Tìm kiếm"
              isLabelHidden
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm theo tên công ty, người đại diện..."
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
            </>
          }
        />

        <Table
          data={isLoadingCustomers ? skeletonRows : filteredCustomers}
          columns={isLoadingCustomers ? skeletonColumns : columns}
          idKey="id"
          dividers="rows"
          hasHover
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
