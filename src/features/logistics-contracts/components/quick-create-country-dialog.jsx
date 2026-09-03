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
 * "+ Thêm nước" embedded in the Contract form's "Thông tin chung" section.
 * Deliberately no `<form>`/`type="submit"` here — mirrors
 * `QuickCreateCustomerDialog` (see its doc comment for why: nested forms
 * inside `ContractFormDialog`'s own `<form>` break, since Astryx `Dialog`
 * is a non-portal native `<dialog>`).
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   onCreated: (country: import('../types/index.js').Country) => void,
 * }} props
 */
export function QuickCreateCountryDialog({ isOpen, onOpenChange, onCreated }) {
  const form = useCountryForm({
    onSuccess: (country) => {
      onCreated(country);
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
