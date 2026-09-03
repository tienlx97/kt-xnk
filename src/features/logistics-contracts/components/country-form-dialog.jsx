'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useCountryForm } from '../hooks/use-country-form.js';
import { CountryFields } from './country-fields.jsx';

/**
 * Standalone create dialog for the Countries page (`countries-list.jsx`) —
 * same field-set as `quick-create-country-dialog.jsx`, but with its own
 * `<form>` since it is not nested inside another dialog's form. Mirrors
 * `CustomerFormDialog`.
 * @param {{ isOpen: boolean, onOpenChange: (isOpen: boolean) => void, onSuccess?: () => void }} props
 */
export function CountryFormDialog({ isOpen, onOpenChange, onSuccess }) {
  const form = useCountryForm({
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
          header={<DialogHeader title="Thêm nước" onOpenChange={handleOpenChange} />}
          content={
            <LayoutContent padding={6}>
              {form.submitError ? (
                <Banner status="error" title={form.submitError} container="card" />
              ) : null}
              <CountryFields
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
