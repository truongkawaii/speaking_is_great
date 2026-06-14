// Nguồn sự thật cho hệ XP / streak / mục tiêu ngày. Tất cả lưu localStorage.

export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

function read(key, def) {
  try { const r = window.localStorage.getItem(key); return r ? JSON.parse(r) : def } catch { return def }
}
function write(key, val) {
  try { window.localStorage.setItem(key, JSON.stringify(val)) } catch { /* noop */ }
}

export const XP = { complete: 50, review: 30, ai: 20 }
const DEFAULT_GOAL = 100

export function getProfile() {
  return read('se:profile', { dailyGoalXp: DEFAULT_GOAL, createdAt: new Date().toISOString() })
}
export function setDailyGoal(xp) {
  const p = getProfile(); p.dailyGoalXp = xp; write('se:profile', p)
}

export function getDay(key = dateKey()) {
  return read('se:day:' + key, { xp: 0, completed: [], reviews: [], practicedAI: [] })
}
function setDay(key, d) { write('se:day:' + key, d) }

export function getStreak() {
  return read('se:streak', { current: 0, longest: 0, lastMetDate: null })
}

// Streak "hiệu lực": đứt nếu ngày đạt mục tiêu gần nhất không phải hôm nay/hôm qua.
export function effectiveStreak() {
  const s = getStreak()
  if (!s.lastMetDate) return 0
  const today = dateKey()
  const yesterday = dateKey(addDays(new Date(), -1))
  return s.lastMetDate === today || s.lastMetDate === yesterday ? s.current : 0
}

function bumpStreakIfGoalMet() {
  const today = dateKey()
  const day = getDay(today)
  const goal = getProfile().dailyGoalXp
  if (day.xp < goal) return
  const s = getStreak()
  if (s.lastMetDate === today) return
  const yesterday = dateKey(addDays(new Date(), -1))
  s.current = s.lastMetDate === yesterday ? s.current + 1 : 1
  s.longest = Math.max(s.longest, s.current)
  s.lastMetDate = today
  write('se:streak', s)
}

function addXp(amount, kind, topicId) {
  const today = dateKey()
  const day = getDay(today)
  day.xp += amount
  if (topicId && day[kind] && !day[kind].includes(topicId)) day[kind].push(topicId)
  setDay(today, day)
  bumpStreakIfGoalMet()
}

// XP hoàn thành: chỉ tính 1 lần/đời cho mỗi hội thoại.
export function creditCompletion(id) {
  const k = 'se:xp:complete:' + id
  try { if (window.localStorage.getItem(k)) return 0; window.localStorage.setItem(k, '1') } catch { /* */ }
  addXp(XP.complete, 'completed', id)
  return XP.complete
}
// XP ôn tập: 1 lần/ngày cho mỗi bài.
export function creditReview(id) {
  if (getDay().reviews.includes(id)) return 0
  addXp(XP.review, 'reviews', id)
  return XP.review
}
// XP tự khai "đã luyện với AI": 1 lần/ngày cho mỗi bài.
export function creditAiPractice(id) {
  if (getDay().practicedAI.includes(id)) return 0
  addXp(XP.ai, 'practicedAI', id)
  return XP.ai
}
export function practicedToday(id) {
  return getDay().practicedAI.includes(id)
}
// XP ôn flashcard từ vựng: +3 mỗi thẻ (gọi 1 lần cuối phiên ôn).
export function creditFlashcards(count) {
  if (count <= 0) return 0
  const xp = count * 3
  addXp(xp)
  return xp
}

/* ---------- Phân tích ---------- */
export function getAllDays() {
  const out = {}
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith('se:day:')) out[k.slice(7)] = read(k, null)
    }
  } catch { /* */ }
  return out
}
export function getTotalXp() {
  const all = getAllDays()
  return Object.values(all).reduce((s, d) => s + (d?.xp || 0), 0)
}
export function getLastDays(n) {
  const all = getAllDays()
  const out = []
  for (let i = n - 1; i >= 0; i--) {
    const key = dateKey(addDays(new Date(), -i))
    out.push({ date: key, xp: all[key]?.xp || 0 })
  }
  return out
}
export function daysStudied() {
  return Object.values(getAllDays()).filter((d) => (d?.xp || 0) > 0).length
}
export function getTotalReviews() {
  return Object.values(getAllDays()).reduce((s, d) => s + (d?.reviews?.length || 0), 0)
}

const LEVELS = [
  { name: 'Mới bắt đầu', min: 0 },
  { name: 'Sơ cấp', min: 300 },
  { name: 'Trung cấp', min: 1000 },
  { name: 'Khá', min: 2500 },
  { name: 'Thành thạo', min: 5000 },
  { name: 'Lưu loát', min: 9000 },
]
export function learnerLevel(totalXp = getTotalXp()) {
  let idx = 0
  for (let i = 0; i < LEVELS.length; i++) if (totalXp >= LEVELS[i].min) idx = i
  const cur = LEVELS[idx]
  const next = LEVELS[idx + 1] || null
  const progress = next ? Math.round(((totalXp - cur.min) / (next.min - cur.min)) * 100) : 100
  return { name: cur.name, index: idx, next, progress, totalXp }
}
