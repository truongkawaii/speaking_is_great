// Định nghĩa huy hiệu + tính trạng thái đạt được từ dữ liệu người dùng.
// Mỗi badge: check(ctx) trả về true nếu đã đạt.
const BADGES = [
  { id: 'first', icon: '🌟', title: 'Bước đầu tiên', desc: 'Hoàn thành hội thoại đầu tiên', check: (c) => c.completed >= 1 },
  { id: 'ten', icon: '📚', title: 'Chăm chỉ', desc: 'Hoàn thành 10 hội thoại', check: (c) => c.completed >= 10 },
  { id: 'fifty', icon: '🎓', title: 'Kiên trì', desc: 'Hoàn thành 50 hội thoại', check: (c) => c.completed >= 50 },
  { id: 'hundred', icon: '💯', title: 'Cột mốc 100', desc: 'Hoàn thành 100 hội thoại', check: (c) => c.completed >= 100 },
  { id: 'all', icon: '🏆', title: 'Toàn tập', desc: 'Hoàn thành tất cả 168 hội thoại', check: (c) => c.completed >= c.totalTopics },
  { id: 'firstC1', icon: '🚀', title: 'Chạm C1', desc: 'Hoàn thành một bài cấp độ C1', check: (c) => c.c1Done >= 1 },
  { id: 'catComplete', icon: '🗂️', title: 'Trọn chủ đề', desc: 'Hoàn thành trọn một chủ đề lớn', check: (c) => c.anyCategoryComplete },
  { id: 'explorer', icon: '🧭', title: 'Khám phá', desc: 'Học ở cả 8 chủ đề lớn', check: (c) => c.categoriesTouched >= c.totalCategories },
  { id: 'streak3', icon: '🔥', title: 'Chuỗi 3 ngày', desc: 'Đạt mục tiêu 3 ngày liên tiếp', check: (c) => c.longestStreak >= 3 },
  { id: 'streak7', icon: '🔥', title: 'Chuỗi 7 ngày', desc: 'Đạt mục tiêu 7 ngày liên tiếp', check: (c) => c.longestStreak >= 7 },
  { id: 'streak30', icon: '⚡', title: 'Chuỗi 30 ngày', desc: 'Đạt mục tiêu 30 ngày liên tiếp', check: (c) => c.longestStreak >= 30 },
  { id: 'xp1000', icon: '💎', title: '1.000 XP', desc: 'Tích lũy 1.000 XP', check: (c) => c.totalXp >= 1000 },
  { id: 'xp5000', icon: '👑', title: '5.000 XP', desc: 'Tích lũy 5.000 XP', check: (c) => c.totalXp >= 5000 },
  { id: 'reviewer', icon: '🔁', title: 'Ôn đều', desc: 'Hoàn thành 10 lượt ôn tập', check: (c) => c.totalReviews >= 10 },
]

export function computeBadges(ctx) {
  return BADGES.map((b) => ({ ...b, earned: !!b.check(ctx) }))
}
