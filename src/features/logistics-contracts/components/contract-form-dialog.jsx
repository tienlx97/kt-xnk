'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Collapsible, CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { DateInput } from '@astryxdesign/core/DateInput';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Selector } from '@astryxdesign/core/Selector';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';

import { CommonDialog } from '../../../shared/components/common-dialog.jsx';
import { currencyOptions } from '../config/currencies.js';
import { incotermOptions } from '../config/incoterms.js';
import { useContractForm } from '../hooks/use-contract-form.js';
import { ContractBanksFields } from './contract-banks-fields.jsx';
import { PartyAFields } from './party-a-fields.jsx';
import { PaymentTermsFields } from './payment-terms-fields.jsx';

export const CONTRACT_FORM_DIALOG_WIDTH = 1100;
const CONTRACT_FORM_DIALOG_MAX_HEIGHT = '88vh';
const CONTRACT_FORM_DIALOG_CONTENT_HEIGHT = 680;

/**
 * One collapsed section of the dialog, same idiom as
 * `user-form-dialog.jsx` (admin-users feature).
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
 * Create/edit dialog for a `Contract`. Notify Party/Consignee are not part
 * of this form yet (sent as `null` — the backend accepts that); this pass
 * covers header fields, Party A, payment terms, and bank references.
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
    setField,
    setPartyAInlineField,
    selectExistingCustomer,
    switchToInlinePartyA,
    setBankIds,
    fieldStatuses,
    companies,
    branches,
    isBranchFixed,
    fixedBranchId,
    customers,
    banks,
    paymentTermRows,
    partyAExtraFieldRows,
    isCheckingContractNumber,
    submitError,
    submitSuccess,
    isSubmitting,
    handleSubmit,
  } = form;

  /** @type {Record<string, { type: 'error', message: string } | undefined>} */
  const partyAFieldStatuses = {};

  return (
    <CommonDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      width={CONTRACT_FORM_DIALOG_WIDTH}
      maxHeight={CONTRACT_FORM_DIALOG_MAX_HEIGHT}
    >
      <form onSubmit={handleSubmit}>
        <Layout
          header={<DialogHeader title={title} onOpenChange={onOpenChange} />}
          content={
            <LayoutContent padding={6}>
              <VStack
                gap={4}
                hAlign="stretch"
                height={CONTRACT_FORM_DIALOG_CONTENT_HEIGHT}
                isScrollable
              >
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

                <CollapsibleGroup
                  type="multiple"
                  defaultValue={['general', 'partyA']}
                >
                  <VStack gap={3} hAlign="stretch">
                    <FormSection value="general" title="Thông tin chung">
                      <HStack gap={3}>
                        <StackItem size="fill">
                          <TextInput
                            label="Số hợp đồng"
                            value={values.contractNumber}
                            onChange={(value) =>
                              setField('contractNumber', value)
                            }
                            isRequired
                            isLoading={isCheckingContractNumber}
                            status={fieldStatuses.contractNumber}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                        <StackItem size="fill">
                          <TextInput
                            label="Tên dự án"
                            value={values.projectName}
                            onChange={(value) => setField('projectName', value)}
                            isRequired
                            status={fieldStatuses.projectName}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                      </HStack>

                      <HStack gap={3}>
                        <StackItem size="fill">
                          <DateInput
                            label="Ngày tạo hợp đồng"
                            value={
                              /** @type {import('@astryxdesign/core/Calendar').ISODateString} */ (
                                values.createdDate
                              )
                            }
                            onChange={(value) =>
                              setField('createdDate', value ?? '')
                            }
                            format="system_date"
                            isRequired
                            status={fieldStatuses.createdDate}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                        <StackItem size="fill">
                          <DateInput
                            label="Ngày báo giá"
                            value={
                              /** @type {import('@astryxdesign/core/Calendar').ISODateString} */ (
                                values.quotationDate
                              )
                            }
                            onChange={(value) =>
                              setField('quotationDate', value ?? '')
                            }
                            format="system_date"
                            isRequired
                            status={fieldStatuses.quotationDate}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                      </HStack>

                      <HStack gap={3}>
                        <StackItem size="fill">
                          <TextInput
                            label="Hạng mục"
                            value={values.category}
                            onChange={(value) => setField('category', value)}
                            isRequired
                            status={fieldStatuses.category}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                        <StackItem size="fill">
                          <TextInput
                            label="Nước xuất khẩu"
                            value={values.exportCountry}
                            onChange={(value) =>
                              setField('exportCountry', value)
                            }
                            isRequired
                            status={fieldStatuses.exportCountry}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                      </HStack>

                      <HStack gap={3}>
                        <StackItem size="fill">
                          <TextInput
                            label="Cảng xếp hàng"
                            value={values.portOfLoading}
                            onChange={(value) =>
                              setField('portOfLoading', value)
                            }
                            isRequired
                            status={fieldStatuses.portOfLoading}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                        <StackItem size="fill">
                          <TextInput
                            label="Cảng/nơi đến"
                            value={values.portOrPlaceOfDestination}
                            onChange={(value) =>
                              setField('portOrPlaceOfDestination', value)
                            }
                            isRequired
                            status={fieldStatuses.portOrPlaceOfDestination}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                      </HStack>

                      <HStack gap={3} vAlign="end">
                        <StackItem size="fill">
                          <NumberInput
                            label="Giá trị hợp đồng"
                            value={values.contractValue}
                            onChange={(value) =>
                              setField('contractValue', value)
                            }
                            min={0}
                            step={0.01}
                            units={values.currency || undefined}
                            isRequired
                            status={fieldStatuses.contractValue}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                        <StackItem size="static">
                          <Selector
                            label="Tiền tệ"
                            placeholder="Đơn vị"
                            value={values.currency}
                            onChange={(value) =>
                              setField('currency', value ?? '')
                            }
                            options={currencyOptions}
                            width={120}
                            isRequired
                            status={fieldStatuses.currency}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                      </HStack>

                      <HStack gap={3}>
                        <StackItem size="fill">
                          <Selector
                            label="Incoterm"
                            placeholder="Chọn Incoterm"
                            value={values.incoterm}
                            onChange={(value) =>
                              setField('incoterm', value ?? '')
                            }
                            options={incotermOptions}
                            isRequired
                            status={fieldStatuses.incoterm}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                        <StackItem size="fill">
                          <NumberInput
                            label="Năm Incoterm"
                            value={values.incotermYear}
                            onChange={(value) =>
                              setField('incotermYear', value)
                            }
                            isIntegerOnly
                            isRequired
                            status={fieldStatuses.incotermYear}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                      </HStack>

                      {isBranchFixed ? (
                        <Text type="supporting" color="secondary">
                          Chi nhánh:{' '}
                          {fixedBranchId ?? '— (không gắn chi nhánh)'} (không
                          thể thay đổi sau khi tạo)
                        </Text>
                      ) : (
                        <VStack gap={3} hAlign="stretch">
                          <Selector
                            label="Công ty"
                            hasSearch
                            placeholder="Chọn công ty"
                            value={values.companyId}
                            onChange={(value) =>
                              setField('companyId', value ?? '')
                            }
                            options={companies.map((company) => ({
                              value: company.id,
                              label: company.name,
                            }))}
                            width="100%"
                          />
                          <Selector
                            label="Chi nhánh"
                            placeholder="Chọn chi nhánh (không bắt buộc)"
                            value={values.branchId}
                            onChange={(value) =>
                              setField('branchId', value ?? '')
                            }
                            options={branches.map((branch) => ({
                              value: branch.id,
                              label: branch.name,
                            }))}
                            isDisabled={!values.companyId}
                            disabledMessage="Chọn công ty trước"
                            isOptional
                            status={fieldStatuses.branchId}
                            statusVariant="tooltip"
                            width="100%"
                          />
                        </VStack>
                      )}
                    </FormSection>

                    <FormSection value="partyA" title="Party A (Khách hàng)">
                      <PartyAFields
                        customers={customers}
                        sourceCustomerId={values.sourceCustomerId}
                        inlineValues={values.partyAInline}
                        sourceCustomerIdStatus={fieldStatuses.sourceCustomerId}
                        fieldStatuses={partyAFieldStatuses}
                        onSelectExisting={selectExistingCustomer}
                        onSwitchToInline={switchToInlinePartyA}
                        onInlineFieldChange={setPartyAInlineField}
                        extraFieldRows={partyAExtraFieldRows}
                      />
                    </FormSection>

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
