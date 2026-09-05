'use client';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { DateInput } from '@astryxdesign/core/DateInput';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Selector } from '@astryxdesign/core/Selector';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { TextArea } from '@astryxdesign/core/TextArea';
import { TextInput } from '@astryxdesign/core/TextInput';
import { useState } from 'react';

import { FormGrid } from '@/shared/components/form-grid.jsx';
import { FormSection } from '@/shared/components/form-section.jsx';
import { IconPlus } from '@/shared/components/icon/icon-plus.jsx';

import { currencyOptions, formatMoney } from '../config/currencies.js';
import { incotermOptions } from '../config/incoterms.js';
import { BuyerFields } from './buyer-fields.jsx';
import { QuickCreateCountryDialog } from './quick-create-country-dialog.jsx';
import { QuickCreatePlaceDialog } from './quick-create-place-dialog.jsx';
import { SellerPickerFields } from './seller-picker-fields.jsx';

/** @param {{ form: ReturnType<typeof import('../hooks/use-contract-form.js').useContractForm> }} props */
export function ContractGeneralFields({ form }) {
  const {
    values,
    setField,
    setSellerInlineField,
    selectExistingSeller,
    switchToInlineSeller,
    setBuyerInlineField,
    selectExistingCustomer,
    switchToInlineBuyer,
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
    sellerExtraFieldRows,
    buyerExtraFieldRows,
    isCheckingContractNumber,
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
    <FormSection value="general" title="Thông tin chung">
      <FormGrid>
        <StackItem size="fill">
          <TextInput
            label="Số hợp đồng"
            value={values.contractNumber}
            onChange={(value) => setField('contractNumber', value)}
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
      </FormGrid>

      <FormGrid>
        <StackItem size="fill">
          <DateInput
            label="Ngày tạo hợp đồng"
            value={
              /** @type {import('@astryxdesign/core/Calendar').ISODateString} */ (
                values.createdDate
              )
            }
            onChange={(value) => setField('createdDate', value ?? '')}
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
            onChange={(value) => setField('quotationDate', value ?? '')}
            format="system_date"
            isRequired
            status={fieldStatuses.quotationDate}
            statusVariant="tooltip"
          />
        </StackItem>
      </FormGrid>

      <FormGrid>
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
          <HStack gap={2} vAlign="end">
            <StackItem size="fill">
              <Selector
                label="Nước xuất khẩu"
                hasSearch
                placeholder="Chọn nước"
                value={values.countryId}
                onChange={(value) => setField('countryId', value ?? '')}
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
      </FormGrid>

      <FormGrid>
        <StackItem size="fill">
          <Selector
            label="Incoterm"
            placeholder="Chọn Incoterm"
            value={values.incoterm}
            onChange={(value) => setField('incoterm', value ?? '')}
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
            onChange={(value) => setField('incotermYear', value)}
            isIntegerOnly
            isRequired
            status={fieldStatuses.incotermYear}
            statusVariant="tooltip"
          />
        </StackItem>
      </FormGrid>

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
                onChange={(value) => setField('placeOfLoading', value ?? '')}
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
              onClick={() => setIsQuickCreateLoadingPlaceOpen(true)}
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
                isDisabled={!isPlaceOfDischargeApplicable || !values.countryId}
                value={values.placeOfDischarge}
                onChange={(value) => setField('placeOfDischarge', value ?? '')}
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
              isDisabled={!isPlaceOfDischargeApplicable || !values.countryId}
              onClick={() => setIsQuickCreateDischargePlaceOpen(true)}
            />
          </HStack>
        </StackItem>
      </HStack>

      <QuickCreateCountryDialog
        isOpen={isQuickCreateCountryOpen}
        onOpenChange={setIsQuickCreateCountryOpen}
        onCreated={(country) => setField('countryId', country.id)}
      />

      <QuickCreatePlaceDialog
        isOpen={isQuickCreateLoadingPlaceOpen}
        onOpenChange={setIsQuickCreateLoadingPlaceOpen}
        countries={countries}
        countryId={vietnamCountryId}
        onCreated={(place) => setField('placeOfLoading', place.name)}
      />

      <QuickCreatePlaceDialog
        isOpen={isQuickCreateDischargePlaceOpen}
        onOpenChange={setIsQuickCreateDischargePlaceOpen}
        countries={countries}
        countryId={values.countryId}
        onCreated={(place) => setField('placeOfDischarge', place.name)}
      />

      <HStack gap={3} vAlign="end">
        <StackItem size="fill">
          <NumberInput
            label="Giá trị hợp đồng"
            value={values.contractValue}
            onChange={(value) => setField('contractValue', value)}
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
            onChange={(value) => setField('currency', value ?? '')}
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
          {companies.find((company) => company.id === values.companyId)?.name ??
            values.companyId}{' '}
          (không thể thay đổi sau khi tạo)
        </Text>
      ) : (
        <Selector
          label="Công ty"
          hasSearch
          placeholder="Chọn công ty"
          value={values.companyId}
          onChange={(value) => setField('companyId', value ?? '')}
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
          onChange={(checked) => setField('sellerSigned', checked)}
        />
        <CheckboxInput
          label="Bên mua ký"
          value={values.buyerSigned}
          onChange={(checked) => setField('buyerSigned', checked)}
        />
      </HStack>

      <Text type="label" color="secondary">
        Bên bán
      </Text>
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

      <Text type="label" color="secondary">
        Buyer (Khách hàng)
      </Text>
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
  );
}
