'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '../../../shared/components/common-dialog.jsx';
import { useCustomerForm } from '../hooks/use-customer-form.js';
import { CustomerFields } from './customer-fields.jsx';

/**
 * "+ Thêm khách hàng" embedded in the Contract form's Party A section.
 * Deliberately no `<form>`/`type="submit"` here — this renders nested
 * inside `ContractFormDialog`'s own `<form>`, and Astryx's `Dialog` is an
 * inline (non-portal) native `<dialog>`, so a second `<form>` would be
 * invalid-HTML-nested-inside-a-form: the browser drops the inner tag and
 * merges the button into the OUTER form (same bug already hit and fixed in
 * `create-org-item-dialog.jsx`, admin-users feature).
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   onCreated: (customer: import('../types/index.js').Customer) => void,
 * }} props
 */
export function QuickCreateCustomerDialog({ isOpen, onOpenChange, onCreated }) {
  const form = useCustomerForm({
    onSuccess: (customer) => {
      onCreated(customer);
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
        header={<DialogHeader title="Thêm khách hàng" onOpenChange={handleOpenChange} />}
        content={
          <LayoutContent padding={6}>
            {form.submitError ? (
              <Banner status="error" title={form.submitError} container="card" />
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
