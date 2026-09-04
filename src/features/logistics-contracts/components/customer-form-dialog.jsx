'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useCustomerForm } from '../hooks/use-customer-form.js';
import { CustomerFields } from './customer-fields.jsx';

/**
 * Create/edit dialog for the Customers page (`customers-list.jsx`) — same
 * field-set as `quick-create-customer-dialog.jsx`, but with its own
 * `<form>` since it is not nested inside another dialog's form. Pass
 * `customer` to edit an existing one; omit it to create a new one.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   customer?: import('../types/index.js').Customer | null,
 *   onSuccess?: (customer: import('../types/index.js').Customer) => void,
 * }} props
 */
export function CustomerFormDialog({
  isOpen,
  onOpenChange,
  customer = null,
  onSuccess,
}) {
  const form = useCustomerForm({
    customer,
    onSuccess: (savedCustomer) => {
      onOpenChange(false);
      onSuccess?.(savedCustomer);
    },
  });

  /** @param {boolean} nextIsOpen */
  function handleOpenChange(nextIsOpen) {
    if (!nextIsOpen) form.reset();
    onOpenChange(nextIsOpen);
  }

  return (
    <CommonDialog isOpen={isOpen} onOpenChange={handleOpenChange} width={600}>
      <form onSubmit={form.handleSubmit}>
        <Layout
          header={
            <DialogHeader
              title={customer ? 'Sửa khách hàng' : 'Thêm khách hàng'}
              onOpenChange={handleOpenChange}
            />
          }
          content={
            <LayoutContent padding={6}>
              {form.submitError ? (
                <Banner
                  status="error"
                  title={form.submitError}
                  container="card"
                />
              ) : null}
              <CustomerFields
                values={form.values}
                setField={form.setField}
                fieldStatuses={form.fieldStatuses}
                extraFieldRows={form.extraFieldRows}
              />
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <HStack hAlign="end" gap={2}>
                <Button
                  label="Hủy"
                  type="button"
                  variant="secondary"
                  onClick={() => handleOpenChange(false)}
                />
                <Button
                  label={customer ? 'Lưu' : 'Thêm'}
                  type="submit"
                  variant="primary"
                  isLoading={form.isSubmitting}
                />
              </HStack>
            </LayoutFooter>
          }
        />
      </form>
    </CommonDialog>
  );
}
