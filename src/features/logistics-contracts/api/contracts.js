import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách hợp đồng';
const GENERIC_CREATE_ERROR = 'Không thể tạo hợp đồng';
const GENERIC_UPDATE_ERROR = 'Không thể cập nhật hợp đồng';
const GENERIC_EXISTS_ERROR = 'Không thể kiểm tra số hợp đồng';

/**
 * @param {{ page?: number, pageSize?: number }} [options]
 * @returns {Promise<{ success: true, contracts: import('../types/index.js').Contract[], page: number, pageSize: number, totalCount: number, totalPages: number } | { success: false, message: string }>}
 */
export async function listContracts({ page = 1, pageSize = 25 } = {}) {
  const result = await apiRequest(
    `/api/v1/contracts?page=${page}&pageSize=${pageSize}`,
    { errorMessage: GENERIC_LIST_ERROR },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return {
    success: true,
    contracts: result.data?.items ?? [],
    page: result.data?.page ?? page,
    pageSize: result.data?.pageSize ?? pageSize,
    totalCount: result.data?.totalCount ?? 0,
    totalPages: result.data?.totalPages ?? 0,
  };
}

/**
 * Real-time duplicate check for the "Số hợp đồng" field — backs the Contract
 * form's live validation, separate from the `409 Conflict` the backend still
 * returns on submit (this is a UX aid, not the source of truth).
 * `excludeContractId` lets the edit form check "does any *other* contract
 * use this number" without the contract colliding with its own current
 * number (see `GET /contracts/exists`, `docs/api/Contracts.md`, BE-kt-xnk).
 * @param {{ contractNumber: string, excludeContractId?: string | null }} params
 * @returns {Promise<{ success: true, exists: boolean } | { success: false, message: string }>}
 */
export async function checkContractNumberExists({
  contractNumber,
  excludeContractId,
}) {
  const params = new URLSearchParams({ contractNumber });
  if (excludeContractId) {
    params.set('excludeContractId', excludeContractId);
  }

  const result = await apiRequest(
    `/api/v1/contracts/exists?${params.toString()}`,
    {
      errorMessage: GENERIC_EXISTS_ERROR,
    },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, exists: Boolean(result.data?.exists) };
}

/**
 * Turns the validated form shape into the `PartyA` wire object. `CompanyName`
 * is only sent when there's no `SourceCustomerId` — the backend takes it
 * from the catalog record when linked. Every other field
 * (`RepresentativeName`/`RepresentativeTitle`/`Address`/`ExtraFields`) is
 * always sent from the form, whether or not `SourceCustomerId` is set — the
 * backend persists them per-contract either way, so the same customer can
 * be Party A on multiple contracts with a different representative on each
 * (see `docs/api/Contracts.md`, BE-kt-xnk).
 * @param {import('../types/index.js').ContractFormValues} values
 * @param {import('../types/index.js').ExtraFieldRow[]} partyAExtraFieldRows
 */
function buildPartyAPayload(values, partyAExtraFieldRows) {
  const extraFields = partyAExtraFieldRows
    .filter((row) => row.key.trim())
    .map((row) => ({ Key: row.key, Value: row.value }));

  return {
    SourceCustomerId: values.sourceCustomerId || null,
    CompanyName: values.sourceCustomerId
      ? null
      : values.partyAInline.companyName,
    RepresentativeName: values.partyAInline.representativeName || null,
    RepresentativeTitle: values.partyAInline.representativeTitle || null,
    Address: values.partyAInline.address || null,
    ExtraFields: extraFields,
  };
}

/**
 * @param {import('../types/index.js').ContractFormValues} values
 * @param {{ paymentTerms: { paymentRatioPercent: number, paymentCondition: string }[], partyAExtraFieldRows?: import('../types/index.js').ExtraFieldRow[] }} extra
 */
function buildContractBody(
  values,
  { paymentTerms, partyAExtraFieldRows = [] },
) {
  return {
    ContractNumber: values.contractNumber,
    CreatedDate: values.createdDate,
    QuotationDate: values.quotationDate,
    ProjectName: values.projectName,
    Category: values.category,
    ExportCountry: values.exportCountry,
    PortOfLoading: values.portOfLoading,
    PortOrPlaceOfDestination: values.portOrPlaceOfDestination,
    ContractValue: values.contractValue,
    Currency: values.currency,
    Incoterm: values.incoterm,
    IncotermYear: values.incotermYear,
    PartyA: buildPartyAPayload(values, partyAExtraFieldRows),
    NotifyParty: null,
    Consignee: null,
    PaymentTerms: paymentTerms.map((term) => ({
      PaymentRatioPercent: term.paymentRatioPercent,
      PaymentCondition: term.paymentCondition,
    })),
    BankIds: values.bankIds,
  };
}

/**
 * @param {import('../types/index.js').ContractFormValues} values
 * @param {{ paymentTerms: { paymentRatioPercent: number, paymentCondition: string }[], partyAExtraFieldRows?: import('../types/index.js').ExtraFieldRow[] }} extra
 * @returns {Promise<{ success: true, contract: import('../types/index.js').Contract } | { success: false, message: string }>}
 */
export async function createContract(values, extra) {
  const result = await apiRequest('/api/v1/contracts', {
    method: 'POST',
    errorMessage: GENERIC_CREATE_ERROR,
    body: {
      ...buildContractBody(values, extra),
      BranchId: values.branchId || null,
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, contract: result.data };
}

/**
 * @param {string} contractId
 * @param {import('../types/index.js').ContractFormValues} values
 * @param {{ paymentTerms: { paymentRatioPercent: number, paymentCondition: string }[], partyAExtraFieldRows?: import('../types/index.js').ExtraFieldRow[] }} extra
 * @returns {Promise<{ success: true, contract: import('../types/index.js').Contract } | { success: false, message: string }>}
 */
export async function updateContract(contractId, values, extra) {
  const result = await apiRequest(`/api/v1/contracts/${contractId}`, {
    method: 'PUT',
    errorMessage: GENERIC_UPDATE_ERROR,
    body: buildContractBody(values, extra),
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, contract: result.data };
}
