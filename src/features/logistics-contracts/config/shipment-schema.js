import { z } from 'zod';

import { CURRENCY_CODES } from './currencies.js';
import { PAYMENT_TYPES } from './payment-schedule-types.js';
import { SHIPMENT_TYPES } from './shipment-types.js';

/**
 * Mirrors the backend's `CreateShipmentCommandValidator`/
 * `UpdateShipmentCommandValidator` (BE-kt-xnk). `shipmentNumber`/
 * `shipmentCode` are system-assigned and never part of this form; neither
 * is `quantityUnit` any more (2026-09-03) — it's derived from `type` on
 * the backend (LCL is always Kiện, FCL always Cont), never a client
 * input. `paymentCondition` reuses the same `TT`/`LC` set as
 * `PaymentSchedule`. `invoiceCurrency`/`declarationCurrency` are
 * constrained to the curated `CURRENCY_CODES` shortlist here (same choice
 * as `contract-schema.js`'s `currency`), narrower than the backend's free
 * 3-letter-code regex.
 */
export const shipmentSchema = z.object({
  supplierCustomerId: z
    .string()
    .trim()
    .min(1, 'Vui lòng chọn forwarder'),
  bookingNumber: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số booking')
    .max(100, 'Tối đa 100 ký tự'),
  billOfLadingNumber: z.string().trim().max(100, 'Tối đa 100 ký tự'),
  shippingLine: z.string().trim().max(100, 'Tối đa 100 ký tự'),
  vesselName: z.string().trim().max(200, 'Tối đa 200 ký tự'),
  type: z.enum(SHIPMENT_TYPES, { error: 'Vui lòng chọn loại hình' }),
  name: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên lô hàng')
    .max(200, 'Tối đa 200 ký tự'),
  paymentCondition: z.enum(PAYMENT_TYPES, {
    error: 'Vui lòng chọn điều kiện thanh toán',
  }),
  invoiceValue: z
    .number({ error: 'Vui lòng nhập giá trị invoice' })
    .positive('Giá trị phải lớn hơn 0'),
  invoiceCurrency: z.enum(CURRENCY_CODES, {
    error: 'Vui lòng chọn đơn vị tiền tệ',
  }),
  declarationValue: z
    .number({ error: 'Vui lòng nhập giá trị tờ khai' })
    .positive('Giá trị phải lớn hơn 0'),
  declarationCurrency: z.enum(CURRENCY_CODES, {
    error: 'Vui lòng chọn đơn vị tiền tệ',
  }),
  declarationExchangeRate: z
    .number({ error: 'Vui lòng nhập tỷ giá tờ khai' })
    .positive('Tỷ giá phải lớn hơn 0'),
  quantityAmount: z
    .number({ error: 'Vui lòng nhập số lượng' })
    .positive('Số lượng phải lớn hơn 0'),
  declarationWeightKg: z
    .number({ error: 'Vui lòng nhập khối lượng tờ khai' })
    .positive('Khối lượng phải lớn hơn 0'),
  coNumber: z.string().trim().max(50, 'Tối đa 50 ký tự'),
  coDeclarationDate: z.string(),
  coIssuedDate: z.string(),
});
