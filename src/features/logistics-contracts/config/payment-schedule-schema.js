import { z } from 'zod';

import { PAYMENT_TYPES } from './payment-schedule-types.js';

/**
 * Mirrors the backend's `CreatePaymentScheduleCommandValidator`/
 * `UpdatePaymentScheduleCommandValidator` (BE-kt-xnk): `amount` must be
 * positive, `type` must be one of the fixed set, `note` is optional up to
 * 2000 chars. `paymentNumber`/`paymentCode` are system-assigned and never
 * part of this form. The backend also rejects *create* with `400` unless
 * the parent contract has `sellerSigned && buyerSigned` — that check needs
 * the parent `Contract`, so it isn't expressed here; the UI instead keeps
 * "Thêm đợt thanh toán" disabled until both are true (see
 * `contracts-list.jsx`).
 */
export const paymentScheduleSchema = z.object({
  paymentDate: z.string().trim().min(1, 'Vui lòng chọn ngày thanh toán'),
  amount: z
    .number({ error: 'Vui lòng nhập giá trị' })
    .positive('Giá trị phải lớn hơn 0'),
  type: z.enum(PAYMENT_TYPES, { error: 'Vui lòng chọn loại thanh toán' }),
  note: z.string().trim().max(2000, 'Tối đa 2000 ký tự'),
});
