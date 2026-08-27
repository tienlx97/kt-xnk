import { z } from 'zod';

import { CURRENCY_CODES } from './currencies.js';
import { INCOTERM_CODES } from './incoterms.js';

const CURRENT_YEAR = new Date().getFullYear();

const paymentTermSchema = z.object({
  paymentRatioPercent: z
    .number({ error: 'Vui lòng nhập tỷ lệ' })
    .positive('Tỷ lệ phải lớn hơn 0'),
  paymentCondition: z.string().trim().min(1, 'Vui lòng nhập điều kiện thanh toán'),
});

/**
 * Mirrors the backend's `CreateContractCommandValidator`/
 * `UpdateContractCommandValidator` (BE-kt-xnk): required header fields,
 * `contractValue > 0`, payment terms non-empty and summing to 100, and
 * Party A needing either a source customer or a typed-in company name.
 * `companyId` is intentionally not in this schema — it only narrows the
 * Branch selector client-side, the backend never sees it. `branchId` is
 * deliberately unvalidated (may be `''`) — the backend accepts a `null`
 * branch, restricted server-side to a caller with a global permission
 * grant (see `docs/api/Contracts.md`, BE-kt-xnk).
 */
export const contractSchema = z
  .object({
    contractNumber: z.string().trim().min(1, 'Vui lòng nhập số hợp đồng'),
    createdDate: z.string().min(1, 'Vui lòng chọn ngày tạo hợp đồng'),
    quotationDate: z.string().min(1, 'Vui lòng chọn ngày báo giá'),
    projectName: z.string().trim().min(1, 'Vui lòng nhập tên dự án'),
    category: z.string().trim().min(1, 'Vui lòng nhập hạng mục'),
    exportCountry: z.string().trim().min(1, 'Vui lòng nhập nước xuất khẩu'),
    contractValue: z
      .number({ error: 'Vui lòng nhập giá trị hợp đồng' })
      .positive('Giá trị hợp đồng phải lớn hơn 0'),
    currency: z.enum(CURRENCY_CODES, { error: 'Vui lòng chọn đơn vị tiền tệ' }),
    incoterm: z.enum(INCOTERM_CODES, { error: 'Vui lòng chọn Incoterm' }),
    incotermYear: z
      .number({ error: 'Vui lòng nhập năm Incoterm' })
      .int()
      .min(2000, 'Năm Incoterm không hợp lệ')
      .max(CURRENT_YEAR + 1, 'Năm Incoterm không hợp lệ'),
    branchId: z.string(),
    sourceCustomerId: z.string(),
    partyAInline: z.object({
      companyName: z.string().trim(),
      representativeName: z.string().trim(),
      representativeTitle: z.string().trim(),
      address: z.string().trim(),
    }),
    paymentTerms: z
      .array(paymentTermSchema)
      .min(1, 'Cần ít nhất 1 đợt thanh toán'),
    bankIds: z.array(z.string()),
  })
  .refine(
    (values) =>
      Boolean(values.sourceCustomerId) ||
      values.partyAInline.companyName.trim().length > 0,
    {
      message: 'Chọn khách hàng có sẵn hoặc nhập tên công ty',
      path: ['partyAInline', 'companyName'],
    },
  )
  .refine(
    (values) => {
      const total = values.paymentTerms.reduce(
        (sum, term) => sum + term.paymentRatioPercent,
        0,
      );
      return Math.abs(total - 100) < 0.01;
    },
    {
      message: 'Tổng tỷ lệ các đợt thanh toán phải bằng 100%',
      path: ['paymentTerms'],
    },
  );
