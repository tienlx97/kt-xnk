/**
 * @typedef {Object} LoginFormValues
 * @property {string} email
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
 * @property {string} email
 */

/**
 * @typedef {Object} LoginFailure
 * @property {false} success
 * @property {string} message
 */

/** @typedef {LoginSuccess | LoginFailure} LoginResult */

/**
 * @typedef {Object} Session
 * @property {string} token
 * @property {string} email
 * @property {string} displayName
 */

export {};
