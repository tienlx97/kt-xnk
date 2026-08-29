import { z } from 'zod';

/**
 * Mirrors the backend's `CreateSellerCommandValidator` (BE-kt-xnk) —
 * `CompanyName` is the only required field.
 */
export const sellerSchema = z.object({
  companyName: z.string().trim().min(1, 'Vui lòng nhập tên công ty'),
  representativeName: z.string().trim(),
  representativeTitle: z.string().trim(),
  address: z.string().trim(),
});
