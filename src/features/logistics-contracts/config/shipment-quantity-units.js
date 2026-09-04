/**
 * Fixed quantity-unit set — mirrors the backend's
 * `CompanyManagement.Domain.Contracts.ShipmentQuantityUnit` enum
 * (BE-kt-xnk) exactly, so the string sent in
 * `CreateShipmentRequest.QuantityUnit` / `UpdateShipmentRequest.QuantityUnit`
 * round-trips without a mapping layer.
 * @type {import('../types/index.js').ShipmentQuantityUnit[]}
 */
export const SHIPMENT_QUANTITY_UNITS = ['Cont', 'Kien'];

export const shipmentQuantityUnitOptions = [
  { value: 'Cont', label: 'Cont' },
  { value: 'Kien', label: 'Kiện' },
];

/** @param {import('../types/index.js').ShipmentQuantityUnit | string} unit */
export function labelForShipmentQuantityUnit(unit) {
  return (
    shipmentQuantityUnitOptions.find((option) => option.value === unit)
      ?.label ?? unit
  );
}

/**
 * `QuantityUnit` is derived from `Type` on the backend now (2026-09-03) —
 * LCL ("hàng lẻ") is always Kiện, FCL always Cont — never an independent
 * client input. Mirrors `Shipment.QuantityUnit`'s computed getter
 * (BE-kt-xnk), so the form can preview it without waiting on a round trip.
 * @param {import('../types/index.js').ShipmentType | ''} type
 * @returns {import('../types/index.js').ShipmentQuantityUnit | ''}
 */
export function quantityUnitForShipmentType(type) {
  if (type === 'LCL') return 'Kien';
  if (type === 'FCL') return 'Cont';
  return '';
}
