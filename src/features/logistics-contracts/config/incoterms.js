/**
 * Fixed Incoterms 2020 rule set — mirrors the backend's
 * `CompanyManagement.Domain.Contracts.Incoterm` enum (BE-kt-xnk) exactly, so
 * the string sent in `CreateContractRequest.Incoterm` round-trips without a
 * mapping layer.
 * @type {import('../types/index.js').Incoterm[]}
 */
export const INCOTERM_CODES = ['EXW', 'FOB', 'CIF', 'DDP'];

export const incotermOptions = INCOTERM_CODES.map((code) => ({
  value: code,
  label: code,
}));

/**
 * Incoterms whose place of discharge is meaningful: DDP/CIF carry the
 * seller's obligation through to a destination in the export country, so
 * `Contract.placeOfDischarge` is picked from that country's `Place`
 * catalog and required. FOB/EXW end at origin — the buyer arranges
 * carriage onward, so `placeOfDischarge` is always sent as `null` for
 * them (see `ContractFormDialog`, which disables and clears the field for
 * these two).
 * @param {import('../types/index.js').Incoterm | ''} incoterm
 * @returns {boolean}
 */
export function requiresPlaceOfDischarge(incoterm) {
  return incoterm === 'DDP' || incoterm === 'CIF';
}
