import { z } from 'zod';

/**
 * Mirrors the backend's `CreateCountryCommandValidator` (BE-kt-xnk) — `Name`
 * is the only field, max 200 chars, uniqueness enforced server-side (409 on
 * duplicate).
 */
export const countrySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên nước')
    .max(200, 'Tối đa 200 ký tự'),
});
