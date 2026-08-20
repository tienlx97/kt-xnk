'use client';

import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { VStack } from '@astryxdesign/core/VStack';

import { BankAccountsFields } from './bank-accounts-fields.jsx';
import { UserContactFields } from './user-contact-fields.jsx';
import { UserPermissionsFields } from './user-permissions-fields.jsx';

/**
 * The tab strip from the reference layout, plus "Quyền" (permissions —
 * no backing reference screen, added for `add-user-permission-grants`).
 * Only "contact", "bank" and "permissions" have real fields today — the
 * other two are shown for layout parity with the reference but carry no
 * data yet (no backing feature/API), so they render a placeholder instead
 * of fake inputs.
 *
 * "permissions" itself only applies to an existing user — granting to an
 * account that doesn't exist yet is meaningless — so `CreateUserForm` omits
 * `permissionsFieldsProps` and the tab doesn't render at all there, rather
 * than showing a dead tab.
 * @param {{
 *   activeTab: 'contact' | 'salary' | 'bank' | 'dependents' | 'permissions',
 *   onActiveTabChange: (tab: string) => void,
 *   contactFieldsProps: import('react').ComponentProps<typeof UserContactFields>,
 *   bankAccountsFieldsProps: import('react').ComponentProps<typeof BankAccountsFields>,
 *   permissionsFieldsProps?: import('react').ComponentProps<typeof UserPermissionsFields>,
 * }} props
 */
export function UserFormTabs({
  activeTab,
  onActiveTabChange,
  contactFieldsProps,
  bankAccountsFieldsProps,
  permissionsFieldsProps,
}) {
  return (
    <VStack gap={4} hAlign="stretch">
      <TabList value={activeTab} onChange={onActiveTabChange} hasDivider>
        <Tab value="contact" label="Thông tin liên hệ" />
        <Tab value="bank" label="Tài khoản ngân hàng" />
        <Tab value="salary" label="Thông tin tiền lương" />
        <Tab
          value="dependents"
          label="Thông tin người phụ thuộc"
          // endContent={<Badge label="Mới" variant="info" />}
        />
        {permissionsFieldsProps ? (
          <Tab value="permissions" label="Quyền" />
        ) : null}
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

        {activeTab === 'permissions' && permissionsFieldsProps ? (
          <UserPermissionsFields {...permissionsFieldsProps} />
        ) : null}
      </VStack>
    </VStack>
  );
}
