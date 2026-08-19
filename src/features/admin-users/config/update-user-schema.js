import { z } from 'zod';

// Same shape as `create-user-schema.js` minus `nationalId`/`password` — the
// backend's `PUT /users/{userId}` (BE-kt-xnk, `UpdateUserCommandValidator`)
// doesn't accept either (national ID is immutable, password has its own
// reset endpoint).
export const updateUserSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Vui lòng nhập tên'),
    lastName: z.string().trim().min(1, 'Vui lòng nhập họ'),
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
