import { z } from 'zod';

import { CONTRACT_ANNEX_TYPES } from './contract-annex-types.js';

/**
 * Mirrors the backend's `CreateContractAnnexCommandValidator`/
 * `UpdateContractAnnexCommandValidator` (BE-kt-xnk): `type` must be one of
 * the fixed set, `amount` must be positive, `signedDate` is required.
 * `annexNumber`/`annexCode` are system-assigned and never part of this form.
 */
export const contractAnnexSchema = z.object({
  type: z.enum(CONTRACT_ANNEX_TYPES, { error: 'Vui lòng chọn loại phụ lục' }),
  amount: z
    .number({ error: 'Vui lòng nhập số tiền' })
    .positive('Số tiền phải lớn hơn 0'),
  signedDate: z.string().trim().min(1, 'Vui lòng chọn ngày ký'),
  buyerSigned: z.boolean(),
  sellerSigned: z.boolean(),
});
