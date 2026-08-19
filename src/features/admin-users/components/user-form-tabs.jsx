'use client';

import { Badge } from '@astryxdesign/core/Badge';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { VStack } from '@astryxdesign/core/VStack';

import { BankAccountsFields } from './bank-accounts-fields.jsx';
import { UserContactFields } from './user-contact-fields.jsx';

/**
 * The 4-tab strip from the reference layout ("Thông tin liên hệ" / "Thông
 * tin tiền lương" / "Tài khoản ngân hàng" / "Thông tin người phụ thuộc").
 * Only the first and third tabs have real fields today — the other two
 * are shown for layout parity with the reference but carry no data yet
 * (no backing feature/API), so they render a placeholder instead of fake
 * inputs.
 * @param {{
 *   activeTab: 'contact' | 'salary' | 'bank' | 'dependents',
 *   onActiveTabChange: (tab: string) => void,
 *   contactFieldsProps: import('react').ComponentProps<typeof UserContactFields>,
 *   bankAccountsFieldsProps: import('react').ComponentProps<typeof BankAccountsFields>,
 * }} props
 */
export function UserFormTabs({
  activeTab,
  onActiveTabChange,
  contactFieldsProps,
  bankAccountsFieldsProps,
}) {
  return (
    <VStack gap={4} hAlign="stretch">
      <TabList value={activeTab} onChange={onActiveTabChange} hasDivider>
        <Tab value="contact" label="Thông tin liên hệ" />
        <Tab value="salary" label="Thông tin tiền lương" />
        <Tab value="bank" label="Tài khoản ngân hàng" />
        <Tab
          value="dependents"
          label="Thông tin người phụ thuộc"
          endContent={<Badge label="Mới" variant="info" />}
        />
      </TabList>

      {/* Fixed min-height so the dialog doesn't grow/shrink (and re-center
          itself, visibly jumping up/down) as the active tab's content
          height varies — the placeholder tabs are much shorter than the
          contact/bank ones. */}
      <VStack gap={4} hAlign="stretch" style={{ minHeight: 340 }}>
        {activeTab === 'contact' ? (
          <UserContactFields {...contactFieldsProps} />
        ) : null}

        {activeTab === 'salary' ? (
          <EmptyState
            title="Chưa có thông tin tiền lương"
            description="Tính năng đang phát triển."
            isCompact
          />
        ) : null}

        {activeTab === 'bank' ? (
          <BankAccountsFields {...bankAccountsFieldsProps} />
        ) : null}

        {activeTab === 'dependents' ? (
          <EmptyState
            title="Chưa có thông tin người phụ thuộc"
            description="Tính năng đang phát triển."
            isCompact
          />
        ) : null}
      </VStack>
    </VStack>
  );
}
