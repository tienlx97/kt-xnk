import { z } from 'zod';

export const loginSchema = z.object({
  nationalId: z
    .string()
    .trim()
    .regex(/^\d{12}$/, 'CCCD phải gồm đúng 12 chữ số'),
  // Password format/strength is enforced by the backend; the client only
  // checks that something was typed.
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean(),
});
