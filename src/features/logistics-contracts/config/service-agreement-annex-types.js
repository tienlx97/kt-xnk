/**
 * Fixed annex type set — mirrors the backend's
 * `CompanyManagement.Domain.Contracts.ServiceAgreementAnnexType` enum
 * (BE-kt-xnk) exactly, so the string sent in
 * `CreateServiceAgreementAnnexRequest.Type` /
 * `UpdateServiceAgreementAnnexRequest.Type` round-trips without a mapping
 * layer. Distinct from `ContractAnnexType` — `InfoChange`, not
 * `ValueChange`.
 * @type {import('../types/index.js').ServiceAgreementAnnexType[]}
 */
export const SERVICE_AGREEMENT_ANNEX_TYPES = [
  'AmountIncrease',
  'AmountDecrease',
  'InfoChange',
];

export const serviceAgreementAnnexTypeOptions = [
  { value: 'AmountIncrease', label: 'Phát sinh tăng' },
  { value: 'AmountDecrease', label: 'Phát sinh giảm' },
  { value: 'InfoChange', label: 'Thay đổi thông tin' },
];

/** @param {import('../types/index.js').ServiceAgreementAnnexType | string} type */
export function labelForServiceAgreementAnnexType(type) {
  return (
    serviceAgreementAnnexTypeOptions.find((option) => option.value === type)
      ?.label ?? type
  );
}
