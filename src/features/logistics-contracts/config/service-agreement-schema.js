import { z } from 'zod';

const paymentTermSchema = z.object({
  paymentRatioPercent: z
    .number({ error: 'Vui lòng nhập tỷ lệ' })
    .positive('Tỷ lệ phải lớn hơn 0'),
  paymentCondition: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập điều kiện thanh toán'),
});

/**
 * Mirrors the backend's `CreateServiceAgreementCommandValidator`/
 * `UpdateServiceAgreementCommandValidator` (BE-kt-xnk). `year`/`number`/
 * `code` are backend-assigned, never part of this form.
 */
export const serviceAgreementSchema = z.object({
  signedDate: z.string().trim().min(1, 'Vui lòng chọn ngày ký'),
  partyCustomerId: z.string().trim().min(1, 'Vui lòng chọn bên nhận hoa hồng'),
  value: z
    .number({ error: 'Vui lòng nhập giá trị' })
    .positive('Giá trị phải lớn hơn 0'),
  sellerSigned: z.boolean(),
  partySigned: z.boolean(),
  paymentTerms: z
    .array(paymentTermSchema)
    .min(1, 'Cần ít nhất 1 đợt thanh toán')
    .refine(
      (terms) =>
        Math.abs(terms.reduce((sum, term) => sum + term.paymentRatioPercent, 0) - 100) <
        0.01,
      { message: 'Tổng tỷ lệ các đợt thanh toán phải bằng 100%' },
    ),
});
