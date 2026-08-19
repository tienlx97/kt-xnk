import { API_BASE_URL } from '../config/api-config.js';

const GENERIC_ERROR_MESSAGE = 'Không thể lưu tài khoản ngân hàng';

/**
 * Public endpoint — populates the bank Selector in the bank accounts grid.
 * @returns {Promise<import('../types/index.js').VietnamBank[]>}
 */
export async function listVietnamBanks() {
  const response = await fetch(`${API_BASE_URL}/api/v1/vietnam-banks`);
  if (!response.ok) return [];
  return response.json();
}

/**
 * Admin-only endpoint.
 * @param {string} userId
 * @param {string} token
 * @returns {Promise<import('../types/index.js').BankAccountListResult>}
 */
export async function adminListBankAccounts(userId, token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}/bank-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { success: false, message: 'Không thể kết nối đến máy chủ' };
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    return { success: false, message: problem?.detail ?? 'Không thể tải danh sách tài khoản ngân hàng' };
  }

  return { success: true, bankAccounts: await response.json() };
}

/**
 * Admin-only endpoint.
 * @param {string} userId
 * @param {import('../types/index.js').BankAccountRow} row
 * @param {string} token
 * @returns {Promise<import('../types/index.js').BankAccountResult>}
 */
export async function adminAddBankAccount(userId, row, token) {
  return sendBankAccountRequest(
    `${API_BASE_URL}/api/v1/users/${userId}/bank-accounts`,
    'POST',
    {
      VietnamBankId: row.vietnamBankId,
      AccountNumber: row.accountNumber,
      Branch: row.branch || null,
      IsPrimary: row.isPrimary,
    },
    token,
  );
}

/**
 * Admin-only endpoint.
 * @param {string} userId
 * @param {string} bankAccountId
 * @param {import('../types/index.js').BankAccountRow} row
 * @param {string} token
 * @returns {Promise<import('../types/index.js').BankAccountResult>}
 */
export async function adminUpdateBankAccount(userId, bankAccountId, row, token) {
  return sendBankAccountRequest(
    `${API_BASE_URL}/api/v1/users/${userId}/bank-accounts/${bankAccountId}`,
    'PUT',
    {
      VietnamBankId: row.vietnamBankId,
      AccountNumber: row.accountNumber,
      Branch: row.branch || null,
    },
    token,
  );
}

/**
 * Admin-only endpoint.
 * @param {string} userId
 * @param {string} bankAccountId
 * @param {string} token
 * @returns {Promise<import('../types/index.js').BankAccountResult>}
 */
export async function adminSetPrimaryBankAccount(userId, bankAccountId, token) {
  return sendBankAccountRequest(
    `${API_BASE_URL}/api/v1/users/${userId}/bank-accounts/${bankAccountId}/primary`,
    'PUT',
    undefined,
    token,
  );
}

/**
 * Admin-only endpoint.
 * @param {string} userId
 * @param {string} bankAccountId
 * @param {string} token
 * @returns {Promise<{ success: true } | { success: false, message: string }>}
 */
export async function adminRemoveBankAccount(userId, bankAccountId, token) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}/bank-accounts/${bankAccountId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { success: false, message: 'Không thể kết nối đến máy chủ' };
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    return { success: false, message: problem?.detail ?? GENERIC_ERROR_MESSAGE };
  }

  return { success: true };
}

/**
 * @param {string} url
 * @param {'POST' | 'PUT'} method
 * @param {Record<string, unknown> | undefined} body
 * @param {string} token
 * @returns {Promise<import('../types/index.js').BankAccountResult>}
 */
async function sendBankAccountRequest(url, method, body, token) {
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    return { success: false, message: 'Không thể kết nối đến máy chủ' };
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    return { success: false, message: problem?.detail ?? GENERIC_ERROR_MESSAGE };
  }

  return { success: true, bankAccount: await response.json() };
}
