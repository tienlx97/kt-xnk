/**
 * Fixed payment type set — mirrors the backend's
 * `CompanyManagement.Domain.Contracts.PaymentType` enum (BE-kt-xnk)
 * exactly, so the string sent in `CreatePaymentScheduleRequest.Type` /
 * `UpdatePaymentScheduleRequest.Type` round-trips without a mapping layer.
 * `/` isn't a valid enum identifier, so "T/T" is `TT` and "L/C" is `LC`.
 * @type {import('../types/index.js').PaymentType[]}
 */
export const PAYMENT_TYPES = ['TT', 'LC'];

export const paymentTypeOptions = [
  { value: 'TT', label: 'T/T' },
  { value: 'LC', label: 'L/C' },
];

/** @param {import('../types/index.js').PaymentType | string} type */
export function labelForPaymentType(type) {
  return (
    paymentTypeOptions.find((option) => option.value === type)?.label ?? type
  );
}
