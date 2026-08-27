import { z } from 'zod';

/**
 * Mirrors the backend's `CreateCustomerCommandValidator` (BE-kt-xnk) —
 * `CompanyName` is the only required field.
 */
export const customerSchema = z.object({
  companyName: z.string().trim().min(1, 'Vui lòng nhập tên công ty'),
  representativeName: z.string().trim(),
  representativeTitle: z.string().trim(),
  address: z.string().trim(),
});
