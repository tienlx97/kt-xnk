import { z } from 'zod';

export const loginSchema = z.object({
  // System-generated at Register (e.g. "DNG26A1B2C3") — not CCCD anymore,
  // see BE-kt-xnk `openspec/changes/add-employee-code-login/`.
  employeeCode: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập mã nhân viên'),
  // Password format/strength is enforced by the backend; the client only
  // checks that something was typed.
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean(),
});
