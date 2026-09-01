/**
 * Fixed annex type set — mirrors the backend's
 * `CompanyManagement.Domain.Contracts.ContractAnnexType` enum (BE-kt-xnk)
 * exactly, so the string sent in `CreateContractAnnexRequest.Type` /
 * `UpdateContractAnnexRequest.Type` round-trips without a mapping layer.
 * @type {import('../types/index.js').ContractAnnexType[]}
 */
export const CONTRACT_ANNEX_TYPES = [
  'AmountIncrease',
  'AmountDecrease',
  'ValueChange',
];

export const contractAnnexTypeOptions = [
  { value: 'AmountIncrease', label: 'Phát sinh tăng tiền' },
  { value: 'AmountDecrease', label: 'Phát sinh giảm tiền' },
  { value: 'ValueChange', label: 'Thay đổi giá trị' },
];

/** @param {import('../types/index.js').ContractAnnexType | string} type */
export function labelForContractAnnexType(type) {
  return (
    contractAnnexTypeOptions.find((option) => option.value === type)?.label ??
    type
  );
}
