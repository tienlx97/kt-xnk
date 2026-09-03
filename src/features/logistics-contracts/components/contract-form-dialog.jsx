'use client';

import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Collapsible, CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { DateInput } from '@astryxdesign/core/DateInput';
import { DialogHeader } from '@astryxdesign/core/Dialog';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Layout, LayoutContent, LayoutFooter } from '@astryxdesign/core/Layout';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Selector } from '@astryxdesign/core/Selector';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { TextArea } from '@astryxdesign/core/TextArea';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { CommonDialog } from '@/shared/components/common-dialog.jsx';
import { IconPlus } from '@/shared/components/icon/icon-plus.jsx';

import { currencyOptions, formatMoney } from '../config/currencies.js';
import { incotermOptions } from '../config/incoterms.js';
import { useContractForm } from '../hooks/use-contract-form.js';
import { BuyerFields } from './buyer-fields.jsx';
import { ContractBanksFields } from './contract-banks-fields.jsx';
import { PaymentTermsFields } from './payment-terms-fields.jsx';
import { QuickCreateCountryDialog } from './quick-create-country-dialog.jsx';
import { QuickCreatePlaceDialog } from './quick-create-place-dialog.jsx';
import { SellerPickerFields } from './seller-picker-fields.jsx';

export const CONTRACT_FORM_DIALOG_WIDTH = 1100;
const CONTRACT_FORM_DIALOG_MAX_HEIGHT = '88vh';
const CONTRACT_FORM_DIALOG_CONTENT_HEIGHT = 680;

const styles = stylex.create({
  // `StackItem size="fill"` only sets `flexGrow: 1` — flex-basis stays
  // `auto`, so a sibling that grows (e.g. a status icon appearing) steals
  // width from the other "fill" item instead of both staying equal. Basis 0
  // makes flex-grow the only thing that decides width, so two fill items in
  // the same row stay equal regardless of either one's content.
  equalFill: {
    flexBasis: 0,
  },
});

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
    setField,
    setSellerInlineField,
    selectExistingSeller,
    switchToInlineSeller,
    setBuyerInlineField,
    selectExistingCustomer,
    switchToInlineBuyer,
    setBankIds,
    fieldStatuses,
    companies,
    isCompanyFixed,
    sellers,
    customers,
    countries,
    vietnamCountryId,
    loadingPlaces,
    isPlaceOfDischargeApplicable,
    dischargePlaces,
    banks,
    paymentTermRows,
    sellerExtraFieldRows,
    buyerExtraFieldRows,
    isCheckingContractNumber,
    submitError,
    submitSuccess,
    isSubmitting,
    handleSubmit,
  } = form;

  const [isQuickCreateCountryOpen, setIsQuickCreateCountryOpen] =
    useState(false);
  const [isQuickCreateLoadingPlaceOpen, setIsQuickCreateLoadingPlaceOpen] =
    useState(false);
  const [isQuickCreateDischargePlaceOpen, setIsQuickCreateDischargePlaceOpen] =
    useState(false);

  /** @type {Record<string, { type: 'error', message: string } | undefined>} */
  const sellerFieldStatuses = {};
  /** @type {Record<string, { type: 'error', message: string } | undefined>} */
  const buyerFieldStatuses = {};

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
            // `isScrollable={false}`: the inner VStack below is the sole
            // scroll owner (fixed height + its own `isScrollable`, so the
            // dialog doesn't resize as collapsible sections toggle) —
            // `LayoutContent`'s own default `isScrollable={true}` would
            // otherwise stack a second, redundant scrollbar on top of it.
            <LayoutContent padding={6} isScrollable={false}>
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
                  defaultValue={['general', 'seller', 'buyer']}
                >
                  <VStack gap={3} hAlign="stretch">
                    <FormSection value="general" title="Thông tin chung">
                      <HStack gap={3}>
                        <StackItem size="fill" xstyle={styles.equalFill}>
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
                        <StackItem size="fill" xstyle={styles.equalFill}>
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
                        <StackItem size="fill" xstyle={styles.equalFill}>
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
                        <StackItem size="fill" xstyle={styles.equalFill}>
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
                        <StackItem size="fill" xstyle={styles.equalFill}>
                          <TextInput
                            label="Hạng mục"
                            value={values.category}
                            onChange={(value) => setField('category', value)}
                            isRequired
                            status={fieldStatuses.category}
                            statusVariant="tooltip"
                          />
                        </StackItem>
                        <StackItem size="fill" xstyle={styles.equalFill}>
                          <HStack gap={2} vAlign="end">
                            <StackItem size="fill">
                              <Selector
                                label="Nước xuất khẩu"
                                hasSearch
                                placeholder="Chọn nước"
                                value={values.countryId}
                                onChange={(value) =>
                                  setField('countryId', value ?? '')
                                }
                                options={countries.map((country) => ({
                                  value: country.id,
                                  label: country.name,
                                }))}
                                isRequired
                                status={fieldStatuses.countryId}
                                statusVariant="tooltip"
                                width="100%"
                              />
                            </StackItem>
                            <IconButton
                              label="Thêm nước"
                              tooltip="Thêm nước"
                              icon={<Icon icon={IconPlus} size="sm" />}
                              type="button"
                              variant="secondary"
                              onClick={() => setIsQuickCreateCountryOpen(true)}
                            />
                          </HStack>
                        </StackItem>
                      </HStack>

                      <HStack gap={3}>
                        <StackItem size="fill" xstyle={styles.equalFill}>
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
                        <StackItem size="fill" xstyle={styles.equalFill}>
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

                      <HStack>
                        <StackItem size="fill">
                          <HStack gap={2} vAlign="end">
                            <StackItem size="fill">
                              <Selector
                                label="Nơi xếp hàng"
                                hasSearch
                                placeholder="Chọn nơi xếp hàng"
                                disabledMessage={
                                  vietnamCountryId
                                    ? undefined
                                    : 'Danh mục nước chưa có "Việt Nam"'
                                }
                                isDisabled={!vietnamCountryId}
                                value={values.placeOfLoading}
                                onChange={(value) =>
                                  setField('placeOfLoading', value ?? '')
                                }
                                options={loadingPlaces.map((place) => ({
                                  value: place.name,
                                  label: place.name,
                                }))}
                                isRequired
                                status={fieldStatuses.placeOfLoading}
                                statusVariant="tooltip"
                                width="100%"
                              />
                            </StackItem>
                            <IconButton
                              label="Thêm nơi xếp hàng"
                              tooltip="Thêm nơi xếp hàng"
                              icon={<Icon icon={IconPlus} size="sm" />}
                              type="button"
                              variant="secondary"
                              isDisabled={!vietnamCountryId}
                              onClick={() =>
                                setIsQuickCreateLoadingPlaceOpen(true)
                              }
                            />
                          </HStack>
                        </StackItem>
                      </HStack>

                      <HStack>
                        <StackItem size="fill">
                          <HStack gap={2} vAlign="end">
                            <StackItem size="fill">
                              <Selector
                                label="Cảng/nơi đến"
                                hasSearch
                                placeholder="Chọn cảng/nơi đến"
                                disabledMessage={
                                  !isPlaceOfDischargeApplicable
                                    ? 'Không áp dụng cho Incoterm EXW/FOB'
                                    : !values.countryId
                                      ? 'Vui lòng chọn nước xuất khẩu trước'
                                      : undefined
                                }
                                isDisabled={
                                  !isPlaceOfDischargeApplicable ||
                                  !values.countryId
                                }
                                value={values.placeOfDischarge}
                                onChange={(value) =>
                                  setField('placeOfDischarge', value ?? '')
                                }
                                options={dischargePlaces.map((place) => ({
                                  value: place.name,
                                  label: place.name,
                                }))}
                                isRequired={isPlaceOfDischargeApplicable}
                                status={fieldStatuses.placeOfDischarge}
                                statusVariant="tooltip"
                                width="100%"
                              />
                            </StackItem>
                            <IconButton
                              label="Thêm cảng / nơi đến"
                              tooltip="Thêm cảng / nơi đến"
                              icon={<Icon icon={IconPlus} size="sm" />}
                              type="button"
                              variant="secondary"
                              isDisabled={
                                !isPlaceOfDischargeApplicable ||
                                !values.countryId
                              }
                              onClick={() =>
                                setIsQuickCreateDischargePlaceOpen(true)
                              }
                            />
                          </HStack>
                        </StackItem>
                      </HStack>

                      <QuickCreateCountryDialog
                        isOpen={isQuickCreateCountryOpen}
                        onOpenChange={setIsQuickCreateCountryOpen}
                        onCreated={(country) =>
                          setField('countryId', country.id)
                        }
                      />

                      <QuickCreatePlaceDialog
                        isOpen={isQuickCreateLoadingPlaceOpen}
                        onOpenChange={setIsQuickCreateLoadingPlaceOpen}
                        countries={countries}
                        countryId={vietnamCountryId}
                        onCreated={(place) =>
                          setField('placeOfLoading', place.name)
                        }
                      />

                      <QuickCreatePlaceDialog
                        isOpen={isQuickCreateDischargePlaceOpen}
                        onOpenChange={setIsQuickCreateDischargePlaceOpen}
                        countries={countries}
                        countryId={values.countryId}
                        onCreated={(place) =>
                          setField('placeOfDischarge', place.name)
                        }
                      />

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
                            formatValue={formatMoney}
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

                      {isCompanyFixed ? (
                        <Text type="supporting" color="secondary">
                          Công ty:{' '}
                          {companies.find(
                            (company) => company.id === values.companyId,
                          )?.name ?? values.companyId}{' '}
                          (không thể thay đổi sau khi tạo)
                        </Text>
                      ) : (
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
                          isRequired
                          status={fieldStatuses.companyId}
                          statusVariant="tooltip"
                          width="100%"
                        />
                      )}

                      <TextArea
                        label="Ghi chú"
                        value={values.note}
                        onChange={(value) => setField('note', value)}
                        isOptional
                        maxLength={2000}
                        status={fieldStatuses.note}
                        statusVariant="tooltip"
                      />

                      <HStack gap={4}>
                        <CheckboxInput
                          label="Bên bán ký"
                          value={values.sellerSigned}
                          onChange={(checked) =>
                            setField('sellerSigned', checked)
                          }
                        />
                        <CheckboxInput
                          label="Bên mua ký"
                          value={values.buyerSigned}
                          onChange={(checked) =>
                            setField('buyerSigned', checked)
                          }
                        />
                      </HStack>
                    </FormSection>

                    <FormSection value="seller" title="Bên bán">
                      <SellerPickerFields
                        sellers={sellers}
                        sourceSellerId={values.sourceSellerId}
                        inlineValues={values.sellerInline}
                        sourceSellerIdStatus={fieldStatuses.sourceSellerId}
                        fieldStatuses={sellerFieldStatuses}
                        onSelectExisting={selectExistingSeller}
                        onSwitchToInline={switchToInlineSeller}
                        onInlineFieldChange={setSellerInlineField}
                        extraFieldRows={sellerExtraFieldRows}
                      />
                    </FormSection>

                    <FormSection value="buyer" title="Buyer (Khách hàng)">
                      <BuyerFields
                        customers={customers}
                        sourceCustomerId={values.sourceCustomerId}
                        inlineValues={values.buyerInline}
                        sourceCustomerIdStatus={fieldStatuses.sourceCustomerId}
                        fieldStatuses={buyerFieldStatuses}
                        onSelectExisting={selectExistingCustomer}
                        onSwitchToInline={switchToInlineBuyer}
                        onInlineFieldChange={setBuyerInlineField}
                        extraFieldRows={buyerExtraFieldRows}
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
