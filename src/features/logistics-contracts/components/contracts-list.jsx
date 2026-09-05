'use client';
/** @typedef {'info' | 'paymentSchedule' | 'shipment' | 'commission'} ExpandedTab */
import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import {
  pixel,
  proportional,
  Table,
  useTableRowExpansion,
} from '@astryxdesign/core/Table';
import { Heading } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  AdvanceTable,
  AdvanceTableErrorBanner,
} from '@/shared/components/advance-table.jsx';
import { createRowExpansionInteractionPlugin } from '@/shared/components/expandable-row-styles.jsx';
import { useFullscreenToggle } from '@/shared/components/fullscreen-panel.jsx';

import {
  COLUMN_OPTIONS,
  DEFAULT_COLUMN_KEYS,
  DEFAULT_PAGE_SIZE,
  FILTER_FIELD_DEFS,
  PAGE_SIZE_OPTIONS,
  SEARCH_FIELD_DEFS,
  skeletonRows,
} from '../config/contracts-table.js';
import { formatMoney } from '../config/currencies.js';
import { useContractBanksQuery } from '../hooks/use-contract-banks-query.js';
import { useContractsQuery } from '../hooks/use-contracts-query.js';
import { useCountriesQuery } from '../hooks/use-countries-query.js';
import { useCustomersQuery } from '../hooks/use-customers-query.js';
import { useShipmentCostCategoriesQuery } from '../hooks/use-shipment-cost-categories-query.js';
import { CommissionAnnexFormDialog } from './commission-annex-form-dialog.jsx';
import { CommissionFormDialog } from './commission-form-dialog.jsx';
import { CommissionPaymentQuickAddDialog } from './commission-payment-quick-add-dialog.jsx';
import { ContractAnnexFormDialog } from './contract-annex-form-dialog.jsx';
import { ContractExpandedDetails } from './contract-expanded-details.jsx';
import { ContractFormDialog } from './contract-form-dialog.jsx';
import { PaymentScheduleFormDialog } from './payment-schedule-form-dialog.jsx';
import { ShipmentFormDialog } from './shipment-form-dialog.jsx';
import { ShipmentVgmFormDialog } from './shipment-vgm-form-dialog.jsx';

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
