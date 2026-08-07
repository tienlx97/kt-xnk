import { z } from 'zod';

// The username is a CCCD (Vietnamese Citizen ID, always 12 digits) under
// the hood, but the UI/copy deliberately doesn't say so — it's presented
// as a generic "username" field.
const USERNAME_PATTERN = /^\d{12}$/;

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên đăng nhập')
    .regex(USERNAME_PATTERN, 'Tên đăng nhập không hợp lệ'),
  // Minimum length is a placeholder until the backend defines its own
  // password policy.
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  rememberMe: z.boolean(),
});
