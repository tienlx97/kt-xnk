'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Collapsible, CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { VStack } from '@astryxdesign/core/VStack';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useShipmentVgmForm } from '../hooks/use-shipment-vgm-form.js';
import { ShipmentVgmAdditionalFields, ShipmentVgmFields } from './shipment-vgm-fields.jsx';

export const SHIPMENT_VGM_FORM_DIALOG_WIDTH = 760;
const SHIPMENT_VGM_FORM_DIALOG_CONTENT_HEIGHT = 480;

/**
 * One collapsed section of the dialog, same idiom as `ContractFormDialog`/
 * `UserFormDialog` — a `Card` per section is the Astryx accordion idiom
 * (`astryx component Collapsible`).
 * @param {{ value: string, title: string, children: import('react').ReactNode }} props
 */
function FormSection({ value, title, children }) {
  return (
    <Card>
      <Collapsible value={value} trigger={title}>
        <VStack gap={3} hAlign="stretch" paddingBlock={3}>
          {children}
        </VStack>
      </Collapsible>
    </Card>
  );
}

/**
 * Create/edit dialog for one `Shipment`'s VGM records — opened from
 * `ShipmentExpandedDetails`'s inline VGM table (itself nested in the
 * Contract's "Shipment" tab, `contracts-list.jsx`). Pass `vgm` to edit an
 * existing one; omit it to create a new one.
 *
 * Two collapsed cards (2026-09-03 follow-up, matching `ContractFormDialog`'s
 * layout), both open by default: the required container/weight fields, then
 * "Thông tin bổ sung" for the optional schedule/arrival times and note.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   contractId: string,
 *   shipmentId: string,
 *   vgm?: import('../types/index.js').ShipmentVgm | null,
 *   onSuccess?: (vgm: import('../types/index.js').ShipmentVgm) => void,
 * }} props
 */
export function ShipmentVgmFormDialog({
  isOpen,
  onOpenChange,
  contractId,
  shipmentId,
  vgm = null,
  onSuccess,
}) {
  const form = useShipmentVgmForm({
    contractId,
    shipmentId,
    vgm,
    onSuccess: (savedVgm) => {
      onOpenChange(false);
      onSuccess?.(savedVgm);
    },
  });

  /** @param {boolean} nextIsOpen */
  function handleOpenChange(nextIsOpen) {
    if (!nextIsOpen) form.reset();
    onOpenChange(nextIsOpen);
  }

  return (
    <CommonDialog
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      width={SHIPMENT_VGM_FORM_DIALOG_WIDTH}
    >
      <form onSubmit={form.handleSubmit}>
        <Layout
          header={
            <DialogHeader
              title={vgm ? `Sửa VGM ${vgm.containerNumber}` : 'Thêm VGM'}
              onOpenChange={handleOpenChange}
            />
          }
          content={
            // See ContractFormDialog for why isScrollable is disabled here
            // and moved to the fixed-height VStack below: without it, every
            // card expand/collapse resizes the dialog itself.
            <LayoutContent padding={6} isScrollable={false}>
              <VStack
                gap={4}
                hAlign="stretch"
                height={SHIPMENT_VGM_FORM_DIALOG_CONTENT_HEIGHT}
                isScrollable
              >
                {form.submitError ? (
                  <Banner status="error" title={form.submitError} container="card" />
                ) : null}

                <CollapsibleGroup type="multiple" defaultValue={['main', 'additional']}>
                  <VStack gap={3} hAlign="stretch">
                    <FormSection value="main" title="Thông tin container">
                      <ShipmentVgmFields
                        values={form.values}
                        setField={form.setField}
                        fieldStatuses={form.fieldStatuses}
                        customers={form.customers}
                      />
                    </FormSection>

                    <FormSection value="additional" title="Thông tin bổ sung">
                      <ShipmentVgmAdditionalFields
                        values={form.values}
                        setField={form.setField}
                        fieldStatuses={form.fieldStatuses}
                      />
                    </FormSection>
                  </VStack>
                </CollapsibleGroup>
              </VStack>
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
                  label={vgm ? 'Lưu' : 'Thêm'}
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
