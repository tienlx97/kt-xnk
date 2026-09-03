export {};

/**
 * @typedef {'EXW' | 'FOB' | 'CIF' | 'DDP'} Incoterm
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
 * Seller catalog entry — the selling company. Same shape as {@link Customer}
 * (Party A's catalog) but a separate list, since seller and customer are
 * different business concepts even though their fields coincide.
 * @typedef {Object} Seller
 * @property {string} id
 * @property {string} companyName
 * @property {string | null} representativeName
 * @property {string | null} representativeTitle
 * @property {string | null} address
 * @property {ExtraField[]} extraFields
 */

/**
 * `bankAddress`/`swiftCode` are not yet on the backend response (see
 * `config/contract-bank-schema.js`) — typed here ahead of it, always
 * `null` until BE-kt-xnk adds them.
 * @typedef {Object} ContractBank
 * @property {string} id
 * @property {string} bankName
 * @property {string | null} beneficiary
 * @property {string | null} bankAccountNumber
 * @property {string | null} branchName
 * @property {string | null} bankAddress
 * @property {string | null} swiftCode
 * @property {ExtraField[]} extraFields
 */

/**
 * Buyer (bên mua) as recorded on one specific contract — a snapshot copied
 * from the {@link Customer} catalog (or typed inline) at creation time.
 * Renamed from `PartyA` on the wire (see `docs/api/Contracts.md`,
 * BE-kt-xnk).
 * @typedef {Object} Buyer
 * @property {string} companyName
 * @property {string | null} representativeName
 * @property {string | null} representativeTitle
 * @property {string | null} address
 * @property {string | null} sourceCustomerId
 * @property {ExtraField[]} extraFields
 */

/**
 * Country catalog entry — `Contract.CountryId` is a live reference to one
 * of these (not copied/snapshotted, unlike Seller/Buyer), so renaming a
 * `Country` changes how every referencing contract displays.
 * @typedef {Object} Country
 * @property {string} id
 * @property {string} name
 */

/**
 * Place catalog entry — lookup/suggestion only, scoped to one `Country`.
 * Does NOT constrain `Contract.placeOfLoading`/`placeOfDischarge`, which
 * stay free text.
 * @typedef {Object} Place
 * @property {string} id
 * @property {string} name
 * @property {string} countryId
 */

/**
 * Seller (bên bán) as recorded on one specific contract — a snapshot copied
 * from the {@link Seller} catalog (or typed inline) at creation time.
 * Mirrors {@link PartyA}.
 * @typedef {Object} ContractSeller
 * @property {string} companyName
 * @property {string | null} representativeName
 * @property {string | null} representativeTitle
 * @property {string | null} address
 * @property {string | null} sourceSellerId
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
 * @property {string} countryId - FK into the {@link Country} catalog (was the free-text `exportCountry`)
 * @property {string} placeOfLoading - was `portOfLoading`
 * @property {string} placeOfDischarge - was `portOrPlaceOfDestination`; free text, not constrained to the {@link Place} catalog
 * @property {number} contractValue
 * @property {string} currency - 3-letter uppercase ISO 4217 code, e.g. "USD"
 * @property {Incoterm} incoterm
 * @property {number} incotermYear
 * @property {string} companyId - the company the contract belongs to (permissions are scoped by company, not branch)
 * @property {ContractSeller} seller
 * @property {Buyer} buyer - was `partyA`
 * @property {null} notifyParty - not editable from this app yet
 * @property {null} consignee - not editable from this app yet
 * @property {string | null} note
 * @property {PaymentTerm[]} paymentTerms
 * @property {string[]} bankIds
 * @property {boolean} sellerSigned - "Bên bán ký"
 * @property {boolean} buyerSigned - "Bên mua ký"
 */

/**
 * @typedef {'AmountIncrease' | 'AmountDecrease' | 'ValueChange'} ContractAnnexType
 */

/**
 * Contract amendment ("phụ lục hợp đồng") — a historical record only, never
 * changes `Contract.contractValue`. `annexNumber`/`annexCode` are
 * system-assigned (BE-kt-xnk): `annexCode` is `{contractNumber}/AN-{annexNumber}`,
 * computed by the backend from the *current* contract number, so it can
 * change if the contract is renamed even though `annexNumber` itself never
 * does.
 * @typedef {Object} ContractAnnex
 * @property {string} id
 * @property {string} contractId
 * @property {number} annexNumber
 * @property {string} annexCode
 * @property {ContractAnnexType} type
 * @property {number} amount
 * @property {string} signedDate - ISO date (YYYY-MM-DD)
 * @property {boolean} buyerSigned
 * @property {boolean} sellerSigned
 */

/**
 * @typedef {Object} ContractAnnexFormValues
 * @property {ContractAnnexType | ''} type
 * @property {number | undefined} amount
 * @property {string} signedDate - ISO date (YYYY-MM-DD)
 * @property {boolean} buyerSigned
 * @property {boolean} sellerSigned
 */

/**
 * Commission agreement with a third party ("hoa hồng") for one specific
 * contract — at most one per contract, optional. `year`/`number`/`code`
 * are backend-assigned (BE-kt-xnk): `code` is `{year%100}SA{number}`
 * (e.g. "26SA01"), a system-wide sequence scoped by the year it was
 * created in (not `signedDate`). Uses the parent contract's `currency` —
 * no currency of its own. `sellerSigned` tracks whether the *contract's*
 * own Seller signed (not a separate snapshot); `partySigned` tracks
 * `partyCustomerId` (the commission recipient).
 * @typedef {Object} ServiceAgreement
 * @property {string} id
 * @property {string} contractId
 * @property {number} year
 * @property {number} number
 * @property {string} code
 * @property {string} signedDate - ISO date (YYYY-MM-DD)
 * @property {string} partyCustomerId - FK into the {@link Customer} catalog — the commission recipient
 * @property {number} value
 * @property {boolean} sellerSigned
 * @property {boolean} partySigned
 * @property {PaymentTerm[]} paymentTerms
 */

/**
 * @typedef {Object} ServiceAgreementFormValues
 * @property {string} signedDate - ISO date (YYYY-MM-DD)
 * @property {string} partyCustomerId
 * @property {number | undefined} value
 * @property {boolean} sellerSigned
 * @property {boolean} partySigned
 */

/**
 * @typedef {'AmountIncrease' | 'AmountDecrease' | 'InfoChange'} ServiceAgreementAnnexType
 */

/**
 * Amendment to a {@link ServiceAgreement} — a historical record only,
 * never changes `value`/`paymentTerms`. `annexNumber` is backend-assigned,
 * sequential per service agreement; `annexCode` is
 * `{serviceAgreement.code}/AN-{annexNumber}` (e.g. "26SA01/AN-01"),
 * computed by the backend, not stored.
 * @typedef {Object} ServiceAgreementAnnex
 * @property {string} id
 * @property {string} serviceAgreementId
 * @property {number} annexNumber
 * @property {string} annexCode
 * @property {string} signedDate - ISO date (YYYY-MM-DD)
 * @property {ServiceAgreementAnnexType} type
 * @property {number} amount
 * @property {boolean} sellerSigned
 * @property {boolean} partySigned
 */

/**
 * @typedef {Object} ServiceAgreementAnnexFormValues
 * @property {string} signedDate - ISO date (YYYY-MM-DD)
 * @property {ServiceAgreementAnnexType | ''} type
 * @property {number | undefined} amount
 * @property {boolean} sellerSigned
 * @property {boolean} partySigned
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
 * @typedef {Object} SellerFormValues
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
 * @property {string} bankAddress
 * @property {string} swiftCode
 */

/**
 * @typedef {Object} CountryFormValues
 * @property {string} name
 */

/**
 * @typedef {Object} PlaceFormValues
 * @property {string} name
 * @property {string} countryId
 */

/**
 * @typedef {Object} ContractFormValues
 * @property {string} contractNumber
 * @property {string} createdDate - ISO date (YYYY-MM-DD)
 * @property {string} quotationDate - ISO date (YYYY-MM-DD)
 * @property {string} projectName
 * @property {string} category
 * @property {string} countryId - FK into the {@link Country} catalog (was the free-text `exportCountry`)
 * @property {string} placeOfLoading - was `portOfLoading`
 * @property {string} placeOfDischarge - was `portOrPlaceOfDestination`; free text
 * @property {number | undefined} contractValue
 * @property {string} currency - 3-letter uppercase ISO 4217 code
 * @property {Incoterm | ''} incoterm
 * @property {number | undefined} incotermYear
 * @property {string} companyId - required; the company the contract belongs to (permissions are scoped by company, not branch)
 * @property {string} sourceSellerId - '' when Seller is entered inline
 * @property {SellerFormValues} sellerInline
 * @property {string} sourceCustomerId - '' when Buyer is entered inline
 * @property {CustomerFormValues} buyerInline - was `partyAInline`
 * @property {string} note
 * @property {string[]} bankIds
 * @property {boolean} sellerSigned - "Bên bán ký"
 * @property {boolean} buyerSigned - "Bên mua ký"
 */

/**
 * @typedef {'TT' | 'LC'} PaymentType
 */

/**
 * Customer payment installment ("đợt thanh toán") after a `Contract` has
 * been signed. `paymentNumber`/`paymentCode` are system-assigned
 * (BE-kt-xnk): `paymentCode` is `{contractNumber}/PR-{paymentNumber:D2}`,
 * computed by the backend from the *current* contract number (same
 * live-reference pattern as `ContractAnnex.annexCode`), so it can change if
 * the contract is renamed even though `paymentNumber` itself never does.
 * Creating one requires `Contract.sellerSigned && Contract.buyerSigned`
 * (backend returns `400` otherwise) — updating an existing one does not
 * re-check this.
 * @typedef {Object} PaymentSchedule
 * @property {string} id
 * @property {string} contractId
 * @property {number} paymentNumber
 * @property {string} paymentCode
 * @property {string} paymentDate - ISO date (YYYY-MM-DD)
 * @property {number} amount
 * @property {PaymentType} type
 * @property {string | null} note
 */

/**
 * @typedef {Object} PaymentScheduleFormValues
 * @property {string} paymentDate - ISO date (YYYY-MM-DD)
 * @property {number | undefined} amount
 * @property {PaymentType | ''} type
 * @property {string} note
 */
