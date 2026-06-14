// Thông báo trình duyệt (chỉ bắn khi web đang mở). Không cần backend.
import { dateKey } from './stats.js'
import { dueCount } from './srs.js'

export function notifyPermission() {
  return typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
}

export async function requestNotify() {
  if (typeof Notification === 'undefined') return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  try { return await Notification.requestPermission() } catch { return 'denied' }
}

// Khi mở web: nếu có bài đến hạn và hôm nay chưa nhắc thì bắn 1 thông báo.
export function maybeRemindReviews() {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  const today = dateKey()
  let last
  try { last = window.localStorage.getItem('se:lastNotified') } catch { /* */ }
  if (last === today) return
  const n = dueCount()
  if (n <= 0) return
  try {
    new Notification('Đến giờ ôn tập rồi! 🔁', {
      body: `Bạn có ${n} hội thoại cần ôn lại hôm nay để nhớ lâu hơn.`,
    })
    window.localStorage.setItem('se:lastNotified', today)
  } catch { /* */ }
}
