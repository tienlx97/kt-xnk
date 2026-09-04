'use client';

import { AlertDialog } from '@astryxdesign/core/AlertDialog';
import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { MetadataList } from '@astryxdesign/core/MetadataList';
import {
  pixel,
  proportional,
  Table,
  useTableStickyColumns,
} from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
  expandableRowStyles,
  UnderlinedMetadataListItem as MetadataListItem,
} from '@/shared/components/expandable-row-styles.jsx';

import { formatMoney } from '../config/currencies.js';
import { labelForPaymentType } from '../config/payment-schedule-types.js';
import { labelForShipmentContainerType } from '../config/shipment-container-types.js';
import { labelForShipmentQuantityUnit } from '../config/shipment-quantity-units.js';
import { labelForShipmentType } from '../config/shipment-types.js';
import {
  useDeleteShipmentVgmMutation,
  useShipmentVgmsQuery,
} from '../hooks/use-shipment-vgms-query.js';

/** @param {string | number | null | undefined} value */
function orDash(value) {
  return value == null || value === '' ? '—' : value;
}

/**
 * Expanded row for one Shipment, nested inside the Contract's own
 * "Shipment" tab table (`contracts-list.jsx`) — Book info + Lot info,
 * plus its VGM records as an inline table. Add/edit VGM stays a small
 * dialog (that's a normal spot for a form); the *list* of VGMs used to
 * live in its own `ShipmentVgmListDialog` (a 3rd level of nested modal —
 * Contract → Shipment → VGM), now folded directly into this expanded
 * row instead, per user request (2026-09-03) to make VGM a table people
 * see without an extra click.
 *
 * The add/edit VGM dialog itself is NOT rendered here — `onAddVgm`/
 * `onEditVgm` forward the request up to `ContractsList`, which renders it
 * outside this table's DOM tree (see the "Selector popover stacking" note
 * on `ContractsList`). The delete confirmation stays local: `AlertDialog`
 * has no `Selector` field, so it isn't affected by that bug.
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
 * @param {{
 *   contractId: string,
 *   shipment: import('../types/index.js').Shipment,
 *   supplierName: string,
 *   customersById: Map<string, import('../types/index.js').Customer>,
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
  onAddVgm,
  onEditVgm,
  onEdit,
}) {
  const [deletingVgm, setDeletingVgm] = useState(
    /** @type {import('../types/index.js').ShipmentVgm | null} */ (null),
  );

  const vgmsQuery = useShipmentVgmsQuery(contractId, shipment.id);
  const vgms = vgmsQuery.data?.success ? vgmsQuery.data.vgms : [];

  const deleteMutation = useDeleteShipmentVgmMutation(contractId, shipment.id);

  async function handleConfirmDelete() {
    if (!deletingVgm) return;
    await deleteMutation.mutateAsync(deletingVgm.id);
    setDeletingVgm(null);
  }

  /**
   * Column order per user request (2026-09-03): carrier and date lead
   * (most identifying facts), then container identity, then the weight
   * figures ending in the two computed values. Widths use `proportional()`
   * ("smart" flex distribution that shares the table's actual width,
   * instead of a fixed `pixel()` per column) and every column is
   * left-aligned (the default — no `align: 'end'` on the weight columns
   * any more), both per user request (2026-09-03 follow-up).
   *
   * `proportional()`'s default 120px floor (`DEFAULT_MIN_COLUMN_WIDTH`) is
   * too narrow for this table's longer headers — at a small viewport the
   * columns shrink to that floor and truncate ("Ngày đóng h...", "Gross
   * weight..."), per a follow-up bug report (2026-09-03). Explicit
   * `minWidth` per column, sized to what its own header actually needs,
   * fixes it: below that width the table now scrolls horizontally (Astryx
   * grows `tableMinWidth` to fit every column's floor) instead of
   * squeezing header text into an ellipsis.
   * @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').ShipmentVgm & Record<string, unknown>>[]}
   */
  const vgmColumns = [
    {
      key: 'carrierCustomerId',
      header: 'Nhà vận chuyển',
      width: proportional(1, { minWidth: 160 }),
      renderCell: (vgm) =>
        orDash(customersById.get(vgm.carrierCustomerId)?.companyName),
    },
    {
      key: 'packingDate',
      header: 'Ngày đóng hàng',
      width: pixel(150),
      renderCell: (vgm) => vgm.packingDate,
    },
    {
      key: 'containerType',
      header: 'Loại cont',
      width: pixel(90),
      renderCell: (vgm) => labelForShipmentContainerType(vgm.containerType),
    },
    {
      key: 'containerNumber',
      header: 'Tên cont',
      width: proportional(1),
      renderCell: (vgm) => vgm.containerNumber,
    },
    {
      key: 'sealNumber',
      header: 'Tên seal',
      width: proportional(1),
      renderCell: (vgm) => vgm.sealNumber,
    },
    {
      key: 'maxGross',
      header: 'Max gross (kg)',
      width: proportional(1, { minWidth: 150 }),
      renderCell: (vgm) => vgm.maxGross.toFixed(2),
    },
    {
      key: 'tare',
      header: 'Tare (kg)',
      width: pixel(110),
      renderCell: (vgm) => vgm.tare.toFixed(2),
    },
    {
      key: 'grossWeight',
      header: 'G.W (kg)',
      width: proportional(1, { minWidth: 170 }),
      renderCell: (vgm) => vgm.grossWeight.toFixed(2),
    },
    {
      key: 'vgm',
      header: 'VGM (kg)',
      width: proportional(1),
      renderCell: (vgm) => vgm.vgm.toFixed(2),
    },
    {
      key: 'actions',
      header: '',
      width: pixel(90),
      renderCell: (vgm) => (
        <HStack gap={1} vAlign="center" hAlign="end">
          <IconButton
            label={`Sửa ${vgm.containerNumber}`}
            tooltip="Sửa VGM"
            icon={<Icon icon={Pencil} size="sm" />}
            variant="ghost"
            size="sm"
            onClick={() => onEditVgm(vgm)}
          />
          <IconButton
            label={`Xoá ${vgm.containerNumber}`}
            tooltip="Xoá VGM"
            icon={<Icon icon={Trash2} size="sm" />}
            variant="ghost"
            size="sm"
            onClick={() => setDeletingVgm(vgm)}
          />
        </HStack>
      ),
    },
  ];

  // Pinned to the end edge so "Sửa"/"Xoá" stay reachable while scrolling
  // horizontally — per user request (2026-09-03 follow-up to the header-
  // truncation fix, which is what made this table scroll horizontally at
  // narrow widths in the first place).
  const vgmStickyColumns =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').ShipmentVgm & Record<string, unknown>>} */ (
      useTableStickyColumns({ endKeys: ['actions'] })
    );

  return (
    <VStack gap={4} hAlign="stretch" xstyle={expandableRowStyles.expandedPanel}>
      <MetadataList
        title={<Text weight="bold">Thông tin lô hàng</Text>}
        columns={4}
        label={{ position: 'top' }}
      >
        <MetadataListItem label="Tên lô hàng">{shipment.name}</MetadataListItem>
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
          {formatMoney(shipment.declarationValue, shipment.declarationCurrency)}
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
      </MetadataList>

      <HStack hAlign="between" vAlign="center">
        <Text weight="semibold">VGM</Text>
        <Button
          label="Thêm VGM"
          variant="secondary"
          size="sm"
          icon={<Icon icon={Plus} />}
          onClick={onAddVgm}
        />
      </HStack>

      {vgms.length === 0 ? (
        <Text color="secondary">Chưa có bản ghi VGM</Text>
      ) : (
        <Table
          columns={vgmColumns}
          data={vgms}
          idKey="id"
          dividers="rows"
          density="compact"
          plugins={{ stickyColumns: vgmStickyColumns }}
        />
      )}

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

      <AlertDialog
        isOpen={deletingVgm !== null}
        onOpenChange={(nextIsOpen) => {
          if (!nextIsOpen) setDeletingVgm(null);
        }}
        title={`Xoá VGM ${deletingVgm?.containerNumber ?? ''}?`}
        description="Hành động này không thể hoàn tác."
        actionLabel="Xoá"
        onAction={handleConfirmDelete}
      />
    </VStack>
  );
}
