'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useShipmentForm } from '../hooks/use-shipment-form.js';
import { ShipmentFields } from './shipment-fields.jsx';

/**
 * Create/edit dialog for one `Contract`'s shipments — opened from
 * `ContractExpandedDetails`'s "Shipment" tab (`contracts-list.jsx`).
 * Pass `shipment` to edit an existing one; omit it
 * to create a new one (its `shipmentNumber`/`shipmentCode` are assigned by
 * the backend on success).
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   contractId: string,
 *   contract?: import('../types/index.js').Contract | null,
 *   shipment?: import('../types/index.js').Shipment | null,
 *   onSuccess?: (shipment: import('../types/index.js').Shipment) => void,
 * }} props
 */
export function ShipmentFormDialog({
  isOpen,
  onOpenChange,
  contractId,
  contract = null,
  shipment = null,
  onSuccess,
}) {
  const form = useShipmentForm({
    contractId,
    contract,
    shipment,
    onSuccess: (savedShipment) => {
      onOpenChange(false);
      onSuccess?.(savedShipment);
    },
  });

  /** @param {boolean} nextIsOpen */
  function handleOpenChange(nextIsOpen) {
    if (!nextIsOpen) form.reset();
    onOpenChange(nextIsOpen);
  }

  return (
    <CommonDialog isOpen={isOpen} onOpenChange={handleOpenChange} width={1200}>
      <form onSubmit={form.handleSubmit}>
        <Layout
          header={
            <DialogHeader
              title={
                shipment
                  ? `Sửa Shipment ${shipment.shipmentCode}`
                  : 'Thêm Shipment'
              }
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
              <ShipmentFields
                values={form.values}
                setField={form.setField}
                fieldStatuses={form.fieldStatuses}
                customers={form.customers}
                isEditing={shipment != null}
                costLineRows={form.costLineRows}
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
                  label={shipment ? 'Lưu' : 'Thêm'}
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
