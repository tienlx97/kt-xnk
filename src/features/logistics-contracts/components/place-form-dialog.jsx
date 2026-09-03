'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { usePlaceForm } from '../hooks/use-place-form.js';
import { PlaceFields } from './place-fields.jsx';

/**
 * Standalone create dialog for the Places page (`places-list.jsx`) — same
 * field-set as `quick-create-place-dialog.jsx`, but with its own `<form>`
 * since it is not nested inside another dialog's form. Mirrors
 * `CustomerFormDialog`.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   countries: import('../types/index.js').Country[],
 *   onSuccess?: () => void,
 * }} props
 */
export function PlaceFormDialog({
  isOpen,
  onOpenChange,
  countries,
  onSuccess,
}) {
  const form = usePlaceForm({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
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
              title="Thêm cảng / nơi đến"
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
              <PlaceFields
                values={form.values}
                setField={form.setField}
                fieldStatuses={form.fieldStatuses}
                countries={countries}
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
