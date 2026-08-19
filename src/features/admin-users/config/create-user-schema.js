import { z } from 'zod';

const CURRENT_YEAR = new Date().getFullYear();
const TODAY_ISO = new Date().toISOString().slice(0, 10);

// Mirrors the backend's `RegisterCommandValidator` (BE-kt-xnk,
// `CompanyManagement.Application/Authentication/Commands/Register/`) —
// client-side validation is a UX nicety, the backend still re-validates
// everything for real.
export const createUserSchema = z
  .object({
    nationalId: z
      .string()
      .trim()
      .regex(/^\d{12}$/, 'CCCD phải gồm đúng 12 chữ số'),
    firstName: z.string().trim().min(1, 'Vui lòng nhập tên'),
    lastName: z.string().trim().min(1, 'Vui lòng nhập họ'),
    // Strength is enforced by the backend; the client only checks that
    // something was typed (same approach as the login form).
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
    yearOfBirth: z
      .number({ error: 'Vui lòng nhập năm sinh' })
      .int()
      .min(1900, 'Năm sinh không hợp lệ')
      .max(CURRENT_YEAR, 'Năm sinh không được ở tương lai'),
    gender: z.enum(['Male', 'Female', 'Other'], {
      error: 'Vui lòng chọn giới tính',
    }),
    nationalIdIssueDate: z
      .string()
      .min(1, 'Vui lòng chọn ngày cấp CCCD')
      .refine((value) => value <= TODAY_ISO, {
        message: 'Ngày cấp CCCD không được ở tương lai',
      }),
    nationalIdIssuePlace: z.string().trim().min(1, 'Vui lòng nhập nơi cấp CCCD'),
    passportNumber: z.string().trim().max(20, 'Số hộ chiếu tối đa 20 ký tự'),
    phone: z
      .string()
      .trim()
      .regex(/^0\d{9}$/, 'Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0'),
    addressType: z.enum(['OldUnits', 'NewUnits']),
    province: z.string().trim().min(1, 'Vui lòng nhập Tỉnh/Thành phố'),
    district: z.string().trim(),
    ward: z.string().trim().min(1, 'Vui lòng nhập Phường/Xã'),
    addressDetail: z.string().trim().min(1, 'Vui lòng nhập số nhà, tên đường'),
    positionId: z.string().min(1, 'Vui lòng chọn chức vụ'),
    companyId: z.string().min(1, 'Vui lòng chọn công ty'),
    branchId: z.string().min(1, 'Vui lòng chọn chi nhánh'),
    departmentId: z.string().min(1, 'Vui lòng chọn phòng ban'),
  })
  .refine(
    (values) => values.addressType !== 'OldUnits' || values.district !== '',
    {
      message: 'Địa chỉ theo chuẩn cũ bắt buộc phải có Quận/Huyện',
      path: ['district'],
    },
  )
  .refine(
    (values) => values.addressType !== 'NewUnits' || values.district === '',
    {
      message:
        'Địa chỉ theo chuẩn mới (sau sáp nhập) không còn cấp Quận/Huyện — để trống trường này',
      path: ['district'],
    },
  );
