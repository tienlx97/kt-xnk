/**
 * Fixed Incoterms 2020 rule set — mirrors the backend's
 * `CompanyManagement.Domain.Contracts.Incoterm` enum (BE-kt-xnk) exactly, so
 * the string sent in `CreateContractRequest.Incoterm` round-trips without a
 * mapping layer.
 * @type {import('../types/index.js').Incoterm[]}
 */
export const INCOTERM_CODES = [
  'EXW',
  'FCA',
  'FAS',
  'FOB',
  'CFR',
  'CIF',
  'CPT',
  'CIP',
  'DAP',
  'DPU',
  'DDP',
];

export const incotermOptions = INCOTERM_CODES.map((code) => ({
  value: code,
  label: code,
}));
