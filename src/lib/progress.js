// Đọc/ghi trạng thái "đã hoàn thành" của từng hội thoại từ localStorage.
export function isCompleted(topicId) {
  try {
    return window.localStorage.getItem(`completed:${topicId}`) === 'true'
  } catch {
    return false
  }
}

export function setCompleted(topicId, done) {
  try {
    window.localStorage.setItem(`completed:${topicId}`, done ? 'true' : 'false')
  } catch {
    /* bỏ qua */
  }
}

// Thống kê tiến độ cho một danh sách hội thoại.
// availableIds = Set các id đã có file nội dung (do App suy ra từ data/topics/*.json).
export function progressFor(topics, availableIds) {
  const available = topics.filter((t) => availableIds.has(t.id))
  const done = available.filter((t) => isCompleted(t.id)).length
  return { done, available: available.length, planned: topics.length }
}
