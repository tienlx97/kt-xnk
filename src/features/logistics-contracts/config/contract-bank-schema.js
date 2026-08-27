import { z } from 'zod';

/**
 * Mirrors the backend's `CreateContractBankCommandValidator` (BE-kt-xnk) —
 * `BankName` is the only required field.
 */
export const contractBankSchema = z.object({
  bankName: z.string().trim().min(1, 'Vui lòng nhập tên ngân hàng'),
  beneficiary: z.string().trim(),
  bankAccountNumber: z.string().trim(),
  branchName: z.string().trim(),
});
