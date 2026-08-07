/**
 * @typedef {Object} LoginFormValues
 * @property {string} username
 * @property {string} password
 * @property {boolean} rememberMe
 */

/**
 * @typedef {Object} LoginSuccess
 * @property {true} success
 * @property {string} accessToken
 * @property {string} refreshToken
 */

/**
 * @typedef {Object} LoginFailure
 * @property {false} success
 * @property {string} message
 */

/** @typedef {LoginSuccess | LoginFailure} LoginResult */

/**
 * @typedef {Object} Session
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {string} username
 */

export {};
