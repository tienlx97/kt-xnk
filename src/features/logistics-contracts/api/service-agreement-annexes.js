import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách phụ lục Service Agreement';
const GENERIC_CREATE_ERROR = 'Không thể thêm phụ lục Service Agreement';
const GENERIC_UPDATE_ERROR = 'Không thể cập nhật phụ lục Service Agreement';

/**
 * Requires `logistics:contracts:view`, scoped to the contract's company.
 * @param {string} contractId
 * @returns {Promise<{ success: true, annexes: import('../types/index.js').ServiceAgreementAnnex[] } | { success: false, message: string }>}
 */
export async function listServiceAgreementAnnexes(contractId) {
  const result = await apiRequest(
    `/api/v1/contracts/${contractId}/service-agreement/annexes`,
    { errorMessage: GENERIC_LIST_ERROR },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, annexes: result.data ?? [] };
}

/**
 * Requires `logistics:contracts:manage`, scoped to the contract's company.
 * `annexNumber`/`annexCode` are assigned by the backend, never sent here.
 * @param {string} contractId
 * @param {import('../types/index.js').ServiceAgreementAnnexFormValues} values
 * @returns {Promise<{ success: true, annex: import('../types/index.js').ServiceAgreementAnnex } | { success: false, message: string }>}
 */
export async function createServiceAgreementAnnex(contractId, values) {
  const result = await apiRequest(
    `/api/v1/contracts/${contractId}/service-agreement/annexes`,
    {
      method: 'POST',
      errorMessage: GENERIC_CREATE_ERROR,
      body: {
        Type: values.type,
        Amount: values.amount,
        SignedDate: values.signedDate,
        SellerSigned: values.sellerSigned,
        PartySigned: values.partySigned,
      },
    },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, annex: result.data };
}

/**
 * Requires `logistics:contracts:manage`, scoped to the contract's company.
 * `annexNumber` is immutable — not part of the request body.
 * @param {string} contractId
 * @param {string} annexId
 * @param {import('../types/index.js').ServiceAgreementAnnexFormValues} values
 * @returns {Promise<{ success: true, annex: import('../types/index.js').ServiceAgreementAnnex } | { success: false, message: string }>}
 */
export async function updateServiceAgreementAnnex(contractId, annexId, values) {
  const result = await apiRequest(
    `/api/v1/contracts/${contractId}/service-agreement/annexes/${annexId}`,
    {
      method: 'PUT',
      errorMessage: GENERIC_UPDATE_ERROR,
      body: {
        Type: values.type,
        Amount: values.amount,
        SignedDate: values.signedDate,
        SellerSigned: values.sellerSigned,
        PartySigned: values.partySigned,
      },
    },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, annex: result.data };
}
