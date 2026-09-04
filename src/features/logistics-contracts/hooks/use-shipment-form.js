'use client';

import { useState } from 'react';

import { shipmentSchema } from '../config/shipment-schema.js';
import { useCustomersQuery } from './use-customers-query.js';
import {
  useCreateShipmentMutation,
  useUpdateShipmentMutation,
} from './use-shipments-query.js';

/** @returns {import('../types/index.js').ShipmentFormValues} */
function emptyValues() {
  return {
    supplierCustomerId: '',
    bookingNumber: '',
    billOfLadingNumber: '',
    shippingLine: '',
    vesselName: '',
    type: '',
    name: '',
    paymentCondition: '',
    invoiceValue: undefined,
    invoiceCurrency: '',
    declarationValue: undefined,
    declarationCurrency: '',
    declarationExchangeRate: undefined,
    quantityAmount: undefined,
    declarationWeightKg: undefined,
  };
}

/** @param {import('../types/index.js').Shipment} shipment */
function valuesFromShipment(shipment) {
  return {
    supplierCustomerId: shipment.supplierCustomerId,
    bookingNumber: shipment.bookingNumber,
    billOfLadingNumber: shipment.billOfLadingNumber ?? '',
    shippingLine: shipment.shippingLine ?? '',
    vesselName: shipment.vesselName ?? '',
    type: shipment.type,
    name: shipment.name,
    paymentCondition: shipment.paymentCondition,
    invoiceValue: shipment.invoiceValue,
    invoiceCurrency: shipment.invoiceCurrency,
    declarationValue: shipment.declarationValue,
    declarationCurrency: shipment.declarationCurrency,
    declarationExchangeRate: shipment.declarationExchangeRate,
    quantityAmount: shipment.quantityAmount,
    declarationWeightKg: shipment.declarationWeightKg,
  };
}

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

/**
 * Form state for creating/updating a `Shipment`. Pass `shipment` to edit an
 * existing one — `shipmentNumber`/`shipmentCode` are never editable
 * (backend-assigned), so they never appear in `values`.
 * @param {{
 *   contractId: string,
 *   shipment?: import('../types/index.js').Shipment | null,
 *   onSuccess?: (shipment: import('../types/index.js').Shipment) => void,
 * }} options
 */
export function useShipmentForm({ contractId, shipment = null, onSuccess }) {
  const [values, setValues] = useState(
    shipment ? valuesFromShipment(shipment) : emptyValues(),
  );
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');

  const customersQuery = useCustomersQuery();
  const createMutation = useCreateShipmentMutation(contractId);
  const updateMutation = useUpdateShipmentMutation(contractId);

  /**
   * @template {keyof import('../types/index.js').ShipmentFormValues} K
   * @param {K} field
   * @param {import('../types/index.js').ShipmentFormValues[K]} value
   */
  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function reset() {
    setValues(shipment ? valuesFromShipment(shipment) : emptyValues());
    setFieldErrors({});
    setSubmitError('');
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} [event] */
  async function handleSubmit(event) {
    event?.preventDefault();
    setSubmitError('');

    const result = shipmentSchema.safeParse(values);
    if (!result.success) {
      /** @type {Record<string, string>} */
      const nextFieldErrors = {};
      for (const issue of result.error.issues) {
        nextFieldErrors[String(issue.path[0])] = issue.message;
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});

    const mutationResult = shipment
      ? await updateMutation.mutateAsync({
          shipmentId: shipment.id,
          values: result.data,
        })
      : await createMutation.mutateAsync(result.data);

    if (!mutationResult.success) {
      setSubmitError(mutationResult.message);
      return;
    }

    onSuccess?.(mutationResult.shipment);
    if (!shipment) reset();
  }

  return {
    values,
    setField,
    fieldStatuses: Object.fromEntries(
      Object.entries(fieldErrors).map(([key, message]) => [
        key,
        fieldStatus(message),
      ]),
    ),
    customers: customersQuery.data?.success
      ? customersQuery.data.customers
      : [],
    submitError,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleSubmit,
    reset,
  };
}
