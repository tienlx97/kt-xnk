import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách Service Agreement';
const GENERIC_GET_ERROR = 'Không thể tải Service Agreement';
const GENERIC_CREATE_ERROR = 'Không thể tạo Service Agreement';
const GENERIC_UPDATE_ERROR = 'Không thể cập nhật Service Agreement';

/**
 * System-wide list across every contract (unlike the other functions here,
 * not scoped under `/contracts/{contractId}`) — non-Admin callers only see
 * agreements whose parent contract's `CompanyId` they have
 * `logistics:contracts:view` on; Admin sees all (see
 * `docs/api/ServiceAgreements.md`, BE-kt-xnk).
 * @param {{ page?: number, pageSize?: number }} [options]
 * @returns {Promise<{ success: true, serviceAgreements: import('../types/index.js').ServiceAgreement[], page: number, pageSize: number, totalCount: number, totalPages: number } | { success: false, message: string }>}
 */
export async function listServiceAgreements({ page = 1, pageSize = 25 } = {}) {
  const result = await apiRequest(
    `/api/v1/service-agreements?page=${page}&pageSize=${pageSize}`,
    { errorMessage: GENERIC_LIST_ERROR },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return {
    success: true,
    serviceAgreements: result.data?.items ?? [],
    page: result.data?.page ?? page,
    pageSize: result.data?.pageSize ?? pageSize,
    totalCount: result.data?.totalCount ?? 0,
    totalPages: result.data?.totalPages ?? 0,
  };
}

/**
 * At most one per contract. A `404` means the contract has none yet —
 * not an error the UI should show, so it is folded into `exists: false`
 * rather than `success: false`.
 * @param {string} contractId
 * @returns {Promise<{ success: true, exists: true, serviceAgreement: import('../types/index.js').ServiceAgreement } | { success: true, exists: false } | { success: false, message: string }>}
 */
export async function getServiceAgreement(contractId) {
  const result = await apiRequest(`/api/v1/contracts/${contractId}/service-agreement`, {
    errorMessage: GENERIC_GET_ERROR,
  });

  if (!result.success) {
    if (result.status === 404) {
      return { success: true, exists: false };
    }
    return { success: false, message: result.message };
  }

  return { success: true, exists: true, serviceAgreement: result.data };
}

/**
 * @param {string} contractId
 * @param {import('../types/index.js').ServiceAgreementFormValues} values
 * @param {{ paymentRatioPercent: number, paymentCondition: string }[]} paymentTerms
 * @returns {Promise<{ success: true, serviceAgreement: import('../types/index.js').ServiceAgreement } | { success: false, message: string }>}
 */
export async function createServiceAgreement(contractId, values, paymentTerms) {
  const result = await apiRequest(`/api/v1/contracts/${contractId}/service-agreement`, {
    method: 'POST',
    errorMessage: GENERIC_CREATE_ERROR,
    body: {
      SignedDate: values.signedDate,
      PartyCustomerId: values.partyCustomerId,
      Value: values.value,
      SellerSigned: values.sellerSigned,
      PartySigned: values.partySigned,
      PaymentTerms: paymentTerms.map((term) => ({
        PaymentRatioPercent: term.paymentRatioPercent,
        PaymentCondition: term.paymentCondition,
      })),
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, serviceAgreement: result.data };
}

/**
 * @param {string} contractId
 * @param {import('../types/index.js').ServiceAgreementFormValues} values
 * @param {{ paymentRatioPercent: number, paymentCondition: string }[]} paymentTerms
 * @returns {Promise<{ success: true, serviceAgreement: import('../types/index.js').ServiceAgreement } | { success: false, message: string }>}
 */
export async function updateServiceAgreement(contractId, values, paymentTerms) {
  const result = await apiRequest(`/api/v1/contracts/${contractId}/service-agreement`, {
    method: 'PUT',
    errorMessage: GENERIC_UPDATE_ERROR,
    body: {
      SignedDate: values.signedDate,
      PartyCustomerId: values.partyCustomerId,
      Value: values.value,
      SellerSigned: values.sellerSigned,
      PartySigned: values.partySigned,
      PaymentTerms: paymentTerms.map((term) => ({
        PaymentRatioPercent: term.paymentRatioPercent,
        PaymentCondition: term.paymentCondition,
      })),
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, serviceAgreement: result.data };
}
