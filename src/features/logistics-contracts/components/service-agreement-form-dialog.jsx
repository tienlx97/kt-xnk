'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useServiceAgreementForm } from '../hooks/use-service-agreement-form.js';
import { ServiceAgreementFields } from './service-agreement-fields.jsx';

/**
 * Create/edit dialog for one `Contract`'s `ServiceAgreement` — opened from
 * `ContractExpandedDetails`'s "Service Agreement" tab (`contracts-list.jsx`).
 * A contract has at most one, so pass `serviceAgreement` to edit the
 * existing one; omit it to create the first (and only) one.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   contractId: string,
 *   currency: string,
 *   serviceAgreement?: import('../types/index.js').ServiceAgreement | null,
 *   onSuccess?: (serviceAgreement: import('../types/index.js').ServiceAgreement) => void,
 * }} props
 */
export function ServiceAgreementFormDialog({
  isOpen,
  onOpenChange,
  contractId,
  currency,
  serviceAgreement = null,
  onSuccess,
}) {
  const form = useServiceAgreementForm({
    contractId,
    serviceAgreement,
    onSuccess: (saved) => {
      onOpenChange(false);
      onSuccess?.(saved);
    },
  });

  return (
    <CommonDialog isOpen={isOpen} onOpenChange={onOpenChange} width={560}>
      <form onSubmit={form.handleSubmit}>
        <Layout
          header={
            <DialogHeader title={form.title} onOpenChange={onOpenChange} />
          }
          content={
            <LayoutContent padding={6}>
              {form.submitError ? (
                <Banner status="error" title={form.submitError} container="card" />
              ) : null}
              <ServiceAgreementFields
                values={form.values}
                setField={form.setField}
                fieldStatuses={form.fieldStatuses}
                customers={form.customers}
                currency={currency}
                paymentTermRows={form.paymentTermRows}
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
