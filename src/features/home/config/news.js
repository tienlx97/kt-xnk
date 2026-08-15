/**
 * @typedef {{ src: string, width: number, height: number, alt: string }} NewsImage
 */

/**
 * @typedef {{
 *   id: string,
 *   category: string,
 *   categoryVariant: 'blue' | 'teal' | 'purple' | 'orange' | 'green',
 *   date: string,
 *   title: string,
 *   excerpt: string,
 *   image: NewsImage,
 *   href: string,
 *   isFeatured?: boolean,
 * }} NewsItem
 */

/**
 * Editorial news for the home page. Items flagged `isFeatured` fill the
 * full-bleed hero carousel at the top of the page; the rest fill the "Tin
 * tức" grid below it, newest first — so this one file is the only place to
 * edit when a story is published or promoted.
 *
 * `date` is an ISO `YYYY-MM-DD` string (formatted for display at render
 * time, never pre-formatted here). `image` points at a file under
 * `public/images/home/`; `width`/`height` are the real intrinsic pixel
 * dimensions, which `next/image` needs to reserve layout space.
 *
 * Placeholder copy and stock photography until a real CMS/news source
 * exists — same documented-placeholder pattern as `companies.js`.
 * @type {NewsItem[]}
 */
export const news = [
  {
    id: 'khoi-cong-cum-cong-nghiep',
    category: 'Dự án',
    categoryVariant: 'orange',
    date: '2026-08-12',
    title: 'Khởi công giai đoạn 2 cụm công nghiệp Bee Giao Yến',
    excerpt:
      'Giai đoạn 2 mở rộng thêm 18 ha hạ tầng kỹ thuật, dự kiến bàn giao mặt bằng cho nhà đầu tư thứ cấp từ quý 2 năm sau.',
    image: {
      src: '/images/home/hero-1.jpg',
      width: 1600,
      height: 700,
      alt: 'Cần cẩu tháp trên công trường xây dựng',
    },
    href: '/docs',
    isFeatured: true,
  },
  {
    id: 'an-toan-lao-dong-quy-3',
    category: 'An toàn',
    categoryVariant: 'teal',
    date: '2026-08-10',
    title: 'Tháng cao điểm an toàn lao động trên toàn hệ sinh thái',
    excerpt:
      'Toàn bộ công trường và nhà máy áp dụng quy trình kiểm tra thiết bị bảo hộ đầu ca, kèm chương trình đào tạo lại cho tổ đội thi công.',
    image: {
      src: '/images/home/hero-2.jpg',
      width: 1600,
      height: 700,
      alt: 'Công nhân xây dựng làm việc trên công trường',
    },
    href: '/docs/noi-quy-chung',
    isFeatured: true,
  },
  {
    id: 'nang-cap-day-chuyen-co-khi',
    category: 'Sản xuất',
    categoryVariant: 'purple',
    date: '2026-08-05',
    title: 'Cơ khí Đại Nghĩa nâng cấp dây chuyền lưới thép hàn',
    excerpt:
      'Dây chuyền mới nâng công suất thêm 30% và giảm tỉ lệ phế phẩm, phục vụ các đơn hàng kết cấu thép quy mô lớn.',
    image: {
      src: '/images/home/hero-3.jpg',
      width: 1600,
      height: 700,
      alt: 'Kỹ sư vận hành máy trong nhà máy cơ khí',
    },
    href: '/docs',
    isFeatured: true,
  },
  {
    id: 'chuyen-doi-so-noi-bo',
    category: 'Chuyển đổi số',
    categoryVariant: 'blue',
    date: '2026-08-02',
    title: 'Đưa cổng thông tin nội bộ vào vận hành chính thức',
    excerpt:
      'Toàn bộ nội quy, quy trình và hướng dẫn IT được tập trung về một nơi tra cứu duy nhất cho cán bộ nhân viên.',
    image: {
      src: '/images/home/hero-4.jpg',
      width: 1600,
      height: 700,
      alt: 'Cuộc họp nhóm trong văn phòng',
    },
    href: '/docs',
    isFeatured: true,
  },
  {
    id: 'ban-giao-cong-trinh-truong-hoc',
    category: 'Dự án',
    categoryVariant: 'orange',
    date: '2026-07-28',
    title: 'Chí Thành Construction bàn giao công trình đúng tiến độ',
    excerpt:
      'Công trình hoàn thành sớm hơn kế hoạch 12 ngày và đạt toàn bộ hạng mục nghiệm thu ngay từ lần kiểm tra đầu tiên.',
    image: {
      src: '/images/home/news-1.jpg',
      width: 800,
      height: 500,
      alt: 'Công trình kiến trúc vừa hoàn thiện',
    },
    href: '/docs',
  },
  {
    id: 'hoi-nghi-nguoi-lao-dong',
    category: 'Nội bộ',
    categoryVariant: 'green',
    date: '2026-07-22',
    title: 'Hội nghị người lao động thường niên 2026',
    excerpt:
      'Ban lãnh đạo đối thoại trực tiếp với đại diện các đơn vị về chính sách lương, thưởng và điều kiện làm việc.',
    image: {
      src: '/images/home/news-2.jpg',
      width: 800,
      height: 500,
      alt: 'Đại biểu tham dự hội nghị trong hội trường',
    },
    href: '/docs',
  },
  {
    id: 'tuyen-dung-ky-su',
    category: 'Nhân sự',
    categoryVariant: 'teal',
    date: '2026-07-18',
    title: 'Tuyển dụng kỹ sư công trường cho các dự án mới',
    excerpt:
      'Ưu tiên ứng viên nội bộ giới thiệu. Chi tiết vị trí và quyền lợi xem tại chuyên mục tuyển dụng nội bộ.',
    image: {
      src: '/images/home/news-3.jpg',
      width: 800,
      height: 500,
      alt: 'Kỹ sư đọc bản vẽ tại công trường',
    },
    href: '/docs',
  },
  {
    id: 'chung-nhan-he-thong-quan-ly',
    category: 'Chất lượng',
    categoryVariant: 'purple',
    date: '2026-07-11',
    title: 'Hoàn tất tái đánh giá hệ thống quản lý chất lượng',
    excerpt:
      'Kỳ đánh giá định kỳ không ghi nhận điểm không phù hợp nặng, các khuyến nghị đã có kế hoạch khắc phục trong 30 ngày.',
    image: {
      src: '/images/home/news-4.jpg',
      width: 800,
      height: 500,
      alt: 'Thợ hàn đang gia công kết cấu thép',
    },
    href: '/docs',
  },
  {
    id: 'bao-mat-tai-khoan',
    category: 'IT',
    categoryVariant: 'blue',
    date: '2026-07-04',
    title: 'Bật xác thực hai lớp cho toàn bộ tài khoản nội bộ',
    excerpt:
      'Phòng IT hỗ trợ cài đặt trực tiếp tại từng đơn vị. Tài khoản chưa bật sau thời hạn sẽ bị hạn chế truy cập từ xa.',
    image: {
      src: '/images/home/news-5.jpg',
      width: 800,
      height: 500,
      alt: 'Màn hình máy tính hiển thị dữ liệu',
    },
    href: '/docs/ho-tro-it',
  },
  {
    id: 'hop-tac-doi-tac',
    category: 'Đầu tư',
    categoryVariant: 'green',
    date: '2026-06-27',
    title: 'Ký kết hợp tác phát triển quỹ đất công nghiệp',
    excerpt:
      'Thỏa thuận mở đường cho việc mở rộng quỹ đất công nghiệp của hệ sinh thái trong ba năm tới.',
    image: {
      src: '/images/home/news-6.jpg',
      width: 800,
      height: 500,
      alt: 'Hai bên bắt tay sau lễ ký kết',
    },
    href: '/docs',
  },
];

/** News promoted to the home page hero carousel. */
export const featuredNews = news.filter((item) => item.isFeatured);

/** News shown in the "Tin tức" grid, i.e. everything not in the hero. */
export const latestNews = news.filter((item) => !item.isFeatured);
