export {};

/**
 * @typedef {'EXW' | 'FCA' | 'FAS' | 'FOB' | 'CFR' | 'CIF' | 'CPT' | 'CIP' | 'DAP' | 'DPU' | 'DDP'} Incoterm
 */

/**
 * @typedef {Object} ExtraField
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef {Object} PaymentTerm
 * @property {string} id
 * @property {number} paymentRatioPercent
 * @property {string} paymentCondition
 */

/**
 * @typedef {Object} Customer
 * @property {string} id
 * @property {string} companyName
 * @property {string | null} representativeName
 * @property {string | null} representativeTitle
 * @property {string | null} address
 * @property {ExtraField[]} extraFields
 */

/**
 * @typedef {Object} ContractBank
 * @property {string} id
 * @property {string} bankName
 * @property {string | null} beneficiary
 * @property {string | null} bankAccountNumber
 * @property {string | null} branchName
 * @property {ExtraField[]} extraFields
 */

/**
 * @typedef {Object} PartyA
 * @property {string} companyName
 * @property {string | null} representativeName
 * @property {string | null} representativeTitle
 * @property {string | null} address
 * @property {string | null} sourceCustomerId
 * @property {ExtraField[]} extraFields
 */

/**
 * @typedef {Object} Contract
 * @property {string} id
 * @property {string} contractNumber
 * @property {string} createdDate - ISO date (YYYY-MM-DD)
 * @property {string} quotationDate - ISO date (YYYY-MM-DD)
 * @property {string} projectName
 * @property {string} category
 * @property {string} exportCountry
 * @property {string} portOfLoading
 * @property {string} portOrPlaceOfDestination
 * @property {number} contractValue
 * @property {string} currency - 3-letter uppercase ISO 4217 code, e.g. "USD"
 * @property {Incoterm} incoterm
 * @property {number} incotermYear
 * @property {string | null} branchId - null when the contract isn't tied to a branch
 * @property {PartyA} partyA
 * @property {null} notifyParty - not editable from this app yet
 * @property {null} consignee - not editable from this app yet
 * @property {PaymentTerm[]} paymentTerms
 * @property {string[]} bankIds
 */

/**
 * @typedef {Object} Company
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} Branch
 * @property {string} id
 * @property {string} name
 * @property {string} companyId
 */

/**
 * @typedef {Object} ExtraFieldRow
 * @property {string} rowKey
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef {Object} PaymentTermRow
 * @property {string} rowKey
 * @property {number | undefined} paymentRatioPercent
 * @property {string} paymentCondition
 */

/**
 * @typedef {Object} CustomerFormValues
 * @property {string} companyName
 * @property {string} representativeName
 * @property {string} representativeTitle
 * @property {string} address
 */

/**
 * @typedef {Object} ContractBankFormValues
 * @property {string} bankName
 * @property {string} beneficiary
 * @property {string} bankAccountNumber
 * @property {string} branchName
 */

/**
 * @typedef {Object} ContractFormValues
 * @property {string} contractNumber
 * @property {string} createdDate - ISO date (YYYY-MM-DD)
 * @property {string} quotationDate - ISO date (YYYY-MM-DD)
 * @property {string} projectName
 * @property {string} category
 * @property {string} exportCountry
 * @property {string} portOfLoading
 * @property {string} portOrPlaceOfDestination
 * @property {number | undefined} contractValue
 * @property {string} currency - 3-letter uppercase ISO 4217 code
 * @property {Incoterm | ''} incoterm
 * @property {number | undefined} incotermYear
 * @property {string} [companyId] - not persisted, narrows the branch Selector; absent from the zod-parsed submission shape (not part of `contractSchema`)
 * @property {string} branchId - '' means no branch (optional — only Admin/global-permission callers may omit it, enforced by the backend)
 * @property {string} sourceCustomerId - '' when Party A is entered inline
 * @property {CustomerFormValues} partyAInline
 * @property {string[]} bankIds
 */
