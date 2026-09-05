'use client';

import { Card } from '@astryxdesign/core/Card';
import { Collapsible, CollapsibleGroup } from '@astryxdesign/core/Collapsible';
import { DateInput } from '@astryxdesign/core/DateInput';
import { HStack } from '@astryxdesign/core/HStack';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Selector } from '@astryxdesign/core/Selector';
import { StackItem } from '@astryxdesign/core/Stack';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';
import { useMemo, useState } from 'react';

import { currencyOptions } from '../config/currencies.js';
import { paymentTypeOptions } from '../config/payment-schedule-types.js';
import {
  labelForShipmentQuantityUnit,
  quantityUnitForShipmentType,
} from '../config/shipment-quantity-units.js';
import { shipmentTypeOptions } from '../config/shipment-types.js';
import { ShipmentCostLinesFields } from './shipment-cost-lines-fields.jsx';
import { ShipmentVgmSection } from './shipment-vgm-section.jsx';

// Fixed content height + its own scroll, same idiom as
// `ContractFormDialog` — per user request (2026-09-05) that this form gets
// tabs (it was one long scroll of Book info / Lot info / costs) instead of
// growing the dialog without bound.
const SHIPMENT_FIELDS_CONTENT_HEIGHT = 560;

/**
 * One collapsible section of the form — same idiom as
 * `contract-form-dialog.jsx`'s own `FormSection`.
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
 * `Shipment` field-set, split into three tabs — per user request
 * (2026-09-05) that this form (Book info + Lot info + logistics costs,
 * previously all collapsible cards on one long scroll) gets "Thông tin" /
 * "VGM" / "Chi phí Logistics" tabs over a fixed height instead.
 * "Thông tin" keeps Book info and Lot info as two collapsible cards inside
 * it, both expanded by default since every field in each is either
 * required or commonly filled in.
 * `shipmentNumber`/`shipmentCode` are backend-assigned and never editable
 * — shown read-only in the dialog header when editing (see
 * `ShipmentFormDialog`).
 *
 * "VGM" needs an existing `shipmentId` (VGM records belong to an already-
 * created Shipment) — while creating a new one, the tab explains that
 * instead of rendering `ShipmentVgmSection`. This dialog is not rendered
 * inside any `<table>` row-expansion (unlike `ShipmentExpandedDetails`), so
 * `ShipmentVgmSection` is left to own its own add/edit dialog here (no
 * `onAddVgm`/`onEditVgm` passed) — see that component's own doc comment for
 * why that split exists.
 *
 * `type` ("Loại hình") is locked once editing an existing shipment (2026-
 * 09-03 business rule, BE-kt-xnk: `Type` is immutable after creation,
 * since `ShipmentCode`'s `LCL-`/`LOT-` prefix and per-type numbering both
 * depend on it) — `isEditing` disables the Selector with an explanatory
 * message instead of just leaving it editable and having the backend
 * silently ignore the change. `quantityUnit` is no longer its own field:
 * it's derived from `type` (LCL → Kiện, FCL → Cont) and shown as the
 * quantity input's `units` suffix instead of a separate Selector.
 * @param {{
 *   values: import('../types/index.js').ShipmentFormValues,
 *   setField: <K extends keyof import('../types/index.js').ShipmentFormValues>(field: K, value: import('../types/index.js').ShipmentFormValues[K]) => void,
 *   fieldStatuses: Record<string, { type: 'error', message: string } | undefined>,
 *   customers: import('../types/index.js').Customer[],
 *   isEditing: boolean,
 *   costLineRows: ReturnType<typeof import('../hooks/use-shipment-cost-line-rows.js').useShipmentCostLineRows>,
 *   contractId: string,
 *   shipmentId: string | null,
 * }} props
 */
export function ShipmentFields({
  values,
  setField,
  fieldStatuses,
  customers,
  isEditing,
  costLineRows,
  contractId,
  shipmentId,
}) {
  const derivedQuantityUnit = quantityUnitForShipmentType(values.type);
  const [activeTab, setActiveTab] = useState('info');

  const customersById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers],
  );

  return (
    <VStack gap={3} hAlign="stretch">
      <TabList value={activeTab} onChange={setActiveTab} hasDivider>
        <Tab value="info" label="Thông tin" />
        <Tab value="vgm" label="VGM" />
        <Tab value="costs" label="Chi phí Logistics" />
      </TabList>

      <VStack
        gap={3}
        hAlign="stretch"
        height={SHIPMENT_FIELDS_CONTENT_HEIGHT}
        isScrollable
      >
        {activeTab === 'info' ? (
          <CollapsibleGroup type="multiple" defaultValue={['book', 'lot']}>
            <VStack gap={3} hAlign="stretch">
              <FormSection value="book" title="Thông tin Book">
                <Selector
                  label="Forwarder"
                  hasSearch
                  placeholder="Chọn forwarder"
                  value={values.supplierCustomerId}
                  onChange={(value) =>
                    setField('supplierCustomerId', value ?? '')
                  }
                  options={customers.map((customer) => ({
                    value: customer.id,
                    label: customer.companyName,
                  }))}
                  isRequired
                  status={fieldStatuses.supplierCustomerId}
                  statusVariant="tooltip"
                  width="100%"
                />

                <HStack gap={3}>
                  <StackItem size="fill">
                    <TextInput
                      label="Số booking"
                      value={values.bookingNumber}
                      onChange={(value) => setField('bookingNumber', value)}
                      isRequired
                      status={fieldStatuses.bookingNumber}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                  <StackItem size="fill">
                    <TextInput
                      label="Số B/L"
                      value={values.billOfLadingNumber}
                      onChange={(value) =>
                        setField('billOfLadingNumber', value)
                      }
                      isOptional
                      status={fieldStatuses.billOfLadingNumber}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                </HStack>

                <HStack gap={3}>
                  <StackItem size="fill">
                    <TextInput
                      label="Line tàu"
                      placeholder="Ví dụ: KMTC, SITC"
                      value={values.shippingLine}
                      onChange={(value) => setField('shippingLine', value)}
                      isOptional
                      status={fieldStatuses.shippingLine}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                  <StackItem size="fill">
                    <TextInput
                      label="Tên tàu"
                      placeholder="Ví dụ: KMTC JAKARTA // 2604S"
                      value={values.vesselName}
                      onChange={(value) => setField('vesselName', value)}
                      isOptional
                      status={fieldStatuses.vesselName}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                </HStack>

                <HStack gap={3}>
                  <StackItem size="fill">
                    <DateInput
                      label="ETD"
                      value={
                        /** @type {import('@astryxdesign/core/Calendar').ISODateString} */ (
                          values.etd || null
                        )
                      }
                      onChange={(value) => setField('etd', value ?? '')}
                      format="system_date"
                      isOptional
                      status={fieldStatuses.etd}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                  <StackItem size="fill">
                    <DateInput
                      label="ETA"
                      value={
                        /** @type {import('@astryxdesign/core/Calendar').ISODateString} */ (
                          values.eta || null
                        )
                      }
                      onChange={(value) => setField('eta', value ?? '')}
                      format="system_date"
                      isOptional
                      status={fieldStatuses.eta}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                </HStack>

                <HStack gap={3}>
                  <StackItem size="fill">
                    <TextInput
                      label="Cảng/nơi xếp hàng"
                      value={values.placeOfLoading}
                      onChange={(value) => setField('placeOfLoading', value)}
                      isOptional
                      status={fieldStatuses.placeOfLoading}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                  <StackItem size="fill">
                    <TextInput
                      label="Cảng/nơi đến"
                      value={values.placeOfDischarge}
                      onChange={(value) => setField('placeOfDischarge', value)}
                      isOptional
                      status={fieldStatuses.placeOfDischarge}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                </HStack>

                <Text weight="semibold">C/O (Certificate of Origin)</Text>

                <TextInput
                  label="Mã C/O"
                  placeholder="Do hải quan cấp, tự nhập"
                  value={values.coNumber}
                  onChange={(value) => setField('coNumber', value)}
                  isOptional
                  status={fieldStatuses.coNumber}
                  statusVariant="tooltip"
                />

                <HStack gap={3}>
                  <StackItem size="fill">
                    <DateInput
                      label="Ngày khai C/O"
                      value={
                        /** @type {import('@astryxdesign/core/Calendar').ISODateString} */ (
                          values.coDeclarationDate || null
                        )
                      }
                      onChange={(value) =>
                        setField('coDeclarationDate', value ?? '')
                      }
                      format="system_date"
                      isOptional
                      status={fieldStatuses.coDeclarationDate}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                  <StackItem size="fill">
                    <DateInput
                      label="Ngày có C/O"
                      value={
                        /** @type {import('@astryxdesign/core/Calendar').ISODateString} */ (
                          values.coIssuedDate || null
                        )
                      }
                      onChange={(value) =>
                        setField('coIssuedDate', value ?? '')
                      }
                      format="system_date"
                      isOptional
                      status={fieldStatuses.coIssuedDate}
                      statusVariant="tooltip"
                    />
                  </StackItem>
                </HStack>
              </FormSection>

              <FormSection value="lot" title="Thông tin lô hàng">
                <HStack gap={3}>
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
                </HStack>

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
                      onChange={(value) =>
                        setField('invoiceCurrency', value ?? '')
                      }
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
                      onChange={(value) =>
                        setField('declarationCurrency', value ?? '')
                      }
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
                  onChange={(value) =>
                    setField('declarationExchangeRate', value)
                  }
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
            </VStack>
          </CollapsibleGroup>
        ) : null}

        {activeTab === 'vgm' ? (
          shipmentId ? (
            <ShipmentVgmSection
              contractId={contractId}
              shipmentId={shipmentId}
              customersById={customersById}
            />
          ) : (
            <Text color="secondary">Lưu shipment trước khi thêm VGM.</Text>
          )
        ) : null}

        {activeTab === 'costs' ? (
          // `Text` heading first, same as `ShipmentVgmSection`'s own "VGM"
          // heading above its table: `Table` ships a baked-in -24px
          // margin-top on its scroll wrapper (meant to pull the header row
          // up flush against whatever sits right above it), and with
          // nothing above to absorb that here, the tab's scrollable
          // container clipped almost the entire header row off — a bug
          // report (2026-09-05) that looked like a width problem but
          // wasn't. Any element ≥24px tall directly above the table fixes
          // it; a heading also matches every other tab's pattern.
          <VStack gap={2} hAlign="stretch">
            <Text weight="semibold">Chi phí Logistics</Text>
            <ShipmentCostLinesFields
              rows={costLineRows.rows}
              customers={customers}
              onAddRow={costLineRows.addRow}
              onRemoveRow={costLineRows.removeRow}
              onUpdateRowField={costLineRows.updateRowField}
            />
          </VStack>
        ) : null}
      </VStack>
    </VStack>
  );
}
