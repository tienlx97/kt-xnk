'use client';

import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { VStack } from '@astryxdesign/core/VStack';
import { useState } from 'react';

import { ShowcaseSection } from '../showcase-section.jsx';

export function SelectionSection() {
  const [tab, setTab] = useState('overview');
  const [view, setView] = useState('grid');

  return (
    <ShowcaseSection
      title="TabList / SegmentedControl"
      description="TabList điều hướng giữa các view (đổi nội dung trang). SegmentedControl là input chọn 1 trong vài chế độ — đừng lẫn hai cái."
    >
      <VStack gap={5}>
        <TabList value={tab} onChange={setTab} hasDivider>
          <Tab value="overview" label="Tổng quan" />
          <Tab value="shipments" label="Lô hàng" />
          <Tab value="documents" label="Chứng từ" />
        </TabList>
        <SegmentedControl value={view} onChange={setView} label="Chế độ xem">
          <SegmentedControlItem value="grid" label="Lưới" />
          <SegmentedControlItem value="list" label="Danh sách" />
          <SegmentedControlItem value="table" label="Bảng" />
        </SegmentedControl>
      </VStack>
    </ShowcaseSection>
  );
}
