import { z } from 'zod';

/**
 * Mirrors the backend's `CreateShipmentCostCategoryCommandValidator`
 * (BE-kt-xnk) — `Name` is the only field, max 200 chars.
 */
export const shipmentCostCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên nhóm chi phí')
    .max(200, 'Tối đa 200 ký tự'),
});
