import { apiRequest } from '../../../shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách hợp đồng';
const GENERIC_CREATE_ERROR = 'Không thể tạo hợp đồng';
const GENERIC_UPDATE_ERROR = 'Không thể cập nhật hợp đồng';

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
 * Turns the validated form shape into the `PartyA` wire object — either a
 * reference to an existing customer (`SourceCustomerId`) or an inline
 * one-off Party A, never both (mirrors `PartyARequest` on the backend).
 * @param {import('../types/index.js').ContractFormValues} values
 * @param {import('../types/index.js').ExtraFieldRow[]} partyAExtraFieldRows
 */
function buildPartyAPayload(values, partyAExtraFieldRows) {
  const extraFields = partyAExtraFieldRows
    .filter((row) => row.key.trim())
    .map((row) => ({ Key: row.key, Value: row.value }));

  if (values.sourceCustomerId) {
    return { SourceCustomerId: values.sourceCustomerId, ExtraFields: extraFields };
  }

  return {
    SourceCustomerId: null,
    CompanyName: values.partyAInline.companyName,
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
function buildContractBody(values, { paymentTerms, partyAExtraFieldRows = [] }) {
  return {
    ContractNumber: values.contractNumber,
    CreatedDate: values.createdDate,
    QuotationDate: values.quotationDate,
    ProjectName: values.projectName,
    Category: values.category,
    ExportCountry: values.exportCountry,
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
    body: { ...buildContractBody(values, extra), BranchId: values.branchId || null },
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
