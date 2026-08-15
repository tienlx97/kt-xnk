/**
 * @typedef {{
 *   id: string,
 *   tag: string,
 *   tagVariant: 'blue' | 'teal' | 'purple' | 'orange' | 'red',
 *   date: string,
 *   title: string,
 *   href: string,
 *   isPinned?: boolean,
 * }} Announcement
 */

/**
 * Official internal notices ("Thông báo") — short, dated, administrative,
 * and deliberately image-free. This is the counterpart to `news.js`: news
 * is editorial and illustrated, a notice is a one-line instruction people
 * scan for. Keeping them in separate files (and separate sections) is what
 * stops the home page from showing the same item twice in two shapes.
 *
 * `date` is an ISO `YYYY-MM-DD` string, formatted at render time.
 * `isPinned` floats a notice to the top regardless of date.
 * @type {Announcement[]}
 */
export const announcements = [
  {
    id: 'lich-nghi-le-quoc-khanh',
    tag: 'Nhân sự',
    tagVariant: 'red',
    date: '2026-08-14',
    title: 'Lịch nghỉ lễ Quốc khánh 2/9 và bố trí trực đơn vị',
    href: '/docs/nghi-phep',
    isPinned: true,
  },
  {
    id: 'cap-nhat-quy-trinh-cham-cong',
    tag: 'Nội quy',
    tagVariant: 'teal',
    date: '2026-08-11',
    title: 'Cập nhật quy trình chấm công và duyệt làm thêm giờ',
    href: '/docs/cham-cong',
  },
  {
    id: 'bao-tri-he-thong-cuoi-tuan',
    tag: 'IT',
    tagVariant: 'purple',
    date: '2026-08-09',
    title: 'Bảo trì hệ thống email và mạng nội bộ cuối tuần này',
    href: '/docs/ho-tro-it',
  },
  {
    id: 'kiem-ke-tai-san',
    tag: 'Hành chính',
    tagVariant: 'orange',
    date: '2026-08-06',
    title: 'Kiểm kê tài sản, thiết bị công ty đợt tháng 8',
    href: '/docs',
  },
  {
    id: 'quy-dinh-bao-mat-thong-tin',
    tag: 'Bảo mật',
    tagVariant: 'blue',
    date: '2026-08-01',
    title: 'Nhắc lại quy định bảo mật thông tin và dữ liệu khách hàng',
    href: '/docs/bao-mat',
  },
];
