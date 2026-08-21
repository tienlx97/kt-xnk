import { z } from 'zod';

const CURRENT_YEAR = new Date().getFullYear();
const TODAY_ISO = new Date().toISOString().slice(0, 10);

// Same shape as `create-user-schema.js` minus `password` — the backend's
// `PUT /users/{userId}` (BE-kt-xnk, `UpdateUserCommandValidator`) doesn't
// accept it (its own reset endpoint exists for that). `nationalId` IS
// accepted and editable here: the login identifier is the system-generated
// `EmployeeCode`, not CCCD, so correcting a mistyped CCCD is now a normal
// field edit (BE-kt-xnk `openspec/changes/add-employee-code-login/`).
export const updateUserSchema = z.object({
  firstName: z.string().trim().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().trim().min(1, 'Vui lòng nhập họ'),
  nationalId: z
    .string()
    .trim()
    .regex(/^\d{12}$/, 'CCCD phải gồm đúng 12 chữ số'),
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
  // See `create-user-schema.js`: both address standards are always required.
  oldProvince: z.string().trim().min(1, 'Vui lòng chọn Tỉnh/Thành phố (chuẩn cũ)'),
  oldDistrict: z.string().trim().min(1, 'Vui lòng chọn Quận/Huyện (chuẩn cũ)'),
  oldWard: z.string().trim().min(1, 'Vui lòng chọn Phường/Xã (chuẩn cũ)'),
  oldAddressDetail: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số nhà, tên đường (chuẩn cũ)'),
  newProvince: z.string().trim().min(1, 'Vui lòng chọn Tỉnh/Thành phố (chuẩn mới)'),
  newWard: z.string().trim().min(1, 'Vui lòng chọn Phường/Xã (chuẩn mới)'),
  newAddressDetail: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số nhà, tên đường (chuẩn mới)'),
  positionId: z.string().min(1, 'Vui lòng chọn chức vụ'),
  companyId: z.string().min(1, 'Vui lòng chọn công ty'),
  branchId: z.string().min(1, 'Vui lòng chọn chi nhánh'),
  departmentId: z.string().min(1, 'Vui lòng chọn phòng ban'),
});
