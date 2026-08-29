'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useSellerForm } from '../hooks/use-seller-form.js';
import { SellerFields } from './seller-fields.jsx';

/**
 * "+ Thêm bên bán" embedded in the Contract form's Seller section. Mirrors
 * `QuickCreateCustomerDialog` — deliberately no `<form>`/`type="submit"`
 * here for the same nested-form reason (see that file's doc comment).
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   onCreated: (seller: import('../types/index.js').Seller) => void,
 * }} props
 */
export function QuickCreateSellerDialog({ isOpen, onOpenChange, onCreated }) {
  const form = useSellerForm({
    onSuccess: (seller) => {
      onCreated(seller);
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
        header={<DialogHeader title="Thêm bên bán" onOpenChange={handleOpenChange} />}
        content={
          <LayoutContent padding={6}>
            {form.submitError ? (
              <Banner status="error" title={form.submitError} container="card" />
            ) : null}
            <SellerFields
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
