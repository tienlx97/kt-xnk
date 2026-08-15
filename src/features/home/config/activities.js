/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   date: string,
 *   image: { src: string, width: number, height: number, alt: string },
 * }} Activity
 */

/**
 * Photos from internal activities — team building, site visits, training,
 * charity work. Rendered as a gallery grid that opens a fullscreen
 * lightbox, so every entry needs a real `alt` (screen readers) and a
 * `title` (used as the lightbox caption).
 *
 * `date` is an ISO `YYYY-MM-DD` string, formatted at render time.
 * Placeholder stock photography until real event photos are uploaded.
 * @type {Activity[]}
 */
export const activities = [
  {
    id: 'le-ky-ket',
    title: 'Lễ ký kết hợp tác với đối tác chiến lược',
    date: '2026-08-08',
    image: {
      src: '/images/home/activity-1.jpg',
      width: 800,
      height: 800,
      alt: 'Hai bên bắt tay tại lễ ký kết',
    },
  },
  {
    id: 'team-building',
    title: 'Team building khối văn phòng',
    date: '2026-07-26',
    image: {
      src: '/images/home/activity-2.jpg',
      width: 800,
      height: 800,
      alt: 'Đồng nghiệp cùng nhau trong hoạt động tập thể',
    },
  },
  {
    id: 'hop-tong-ket-quy',
    title: 'Họp tổng kết quý tại trụ sở chính',
    date: '2026-07-15',
    image: {
      src: '/images/home/activity-3.jpg',
      width: 800,
      height: 800,
      alt: 'Buổi họp tổng kết trong phòng làm việc',
    },
  },
  {
    id: 'ky-niem-thanh-lap',
    title: 'Kỷ niệm ngày thành lập công ty',
    date: '2026-06-30',
    image: {
      src: '/images/home/activity-4.jpg',
      width: 800,
      height: 800,
      alt: 'Không khí buổi lễ kỷ niệm',
    },
  },
  {
    id: 'kiem-tra-cong-truong',
    title: 'Ban lãnh đạo kiểm tra tiến độ công trường',
    date: '2026-06-18',
    image: {
      src: '/images/home/activity-5.jpg',
      width: 800,
      height: 800,
      alt: 'Kỹ sư kiểm tra tiến độ tại công trường',
    },
  },
  {
    id: 'dao-tao-noi-bo',
    title: 'Lớp đào tạo nghiệp vụ nội bộ',
    date: '2026-06-05',
    image: {
      src: '/images/home/activity-6.jpg',
      width: 800,
      height: 800,
      alt: 'Học viên trong lớp đào tạo nội bộ',
    },
  },
  {
    id: 'tham-nha-may',
    title: 'Đoàn tham quan nhà máy cơ khí',
    date: '2026-05-24',
    image: {
      src: '/images/home/activity-7.jpg',
      width: 800,
      height: 800,
      alt: 'Đoàn tham quan bên trong nhà máy',
    },
  },
  {
    id: 'sinh-hoat-chuyen-de',
    title: 'Sinh hoạt chuyên đề đầu tháng',
    date: '2026-05-09',
    image: {
      src: '/images/home/activity-8.jpg',
      width: 800,
      height: 800,
      alt: 'Nhân viên trao đổi trong buổi sinh hoạt chuyên đề',
    },
  },
];
