'use client';

import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Button } from '@astryxdesign/core/Button';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { DropdownMenu } from '@astryxdesign/core/DropdownMenu';
import { HoverCard } from '@astryxdesign/core/HoverCard';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { Popover } from '@astryxdesign/core/Popover';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Tooltip } from '@astryxdesign/core/Tooltip';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

import { ShowcaseSection } from '../showcase-section.js';

export function OverlaysSection() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [lastAction, setLastAction] = useState(/** @type {string | null} */ (null));

  return (
    <ShowcaseSection
      title="Dialog / Popover / Tooltip / HoverCard / DropdownMenu"
      description="Tất cả overlay đều controlled qua isOpen/onOpenChange — bấm nút để mở thật, không phải ảnh chụp tĩnh."
    >
      <HStack gap={3} wrap="wrap" vAlign="center">
        <Button label="Mở dialog" onClick={() => setDialogOpen(true)} />
        <Button
          label="Xoá lô hàng"
          variant="destructive"
          onClick={() => setAlertOpen(true)}
        />
        <Popover
          isOpen={isPopoverOpen}
          onOpenChange={setPopoverOpen}
          placement="below"
          label="Cài đặt nhanh"
          width={260}
          content={
            <VStack gap={2}>
              <Heading level={4}>Cài đặt nhanh</Heading>
              <Text type="body" color="secondary">
                Thông báo, đơn vị đo, và tuỳ chọn hiển thị.
              </Text>
            </VStack>
          }
        >
          <Button label="Cài đặt" variant="secondary">
            Cài đặt
          </Button>
        </Popover>
        <Tooltip content="Xem chi tiết lô hàng" placement="above">
          <Button label="Hover tôi" variant="ghost" />
        </Tooltip>
        <HoverCard
          placement="above"
          content={
            <VStack gap={2} style={{ width: 220 }}>
              <HStack gap={2} vAlign="center">
                <Avatar name="Lê Xuân Tiến" size="md" />
                <VStack gap={0}>
                  <Heading level={5}>Lê Xuân Tiến</Heading>
                  <Text type="supporting" color="secondary">
                    Điều phối viên
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          }
        >
          <Button label="@tienlx97" variant="ghost" />
        </HoverCard>
        <DropdownMenu
          button={{ label: 'Hành động' }}
          items={[
            { label: 'Chỉnh sửa', onClick: () => setLastAction('Chỉnh sửa') },
            { label: 'Nhân bản', onClick: () => setLastAction('Nhân bản') },
            { type: 'divider' },
            { label: 'Xoá', onClick: () => setLastAction('Xoá') },
          ]}
        />
      </HStack>

      {lastAction ? (
        <Text type="supporting" color="secondary">
          Hành động dropdown gần nhất: {lastAction}
        </Text>
      ) : null}

      <Dialog isOpen={isDialogOpen} onOpenChange={setDialogOpen} width={420}>
        <Layout
          header={
            <DialogHeader
              title="Chi tiết lô hàng"
              onOpenChange={setDialogOpen}
            />
          }
          content={
            <LayoutContent>
              <Text type="body">
                Lô hàng #KT-2026-014 — 3 container 40&apos;, cảng đến Cát Lái,
                dự kiến thông quan 3 ngày.
              </Text>
            </LayoutContent>
          }
        />
      </Dialog>

      <AlertDialog
        isOpen={isAlertOpen}
        onOpenChange={setAlertOpen}
        title="Xoá lô hàng?"
        description="Hành động này không thể hoàn tác. Toàn bộ chứng từ đính kèm sẽ bị xoá."
        actionLabel="Xoá"
        onAction={() => setAlertOpen(false)}
      />
    </ShowcaseSection>
  );
}
