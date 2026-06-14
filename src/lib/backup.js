// Sao lưu / khôi phục toàn bộ dữ liệu người dùng trong localStorage.
const PREFIXES = ['completed:', 'note:', 'selfcheck:', 'bookmark:', 'se:']
const EXACT = ['theme']

function isOurs(k) {
  return EXACT.includes(k) || PREFIXES.some((p) => k.startsWith(p))
}

export function collectData() {
  const data = {}
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && isOurs(k)) data[k] = window.localStorage.getItem(k)
    }
  } catch { /* noop */ }
  return data
}

export function exportString() {
  return JSON.stringify(
    { app: 'speaking-english', version: 1, exportedAt: new Date().toISOString(), data: collectData() },
    null, 2
  )
}

// Khôi phục: ghi đè các khóa thuộc về app. Trả về số khóa đã nạp.
export function importString(text) {
  const obj = JSON.parse(text)
  const data = obj && obj.data ? obj.data : obj
  if (!data || typeof data !== 'object') throw new Error('invalid')
  let n = 0
  for (const k in data) {
    if (isOurs(k) && typeof data[k] === 'string') { window.localStorage.setItem(k, data[k]); n++ }
  }
  return n
}
