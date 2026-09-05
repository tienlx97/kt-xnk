'use client';

import { HStack } from '@astryxdesign/core/HStack';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Selector } from '@astryxdesign/core/Selector';
import { StackItem } from '@astryxdesign/core/Stack';
import { TextInput } from '@astryxdesign/core/TextInput';

import { FormGrid } from '@/shared/components/form-grid.jsx';
import { FormSection } from '@/shared/components/form-section.jsx';

import { currencyOptions } from '../config/currencies.js';
import { paymentTypeOptions } from '../config/payment-schedule-types.js';
import { labelForShipmentQuantityUnit } from '../config/shipment-quantity-units.js';
import { shipmentTypeOptions } from '../config/shipment-types.js';
/** @param {{
 * values: import('../types/index.js').ShipmentFormValues,
 * setField: <K extends keyof import('../types/index.js').ShipmentFormValues>(field: K, value: import('../types/index.js').ShipmentFormValues[K]) => void,
 * fieldStatuses: Record<string, { type: 'error', message: string } | undefined>,
 * isEditing: boolean,
 * derivedQuantityUnit: ReturnType<typeof import('../config/shipment-quantity-units.js').quantityUnitForShipmentType>,
 * }} props */
export function ShipmentLotFields({
  values,
  setField,
  fieldStatuses,
  isEditing,
  derivedQuantityUnit,
}) {
  return (
    <FormSection value="lot" title="Thông tin lô hàng">
      <FormGrid>
        <StackItem size="fill">
          <TextInput
            label="Tên lô hàng"
            value={values.name}
            onChange={(value) => setField('name', value)}
            isRequired
            status={fieldStatuses.name}
            statusVariant="tooltip"
          />
        </StackItem>
        <StackItem size="static">
          <Selector
            label="Loại hình"
            placeholder="LCL/FCL"
            value={values.type}
            onChange={(value) =>
              setField(
                'type',
                /** @type {import('../types/index.js').ShipmentType | ''} */ (
                  value ?? ''
                ),
              )
            }
            options={shipmentTypeOptions}
            width={140}
            isDisabled={isEditing}
            disabledMessage="Không thể đổi loại hình sau khi đã tạo"
            isRequired
            status={fieldStatuses.type}
            statusVariant="tooltip"
          />
        </StackItem>
      </FormGrid>

      <Selector
        label="Điều kiện thanh toán"
        placeholder="Chọn điều kiện thanh toán"
        value={values.paymentCondition}
        onChange={(value) =>
          setField(
            'paymentCondition',
            /** @type {import('../types/index.js').PaymentType | ''} */ (
              value ?? ''
            ),
          )
        }
        options={paymentTypeOptions}
        isRequired
        status={fieldStatuses.paymentCondition}
        statusVariant="tooltip"
        width="100%"
      />

      <HStack gap={3} vAlign="end">
        <StackItem size="fill">
          <NumberInput
            label="Giá trị invoice"
            value={values.invoiceValue}
            onChange={(value) => setField('invoiceValue', value)}
            min={0}
            step={0.01}
            units={values.invoiceCurrency || undefined}
            isRequired
            status={fieldStatuses.invoiceValue}
            statusVariant="tooltip"
          />
        </StackItem>
        <StackItem size="static">
          <Selector
            label="Đơn vị"
            value={values.invoiceCurrency}
            onChange={(value) => setField('invoiceCurrency', value ?? '')}
            options={currencyOptions}
            width={180}
            isRequired
            status={fieldStatuses.invoiceCurrency}
            statusVariant="tooltip"
          />
        </StackItem>
      </HStack>

      <HStack gap={3} vAlign="end">
        <StackItem size="fill">
          <NumberInput
            label="Giá trị tờ khai"
            value={values.declarationValue}
            onChange={(value) => setField('declarationValue', value)}
            min={0}
            step={0.01}
            units={values.declarationCurrency || undefined}
            isRequired
            status={fieldStatuses.declarationValue}
            statusVariant="tooltip"
          />
        </StackItem>
        <StackItem size="static">
          <Selector
            label="Đơn vị"
            value={values.declarationCurrency}
            onChange={(value) => setField('declarationCurrency', value ?? '')}
            options={currencyOptions}
            width={180}
            isRequired
            status={fieldStatuses.declarationCurrency}
            statusVariant="tooltip"
          />
        </StackItem>
      </HStack>

      <NumberInput
        label="Tỷ giá tờ khai"
        value={values.declarationExchangeRate}
        onChange={(value) => setField('declarationExchangeRate', value)}
        min={0}
        step={0.01}
        units="đ"
        isRequired
        status={fieldStatuses.declarationExchangeRate}
        statusVariant="tooltip"
      />

      <NumberInput
        label="Số lượng"
        value={values.quantityAmount}
        onChange={(value) => setField('quantityAmount', value)}
        min={0}
        step={1}
        units={
          derivedQuantityUnit
            ? labelForShipmentQuantityUnit(derivedQuantityUnit)
            : undefined
        }
        description={
          values.type
            ? undefined
            : 'Chọn loại hình trước để biết đơn vị (Kiện cho LCL, Cont cho FCL)'
        }
        isRequired
        status={fieldStatuses.quantityAmount}
        statusVariant="tooltip"
      />

      <NumberInput
        label="Khối lượng tờ khai"
        value={values.declarationWeightKg}
        onChange={(value) => setField('declarationWeightKg', value)}
        min={0}
        step={0.01}
        units="kg"
        isRequired
        status={fieldStatuses.declarationWeightKg}
        statusVariant="tooltip"
      />
    </FormSection>
  );
}
