import { z } from 'zod';

import { COMMISSION_ANNEX_TYPES } from './commission-annex-types.js';

/**
 * Mirrors the backend's `CreateCommissionAnnexCommandValidator`/
 * `UpdateCommissionAnnexCommandValidator` (BE-kt-xnk).
 * `annexNumber`/`annexCode` are backend-assigned, never part of this form.
 */
export const commissionAnnexSchema = z.object({
  signedDate: z.string().trim().min(1, 'Vui lòng chọn ngày ký'),
  type: z.enum(COMMISSION_ANNEX_TYPES, { error: 'Vui lòng chọn loại phụ lục' }),
  amount: z
    .number({ error: 'Vui lòng nhập số tiền' })
    .positive('Số tiền phải lớn hơn 0'),
  sellerSigned: z.boolean(),
  partySigned: z.boolean(),
});
