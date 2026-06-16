// Flashcard từ vựng + lặp lại ngắt quãng ở MỨC TỪ (Leitner), lưu localStorage.
import { dateKey, addDays } from './stats.js'

const INTERVALS = [1, 3, 7, 16, 40]
const NEW_PER_SESSION = 10

function readCard(id) {
  try { const r = window.localStorage.getItem('se:card:' + id); return r ? JSON.parse(r) : null } catch { return null }
}
function writeCard(id, v) {
  try { window.localStorage.setItem('se:card:' + id, JSON.stringify(v)) } catch { /* noop */ }
}

// Gom thẻ từ vựng từ các hội thoại ĐÃ HOÀN THÀNH (để ôn cái đã học).
// Mỗi từ gốc là 1 thẻ; mỗi từ đồng nghĩa cũng là 1 thẻ riêng (có lịch ôn riêng).
export function buildPool(topicsMap, completedIds) {
  const pool = []
  for (const id of completedIds) {
    const t = topicsMap[id]
    if (!t || !Array.isArray(t.vocabulary)) continue
    for (const v of t.vocabulary) {
      const syns = Array.isArray(v.synonyms) ? v.synonyms : []
      pool.push({
        id: id + '::' + v.term,
        kind: 'word',
        term: v.term, ipa: v.ipa, vi: v.vi,
        example: v.example, exampleVi: v.exampleVi,
        synonyms: syns,
        topicId: id, topicTitle: t.title,
      })
      for (const s of syns) {
        pool.push({
          id: id + '::' + v.term + '::' + s.term,
          kind: 'synonym',
          term: s.term, ipa: s.ipa, register: s.register, nuanceVi: s.nuanceVi,
          headword: v.term, headwordVi: v.vi,
          topicId: id, topicTitle: t.title,
        })
      }
    }
  }
  return pool
}

export function reviewCard(id, rating) {
  const s = readCard(id) || { box: 1, reps: 0 }
  if (rating === 'again') s.box = 1
  else if (rating === 'good') s.box = Math.min(INTERVALS.length, s.box + 1)
  s.reps = (s.reps || 0) + 1
  s.last = dateKey()
  s.due = dateKey(addDays(new Date(), INTERVALS[s.box - 1]))
  writeCard(id, s)
}

// Phiên ôn = thẻ đến hạn + tối đa N thẻ mới (chưa từng ôn).
export function getSession(pool) {
  const today = dateKey()
  const due = [], fresh = []
  for (const c of pool) {
    const s = readCard(c.id)
    if (s) { if (s.due <= today) due.push(c) }
    else fresh.push(c)
  }
  return [...due, ...fresh.slice(0, NEW_PER_SESSION)]
}

export function dueCardCount(pool) {
  const today = dateKey()
  return pool.reduce((n, c) => { const s = readCard(c.id); return n + (s && s.due <= today ? 1 : 0) }, 0)
}
export function newCardCount(pool) {
  return pool.reduce((n, c) => n + (readCard(c.id) ? 0 : 1), 0)
}
export function learnedCount(pool) {
  return pool.reduce((n, c) => n + (readCard(c.id) ? 1 : 0), 0)
}
