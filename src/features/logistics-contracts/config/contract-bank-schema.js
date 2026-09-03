import { z } from 'zod';

/**
 * Mirrors the backend's `CreateContractBankCommandValidator` (BE-kt-xnk) —
 * `BankName` is the only required field (verified directly against the
 * running API: an empty `BankName` still 400s, even though the OpenAPI
 * schema marks it `nullable: true`).
 *
 * `bankAddress`/`swiftCode` are new input fields the UI now offers (per
 * user request, 2026-09-02) even though `CreateContractBankRequest` has
 * no such fields yet — the backend silently drops them today. Both are
 * plain optional strings here; nothing to validate until the backend
 * defines constraints for them.
 */
export const contractBankSchema = z.object({
  bankName: z.string().trim().min(1, 'Vui lòng nhập tên ngân hàng'),
  beneficiary: z.string().trim(),
  bankAccountNumber: z.string().trim(),
  branchName: z.string().trim(),
  bankAddress: z.string().trim(),
  swiftCode: z.string().trim(),
});
