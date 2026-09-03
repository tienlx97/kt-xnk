import { apiRequest } from '@/shared/api/api-client.js';

const GENERIC_LIST_ERROR = 'Không thể tải danh sách ngân hàng';
const GENERIC_CREATE_ERROR = 'Không thể thêm ngân hàng';

/**
 * Requires `logistics:contracts:view`.
 * @returns {Promise<{ success: true, banks: import('../types/index.js').ContractBank[] } | { success: false, message: string }>}
 */
export async function listContractBanks() {
  const result = await apiRequest('/api/v1/contract-banks', {
    errorMessage: GENERIC_LIST_ERROR,
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, banks: result.data ?? [] };
}

/**
 * Requires `logistics:contracts:manage`.
 * @param {import('../types/index.js').ContractBankFormValues} values
 * @param {import('../types/index.js').ExtraFieldRow[]} [extraFieldRows]
 * @returns {Promise<{ success: true, bank: import('../types/index.js').ContractBank } | { success: false, message: string }>}
 */
export async function createContractBank(values, extraFieldRows = []) {
  const result = await apiRequest('/api/v1/contract-banks', {
    method: 'POST',
    errorMessage: GENERIC_CREATE_ERROR,
    body: {
      BankName: values.bankName || null,
      Beneficiary: values.beneficiary || null,
      BankAccountNumber: values.bankAccountNumber || null,
      BranchName: values.branchName || null,
      // `CreateContractBankRequest` has no `BankAddress`/`SwiftCode` yet
      // (verified against the live backend: it 201s but silently drops
      // both) — sent anyway so this starts working the moment BE-kt-xnk
      // adds them, no frontend change needed. See
      // `config/contract-bank-schema.js`.
      BankAddress: values.bankAddress || null,
      SwiftCode: values.swiftCode || null,
      ExtraFields: extraFieldRows
        .filter((row) => row.key.trim())
        .map((row) => ({ Key: row.key, Value: row.value })),
    },
  });

  if (!result.success) {
    return { success: false, message: result.message };
  }

  return { success: true, bank: result.data };
}
