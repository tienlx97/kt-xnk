'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { usePaymentScheduleForm } from '../hooks/use-payment-schedule-form.js';
import { PaymentScheduleFields } from './payment-schedule-fields.jsx';

/**
 * Create/edit dialog for one `Contract`'s payment schedules — opened from
 * `ContractExpandedDetails`'s "Thông tin" tab (`contracts-list.jsx`). Pass
 * `schedule` to edit an existing one; omit it to create a new one (its
 * `paymentNumber`/`paymentCode` are assigned by the backend on success).
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   contractId: string,
 *   schedule?: import('../types/index.js').PaymentSchedule | null,
 *   onSuccess?: (schedule: import('../types/index.js').PaymentSchedule) => void,
 * }} props
 */
export function PaymentScheduleFormDialog({
  isOpen,
  onOpenChange,
  contractId,
  schedule = null,
  onSuccess,
}) {
  const form = usePaymentScheduleForm({
    contractId,
    schedule,
    onSuccess: (savedSchedule) => {
      onOpenChange(false);
      onSuccess?.(savedSchedule);
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
              title={
                schedule
                  ? `Sửa đợt thanh toán ${schedule.paymentCode}`
                  : 'Thêm đợt thanh toán'
              }
              onOpenChange={handleOpenChange}
            />
          }
          content={
            <LayoutContent padding={6}>
              {form.submitError ? (
                <Banner status="error" title={form.submitError} container="card" />
              ) : null}
              <PaymentScheduleFields
                values={form.values}
                setField={form.setField}
                fieldStatuses={form.fieldStatuses}
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
                  label={schedule ? 'Lưu' : 'Thêm'}
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
