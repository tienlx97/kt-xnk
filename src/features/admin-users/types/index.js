/**
 * @typedef {'OldUnits' | 'NewUnits'} AddressType
 */

/**
 * @typedef {Object} CreateUserFormValues
 * @property {string} nationalId
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} password
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

export {};
