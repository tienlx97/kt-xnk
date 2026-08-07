'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { Skeleton } from '@astryxdesign/core/Skeleton';
import { Spinner } from '@astryxdesign/core/Spinner';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Toast, useToast } from '@astryxdesign/core/Toast';
import { VStack } from '@astryxdesign/core/VStack';

import { ShowcaseSection } from '../showcase-section.jsx';

/** @type {('info' | 'success' | 'warning' | 'error')[]} */
const BANNER_STATUSES = ['info', 'success', 'warning', 'error'];
/** @type {('success' | 'warning' | 'error' | 'accent' | 'neutral')[]} */
const STATUS_DOT_VARIANTS = ['success', 'warning', 'error', 'accent', 'neutral'];

export function FeedbackSection() {
  const toast = useToast();

  return (
    <>
      <ShowcaseSection
        title="Banner"
        description="Thông báo tồn tại tới khi người dùng xử lý — khác Toast (tự biến mất)."
      >
        <VStack gap={3}>
          {BANNER_STATUSES.map((status) => (
            <Banner
              key={status}
              status={status}
              title={`Banner status="${status}"`}
            />
          ))}
        </VStack>
      </ShowcaseSection>

      <ShowcaseSection
        title="Toast"
        description="Bấm nút để bắn toast thật qua useToast() — cách dùng khuyến nghị cho production, tự xếp chồng và tự ẩn."
      >
        <VStack gap={3}>
          <HStack gap={3}>
            <Button
              label="Bắn toast thành công"
              variant="secondary"
              onClick={() => toast({ body: 'Đã lưu lô hàng #KT-2026-014' })}
            />
            <Button
              label="Bắn toast lỗi"
              variant="destructive"
              onClick={() =>
                toast({ body: 'Không kết nối được kho dữ liệu', type: 'error' })
              }
            />
          </HStack>
          <Toast
            type="info"
            body="Xem trước giao diện Toast (tĩnh, không tự ẩn)"
            isAutoHide={false}
            autoHideDuration={5000}
            isExiting={false}
            onDismiss={() => {}}
          />
        </VStack>
      </ShowcaseSection>

      <ShowcaseSection title="ProgressBar / Skeleton / Spinner / StatusDot">
        <VStack gap={5}>
          <ProgressBar
            value={62}
            label="Tiến độ thông quan"
            hasValueLabel
            style={{ width: 320 }}
          />
          <HStack gap={4} vAlign="center">
            <Skeleton width={64} height={64} radius="rounded" index={0} />
            <VStack gap={2}>
              <Skeleton width={160} height={20} index={1} />
              <Skeleton width={100} height={16} index={2} />
            </VStack>
          </HStack>
          <HStack gap={4} vAlign="center">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" label="Đang tải lô hàng..." />
          </HStack>
          <HStack gap={3} wrap="wrap">
            {STATUS_DOT_VARIANTS.map((variant) => (
              <StatusDot key={variant} variant={variant} label={variant} />
            ))}
          </HStack>
        </VStack>
      </ShowcaseSection>

      <ShowcaseSection
        title="EmptyState"
        description="Luôn có tiêu đề + hành động kế tiếp — không để người dùng bế tắc."
      >
        <EmptyState
          icon={<Icon icon="search" size="lg" />}
          title="Chưa có lô hàng nào"
          description="Tạo lô hàng đầu tiên để bắt đầu theo dõi tiến độ thông quan."
          actions={<Button label="Tạo lô hàng" variant="primary" />}
        />
      </ShowcaseSection>
    </>
  );
}
