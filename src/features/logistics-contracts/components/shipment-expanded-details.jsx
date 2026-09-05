'use client';

import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { MetadataList } from '@astryxdesign/core/MetadataList';
import { pixel, proportional, Table } from '@astryxdesign/core/Table';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

import {
  expandableRowStyles,
  UnderlinedMetadataListItem as MetadataListItem,
} from '@/shared/components/expandable-row-styles.jsx';

import { formatMoney } from '../config/currencies.js';
import { labelForPaymentType } from '../config/payment-schedule-types.js';
import { labelForShipmentQuantityUnit } from '../config/shipment-quantity-units.js';
import { labelForShipmentType } from '../config/shipment-types.js';
import { ShipmentVgmSection } from './shipment-vgm-section.jsx';

// Fixed content height + its own scroll, same idiom as
// `ContractFormDialog`/`ShipmentVgmFormDialog` — per user request
// (2026-09-05) that this panel gets tabs (it was one long scroll of
// "Thông tin lô hàng" / "Thông tin Book" / VGM / costs stacked together) and
// keeps a stable, bounded height like the contract dialog instead of
// growing without limit.
const EXPANDED_DETAILS_CONTENT_HEIGHT = 480;

/** @param {string | number | null | undefined} value */
function orDash(value) {
  return value == null || value === '' ? '—' : value;
}

/**
 * Expanded row for one Shipment, nested inside the Contract's own
 * "Shipment" tab table (`contracts-list.jsx`) — Book info + Lot info, its
 * VGM records, and its logistics cost lines, split into three tabs
 * ("Thông tin" / "VGM" / "Chi phí Logistics") over a fixed, scrollable
 * height, per user request (2026-09-05): the panel used to stack all of
 * that content in one long scroll, which made it hard to find any one
 * section.
 *
 * VGM's table + add/edit/delete affordances live in `ShipmentVgmSection`,
 * shared with `ShipmentFormDialog`'s own "VGM" tab. `onAddVgm`/`onEditVgm`
 * are forwarded down into it unchanged: this panel still renders inside a
 * `<table>` row-expansion, so the add/edit dialog itself must stay owned by
 * `ContractsList` outside that DOM tree (see the "Selector popover
 * stacking" note on `ContractsList`) — only the *list* of VGMs (no
 * `Selector` field) lives in this panel.
 *
 * `onEdit` is optional: `contracts-list.jsx`'s own "Shipment" tab already
 * has its own row-level edit icon (a plain `<Table>`, not wrapped by
 * `AdvanceTable`'s column-settings machinery, so an always-on action
 * column works there) and doesn't pass it. `shipments-list.jsx` (the
 * standalone `/logistics/shipments` page) does pass it — `AdvanceTable`
 * drops any `tableColumns` key not also declared in `columnOptions`, so a
 * persistent per-row action column isn't an option there, and this footer
 * button is the edit entry point instead, same spot `ContractExpandedDetails`
 * puts "Sửa hợp đồng".
 * `costCategoriesById` resolves `ShipmentCostLine.costCategoryId` → name for
 * the "Chi phí Logistics" tab below; `ProviderCustomerId` reuses the
 * already-threaded `customersById` instead of a new prop.
 * @param {{
 *   contractId: string,
 *   shipment: import('../types/index.js').Shipment,
 *   supplierName: string,
 *   customersById: Map<string, import('../types/index.js').Customer>,
 *   costCategoriesById: Map<string, import('../types/index.js').ShipmentCostCategory>,
 *   onAddVgm: () => void,
 *   onEditVgm: (vgm: import('../types/index.js').ShipmentVgm) => void,
 *   onEdit?: () => void,
 * }} props
 */
export function ShipmentExpandedDetails({
  contractId,
  shipment,
  supplierName,
  customersById,
  costCategoriesById,
  onAddVgm,
  onEditVgm,
  onEdit,
}) {
  const [activeTab, setActiveTab] = useState('info');

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').ShipmentCostLine & Record<string, unknown>>[]} */
  const costColumns = [
    {
      key: 'costCategoryId',
      header: 'Nhóm chi phí',
      width: pixel(320),
      renderCell: (cost) =>
        orDash(costCategoriesById.get(cost.costCategoryId)?.name),
    },
    {
      key: 'name',
      header: 'Tên khoản chi phí',
      width: proportional(1, { minWidth: 160 }),
      renderCell: (cost) => cost.name,
    },
    {
      key: 'amount',
      header: 'Số tiền',
      width: pixel(160),
      renderCell: (cost) => `${formatMoney(cost.amount)} đ`,
    },
    {
      key: 'note',
      header: 'Ghi chú',
      width: proportional(1),
      renderCell: (cost) => orDash(cost.note),
    },
    {
      key: 'providerCustomerId',
      header: 'Nhà cung cấp',
      width: proportional(1, { minWidth: 160 }),
      renderCell: (cost) =>
        orDash(
          cost.providerCustomerId
            ? customersById.get(cost.providerCustomerId)?.companyName
            : null,
        ),
    },
  ];

  return (
    <VStack gap={3} hAlign="stretch" xstyle={expandableRowStyles.expandedPanel}>
      <TabList value={activeTab} onChange={setActiveTab} hasDivider>
        <Tab value="info" label="Thông tin" />
        <Tab value="vgm" label="VGM" />
        <Tab value="costs" label="Chi phí Logistics" />
      </TabList>

      <VStack
        gap={4}
        hAlign="stretch"
        height={EXPANDED_DETAILS_CONTENT_HEIGHT}
        isScrollable
      >
        {activeTab === 'info' ? (
          <>
            <MetadataList
              title={<Text weight="bold">Thông tin lô hàng</Text>}
              columns={4}
              label={{ position: 'top' }}
            >
              <MetadataListItem label="Tên lô hàng">
                {shipment.name}
              </MetadataListItem>
              <MetadataListItem label="Loại hình">
                {labelForShipmentType(shipment.type)}
              </MetadataListItem>
              <MetadataListItem label="Điều kiện thanh toán">
                {labelForPaymentType(shipment.paymentCondition)}
              </MetadataListItem>
              <MetadataListItem label="Số lượng">
                {shipment.quantityAmount}{' '}
                {labelForShipmentQuantityUnit(shipment.quantityUnit)}
              </MetadataListItem>
              <MetadataListItem label="Giá trị invoice">
                {formatMoney(shipment.invoiceValue, shipment.invoiceCurrency)}
              </MetadataListItem>
              <MetadataListItem label="Giá trị tờ khai">
                {formatMoney(
                  shipment.declarationValue,
                  shipment.declarationCurrency,
                )}
              </MetadataListItem>
              <MetadataListItem label="Tỷ giá tờ khai">
                {shipment.declarationExchangeRate}
              </MetadataListItem>
              <MetadataListItem label="Khối lượng tờ khai">
                {shipment.declarationWeightKg} kg
              </MetadataListItem>
            </MetadataList>

            <MetadataList
              title={<Text weight="bold">Thông tin Book</Text>}
              columns={4}
              label={{ position: 'top' }}
            >
              <MetadataListItem label="Forwarder">
                {orDash(supplierName)}
              </MetadataListItem>
              <MetadataListItem label="Số booking">
                {shipment.bookingNumber}
              </MetadataListItem>
              <MetadataListItem label="Số B/L">
                {orDash(shipment.billOfLadingNumber)}
              </MetadataListItem>
              <MetadataListItem label="Line tàu">
                {orDash(shipment.shippingLine)}
              </MetadataListItem>
              <MetadataListItem label="Tên tàu">
                {orDash(shipment.vesselName)}
              </MetadataListItem>
              <MetadataListItem label="ETD">
                {orDash(shipment.etd)}
              </MetadataListItem>
              <MetadataListItem label="ETA">
                {orDash(shipment.eta)}
              </MetadataListItem>
              <MetadataListItem label="Cảng/nơi xếp hàng">
                {orDash(shipment.placeOfLoading)}
              </MetadataListItem>
              <MetadataListItem label="Cảng/nơi đến">
                {orDash(shipment.placeOfDischarge)}
              </MetadataListItem>
              <MetadataListItem label="Mã C/O">
                {orDash(shipment.coNumber)}
              </MetadataListItem>
              <MetadataListItem label="Ngày khai C/O">
                {orDash(shipment.coDeclarationDate)}
              </MetadataListItem>
              <MetadataListItem label="Ngày có C/O">
                {orDash(shipment.coIssuedDate)}
              </MetadataListItem>
            </MetadataList>
          </>
        ) : null}

        {activeTab === 'vgm' ? (
          <ShipmentVgmSection
            contractId={contractId}
            shipmentId={shipment.id}
            customersById={customersById}
            onAddVgm={onAddVgm}
            onEditVgm={onEditVgm}
          />
        ) : null}

        {activeTab === 'costs' ? (
          <VStack gap={2} hAlign="stretch">
            <Text weight="semibold">Thông tin chi phí logistics</Text>

            {shipment.costs.length === 0 ? (
              <Text color="secondary">Chưa có khoản chi phí nào</Text>
            ) : (
              <>
                <Table
                  columns={costColumns}
                  data={shipment.costs}
                  idKey="id"
                  dividers="rows"
                  density="compact"
                />
                {shipment.costTotalsByCategory.length > 0 ? (
                  <MetadataList
                    title={
                      <Text weight="semibold">Tổng theo nhóm chi phí</Text>
                    }
                    columns={4}
                    label={{ position: 'top' }}
                  >
                    {shipment.costTotalsByCategory.map((total) => (
                      <MetadataListItem
                        key={total.costCategoryId}
                        label={total.costCategoryName}
                      >
                        {formatMoney(total.totalAmount)} đ
                      </MetadataListItem>
                    ))}
                  </MetadataList>
                ) : null}
              </>
            )}
          </VStack>
        ) : null}
      </VStack>

      {onEdit ? (
        <>
          <Divider />
          <HStack hAlign="end">
            <Button
              label="Sửa Shipment"
              variant="secondary"
              size="sm"
              icon={<Icon icon={Pencil} />}
              onClick={onEdit}
            />
          </HStack>
        </>
      ) : null}
    </VStack>
  );
}
