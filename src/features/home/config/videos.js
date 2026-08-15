/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   description: string,
 *   duration: string,
 *   date: string,
 *   youtubeId: string,
 *   thumbnail: { src: string, width: number, height: number, alt: string },
 * }} VideoClip
 */

/**
 * Video clips shown on the home page. Each card renders a local thumbnail
 * and only loads the YouTube player once the user opens it (facade
 * pattern), so an unwatched video costs nothing on first paint.
 *
 * `youtubeId` is the `v=` parameter of a YouTube URL. The values below are
 * Blender Foundation open movies (Creative Commons) used purely as working
 * placeholders — replace them with the real internal video IDs; nothing
 * else needs to change. `thumbnail` points at a file under
 * `public/images/home/` rather than YouTube's CDN, so the grid renders
 * without an external image host.
 *
 * `duration` is display text (`m:ss`), not a parsed value.
 * @type {VideoClip[]}
 */
export const videos = [
  {
    id: 'gioi-thieu-tap-doan',
    title: 'Giới thiệu Đại Nghĩa Group',
    description:
      'Toàn cảnh hệ sinh thái 6 công ty thành viên: lĩnh vực hoạt động, năng lực thi công và định hướng phát triển.',
    duration: '3:42',
    date: '2026-08-01',
    youtubeId: 'aqz-KE-bpKQ',
    thumbnail: {
      src: '/images/home/video-1.jpg',
      width: 960,
      height: 540,
      alt: 'Toàn cảnh công trình của tập đoàn',
    },
  },
  {
    id: 'an-toan-lao-dong',
    title: 'Hướng dẫn an toàn lao động tại công trường',
    description:
      'Quy tắc bảo hộ, kiểm tra thiết bị đầu ca và xử lý tình huống khẩn cấp.',
    duration: '6:15',
    date: '2026-07-20',
    youtubeId: 'eRsGyueVLvQ',
    thumbnail: {
      src: '/images/home/video-2.jpg',
      width: 960,
      height: 540,
      alt: 'Công nhân làm việc trong khu vực sản xuất',
    },
  },
  {
    id: 'quy-trinh-san-xuat',
    title: 'Bên trong nhà máy Cơ khí Đại Nghĩa',
    description:
      'Dây chuyền kết cấu thép và lưới thép hàn từ khâu nguyên liệu đến thành phẩm.',
    duration: '4:58',
    date: '2026-07-02',
    youtubeId: 'R6MlUcmOul8',
    thumbnail: {
      src: '/images/home/video-3.jpg',
      width: 960,
      height: 540,
      alt: 'Dây chuyền sản xuất trong nhà máy',
    },
  },
  {
    id: 'du-an-tieu-bieu',
    title: 'Dự án tiêu biểu năm 2026',
    description:
      'Điểm lại các công trình đã bàn giao và những dự án đang triển khai.',
    duration: '5:27',
    date: '2026-06-14',
    youtubeId: 'TLkA0RELQ1g',
    thumbnail: {
      src: '/images/home/video-4.jpg',
      width: 960,
      height: 540,
      alt: 'Khu vực khai thác và tập kết vật liệu',
    },
  },
];
