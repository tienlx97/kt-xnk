import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách phụ lục Commission';
const GENERIC_CREATE_ERROR = 'Không thể thêm phụ lục Commission';
const GENERIC_UPDATE_ERROR = 'Không thể cập nhật phụ lục Commission';

/**
 * Requires `logistics:contracts:view`, scoped to the contract's company.
 * @param {string} contractId
 * @returns {Promise<{ success: true, annexes: import('../types/index.js').CommissionAnnex[] } | { success: false, message: string }>}
 */
export async function listCommissionAnnexes(contractId) {
  const result = await apiRequest(
    `/api/v1/contracts/${contractId}/commission/annexes`,
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
 * @param {import('../types/index.js').CommissionAnnexFormValues} values
 * @returns {Promise<{ success: true, annex: import('../types/index.js').CommissionAnnex } | { success: false, message: string }>}
 */
export async function createCommissionAnnex(contractId, values) {
  const result = await apiRequest(
    `/api/v1/contracts/${contractId}/commission/annexes`,
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
 * @param {import('../types/index.js').CommissionAnnexFormValues} values
 * @returns {Promise<{ success: true, annex: import('../types/index.js').CommissionAnnex } | { success: false, message: string }>}
 */
export async function updateCommissionAnnex(contractId, annexId, values) {
  const result = await apiRequest(
    `/api/v1/contracts/${contractId}/commission/annexes/${annexId}`,
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
