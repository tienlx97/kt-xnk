'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useCommissionPaymentQuickAddForm } from '../hooks/use-commission-payment-quick-add-form.js';
import { CommissionPaymentFields } from './commission-payment-fields.jsx';

/**
 * "Thêm nhanh" — appends one payment to a Commission's "Lịch sử thanh
 * toán" without opening the full `CommissionFormDialog`, same idiom as
 * `CommissionAnnexFormDialog`'s standalone "Thêm phụ lục". Requires the
 * full `commission` (not just its id) since the update it sends resends
 * every other field unchanged — see `useCommissionPaymentQuickAddForm`.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   contractId: string,
 *   commission: import('../types/index.js').Commission,
 *   currency: string,
 *   onSuccess?: (commission: import('../types/index.js').Commission) => void,
 * }} props
 */
export function CommissionPaymentQuickAddDialog({
  isOpen,
  onOpenChange,
  contractId,
  commission,
  currency,
  onSuccess,
}) {
  const form = useCommissionPaymentQuickAddForm({
    contractId,
    commission,
    onSuccess: (saved) => {
      onOpenChange(false);
      onSuccess?.(saved);
    },
  });

  /** @param {boolean} nextIsOpen */
  function handleOpenChange(nextIsOpen) {
    if (!nextIsOpen) form.reset();
    onOpenChange(nextIsOpen);
  }

  return (
    <CommonDialog isOpen={isOpen} onOpenChange={handleOpenChange} width={480}>
      <form onSubmit={form.handleSubmit}>
        <Layout
          header={
            <DialogHeader
              title="Thêm lần thanh toán"
              onOpenChange={handleOpenChange}
            />
          }
          content={
            <LayoutContent padding={6}>
              {form.submitError ? (
                <Banner status="error" title={form.submitError} container="card" />
              ) : null}
              <CommissionPaymentFields
                values={form.values}
                setField={form.setField}
                fieldStatuses={form.fieldStatuses}
                currency={currency}
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
                  label="Thêm"
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
