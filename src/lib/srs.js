// Lặp lại ngắt quãng theo hệ Leitner 5 hộp. Lưu localStorage theo từng hội thoại.
import { dateKey, addDays } from './stats.js'

const INTERVALS = [1, 3, 7, 16, 40] // số ngày tương ứng hộp 1..5

function read(id) {
  try { const r = window.localStorage.getItem('se:srs:' + id); return r ? JSON.parse(r) : null } catch { return null }
}
function write(id, val) {
  try { window.localStorage.setItem('se:srs:' + id, JSON.stringify(val)) } catch { /* noop */ }
}

export function getSrs(id) { return read(id) }

// Khi hoàn thành lần đầu: đưa vào hộp 1, hẹn ôn sau 1 ngày.
export function scheduleNew(id) {
  if (read(id)) return
  write(id, { box: 1, due: dateKey(addDays(new Date(), INTERVALS[0])), last: dateKey(), reps: 0 })
}

// Ôn xong + tự chấm: 'again' về hộp 1 · 'ok' giữ hộp · 'good' lên hộp.
export function review(id, rating) {
  const s = read(id) || { box: 1, reps: 0 }
  if (rating === 'again') s.box = 1
  else if (rating === 'good') s.box = Math.min(INTERVALS.length, s.box + 1)
  s.reps = (s.reps || 0) + 1
  s.last = dateKey()
  s.due = dateKey(addDays(new Date(), INTERVALS[s.box - 1]))
  write(id, s)
}

export function isDue(id) {
  const s = read(id)
  return !!s && s.due <= dateKey()
}

// Quét mọi mục SRS, trả về danh sách id đến hạn ôn (due <= hôm nay).
export function getDueIds() {
  const today = dateKey()
  const out = []
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith('se:srs:')) {
        const s = JSON.parse(window.localStorage.getItem(k))
        if (s && s.due <= today) out.push(k.slice(7))
      }
    }
  } catch { /* */ }
  return out
}
export function dueCount() { return getDueIds().length }
