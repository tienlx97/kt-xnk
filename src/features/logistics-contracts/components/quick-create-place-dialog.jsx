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
 * "+ Thêm cảng / nơi đến" — not currently wired into the Contract form (which keeps
 * `placeOfLoading`/`placeOfDischarge` as free text, see
 * `docs/api/Places.md`, BE-kt-xnk), but built following the same pattern as
 * `QuickCreateCountryDialog` for the `Place` catalog to be usable wherever a
 * future picker needs it. No `<form>`/`type="submit"` here for the same
 * nested-form reason as `QuickCreateCustomerDialog`.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   countries: import('../types/index.js').Country[],
 *   countryId?: string,
 *   onCreated: (place: import('../types/index.js').Place) => void,
 * }} props
 */
export function QuickCreatePlaceDialog({
  isOpen,
  onOpenChange,
  countries,
  countryId,
  onCreated,
}) {
  const form = usePlaceForm({
    countryId,
    // Re-seeds `values.countryId` from the latest `countryId` prop every
    // time this dialog opens — see the `isOpen` param's doc comment in
    // `usePlaceForm`. This dialog stays mounted and is opened by its
    // caller flipping `isOpen` directly (an IconButton's onClick), which
    // never touches this hook, so without this the Country selector would
    // stay stuck on whatever `countryId` was true the first time this
    // component ever mounted.
    isOpen,
    onSuccess: (place) => {
      onCreated(place);
      onOpenChange(false);
    },
  });

  return (
    <CommonDialog isOpen={isOpen} onOpenChange={onOpenChange} width={480}>
      <Layout
        header={
          <DialogHeader
            title="Thêm cảng / nơi đến"
            onOpenChange={onOpenChange}
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
              isCountryFixed={Boolean(countryId)}
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
