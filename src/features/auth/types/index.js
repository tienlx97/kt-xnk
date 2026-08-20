/**
 * @typedef {Object} LoginFormValues
 * @property {string} nationalId
 * @property {string} password
 * @property {boolean} rememberMe
 */

/**
 * @typedef {Object} LoginSuccess
 * @property {true} success
 * @property {string} token
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} nationalId
 */

/**
 * @typedef {Object} LoginFailure
 * @property {false} success
 * @property {string} message
 */

/** @typedef {LoginSuccess | LoginFailure} LoginResult */

export {};
