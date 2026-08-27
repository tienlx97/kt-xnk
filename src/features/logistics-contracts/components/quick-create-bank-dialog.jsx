'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '../../../shared/components/common-dialog.jsx';
import { useBankForm } from '../hooks/use-bank-form.js';
import { BankFields } from './bank-fields.jsx';

/**
 * "+ Thêm ngân hàng" embedded in the Contract form's Ngân hàng section.
 * No `<form>` here for the same nested-form reason documented in
 * `quick-create-customer-dialog.jsx`.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   onCreated: (bank: import('../types/index.js').ContractBank) => void,
 * }} props
 */
export function QuickCreateBankDialog({ isOpen, onOpenChange, onCreated }) {
  const form = useBankForm({
    onSuccess: (bank) => {
      onCreated(bank);
      onOpenChange(false);
    },
  });

  /** @param {boolean} nextIsOpen */
  function handleOpenChange(nextIsOpen) {
    if (!nextIsOpen) form.reset();
    onOpenChange(nextIsOpen);
  }

  return (
    <CommonDialog isOpen={isOpen} onOpenChange={handleOpenChange} width={600}>
      <Layout
        header={<DialogHeader title="Thêm ngân hàng" onOpenChange={handleOpenChange} />}
        content={
          <LayoutContent padding={6}>
            {form.submitError ? (
              <Banner status="error" title={form.submitError} container="card" />
            ) : null}
            <BankFields
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
                label="Thêm"
                type="button"
                variant="primary"
                isLoading={form.isSubmitting}
                onClick={() => form.handleSubmit()}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </CommonDialog>
  );
}
