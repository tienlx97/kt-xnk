'use client';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Selector } from '@astryxdesign/core/Selector';
import { Text } from '@astryxdesign/core/Text';

import { tablePagination } from '@/shared/config/table-pagination.js';
/** @typedef {{ pageIndex: number, pageSize: number, totalCount: number, totalPages: number, onPageIndexChange: (page: number) => void, onPageSizeChange: (size: number) => void, pageSizeOptions?: string[] }} AdvanceTablePagination */
const DEFAULT_PAGE_SIZE_OPTIONS = ['10', '25', '50', '100'];
/** @param {{ pagination?: AdvanceTablePagination, visibleCount: number, isLoading: boolean }} props */
export function AdvanceTablePagination({
  pagination,
  visibleCount,
  isLoading,
}) {
  const pageSizeOptions =
    pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
  const { currentPage, totalPages, rangeStart, rangeEnd } = tablePagination(
    pagination,
    visibleCount,
  );
  return (
    <HStack hAlign="between" vAlign="center" wrap="wrap" gap={3}>
      <Text type="supporting" color="secondary">
        Tổng số: {pagination ? pagination.totalCount : visibleCount}
      </Text>
      {pagination ? (
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
              options={pageSizeOptions}
              value={String(pagination.pageSize)}
              onChange={(value) => {
                pagination.onPageSizeChange(Number(value));
                pagination.onPageIndexChange(1);
              }}
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
              onClick={() => pagination.onPageIndexChange(1)}
            />
            <IconButton
              label="Trang trước"
              icon={<Icon icon="chevronLeft" size="sm" />}
              variant="ghost"
              size="sm"
              isDisabled={currentPage === 1}
              onClick={() =>
                pagination.onPageIndexChange(Math.max(1, currentPage - 1))
              }
            />
            <IconButton
              label="Trang sau"
              icon={<Icon icon="chevronRight" size="sm" />}
              variant="ghost"
              size="sm"
              isDisabled={currentPage >= totalPages || isLoading}
              onClick={() =>
                pagination.onPageIndexChange(
                  Math.min(totalPages, currentPage + 1),
                )
              }
            />
            <IconButton
              label="Trang cuối"
              icon={<Icon icon="chevronsRight" size="sm" />}
              variant="ghost"
              size="sm"
              isDisabled={currentPage >= totalPages || isLoading}
              onClick={() => pagination.onPageIndexChange(totalPages)}
            />
          </HStack>
        </HStack>
      ) : null}
    </HStack>
  );
}
