import React from 'react'

const REGISTER_LABEL = { formal: 'Trang trọng', neutral: 'Trung tính', casual: 'Thân mật' }

// Nhãn mức trang trọng (register), tô màu theo quy ước trong SCHEMA.md.
export function RegisterBadge({ value }) {
  if (!value) return null
  return <span className={`badge reg-${value}`}>{REGISTER_LABEL[value] || value}</span>
}

// Nút loa: dùng Web Speech API (TTS của trình duyệt) — chạy offline, không cần file audio.
export function SpeakButton({ text }) {
  const speak = (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const u = new SpeechSynthesisUtterance(text.replace(/_+/g, ' '))
      u.lang = 'en-US'
      u.rate = 0.95
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    } catch {
      /* trình duyệt không hỗ trợ */
    }
  }
  return (
    <button className="speak-btn" onClick={speak} title="Nghe (đọc bằng giọng trình duyệt)" aria-label="Nghe phát âm">
      🔊
    </button>
  )
}

// Tiêu đề một mục nội dung.
export function Section({ id, title, sub, children }) {
  return (
    <section className="section" id={id}>
      <h2>{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
      {children}
    </section>
  )
}
