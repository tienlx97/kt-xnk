import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách đợt thanh toán';
const GENERIC_CREATE_ERROR = 'Không thể thêm đợt thanh toán';
const GENERIC_UPDATE_ERROR = 'Không thể cập nhật đợt thanh toán';

/**
 * Requires `logistics:contracts:view`, scoped to the contract's company.
 * @param {string} contractId
 * @returns {Promise<{ success: true, schedules: import('../types/index.js').PaymentSchedule[] } | { success: false, message: string }>}
 */
export async function listPaymentSchedules(contractId) {
  const result = await apiRequest(
    `/api/v1/contracts/${contractId}/payment-schedules`,
    { errorMessage: GENERIC_LIST_ERROR },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, schedules: result.data ?? [] };
}

/**
 * Requires `logistics:contracts:manage`, scoped to the contract's company.
 * `paymentNumber`/`paymentCode` are assigned by the backend, never sent
 * here. The backend returns `400` if the parent contract isn't fully
 * signed (`sellerSigned && buyerSigned`) — the UI keeps the "Thêm đợt
 * thanh toán" button disabled in that case, but this call still surfaces
 * the server's error message as a fallback if that guard is ever bypassed.
 * @param {string} contractId
 * @param {import('../types/index.js').PaymentScheduleFormValues} values
 * @returns {Promise<{ success: true, schedule: import('../types/index.js').PaymentSchedule } | { success: false, message: string }>}
 */
export async function createPaymentSchedule(contractId, values) {
  const result = await apiRequest(
    `/api/v1/contracts/${contractId}/payment-schedules`,
    {
      method: 'POST',
      errorMessage: GENERIC_CREATE_ERROR,
      body: {
        PaymentDate: values.paymentDate,
        Amount: values.amount,
        Type: values.type,
        Note: values.note || null,
      },
    },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, schedule: result.data };
}

/**
 * Requires `logistics:contracts:manage`, scoped to the contract's company.
 * `paymentNumber` is immutable — not part of the request body.
 * @param {string} contractId
 * @param {string} paymentScheduleId
 * @param {import('../types/index.js').PaymentScheduleFormValues} values
 * @returns {Promise<{ success: true, schedule: import('../types/index.js').PaymentSchedule } | { success: false, message: string }>}
 */
export async function updatePaymentSchedule(
  contractId,
  paymentScheduleId,
  values,
) {
  const result = await apiRequest(
    `/api/v1/contracts/${contractId}/payment-schedules/${paymentScheduleId}`,
    {
      method: 'PUT',
      errorMessage: GENERIC_UPDATE_ERROR,
      body: {
        PaymentDate: values.paymentDate,
        Amount: values.amount,
        Type: values.type,
        Note: values.note || null,
      },
    },
  );

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, schedule: result.data };
}
