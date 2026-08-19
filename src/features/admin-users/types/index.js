/**
 * @typedef {'OldUnits' | 'NewUnits'} AddressType
 */

/**
 * @typedef {'Male' | 'Female' | 'Other'} Gender
 */

/**
 * @typedef {Object} CreateUserFormValues
 * @property {string} nationalId
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} password
 * @property {number | undefined} yearOfBirth
 * @property {Gender | ''} gender
 * @property {string} nationalIdIssueDate - ISO date (YYYY-MM-DD)
 * @property {string} nationalIdIssuePlace
 * @property {string} passportNumber - optional, empty string when unset
 * @property {string} phone
 * @property {AddressType} addressType
 * @property {string} province
 * @property {string} district
 * @property {string} ward
 * @property {string} addressDetail
 * @property {string} positionId
 * @property {string} companyId
 * @property {string} branchId
 * @property {string} departmentId
 */

/**
 * @typedef {Object} EditUserFormValues
 * @property {string} firstName
 * @property {string} lastName
 * @property {number | undefined} yearOfBirth
 * @property {Gender | ''} gender
 * @property {string} nationalIdIssueDate - ISO date (YYYY-MM-DD)
 * @property {string} nationalIdIssuePlace
 * @property {string} passportNumber - optional, empty string when unset
 * @property {string} phone
 * @property {AddressType} addressType
 * @property {string} province
 * @property {string} district
 * @property {string} ward
 * @property {string} addressDetail
 * @property {string} positionId
 * @property {string} companyId
 * @property {string} branchId
 * @property {string} departmentId
 */

/**
 * @typedef {Object} CreateUserSuccess
 * @property {true} success
 * @property {string} id
 */

/**
 * @typedef {Object} CreateUserFailure
 * @property {false} success
 * @property {string} message
 */

/** @typedef {CreateUserSuccess | CreateUserFailure} CreateUserResult */

/** @typedef {{ id: string, name: string }} Company */
/** @typedef {{ id: string, name: string, companyId: string }} Branch */
/** @typedef {{ id: string, name: string, branchId: string }} Department */
/** @typedef {{ id: string, name: string }} Position */

/**
 * Shape of `GET /users` list items — `UserResponse` (BE-kt-xnk,
 * `CompanyManagement.Contracts/Users/UserResponse.cs`).
 * @typedef {Object} UserListItem
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} nationalId
 * @property {number | null} yearOfBirth
 * @property {Gender | null} gender
 * @property {string | null} nationalIdIssueDate
 * @property {string | null} nationalIdIssuePlace
 * @property {string | null} passportNumber
 * @property {string | null} phone
 * @property {AddressType | null} addressType
 * @property {string | null} province
 * @property {string | null} district
 * @property {string | null} ward
 * @property {string | null} addressDetail
 * @property {string | null} positionId
 * @property {string | null} companyId
 * @property {string | null} branchId
 * @property {string[]} departmentIds
 */

/**
 * @typedef {Object} UserListSuccess
 * @property {true} success
 * @property {UserListItem[]} users
 */

/**
 * @typedef {Object} UserListFailure
 * @property {false} success
 * @property {string} message
 */

/** @typedef {UserListSuccess | UserListFailure} UserListResult */

/**
 * Shape of `GET /vietnam-banks` items — `VietnamBankResponse` (BE-kt-xnk,
 * `CompanyManagement.Contracts/Banks/VietnamBankResponse.cs`).
 * @typedef {Object} VietnamBank
 * @property {string} id
 * @property {string} code
 * @property {string} name
 * @property {string} shortName
 */

/**
 * One editable row in the bank accounts grid (`CreateUserForm`/
 * `EditUserForm`). Local-only state until saved — `bankAccountId` is `null`
 * for a row the user added but hasn't been persisted yet (Create: every
 * row, until the user itself is created; Edit: a row added in this
 * session, until submit).
 * @typedef {Object} BankAccountRow
 * @property {string} rowKey - client-only stable React key, never sent to the API
 * @property {string | null} bankAccountId
 * @property {string} vietnamBankId
 * @property {string} accountNumber
 * @property {string} branch
 * @property {boolean} isPrimary
 */

/**
 * Shape of `GET .../bank-accounts` items — `BankAccountResponse`
 * (BE-kt-xnk, `CompanyManagement.Contracts/BankAccounts/BankAccountResponse.cs`).
 * @typedef {Object} BankAccountApiItem
 * @property {string} id
 * @property {string} vietnamBankId
 * @property {string} accountNumber
 * @property {string | null} branch
 * @property {boolean} isPrimary
 */

/**
 * @typedef {Object} BankAccountSuccess
 * @property {true} success
 * @property {BankAccountApiItem} bankAccount
 */

/**
 * @typedef {Object} BankAccountFailure
 * @property {false} success
 * @property {string} message
 */

/** @typedef {BankAccountSuccess | BankAccountFailure} BankAccountResult */

/**
 * @typedef {Object} BankAccountListSuccess
 * @property {true} success
 * @property {BankAccountApiItem[]} bankAccounts
 */

/** @typedef {BankAccountListSuccess | BankAccountFailure} BankAccountListResult */

export {};
