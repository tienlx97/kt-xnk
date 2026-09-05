'use client';

import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { List, ListItem } from '@astryxdesign/core/List';
import {
  MetadataList,
  MetadataListItem as RawMetadataListItem,
} from '@astryxdesign/core/MetadataList';
import {
  pixel,
  proportional,
  Table,
  useTableRowExpansion,
} from '@astryxdesign/core/Table';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { VStack } from '@astryxdesign/core/VStack';
import * as stylex from '@stylexjs/stylex';
import {
  FileText,
  Maximize2,
  Minimize2,
  Pencil,
  Plus,
  Printer,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  AdvanceTable,
  AdvanceTableErrorBanner,
} from '@/shared/components/advance-table.jsx';
import {
  createRowExpansionInteractionPlugin,
  expandableRowStyles,
  UnderlinedMetadataListItem as MetadataListItem,
} from '@/shared/components/expandable-row-styles.jsx';
import { useFullscreenToggle } from '@/shared/components/fullscreen-panel.jsx';

import { labelForCommissionAnnexType } from '../config/commission-annex-types.js';
import { labelForContractAnnexType } from '../config/contract-annex-types.js';
import { currencyOptions, formatMoney } from '../config/currencies.js';
import { incotermOptions } from '../config/incoterms.js';
import { labelForPaymentType } from '../config/payment-schedule-types.js';
import { labelForShipmentQuantityUnit } from '../config/shipment-quantity-units.js';
import { labelForShipmentType } from '../config/shipment-types.js';
import { useCommissionAnnexesQuery } from '../hooks/use-commission-annexes-query.js';
import { useCommissionQuery } from '../hooks/use-commission-query.js';
import { useContractAnnexesQuery } from '../hooks/use-contract-annexes-query.js';
import { useContractBanksQuery } from '../hooks/use-contract-banks-query.js';
import { useContractsQuery } from '../hooks/use-contracts-query.js';
import { useCountriesQuery } from '../hooks/use-countries-query.js';
import { useCustomersQuery } from '../hooks/use-customers-query.js';
import { usePaymentSchedulesQuery } from '../hooks/use-payment-schedules-query.js';
import { useShipmentCostCategoriesQuery } from '../hooks/use-shipment-cost-categories-query.js';
import { useShipmentsQuery } from '../hooks/use-shipments-query.js';
import { CommissionAnnexFormDialog } from './commission-annex-form-dialog.jsx';
import { CommissionFormDialog } from './commission-form-dialog.jsx';
import { CommissionPaymentQuickAddDialog } from './commission-payment-quick-add-dialog.jsx';
import { ContractAnnexFormDialog } from './contract-annex-form-dialog.jsx';
import { ContractFormDialog } from './contract-form-dialog.jsx';
import { PaymentScheduleFormDialog } from './payment-schedule-form-dialog.jsx';
import { ShipmentExpandedDetails } from './shipment-expanded-details.jsx';
import { ShipmentFormDialog } from './shipment-form-dialog.jsx';
import { ShipmentVgmFormDialog } from './shipment-vgm-form-dialog.jsx';

/** @satisfies {ReadonlyArray<import('@astryxdesign/core/PowerSearch').FieldDefinition>} */
const SEARCH_FIELD_DEFS = [
  { key: 'contractNumber', type: 'string', label: 'Số hợp đồng' },
  { key: 'projectName', type: 'string', label: 'Dự án' },
  { key: 'buyerCompanyName', type: 'string', label: 'Khách hàng' },
  { key: 'contractValue', type: 'number', label: 'Giá trị' },
  {
    key: 'currency',
    type: 'enum',
    label: 'Đơn vị tiền tệ',
    enumValues: currencyOptions,
  },
  {
    key: 'incoterm',
    type: 'enum',
    label: 'Incoterm',
    enumValues: incotermOptions,
  },
];

// The static, single-value-per-field advanced search this list used to have
// (one text input per field, ANDed together) is replaced by the
// `AdvancedFilterBuilder` condition builder below (`FILTER_FIELD_DEFS`) —
// same funnel-icon entry point in `AdvanceTable`'s toolbar, now server-side
// and per-field-typed (operators, Và/Hoặc chaining) instead of a fixed form.
// `countryName`/`bankNames` (client-joined display fields with no matching
// backend filter field yet) aren't carried over — see
// `openspec/changes/add-advanced-filtering/proposal.md`'s "Out of scope".

/** @satisfies {ReadonlyArray<import('@/shared/components/advanced-filter-builder.jsx').AdvancedFilterFieldDef>} */
const FILTER_FIELD_DEFS = [
  { key: 'contractNumber', label: 'Số hợp đồng', type: 'string' },
  { key: 'projectName', label: 'Dự án', type: 'string' },
  { key: 'buyerCompanyName', label: 'Khách hàng', type: 'string' },
  { key: 'sellerCompanyName', label: 'Người bán', type: 'string' },
  { key: 'contractValue', label: 'Giá trị', type: 'number' },
  { key: 'currency', label: 'Đơn vị tiền tệ', type: 'enum', options: currencyOptions },
  { key: 'incoterm', label: 'Incoterm', type: 'enum', options: incotermOptions },
  { key: 'incotermYear', label: 'Năm Incoterm', type: 'number' },
  { key: 'createdDate', label: 'Ngày tạo', type: 'date' },
  { key: 'quotationDate', label: 'Ngày báo giá', type: 'date' },
  { key: 'category', label: 'Hạng mục', type: 'string' },
  { key: 'placeOfLoading', label: 'Nơi xếp hàng', type: 'string' },
  { key: 'placeOfDischarge', label: 'Nơi dỡ hàng', type: 'string' },
  { key: 'note', label: 'Ghi chú', type: 'string' },
];

const COLUMN_OPTIONS = [
  { key: 'contractNumber', label: 'Số hợp đồng', isAlwaysVisible: true },
  { key: 'projectName', label: 'Dự án' },
  { key: 'buyer', label: 'Khách hàng' },
  { key: 'contractValue', label: 'Giá trị' },
  { key: 'incoterm', label: 'Incoterm' },
  { key: 'createdDate', label: 'Ngày tạo' },
  { key: 'quotationDate', label: 'Ngày báo giá' },
  { key: 'category', label: 'Hạng mục' },
  { key: 'countryName', label: 'Nước xuất khẩu' },
  { key: 'placeOfLoading', label: 'Nơi xếp hàng' },
  { key: 'placeOfDischarge', label: 'Nơi dỡ hàng' },
  { key: 'note', label: 'Ghi chú' },
  { key: 'paymentTerms', label: 'Đợt thanh toán' },
  { key: 'bankIds', label: 'Ngân hàng thụ hưởng' },
];
// The picker opens on this set rather than every column at once — the API
// carries more fields than a first glance needs, and starting from the
// pre-existing default keeps today's screen unchanged for anyone who
// already has it open.
const DEFAULT_COLUMN_KEYS = [
  'contractNumber',
  'projectName',
  'buyer',
  'contractValue',
  'incoterm',
  'createdDate',
];

/** @param {string | null | undefined} value */
function orDash(value) {
  return value == null || value === '' ? '—' : value;
}

/** @param {import('../types/index.js').PaymentTerm[]} terms */
function formatPaymentTerms(terms) {
  if (terms.length === 0) {
    return '—';
  }
  if (terms.length === 1) {
    return `${terms[0].paymentRatioPercent}% ${terms[0].paymentCondition}`;
  }
  return `${terms.length} đợt`;
}

/**
 * A blank grid cell — `MetadataListItem` has no first-class "empty slot"
 * (`label`/`children` are both meant to be filled in), so this fakes one
 * purely to pad a row out to a multiple of `columns`. Keeps the expanded
 * panel's info grid a *single* `columns={4}` `MetadataList` — so every
 * row's 4 columns are the same width and line up with each other — while
 * still visually grouping fields onto their own row even when a row has
 * fewer than 4 fields (see `commissions-list.jsx`'s identical
 * technique). Uses the raw (unwrapped) `MetadataListItem` so the spacer
 * doesn't pick up the field underline every real item gets — an empty
 * underlined box would read as a broken field, not blank padding.
 * @param {string} key
 */
function metadataSpacer(key) {
  return (
    <RawMetadataListItem key={key} label="">
      {''}
    </RawMetadataListItem>
  );
}

/**
 * Signed amount label for one contract-annex row — `ValueChange` never
 * represents an amount change, so it gets no sign (same sign convention as
 * `commissions-list.jsx`'s `annexAmountLabel`).
 * @param {import('../types/index.js').ContractAnnex} annex
 * @param {string} currency
 */
function contractAnnexAmountLabel(annex, currency) {
  const formatted = formatMoney(annex.amount, currency);
  if (annex.type === 'AmountIncrease') return `+ ${formatted}`;
  if (annex.type === 'AmountDecrease') return `− ${formatted}`;
  return formatted;
}

/**
 * Signed amount label for one Commission annex row — same
 * convention as `contractAnnexAmountLabel`/`commissions-list.jsx`'s
 * `annexAmountLabel`: `InfoChange` never represents a value change, so it
 * gets no sign.
 * @param {import('../types/index.js').CommissionAnnex} annex
 * @param {string} currency
 */
function commissionAnnexAmountLabel(annex, currency) {
  const formatted = formatMoney(annex.amount, currency);
  if (annex.type === 'AmountIncrease') return `+ ${formatted}`;
  if (annex.type === 'AmountDecrease') return `− ${formatted}`;
  return formatted;
}

const styles = stylex.create({
  projectNameHeading: {
    textTransform: 'uppercase',
  },
});

const SKELETON_ROW_COUNT = 6;
const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = ['10', '25', '50', '100'];

// Caps each tab's content in the expanded row to its own scroll area (same
// idiom as `ContractFormDialog`'s fixed-height inner `VStack`) so the
// action bar below it (Sửa hợp đồng/Xoá/...) stays put right under the
// tabs instead of sliding to the bottom of whatever the longest tab's
// content happens to be — per user report (2026-09-04): the "Thông tin"
// tab in particular is long enough that reaching those buttons meant a
// lot of scrolling.
const EXPANDED_TAB_CONTENT_HEIGHT = 520;

/** @type {import('../types/index.js').Contract[]} */
const skeletonRows = Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => ({
  id: `skeleton-${index}`,
  contractNumber: '',
  createdDate: '',
  quotationDate: '',
  projectName: '',
  category: '',
  countryId: '',
  placeOfLoading: '',
  placeOfDischarge: '',
  contractValue: 0,
  currency: '',
  incoterm: 'EXW',
  incotermYear: 0,
  companyId: '',
  seller: {
    companyName: '',
    representativeName: null,
    representativeTitle: null,
    address: null,
    sourceSellerId: null,
    extraFields: [],
  },
  buyer: {
    companyName: '',
    representativeName: null,
    representativeTitle: null,
    address: null,
    sourceCustomerId: null,
    extraFields: [],
  },
  notifyParty: null,
  consignee: null,
  note: null,
  paymentTerms: [],
  bankIds: [],
  sellerSigned: false,
  buyerSigned: false,
}));

/** @typedef {'info' | 'paymentSchedule' | 'shipment' | 'commission'} ExpandedTab */

/**
 * All dialogs opened from within this component's own tabs (Shipment,
 * Payment Schedule, Annex, Commission, VGM) are deliberately owned
 * and rendered by `ContractsList`, not here — see the "Selector popover
 * stacking" note above `ContractsList` for why. This component only
 * forwards trigger callbacks (`onAddShipment`, `onEditShipment`, ...) up to
 * whichever entity the click was about; it never opens a `*FormDialog`
 * itself.
 * @param {object} props
 * @param {import('../types/index.js').Contract} props.contract
 * @param {(contract: import('../types/index.js').Contract) => void} props.onEdit
 * @param {Map<string, import('../types/index.js').ContractBank>} props.banksById
 * @param {Map<string, import('../types/index.js').Country>} props.countriesById
 * @param {Map<string, import('../types/index.js').Customer>} props.customersById
 * @param {Map<string, import('../types/index.js').ShipmentCostCategory>} props.costCategoriesById
 * @param {ExpandedTab} props.activeTab
 * @param {(tab: ExpandedTab) => void} props.onActiveTabChange
 * @param {() => void} props.onAddAnnex
 * @param {(annex: import('../types/index.js').ContractAnnex) => void} props.onEditAnnex
 * @param {() => void} props.onAddPaymentSchedule
 * @param {(schedule: import('../types/index.js').PaymentSchedule) => void} props.onEditPaymentSchedule
 * @param {() => void} props.onAddShipment
 * @param {(shipment: import('../types/index.js').Shipment) => void} props.onEditShipment
 * @param {(payload: { contractId: string, shipmentId: string }) => void} props.onAddVgm
 * @param {(payload: { contractId: string, shipmentId: string, vgm: import('../types/index.js').ShipmentVgm }) => void} props.onEditVgm
 * @param {(payload: { contractId: string, currency: string, commission: import('../types/index.js').Commission | null }) => void} props.onOpenCommission
 * @param {() => void} props.onAddCommissionAnnex
 * @param {(annex: import('../types/index.js').CommissionAnnex) => void} props.onEditCommissionAnnex
 * @param {(commission: import('../types/index.js').Commission) => void} props.onAddCommissionPayment
 */
function ContractExpandedDetails({
  contract,
  onEdit,
  banksById,
  countriesById,
  customersById,
  costCategoriesById,
  activeTab,
  onActiveTabChange,
  onAddAnnex,
  onEditAnnex,
  onAddPaymentSchedule,
  onEditPaymentSchedule,
  onAddShipment,
  onEditShipment,
  onAddVgm,
  onEditVgm,
  onOpenCommission,
  onAddCommissionAnnex,
  onEditCommissionAnnex,
  onAddCommissionPayment,
}) {
  const [expandedShipmentId, setExpandedShipmentId] = useState(
    /** @type {string | null} */ (null),
  );

  const annexesQuery = useContractAnnexesQuery(contract.id);
  const annexes = annexesQuery.data?.success ? annexesQuery.data.annexes : [];

  // "Tổng cộng" = the contract's own `contractValue` plus every annex's
  // `amount`, signed by its `type` — same rollup as the Commission
  // tab's `commissionGrandTotal` below.
  const contractAnnexesTotal = annexes.reduce((total, annex) => {
    if (annex.type === 'AmountIncrease') return total + annex.amount;
    if (annex.type === 'AmountDecrease') return total - annex.amount;
    return total;
  }, 0);
  const contractGrandTotal = contract.contractValue + contractAnnexesTotal;

  const isFullySigned = contract.sellerSigned && contract.buyerSigned;
  const paymentSchedulesQuery = usePaymentSchedulesQuery(contract.id);
  const paymentSchedules = paymentSchedulesQuery.data?.success
    ? paymentSchedulesQuery.data.schedules
    : [];

  const shipmentsQuery = useShipmentsQuery(contract.id);
  const shipments = shipmentsQuery.data?.success
    ? shipmentsQuery.data.shipments
    : [];

  const paymentTermRows = contract.paymentTerms.map((term, index) => ({
    ...term,
    orderLabel: `Đợt ${index + 1}`,
  }));

  /** @type {import('@astryxdesign/core/Table').TableColumn<(typeof paymentTermRows)[number]>[]} */
  const paymentTermColumns = [
    {
      key: 'orderLabel',
      header: 'Đợt',
      width: pixel(80),
      renderCell: (term) => term.orderLabel,
    },
    {
      key: 'paymentRatioPercent',
      header: 'Tỷ lệ',
      width: pixel(100),
      align: 'end',
      renderCell: (term) => `${term.paymentRatioPercent}%`,
    },
    {
      key: 'paymentCondition',
      header: 'Điều kiện thanh toán',
      width: proportional(1),
      renderCell: (term) => orDash(term.paymentCondition),
    },
  ];

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').ContractAnnex & Record<string, unknown>>[]} */
  const annexColumns = [
    {
      key: 'annexCode',
      header: 'Mã phụ lục',
      width: proportional(1.2),
      renderCell: (annex) =>
        `${annex.annexCode} · ${labelForContractAnnexType(annex.type)}`,
    },
    {
      key: 'signedDate',
      header: 'Ngày ký',
      width: pixel(120),
      renderCell: (annex) => annex.signedDate,
    },
    {
      key: 'buyerSigned',
      header: 'Mua ký',
      width: pixel(90),
      renderCell: (annex) => (annex.buyerSigned ? 'Đã ký' : 'Chưa ký'),
    },
    {
      key: 'sellerSigned',
      header: 'Bán ký',
      width: pixel(90),
      renderCell: (annex) => (annex.sellerSigned ? 'Đã ký' : 'Chưa ký'),
    },
    {
      key: 'amount',
      header: 'Số tiền',
      width: pixel(140),
      align: 'end',
      renderCell: (annex) => contractAnnexAmountLabel(annex, contract.currency),
    },
    {
      key: 'actions',
      header: '',
      width: pixel(60),
      renderCell: (annex) => (
        <IconButton
          label={`Sửa ${annex.annexCode}`}
          tooltip="Sửa phụ lục"
          icon={<Icon icon={Pencil} size="sm" />}
          variant="ghost"
          size="sm"
          onClick={() => onEditAnnex(annex)}
        />
      ),
    },
  ];

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').PaymentSchedule & Record<string, unknown>>[]} */
  const paymentScheduleColumns = [
    {
      key: 'paymentCode',
      header: 'Mã',
      width: proportional(1),
      renderCell: (schedule) =>
        `${schedule.paymentCode} · ${labelForPaymentType(schedule.type)}`,
    },
    {
      key: 'paymentDate',
      header: 'Ngày',
      width: pixel(120),
      renderCell: (schedule) => schedule.paymentDate,
    },
    {
      key: 'note',
      header: 'Ghi chú',
      width: proportional(1),
      renderCell: (schedule) => orDash(schedule.note),
    },
    {
      key: 'amount',
      header: 'Số tiền',
      width: pixel(140),
      align: 'end',
      renderCell: (schedule) => formatMoney(schedule.amount, contract.currency),
    },
    {
      key: 'actions',
      header: '',
      width: pixel(60),
      renderCell: (schedule) => (
        <IconButton
          label={`Sửa ${schedule.paymentCode}`}
          tooltip="Sửa đợt thanh toán"
          icon={<Icon icon={Pencil} size="sm" />}
          variant="ghost"
          size="sm"
          onClick={() => onEditPaymentSchedule(schedule)}
        />
      ),
    },
  ];

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').Shipment & Record<string, unknown>>[]} */
  const shipmentColumns = [
    {
      key: 'shipmentCode',
      header: 'Mã',
      width: pixel(160),
      renderCell: (shipment) => shipment.shipmentCode,
    },
    {
      key: 'name',
      header: 'Tên lô hàng',
      width: proportional(1.2),
      renderCell: (shipment) => shipment.name,
    },
    {
      key: 'type',
      header: 'Loại hình',
      width: pixel(90),
      renderCell: (shipment) => labelForShipmentType(shipment.type),
    },
    {
      key: 'quantity',
      header: 'Số lượng',
      width: pixel(110),
      renderCell: (shipment) =>
        `${shipment.quantityAmount} ${labelForShipmentQuantityUnit(shipment.quantityUnit)}`,
    },
    {
      key: 'bookingNumber',
      header: 'Booking',
      width: pixel(140),
      renderCell: (shipment) => shipment.bookingNumber,
    },
    {
      key: 'supplier',
      header: 'Forwarder',
      width: proportional(1.2),
      renderCell: (shipment) =>
        orDash(customersById.get(shipment.supplierCustomerId)?.companyName),
    },
    {
      key: 'invoiceValue',
      header: 'Giá trị invoice',
      width: pixel(140),
      align: 'end',
      renderCell: (shipment) =>
        formatMoney(shipment.invoiceValue, shipment.invoiceCurrency),
    },
    {
      key: 'actions',
      header: '',
      width: pixel(60),
      renderCell: (shipment) => (
        <IconButton
          label={`Sửa ${shipment.shipmentCode}`}
          tooltip="Sửa Shipment"
          icon={<Icon icon={Pencil} size="sm" />}
          variant="ghost"
          size="sm"
          onClick={(event) => {
            event.stopPropagation();
            onEditShipment(shipment);
          }}
        />
      ),
    },
  ];

  const shipmentExpandedKeys = useMemo(
    () => new Set(expandedShipmentId ? [expandedShipmentId] : []),
    [expandedShipmentId],
  );
  const shipmentExpansionPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Shipment & Record<string, unknown>>} */ (
      useTableRowExpansion({
        expandedKeys: shipmentExpandedKeys,
        onToggle: (shipmentId) =>
          setExpandedShipmentId((current) =>
            current === shipmentId ? null : shipmentId,
          ),
        getRowKey: (shipment) => shipment.id,
        renderExpanded: (shipment) => (
          <ShipmentExpandedDetails
            contractId={contract.id}
            shipment={shipment}
            supplierName={
              customersById.get(shipment.supplierCustomerId)?.companyName ?? ''
            }
            customersById={customersById}
            costCategoriesById={costCategoriesById}
            onAddVgm={() =>
              onAddVgm({ contractId: contract.id, shipmentId: shipment.id })
            }
            onEditVgm={(vgm) =>
              onEditVgm({
                contractId: contract.id,
                shipmentId: shipment.id,
                vgm,
              })
            }
          />
        ),
      })
    );
  const shipmentRowInteractionPlugin = useMemo(
    /** @returns {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Shipment & Record<string, unknown>>} */
    () =>
      createRowExpansionInteractionPlugin({
        expandedId: expandedShipmentId,
        onToggle: (shipmentId) =>
          setExpandedShipmentId((current) =>
            current === shipmentId ? null : shipmentId,
          ),
      }),
    [expandedShipmentId],
  );

  const commissionQuery = useCommissionQuery(contract.id);
  const commissionResult = commissionQuery.data;
  const commission =
    commissionResult?.success && commissionResult.exists
      ? commissionResult.commission
      : null;
  const hasCommission = commission !== null;

  const commissionAnnexesQuery = useCommissionAnnexesQuery(
    hasCommission ? contract.id : undefined,
  );
  const commissionAnnexes = commissionAnnexesQuery.data?.success
    ? commissionAnnexesQuery.data.annexes
    : [];

  // "Tổng cộng" = the commission's own `value` plus every annex's `amount`,
  // signed by its `type` — same rollup as `commissions-list.jsx`'s
  // `grandTotal`.
  const commissionAnnexesTotal = commissionAnnexes.reduce((total, annex) => {
    if (annex.type === 'AmountIncrease') return total + annex.amount;
    if (annex.type === 'AmountDecrease') return total - annex.amount;
    return total;
  }, 0);
  const commissionGrandTotal = commission
    ? commission.value + commissionAnnexesTotal
    : 0;

  return (
    <VStack gap={4} hAlign="stretch" xstyle={expandableRowStyles.expandedPanel}>
      <HStack hAlign="between" vAlign="start" gap={4} wrap="wrap">
        <HStack gap={3} vAlign="center">
          <HStack
            vAlign="center"
            hAlign="center"
            xstyle={expandableRowStyles.expandedIcon}
          >
            <Icon icon={FileText} size="md" />
          </HStack>
          <VStack gap={1}>
            <Heading level={3} xstyle={styles.projectNameHeading}>
              {contract.projectName}
            </Heading>
            <Text color="secondary">
              {contract.contractNumber} · {contract.buyer.companyName}
            </Text>
          </VStack>
        </HStack>
        <HStack gap={2} vAlign="center" wrap="wrap">
          <Token
            label={`${contract.incoterm} ${contract.incotermYear}`}
            color="blue"
            size="sm"
          />
          {contract.currency && (
            <Token label={contract.currency} color="gray" size="sm" />
          )}
        </HStack>
      </HStack>

      <TabList
        value={activeTab}
        onChange={(value) =>
          onActiveTabChange(/** @type {ExpandedTab} */ (value))
        }
        hasDivider
        size="sm"
      >
        <Tab value="info" label="Thông tin" />
        <Tab value="paymentSchedule" label="Lịch sử thanh toán" />
        <Tab value="shipment" label="Shipment" />
        <Tab value="commission" label="Commission" />
      </TabList>

      <VStack
        gap={4}
        hAlign="stretch"
        height={EXPANDED_TAB_CONTENT_HEIGHT}
        isScrollable
      >
        {activeTab === 'info' && (
          <VStack gap={4} hAlign="stretch">
            {/* Rows 1–3: one columns={4} grid, padded with blank cells so
              row 2 (only 2 fields) still lines up under rows 1 and 3 (each
              already exactly 4 fields) — see `metadataSpacer`. */}
            <MetadataList columns={4} label={{ position: 'top' }}>
              <MetadataListItem label="Số hợp đồng">
                {contract.contractNumber}
              </MetadataListItem>
              <MetadataListItem label="Dự án">
                {contract.projectName}
              </MetadataListItem>
              <MetadataListItem label="Hạng mục">
                {orDash(contract.category)}
              </MetadataListItem>
              <MetadataListItem label="Nước xuất khẩu">
                {orDash(countriesById.get(contract.countryId)?.name)}
              </MetadataListItem>
              <MetadataListItem label="Ngày tạo">
                {orDash(contract.createdDate)}
              </MetadataListItem>
              <MetadataListItem label="Ngày báo giá">
                {orDash(contract.quotationDate)}
              </MetadataListItem>
              {metadataSpacer('row2-pad-1')}
              {metadataSpacer('row2-pad-2')}
              <MetadataListItem label="Incoterm">
                {contract.incoterm}
              </MetadataListItem>
              <MetadataListItem label="Năm">
                {contract.incotermYear}
              </MetadataListItem>
              <MetadataListItem label="Cảng/nơi xếp hàng">
                {orDash(contract.placeOfLoading)}
              </MetadataListItem>
              <MetadataListItem label="Cảng/nơi đến">
                {orDash(contract.placeOfDischarge)}
              </MetadataListItem>
            </MetadataList>

            {/* Row 4: Giá trị, Ghi chú (chiếm 2 ô) — `MetadataListItem` has
              no colSpan, so this is its own columns={2} block instead:
              each item is 1 of 2 columns here, the same width as 2 of the
              4 columns above, which is the closest approximation of "Ghi
              chú spans 2 cells" the component supports. It doesn't share
              the grid tracks of the rows above (a real limitation, not an
              oversight — see `harness/PROGRESS.md`). */}
            <MetadataList columns={2} label={{ position: 'top' }}>
              <MetadataListItem label="Giá trị">
                {formatMoney(contract.contractValue, contract.currency)}
              </MetadataListItem>
              <MetadataListItem label="Ghi chú">
                {orDash(contract.note)}
              </MetadataListItem>
            </MetadataList>

            <MetadataList columns={2} label={{ position: 'top' }}>
              <MetadataListItem label="Bên bán ký">
                {contract.sellerSigned ? 'Đã ký' : 'Chưa ký'}
              </MetadataListItem>
              <MetadataListItem label="Bên mua ký">
                {contract.buyerSigned ? 'Đã ký' : 'Chưa ký'}
              </MetadataListItem>
            </MetadataList>

            {/* Bên bán — pulled down from the old "Bên bán" tab. */}
            <VStack gap={2} hAlign="stretch">
              <Text weight="semibold">Bên bán</Text>
              <MetadataList columns={4} label={{ position: 'top' }}>
                <MetadataListItem label="Tên công ty">
                  {contract.seller.companyName}
                </MetadataListItem>
                <MetadataListItem label="Người đại diện">
                  {orDash(contract.seller.representativeName)}
                </MetadataListItem>
                <MetadataListItem label="Chức vụ">
                  {orDash(contract.seller.representativeTitle)}
                </MetadataListItem>
                <MetadataListItem label="Địa chỉ">
                  {orDash(contract.seller.address)}
                </MetadataListItem>
                {contract.seller.extraFields.map((field) => (
                  <MetadataListItem key={field.key} label={field.key}>
                    {orDash(field.value)}
                  </MetadataListItem>
                ))}
              </MetadataList>
            </VStack>

            {/* Khách hàng — pulled down from the old "Khách hàng" tab. */}
            <VStack gap={2} hAlign="stretch">
              <Text weight="semibold">Khách hàng</Text>
              <MetadataList columns={4} label={{ position: 'top' }}>
                <MetadataListItem label="Tên công ty">
                  {contract.buyer.companyName}
                </MetadataListItem>
                <MetadataListItem label="Người đại diện">
                  {orDash(contract.buyer.representativeName)}
                </MetadataListItem>
                <MetadataListItem label="Chức vụ">
                  {orDash(contract.buyer.representativeTitle)}
                </MetadataListItem>
                <MetadataListItem label="Địa chỉ">
                  {orDash(contract.buyer.address)}
                </MetadataListItem>
                {contract.buyer.extraFields.map((field) => (
                  <MetadataListItem key={field.key} label={field.key}>
                    {orDash(field.value)}
                  </MetadataListItem>
                ))}
              </MetadataList>
            </VStack>

            {/* Ngân hàng — pulled down from the old "Ngân hàng" tab. */}
            <VStack gap={2} hAlign="stretch">
              <Text weight="semibold">Ngân hàng</Text>
              {contract.bankIds.length === 0 ? (
                <Text color="secondary">Chưa có ngân hàng thụ hưởng</Text>
              ) : (
                <List hasDividers density="compact">
                  {contract.bankIds.map((bankId) => {
                    const bank = banksById.get(bankId);
                    return (
                      <ListItem
                        key={bankId}
                        label={bank?.bankName || 'Ngân hàng chưa đặt tên'}
                        description={
                          bank
                            ? [
                                bank.beneficiary,
                                bank.bankAccountNumber,
                                bank.branchName,
                              ]
                                .filter(Boolean)
                                .join(' · ') || undefined
                            : undefined
                        }
                      />
                    );
                  })}
                </List>
              )}
            </VStack>

            {/* Đợt thanh toán */}
            <VStack gap={2} hAlign="stretch">
              <Text weight="semibold">Đợt thanh toán (Hợp đồng)</Text>
              {contract.paymentTerms.length === 0 ? (
                <Text color="secondary">Chưa có đợt thanh toán</Text>
              ) : (
                <Table
                  columns={paymentTermColumns}
                  data={paymentTermRows}
                  idKey="id"
                  dividers="rows"
                  density="compact"
                />
              )}
            </VStack>

            {/* Phụ lục — pulled down from the old "Phụ lục" tab, styled to
              match `commissions-list.jsx`'s annex list: label +
              signed amount on the top line, sign/dates/parties below. */}
            <HStack hAlign="between" vAlign="center">
              <Text weight="semibold">Phụ lục hợp đồng</Text>
              <Button
                label="Thêm phụ lục"
                variant="secondary"
                size="sm"
                icon={<Icon icon={Plus} />}
                onClick={onAddAnnex}
              />
            </HStack>

            {annexes.length === 0 ? (
              <Text color="secondary">Chưa có phụ lục</Text>
            ) : (
              <Table
                columns={annexColumns}
                data={annexes}
                idKey="id"
                dividers="rows"
                density="compact"
              />
            )}

            <HStack hAlign="between" vAlign="center">
              <Text weight="semibold">Tổng cộng:</Text>
              <Text weight="semibold">
                {formatMoney(contractGrandTotal, contract.currency)}
              </Text>
            </HStack>
          </VStack>
        )}

        {activeTab === 'paymentSchedule' && (
          <VStack gap={4} hAlign="stretch">
            {/* Requires the contract to be fully signed to create; the
              backend also enforces this (`400` otherwise), the disabled
              button + tooltip here is just the UX-level mirror of that
              rule. */}
            <HStack hAlign="between" vAlign="center">
              <Text weight="semibold">Lịch sử thanh toán</Text>
              <Button
                label="Thêm đợt thanh toán"
                variant="secondary"
                size="sm"
                icon={<Icon icon={Plus} />}
                isDisabled={!isFullySigned}
                tooltip={
                  isFullySigned
                    ? undefined
                    : 'Hợp đồng phải được cả 2 bên ký trước khi thêm đợt thanh toán'
                }
                onClick={onAddPaymentSchedule}
              />
            </HStack>

            {paymentSchedules.length === 0 ? (
              <Text color="secondary">Chưa có đợt thanh toán</Text>
            ) : (
              <Table
                columns={paymentScheduleColumns}
                data={paymentSchedules}
                idKey="id"
                dividers="rows"
                density="compact"
              />
            )}
          </VStack>
        )}

        {activeTab === 'shipment' && (
          <VStack gap={4} hAlign="stretch">
            <HStack hAlign="between" vAlign="center">
              <Text weight="semibold">Shipment</Text>
              <Button
                label="Thêm Shipment"
                variant="secondary"
                size="sm"
                icon={<Icon icon={Plus} />}
                onClick={onAddShipment}
              />
            </HStack>

            {shipments.length === 0 ? (
              <Text color="secondary">Chưa có Shipment nào</Text>
            ) : (
              <Table
                columns={shipmentColumns}
                data={shipments}
                idKey="id"
                dividers="rows"
                density="compact"
                plugins={{
                  expansion: shipmentExpansionPlugin,
                  rowInteraction: shipmentRowInteractionPlugin,
                }}
              />
            )}
          </VStack>
        )}

        {activeTab === 'commission' && !commission && (
          <VStack gap={4} hAlign="stretch" vAlign="center">
            <Text color="secondary">Hợp đồng chưa có Commission</Text>
            <Button
              label="Tạo Commission"
              variant="secondary"
              size="sm"
              icon={<Icon icon={Plus} />}
              onClick={() =>
                onOpenCommission({
                  contractId: contract.id,
                  currency: contract.currency,
                  commission: null,
                })
              }
            />
          </VStack>
        )}

        {activeTab === 'commission' && commission && (
          <VStack gap={4} hAlign="stretch">
            {/* Same field set/layout as `commissions-list.jsx`'s
              `CommissionExpandedDetails` — this tab is that
              component's content, just entered from a contract's row
              instead of the system-wide Commission list. */}
            <MetadataList columns={4} label={{ position: 'top' }}>
              <MetadataListItem label="Mã">{commission.code}</MetadataListItem>
              <MetadataListItem label="Số hợp đồng">
                {contract.contractNumber}
              </MetadataListItem>
              <MetadataListItem label="Dự án">
                {contract.projectName}
              </MetadataListItem>
              <MetadataListItem label="Giá trị">
                {formatMoney(commission.value, contract.currency)}
              </MetadataListItem>
              <MetadataListItem label="Trung gian">
                {orDash(
                  customersById.get(commission.partyCustomerId)?.companyName,
                )}
              </MetadataListItem>
              <MetadataListItem label="Ngày ký">
                {orDash(commission.signedDate)}
              </MetadataListItem>
              <MetadataListItem label="Bên nhận hoa hồng">
                {commission.partySigned ? 'Đã ký' : 'Chưa ký'}
              </MetadataListItem>
              <MetadataListItem label="Bên bán">
                {commission.sellerSigned ? 'Đã ký' : 'Chưa ký'}
              </MetadataListItem>
            </MetadataList>

            <MetadataList
              title="Đợt thanh toán"
              columns={4}
              label={{ position: 'top' }}
            >
              {commission.paymentTerms.length === 0 ? (
                <MetadataListItem label="Đợt thanh toán">—</MetadataListItem>
              ) : (
                commission.paymentTerms.map((term, index) => (
                  <MetadataListItem key={term.id} label={`Đợt ${index + 1}`}>
                    {term.paymentRatioPercent}% ·{' '}
                    {orDash(term.paymentCondition)}
                  </MetadataListItem>
                ))
              )}
            </MetadataList>

            <HStack hAlign="between" vAlign="center">
              <Text weight="semibold">Lịch sử thanh toán</Text>
              <Button
                label="Thêm nhanh"
                variant="secondary"
                size="sm"
                icon={<Icon icon={Plus} />}
                onClick={() => onAddCommissionPayment(commission)}
              />
            </HStack>

            <MetadataList columns={4} label={{ position: 'top' }}>
              {commission.paymentHistory.length === 0 ? (
                <MetadataListItem label="Lịch sử thanh toán">
                  —
                </MetadataListItem>
              ) : (
                commission.paymentHistory.map((payment) => (
                  <MetadataListItem
                    key={payment.id}
                    label={payment.paymentDate}
                  >
                    {formatMoney(payment.amount, contract.currency)}
                    {payment.note ? ` · ${payment.note}` : ''}
                  </MetadataListItem>
                ))
              )}
            </MetadataList>

            <HStack hAlign="between" vAlign="center">
              <Text weight="semibold">Phụ lục</Text>
              <Button
                label="Thêm phụ lục"
                variant="secondary"
                size="sm"
                icon={<Icon icon={Plus} />}
                onClick={onAddCommissionAnnex}
              />
            </HStack>

            {commissionAnnexes.length === 0 ? (
              <Text color="secondary">Chưa có phụ lục</Text>
            ) : (
              <List hasDividers density="compact">
                {commissionAnnexes.map((annex) => (
                  <ListItem
                    key={annex.id}
                    label={`${annex.annexCode} · ${labelForCommissionAnnexType(annex.type)}`}
                    description={[
                      `Ký ${annex.signedDate}`,
                      `Bên bán: ${annex.sellerSigned ? 'đã ký' : 'chưa ký'}`,
                      `Bên nhận hoa hồng: ${annex.partySigned ? 'đã ký' : 'chưa ký'}`,
                    ].join(' · ')}
                    endContent={
                      <HStack gap={1} vAlign="center">
                        <Text weight="semibold">
                          {commissionAnnexAmountLabel(annex, contract.currency)}
                        </Text>
                        <IconButton
                          label={`Sửa ${annex.annexCode}`}
                          tooltip="Sửa phụ lục"
                          icon={<Icon icon={Pencil} size="sm" />}
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditCommissionAnnex(annex)}
                        />
                      </HStack>
                    }
                  />
                ))}
              </List>
            )}

            <HStack hAlign="between" vAlign="center">
              <Text weight="semibold">Tổng cộng:</Text>
              <Text weight="semibold">
                {formatMoney(commissionGrandTotal, contract.currency)}
              </Text>
            </HStack>
          </VStack>
        )}
      </VStack>

      <Divider />

      <HStack hAlign="between" vAlign="center">
        <Button
          label="Xoá"
          variant="ghost"
          size="sm"
          icon={<Icon icon={Trash2} />}
          isDisabled
          tooltip="Chưa hỗ trợ"
        />
        <HStack gap={2}>
          <Button
            label={hasCommission ? 'Sửa Commission' : 'Tạo Commission'}
            variant="secondary"
            size="sm"
            icon={<Icon icon={hasCommission ? Pencil : Plus} />}
            onClick={() =>
              onOpenCommission({
                contractId: contract.id,
                currency: contract.currency,
                commission,
              })
            }
          />
          <Button
            label="In"
            variant="secondary"
            size="sm"
            icon={<Icon icon={Printer} />}
            isDisabled
            tooltip="Chưa hỗ trợ"
          />
          <Button
            label="Sửa hợp đồng"
            variant="primary"
            size="sm"
            icon={<Icon icon={Pencil} />}
            onClick={() => onEdit(contract)}
          />
        </HStack>
      </HStack>
    </VStack>
  );
}

/**
 * Selector popover stacking: Astryx's `Selector` positions its dropdown by
 * walking up from its own DOM position and portaling out to the nearest
 * ancestor outside any "unsafe host" (`<table>`, `<tr>`, ... — see
 * `resolveLayerPortalTarget` in `@astryxdesign/core`'s `Layer/layerHost.ts`).
 * A `*FormDialog` declared inside this table's own `renderExpanded` callback
 * is, in the React/DOM tree, still a descendant of this `<table>` even
 * though the Dialog itself floats visually above the page — so any
 * `Selector` inside it gets portaled to the *table's* scroll wrapper instead
 * of the dialog's own layer, and ends up stacked underneath the dialog:
 * visually it looks fine, but a mouse click on an option lands on the
 * dialog's trigger button underneath instead of the option (only keyboard
 * selection worked). Every dialog that has a `Selector` field and is opened
 * from inside a row's expanded content (Shipment, Payment Schedule, Annex,
 * Commission, VGM) is therefore rendered HERE — a sibling of
 * `AdvanceTable`, not a descendant of it — with only trigger callbacks
 * passed down to `ContractExpandedDetails`/`ShipmentExpandedDetails`. Do not
 * move a `*FormDialog` back inside `renderExpanded`.
 */
export function ContractsList() {
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreenToggle();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [hasOpenedCreate, setHasOpenedCreate] = useState(false);
  const [editingContract, setEditingContract] = useState(
    /** @type {import('../types/index.js').Contract | null} */ (null),
  );
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [filterConditions, setFilterConditions] = useState(
    /** @type {import('@/shared/components/advanced-filter-builder.jsx').AdvancedFilterCondition[]} */ ([]),
  );
  const [expandedContractId, setExpandedContractId] = useState(
    /** @type {string | null} */ (null),
  );
  const [expandedTab, setExpandedTab] = useState(
    /** @type {ExpandedTab} */ ('info'),
  );
  const [shipmentDialog, setShipmentDialog] = useState(
    /** @type {{ contractId: string, contract: import('../types/index.js').Contract, shipment?: import('../types/index.js').Shipment } | null} */ (
      null
    ),
  );
  const [annexDialog, setAnnexDialog] = useState(
    /** @type {{ contractId: string, annex?: import('../types/index.js').ContractAnnex } | null} */ (
      null
    ),
  );
  const [paymentScheduleDialog, setPaymentScheduleDialog] = useState(
    /** @type {{ contractId: string, schedule?: import('../types/index.js').PaymentSchedule } | null} */ (
      null
    ),
  );
  const [commissionDialog, setCommissionDialog] = useState(
    /** @type {{ contractId: string, currency: string, commission: import('../types/index.js').Commission | null } | null} */ (
      null
    ),
  );
  const [commissionAnnexDialog, setCommissionAnnexDialog] = useState(
    /** @type {{ contractId: string, annex?: import('../types/index.js').CommissionAnnex } | null} */ (
      null
    ),
  );
  const [commissionPaymentDialog, setCommissionPaymentDialog] = useState(
    /** @type {{ contractId: string, currency: string, commission: import('../types/index.js').Commission } | null} */ (
      null
    ),
  );
  const [vgmDialog, setVgmDialog] = useState(
    /** @type {{ contractId: string, shipmentId: string, vgm?: import('../types/index.js').ShipmentVgm } | null} */ (
      null
    ),
  );

  /** @param {string} contractId */
  function toggleExpandedContract(contractId) {
    setExpandedContractId((current) => {
      const next = current === contractId ? null : contractId;
      if (next !== current) setExpandedTab('info');
      return next;
    });
  }

  const contractsQuery = useContractsQuery({
    page: pageIndex,
    pageSize,
    conditions: filterConditions,
  });
  const listResult = contractsQuery.data;
  const contracts = listResult?.success ? listResult.contracts : [];

  const banksQuery = useContractBanksQuery();
  const banksById = useMemo(
    () =>
      new Map(
        (banksQuery.data?.success ? banksQuery.data.banks : []).map((bank) => [
          bank.id,
          bank,
        ]),
      ),
    [banksQuery.data],
  );

  // `ContractResponse` only carries `countryId`, no denormalized country
  // name (confirmed in `docs/api/Contracts.md`, BE-kt-xnk), so the display
  // name has to be resolved client-side from the Country catalog.
  const countriesQuery = useCountriesQuery();
  const countriesById = useMemo(
    () =>
      new Map(
        (countriesQuery.data?.success ? countriesQuery.data.countries : []).map(
          (country) => [country.id, country],
        ),
      ),
    [countriesQuery.data],
  );

  // `Commission.partyCustomerId` is a live FK into the Customer
  // catalog (`docs/api/Commissions.md`, BE-kt-xnk) — same
  // client-side name resolution as `commissions-list.jsx`'s
  // `customersById`.
  const customersQuery = useCustomersQuery();
  const customersById = useMemo(
    () =>
      new Map(
        (customersQuery.data?.success ? customersQuery.data.customers : []).map(
          (customer) => [customer.id, customer],
        ),
      ),
    [customersQuery.data],
  );

  // `Shipment.costs[].costCategoryId` is a live FK into the
  // `ShipmentCostCategory` catalog — resolved client-side for
  // `ShipmentExpandedDetails`'s cost-lines table, same pattern as
  // `customersById` above.
  const costCategoriesQuery = useShipmentCostCategoriesQuery();
  const costCategoriesById = useMemo(
    () =>
      new Map(
        (costCategoriesQuery.data?.success
          ? costCategoriesQuery.data.costCategories
          : []
        ).map((costCategory) => [costCategory.id, costCategory]),
      ),
    [costCategoriesQuery.data],
  );

  /** @type {import('@astryxdesign/core/Table').TableColumn<import('../types/index.js').Contract & Record<string, unknown>>[]} */
  const columns = [
    {
      key: 'contractNumber',
      header: 'Số hợp đồng',
      width: pixel(180),
      filter: 'contractNumber',
      renderCell: (contract) => contract.contractNumber,
    },
    {
      key: 'projectName',
      header: 'Dự án',
      width: proportional(1),
      filter: 'projectName',
      renderCell: (contract) => contract.projectName,
    },
    {
      key: 'buyer',
      header: 'Khách hàng',
      width: proportional(1),
      filter: 'buyerCompanyName',
      renderCell: (contract) => contract.buyer.companyName,
    },
    {
      key: 'contractValue',
      // Fixed width, not proportional — a money value is compact and
      // doesn't need to flex; letting `projectName`/`buyer` (both
      // `proportional(1.4)`) be the only two columns sharing the table's
      // leftover width keeps every column's width intentional instead of
      // one absorbing slack it doesn't need (see the "Harness gaps" note
      // in `harness/PROGRESS.md` about mixing `pixel()`/`proportional()`).
      header: 'Giá trị',
      width: proportional(1),
      // align: 'end',
      filter: 'contractValue',
      renderCell: (contract) =>
        formatMoney(contract.contractValue, contract.currency),
    },
    {
      key: 'incoterm',
      header: 'Incoterm',
      // Wider than the header text alone needs — the filter plugin appends
      // an icon after it, and header cells always truncate (never wrap).
      width: pixel(140),
      filter: 'incoterm',
      renderCell: (contract) => `${contract.incoterm} ${contract.incotermYear}`,
    },
    {
      key: 'createdDate',
      header: 'Ngày tạo',
      width: pixel(150),
      renderCell: (contract) => contract.createdDate,
    },
    {
      key: 'quotationDate',
      header: 'Ngày báo giá',
      // Header cells always truncate (never wrap), so a column whose header
      // is longer than its data needs its own pixel floor rather than
      // proportional() — the 120px proportional minimum fits "2026-08-27"
      // fine but clips the label itself.
      width: pixel(150),
      renderCell: (contract) => orDash(contract.quotationDate),
    },
    {
      key: 'category',
      header: 'Hạng mục',
      width: pixel(130),
      renderCell: (contract) => orDash(contract.category),
    },
    {
      key: 'countryName',
      header: 'Nước xuất khẩu',
      width: pixel(160),
      filter: 'countryName',
      renderCell: (contract) =>
        orDash(countriesById.get(contract.countryId)?.name),
    },
    {
      key: 'placeOfLoading',
      header: 'Nơi xếp hàng',
      width: pixel(150),
      renderCell: (contract) => orDash(contract.placeOfLoading),
    },
    {
      key: 'placeOfDischarge',
      header: 'Nơi dỡ hàng',
      width: pixel(140),
      filter: 'placeOfDischarge',
      renderCell: (contract) => orDash(contract.placeOfDischarge),
    },
    {
      key: 'paymentTerms',
      header: 'Đợt thanh toán',
      width: pixel(160),
      renderCell: (contract) => formatPaymentTerms(contract.paymentTerms),
    },
    {
      key: 'bankIds',
      header: 'Ngân hàng thụ hưởng',
      width: pixel(200),
      renderCell: (contract) =>
        contract.bankIds.length === 0
          ? '—'
          : `${contract.bankIds.length} ngân hàng`,
    },
  ];

  const searchableContracts = contracts.map((contract) => ({
    ...contract,
    buyerCompanyName: contract.buyer.companyName,
    countryName: countriesById.get(contract.countryId)?.name ?? '',
    bankNames: contract.bankIds
      .map((bankId) => banksById.get(bankId)?.bankName)
      .filter(Boolean)
      .join(', '),
  }));

  const expandedKeys = useMemo(
    () => new Set(expandedContractId ? [expandedContractId] : []),
    [expandedContractId],
  );
  const expansionPlugin =
    /** @type {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Contract & Record<string, unknown>>} */ (
      useTableRowExpansion({
        expandedKeys,
        onToggle: toggleExpandedContract,
        getRowKey: (contract) => contract.id,
        getIsItemExpandable: (contract) => !contract.id.startsWith('skeleton-'),
        renderExpanded: (contract) => (
          <ContractExpandedDetails
            contract={contract}
            onEdit={setEditingContract}
            banksById={banksById}
            countriesById={countriesById}
            customersById={customersById}
            costCategoriesById={costCategoriesById}
            activeTab={expandedTab}
            onActiveTabChange={setExpandedTab}
            onAddAnnex={() => setAnnexDialog({ contractId: contract.id })}
            onEditAnnex={(annex) =>
              setAnnexDialog({ contractId: contract.id, annex })
            }
            onAddPaymentSchedule={() =>
              setPaymentScheduleDialog({ contractId: contract.id })
            }
            onEditPaymentSchedule={(schedule) =>
              setPaymentScheduleDialog({ contractId: contract.id, schedule })
            }
            onAddShipment={() =>
              setShipmentDialog({ contractId: contract.id, contract })
            }
            onEditShipment={(shipment) =>
              setShipmentDialog({ contractId: contract.id, contract, shipment })
            }
            onAddVgm={(payload) => setVgmDialog(payload)}
            onEditVgm={(payload) => setVgmDialog(payload)}
            onOpenCommission={(payload) => setCommissionDialog(payload)}
            onAddCommissionAnnex={() =>
              setCommissionAnnexDialog({ contractId: contract.id })
            }
            onEditCommissionAnnex={(annex) =>
              setCommissionAnnexDialog({ contractId: contract.id, annex })
            }
            onAddCommissionPayment={(commission) =>
              setCommissionPaymentDialog({
                contractId: contract.id,
                currency: contract.currency,
                commission,
              })
            }
          />
        ),
      })
    );
  const rowInteractionPlugin = useMemo(
    /** @returns {import('@astryxdesign/core/Table').TablePlugin<import('../types/index.js').Contract & Record<string, unknown>>} */
    () =>
      createRowExpansionInteractionPlugin({
        expandedId: expandedContractId,
        onToggle: toggleExpandedContract,
        isExpandable: (contract) => !contract.id.startsWith('skeleton-'),
      }),
    [expandedContractId],
  );

  const totalContracts = listResult?.success ? listResult.totalCount : 0;
  const totalPages = Math.max(
    1,
    listResult?.success ? listResult.totalPages : 1,
  );

  const isLoadingContracts = contractsQuery.isLoading;

  return (
    <VStack gap={4} hAlign="stretch">
      <HStack hAlign="between" vAlign="start" wrap="wrap" gap={3}>
        <VStack gap={1}>
          <Heading level={1}>Hợp đồng</Heading>
        </VStack>
        <HStack gap={2}>
          <IconButton
            label={
              isFullscreen
                ? 'Thu nhỏ danh sách hợp đồng'
                : 'Phóng to danh sách hợp đồng'
            }
            tooltip={isFullscreen ? 'Thu nhỏ' : 'Phóng to'}
            icon={
              <Icon icon={isFullscreen ? Minimize2 : Maximize2} size="sm" />
            }
            variant="secondary"
            onClick={toggleFullscreen}
          />
          <Button
            label="Tạo hợp đồng"
            variant="primary"
            onClick={() => {
              setHasOpenedCreate(true);
              setIsCreateOpen(true);
            }}
          />
        </HStack>
      </HStack>

      {listResult && !listResult.success ? (
        <AdvanceTableErrorBanner message={listResult.message} />
      ) : null}

      <AdvanceTable
        toolbarLabel="Thao tác danh sách hợp đồng"
        searchFieldDefs={SEARCH_FIELD_DEFS}
        entityLabel="Hợp đồng"
        contentSearchFieldKey="contractNumber"
        searchPlaceholder="Tìm số HĐ, dự án..."
        filterFieldDefs={FILTER_FIELD_DEFS}
        advancedFilterConditions={filterConditions}
        onAdvancedFilterChange={setFilterConditions}
        columnOptions={COLUMN_OPTIONS}
        initialColumnKeys={DEFAULT_COLUMN_KEYS}
        defaultColumnKeys={DEFAULT_COLUMN_KEYS}
        tableColumns={columns}
        data={searchableContracts}
        idKey="id"
        isLoading={isLoadingContracts}
        skeletonRows={skeletonRows}
        extraPlugins={{
          expansion: expansionPlugin,
          rowInteraction: rowInteractionPlugin,
        }}
        onRefresh={() => contractsQuery.refetch()}
        isRefreshing={contractsQuery.isFetching}
        pagination={{
          pageIndex,
          pageSize,
          totalCount: totalContracts,
          totalPages,
          onPageIndexChange: setPageIndex,
          onPageSizeChange: setPageSize,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
        }}
      />

      {hasOpenedCreate ? (
        <ContractFormDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSuccess={() => setIsCreateOpen(false)}
        />
      ) : null}

      {editingContract ? (
        <ContractFormDialog
          key={editingContract.id}
          isOpen={editingContract !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEditingContract(null);
          }}
          contract={editingContract}
          onSuccess={() => setEditingContract(null)}
        />
      ) : null}

      {/* Every dialog below is opened from inside a Contracts-row's expanded
          content but rendered here, a sibling of `AdvanceTable` rather than
          a descendant of it — see the note above this component for why. */}

      {shipmentDialog ? (
        <ShipmentFormDialog
          key={shipmentDialog.shipment?.id ?? 'create'}
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setShipmentDialog(null);
          }}
          contractId={shipmentDialog.contractId}
          contract={shipmentDialog.contract}
          shipment={shipmentDialog.shipment}
          onSuccess={() => setShipmentDialog(null)}
        />
      ) : null}

      {annexDialog ? (
        <ContractAnnexFormDialog
          key={annexDialog.annex?.id ?? 'create'}
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setAnnexDialog(null);
          }}
          contractId={annexDialog.contractId}
          annex={annexDialog.annex}
          onSuccess={() => setAnnexDialog(null)}
        />
      ) : null}

      {paymentScheduleDialog ? (
        <PaymentScheduleFormDialog
          key={paymentScheduleDialog.schedule?.id ?? 'create'}
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setPaymentScheduleDialog(null);
          }}
          contractId={paymentScheduleDialog.contractId}
          schedule={paymentScheduleDialog.schedule}
          onSuccess={() => setPaymentScheduleDialog(null)}
        />
      ) : null}

      {commissionDialog ? (
        <CommissionFormDialog
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setCommissionDialog(null);
          }}
          contractId={commissionDialog.contractId}
          currency={commissionDialog.currency}
          commission={commissionDialog.commission}
          onSuccess={() => {
            setExpandedTab('commission');
            setCommissionDialog(null);
          }}
        />
      ) : null}

      {commissionAnnexDialog ? (
        <CommissionAnnexFormDialog
          key={commissionAnnexDialog.annex?.id ?? 'create'}
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setCommissionAnnexDialog(null);
          }}
          contractId={commissionAnnexDialog.contractId}
          annex={commissionAnnexDialog.annex}
          onSuccess={() => setCommissionAnnexDialog(null)}
        />
      ) : null}

      {commissionPaymentDialog ? (
        <CommissionPaymentQuickAddDialog
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setCommissionPaymentDialog(null);
          }}
          contractId={commissionPaymentDialog.contractId}
          commission={commissionPaymentDialog.commission}
          currency={commissionPaymentDialog.currency}
          onSuccess={() => setCommissionPaymentDialog(null)}
        />
      ) : null}

      {vgmDialog ? (
        <ShipmentVgmFormDialog
          key={vgmDialog.vgm?.id ?? 'create'}
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setVgmDialog(null);
          }}
          contractId={vgmDialog.contractId}
          shipmentId={vgmDialog.shipmentId}
          vgm={vgmDialog.vgm}
          onSuccess={() => setVgmDialog(null)}
        />
      ) : null}
    </VStack>
  );
}
