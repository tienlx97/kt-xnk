import { z } from 'zod';

/**
 * Mirrors the backend's `CreatePlaceCommandValidator` (BE-kt-xnk) — `Name`
 * (max 200 chars) and `CountryId` (must reference an existing `Country`,
 * checked server-side) are both required.
 */
export const placeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên cảng')
    .max(200, 'Tối đa 200 ký tự'),
  countryId: z.string().trim().min(1, 'Vui lòng chọn nước'),
});
