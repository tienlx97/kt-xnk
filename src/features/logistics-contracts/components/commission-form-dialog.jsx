'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import * as stylex from '@stylexjs/stylex';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useCommissionForm } from '../hooks/use-commission-form.js';
import { CommissionFields } from './commission-fields.jsx';

const styles = stylex.create({
  form: {
    height: '100%',
  },
});

/**
 * Create/edit dialog for one `Contract`'s `Commission` — opened from
 * `ContractExpandedDetails`'s "Commission" tab (`contracts-list.jsx`).
 * A contract has at most one, so pass `commission` to edit the
 * existing one; omit it to create the first (and only) one.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   contractId: string,
 *   currency: string,
 *   commission?: import('../types/index.js').Commission | null,
 *   onSuccess?: (commission: import('../types/index.js').Commission) => void,
 * }} props
 */
export function CommissionFormDialog({
  isOpen,
  onOpenChange,
  contractId,
  currency,
  commission = null,
  onSuccess,
}) {
  const form = useCommissionForm({
    contractId,
    commission,
    onSuccess: (saved) => {
      onOpenChange(false);
      onSuccess?.(saved);
    },
  });

  return (
    <CommonDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      variant="fullscreen"
    >
      <form onSubmit={form.handleSubmit} {...stylex.props(styles.form)}>
        <Layout
          header={
            <DialogHeader title={form.title} onOpenChange={onOpenChange} />
          }
          content={
            <LayoutContent padding={6}>
              {form.submitError ? (
                <Banner status="error" title={form.submitError} container="card" />
              ) : null}
              <CommissionFields
                values={form.values}
                setField={form.setField}
                fieldStatuses={form.fieldStatuses}
                customers={form.customers}
                currency={currency}
                paymentTermRows={form.paymentTermRows}
                paymentHistoryRows={form.paymentHistoryRows}
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
                  onClick={() => onOpenChange(false)}
                />
                <Button
                  label={form.submitLabel}
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
