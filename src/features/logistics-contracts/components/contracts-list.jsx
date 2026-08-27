'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
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
import { formatMoney } from '../config/currencies.js';
import { useContractsQuery } from '../hooks/use-contracts-query.js';
import { ContractFormDialog } from './contract-form-dialog.jsx';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);

  const contractsQuery = useContractsQuery({ page: pageIndex, pageSize });
  const listResult = contractsQuery.data;
  const contracts = listResult?.success ? listResult.contracts : [];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredContracts = normalizedQuery
    ? contracts.filter((contract) => {
        const haystack =
          `${contract.contractNumber} ${contract.projectName} ${contract.partyA.companyName}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : contracts;

  const totalContracts = listResult?.success ? listResult.totalCount : 0;
  const totalPages = Math.max(1, listResult?.success ? listResult.totalPages : 1);
  const currentPage = Math.min(pageIndex, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const rangeStart = totalContracts === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + filteredContracts.length, totalContracts);

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

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').Contract & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'contractNumber',
      header: 'Số hợp đồng',
      width: proportional(1),
      renderCell: (contract) => contract.contractNumber,
    },
    {
      key: 'projectName',
      header: 'Dự án',
      width: proportional(1.4),
      renderCell: (contract) => contract.projectName,
    },
    {
      key: 'partyA',
      header: 'Khách hàng',
      width: proportional(1.4),
      renderCell: (contract) => contract.partyA.companyName,
    },
    {
      key: 'contractValue',
      header: 'Giá trị',
      width: proportional(1),
      align: 'end',
      renderCell: (contract) => formatMoney(contract.contractValue, contract.currency),
    },
    {
      key: 'incoterm',
      header: 'Incoterm',
      width: pixel(110),
      renderCell: (contract) => `${contract.incoterm} ${contract.incotermYear}`,
    },
    {
      key: 'createdDate',
      header: 'Ngày tạo',
      width: pixel(120),
      renderCell: (contract) => contract.createdDate,
    },
    {
      key: 'actions',
      header: 'Chức năng',
      width: pixel(90),
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

      <VStack gap={0} hAlign="stretch">
        <Toolbar
          label="Thao tác danh sách hợp đồng"
          size="sm"
          startContent={
            <TextInput
              label="Tìm kiếm"
              isLabelHidden
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm theo số HĐ, dự án, khách hàng..."
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
            </>
          }
        />

        <Table
          data={isLoadingContracts ? skeletonRows : filteredContracts}
          columns={isLoadingContracts ? skeletonColumns : columns}
          idKey="id"
          dividers="rows"
          hasHover
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
                onClick={() => setPageIndex((page) => Math.min(totalPages, page + 1))}
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
