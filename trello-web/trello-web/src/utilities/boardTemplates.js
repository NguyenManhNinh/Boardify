export const BOARD_TEMPLATES = [
  {
    id: 'kanban-basic',
    name: 'Kanban Cơ bản',
    category: 'Làm việc nhóm',
    description: 'Quy trình Kanban tiêu chuẩn để quản lý công việc.',
    thumbnailColor: '#0c66e4',
    columns: [
      { title: 'Cần làm', cards: ['Nghiên cứu yêu cầu', 'Lên kế hoạch'] },
      { title: 'Đang làm', cards: ['Thiết kế giao diện', 'Viết code'] },
      { title: 'Đã xong', cards: ['Kiểm thử', 'Triển khai'] }
    ]
  },
  {
    id: 'project-management',
    name: 'Quản lý Dự án',
    category: 'Làm việc nhóm',
    description: 'Theo dõi tiến độ dự án với các giai đoạn chi tiết.',
    thumbnailColor: '#00c2e0',
    columns: [
      { title: 'Ý tưởng', cards: ['Brainstorming', 'Phân tích khả thi'] },
      { title: 'Lập kế hoạch', cards: ['Phân bổ nguồn lực', 'Timeline'] },
      { title: 'Thực thi', cards: [] },
      { title: 'Kiểm soát', cards: [] },
      { title: 'Đóng dự án', cards: [] }
    ]
  },
  {
    id: 'study-plan',
    name: 'Học tập / Ôn thi',
    category: 'Học tập',
    description: 'Lên lịch ôn tập và theo dõi bài tập.',
    thumbnailColor: '#7bc86c',
    columns: [
      { title: 'Môn học', cards: ['Toán cao cấp', 'Lập trình Web', 'Cơ sở dữ liệu'] },
      { title: 'Bài tập về nhà', cards: ['Bài tập chương 1', 'Lab 2'] },
      { title: 'Đang ôn', cards: [] },
      { title: 'Đã hoàn thành', cards: [] }
    ]
  },
  {
    id: 'personal-goals',
    name: 'Mục tiêu Cá nhân',
    category: 'Cá nhân',
    description: 'Theo dõi mục tiêu năm và thói quen hàng ngày.',
    thumbnailColor: '#f5dd29',
    columns: [
      { title: 'Mục tiêu năm', cards: ['Học tiếng Anh', 'Tập gym'] },
      { title: 'Tháng này', cards: [] },
      { title: 'Tuần này', cards: [] },
      { title: 'Hôm nay', cards: [] },
      { title: 'Đạt được', cards: [] }
    ]
  },
  {
    id: 'weekly-planner',
    name: 'Lịch tuần',
    category: 'Cá nhân',
    description: 'Lên kế hoạch cho cả tuần làm việc hiệu quả.',
    thumbnailColor: '#ff8ed4',
    columns: [
      { title: 'Thứ 2', cards: [] },
      { title: 'Thứ 3', cards: [] },
      { title: 'Thứ 4', cards: [] },
      { title: 'Thứ 5', cards: [] },
      { title: 'Thứ 6', cards: [] },
      { title: 'Cuối tuần', cards: [] }
    ]
  },
      {
      id: 'bug-tracking',
      name: 'Theo dõi Bug',
      category: 'Làm việc nhóm',
      description: 'Quản lý lỗi từ lúc báo cáo đến khi fix xong và deploy.',
      thumbnailColor: '#e74c3c',
      columns: [
        { title: 'Backlog', cards: ['Bug: Lỗi hiển thị avatar trên mobile', 'Bug: Lọc theo label không hoạt động'] },
        { title: 'Cần tái hiện (To Reproduce)', cards: ['Bug: 500 khi tạo board không có tên'] },
        { title: 'Đang fix', cards: ['Bug: Lỗi CORS khi gọi /api/auth/profile'] },
        { title: 'Chờ review', cards: ['PR #128 – Sửa throttle cho endpoint /search'] },
        { title: 'Hoàn thành', cards: ['Bug: Lệch timezone ở due date', 'Bug: Trùng invite email'] }
      ]
    },
    {
      id: 'marketing-campaign',
      name: 'Chiến dịch Marketing',
      category: 'Kinh doanh',
      description: 'Lập kế hoạch, nội dung, thiết kế và triển khai chiến dịch.',
      thumbnailColor: '#9b59b6',
      columns: [
        { title: 'Nghiên cứu', cards: ['Phân tích đối thủ', 'Xác định chân dung khách hàng'] },
        { title: 'Nội dung (Content)', cards: ['Outline bài blog #1', 'Kịch bản video 30s', 'Key message & CTA'] },
        { title: 'Thiết kế (Design)', cards: ['Banner Facebook', 'Thumbnail YouTube', 'KV chủ đạo'] },
        { title: 'Chuẩn bị Launch', cards: ['Lịch đăng bài', 'Thiết lập UTM tracking', 'Setup Landing Page'] },
        { title: 'Đang chạy (Live)', cards: ['Chạy ads nhóm A/B', 'Tối ưu ngân sách ngày 1-3'] },
        { title: 'Tổng kết', cards: ['Báo cáo KPI', 'Rút kinh nghiệm & đề xuất vòng sau'] }
      ]
    }
]
