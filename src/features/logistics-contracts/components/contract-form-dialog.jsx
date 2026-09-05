'use client';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';
import { FormSection } from '@/shared/components/form-section.jsx';

import { useContractForm } from '../hooks/use-contract-form.js';
import { ContractBanksFields } from './contract-banks-fields.jsx';
import { ContractGeneralFields } from './contract-general-fields.jsx';
import { PaymentTermsFields } from './payment-terms-fields.jsx';

const styles = stylex.create({
  form: {
    height: '100%',
  },
});

/**
 * Create/edit dialog for a `Contract`. Notify Party/Consignee are not part
 * of this form yet (sent as `null` — the backend accepts that); this pass
 * covers header fields, Buyer (was "Party A" — see `docs/api/Contracts.md`,
 * BE-kt-xnk), payment terms, and bank references.
 * @param {{
 *   isOpen: boolean,
 *   onOpenChange: (isOpen: boolean) => void,
 *   contract?: import('../types/index.js').Contract | null,
 *   onSuccess?: () => void,
 * }} props
 */
export function ContractFormDialog({
  isOpen,
  onOpenChange,
  contract = null,
  onSuccess,
}) {
  const form = useContractForm({ contract, onSuccess });
  const {
    title,
    submitLabel,
    values,
    setBankIds,
    fieldStatuses,
    banks,
    paymentTermRows,
    submitError,
    submitSuccess,
    isSubmitting,
    handleSubmit,
  } = form;

  return (
    <CommonDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      variant="fullscreen"
    >
      <form onSubmit={handleSubmit} {...stylex.props(styles.form)}>
        <Layout
          header={<DialogHeader title={title} onOpenChange={onOpenChange} />}
          content={
            // `isScrollable={false}`: the inner VStack below is the sole
            // scroll owner (it fills the available content height and owns
            // overflow as collapsible sections toggle) —
            // `LayoutContent`'s own default `isScrollable={true}` would
            // otherwise stack a second, redundant scrollbar on top of it.
            <LayoutContent padding={6} isScrollable={false}>
              <VStack gap={4} hAlign="stretch" height="100%" isScrollable>
                {submitError ? (
                  <Banner status="error" title={submitError} container="card" />
                ) : null}
                {submitSuccess ? (
                  <Banner
                    status="success"
                    title={submitSuccess}
                    container="card"
                  />
                ) : null}

                <CollapsibleGroup type="single" defaultValue="general">
                  <VStack gap={3} hAlign="stretch">
                    <ContractGeneralFields form={form} />

                    <FormSection value="paymentTerms" title="Đợt thanh toán">
                      <PaymentTermsFields
                        rows={paymentTermRows.rows}
                        totalPercent={paymentTermRows.totalPercent}
                        status={fieldStatuses.paymentTerms}
                        contractValue={values.contractValue}
                        currency={values.currency}
                        onAddRow={paymentTermRows.addRow}
                        onRemoveRow={paymentTermRows.removeRow}
                        onUpdateRowField={paymentTermRows.updateRowField}
                      />
                    </FormSection>

                    <FormSection value="banks" title="Ngân hàng thụ hưởng">
                      <ContractBanksFields
                        banks={banks}
                        selectedBankIds={values.bankIds}
                        onChange={setBankIds}
                        status={fieldStatuses.bankIds}
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
                  onClick={() => onOpenChange(false)}
                />
                <Button
                  label={submitLabel}
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                />
              </HStack>
            </LayoutFooter>
          }
        />
      </form>
    </CommonDialog>
  );
}
