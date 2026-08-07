import { z } from 'zod';

// CCCD (Vietnamese Citizen ID) is always 12 digits.
const CCCD_PATTERN = /^\d{12}$/;

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số căn cước công dân')
    .regex(CCCD_PATTERN, 'Số căn cước công dân phải gồm đúng 12 chữ số'),
  // Minimum length is a placeholder until the backend defines its own
  // password policy.
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  rememberMe: z.boolean(),
});
