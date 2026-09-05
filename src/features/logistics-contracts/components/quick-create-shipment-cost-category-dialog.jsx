'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { TextInput } from '@astryxdesign/core/TextInput';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useShipmentCostCategoryForm } from '../hooks/use-shipment-cost-category-form.js';

/**
 * "+ Thêm nhóm chi phí" opened from the cost-lines row's category Selector
 * in `shipment-cost-lines-fields.jsx` — mirrors `QuickCreateCountryDialog`.
 * No `<form>`/`type="submit"` here for the same nested-form reason as
 * `QuickCreateCustomerDialog`.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   onCreated: (costCategory: import('../types/index.js').ShipmentCostCategory) => void,
 * }} props
 */
export function QuickCreateShipmentCostCategoryDialog({
  isOpen,
  onOpenChange,
  onCreated,
}) {
  const form = useShipmentCostCategoryForm({
    onSuccess: (costCategory) => {
      onCreated(costCategory);
      onOpenChange(false);
    },
  });

  /** @param {boolean} nextIsOpen */
  function handleOpenChange(nextIsOpen) {
    if (!nextIsOpen) form.reset();
    onOpenChange(nextIsOpen);
  }

  return (
    <CommonDialog isOpen={isOpen} onOpenChange={handleOpenChange} width={480}>
      <Layout
        header={
          <DialogHeader
            title="Thêm nhóm chi phí"
            onOpenChange={handleOpenChange}
          />
        }
        content={
          <LayoutContent padding={6}>
            {form.submitError ? (
              <Banner status="error" title={form.submitError} container="card" />
            ) : null}
            <TextInput
              label="Tên nhóm chi phí"
              placeholder="Ví dụ: Trucking, O/F, Customs"
              value={form.values.name}
              onChange={(value) => form.setField('name', value)}
              isRequired
              status={form.fieldStatuses.name}
              statusVariant="tooltip"
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
