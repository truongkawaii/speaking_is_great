// Bookmark + tổng hợp ghi chú/hoàn thành từ localStorage cho trang "Của tôi".

export function isBookmarked(id) {
  try { return window.localStorage.getItem(`bookmark:${id}`) === 'true' } catch { return false }
}

export function setBookmarked(id, v) {
  try { window.localStorage.setItem(`bookmark:${id}`, v ? 'true' : 'false') } catch { /* noop */ }
}

function scanKeys(prefix) {
  const out = []
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith(prefix)) out.push(k.slice(prefix.length))
    }
  } catch { /* noop */ }
  return out
}

export function getBookmarkedIds() {
  return scanKeys('bookmark:').filter((id) => isBookmarked(id))
}

export function getCompletedIds() {
  return scanKeys('completed:').filter((id) => {
    try { return window.localStorage.getItem(`completed:${id}`) === 'true' } catch { return false }
  })
}

// Ghi chú lưu qua useLocalStorage nên giá trị là chuỗi JSON ("..."); cần parse lại.
export function getNotes() {
  const out = []
  for (const id of scanKeys('note:')) {
    try {
      const raw = window.localStorage.getItem(`note:${id}`)
      const text = JSON.parse(raw)
      if (text && String(text).trim()) out.push({ id, text: String(text) })
    } catch { /* bỏ qua giá trị hỏng */ }
  }
  return out
}
