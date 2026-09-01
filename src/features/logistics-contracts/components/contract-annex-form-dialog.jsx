'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';

import { useContractAnnexForm } from '../hooks/use-contract-annex-form.js';
import { ContractAnnexFields } from './contract-annex-fields.jsx';

/**
 * Create/edit dialog for one `Contract`'s annexes — opened from
 * `ContractExpandedDetails`'s "Phụ lục" tab (`contracts-list.jsx`). Pass
 * `annex` to edit an existing one; omit it to create a new one (its
 * `annexNumber`/`annexCode` are assigned by the backend on success).
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   contractId: string,
 *   annex?: import('../types/index.js').ContractAnnex | null,
 *   onSuccess?: (annex: import('../types/index.js').ContractAnnex) => void,
 * }} props
 */
export function ContractAnnexFormDialog({
  isOpen,
  onOpenChange,
  contractId,
  annex = null,
  onSuccess,
}) {
  const form = useContractAnnexForm({
    contractId,
    annex,
    onSuccess: (savedAnnex) => {
      onOpenChange(false);
      onSuccess?.(savedAnnex);
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
              title={annex ? `Sửa phụ lục ${annex.annexCode}` : 'Thêm phụ lục'}
              onOpenChange={handleOpenChange}
            />
          }
          content={
            <LayoutContent padding={6}>
              {form.submitError ? (
                <Banner status="error" title={form.submitError} container="card" />
              ) : null}
              <ContractAnnexFields
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
                  label={annex ? 'Lưu' : 'Thêm'}
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
