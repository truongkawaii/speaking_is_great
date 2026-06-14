import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

// Prompt luyện với AI + nút copy để dán vào ChatGPT/Gemini.
export function AiPractice({ ai }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ai.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard không khả dụng */
    }
  }
  return (
    <div className="card ai-box">
      <p className="vi-soft" style={{ margin: 0 }}>{ai.intro}</p>
      <div className="ai-prompt">{ai.prompt}</div>
      <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={copy}>
        {copied ? '✓ Đã copy!' : '📋 Copy prompt luyện nói'}
      </button>
      {ai.advancedTips?.length > 0 && (
        <ul className="ai-tips bullets">
          {ai.advancedTips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      )}
    </div>
  )
}

// Checklist tự đánh giá, lưu trạng thái theo chủ đề.
export function SelfCheck({ topicId, items }) {
  const [checked, setChecked] = useLocalStorage(`selfcheck:${topicId}`, {})
  const toggle = (i) => setChecked((p) => ({ ...p, [i]: !p[i] }))
  return (
    <div className="card selfcheck">
      {items.map((item, i) => (
        <label key={i} className={checked[i] ? 'done' : ''}>
          <input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)} />
          <span>{item}</span>
        </label>
      ))}
    </div>
  )
}

// Ngăn ghi chú nổi: mở được từ bất kỳ tab nào, lưu vào localStorage theo chủ đề.
export function NotesDrawer({ topicId }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useLocalStorage(`note:${topicId}`, '')
  return (
    <>
      <button className="notes-fab" onClick={() => setOpen((o) => !o)} title="Ghi chú">
        📝 Ghi chú{note ? ' •' : ''}
      </button>
      {open && (
        <div className="notes-drawer">
          <div className="notes-drawer-head">
            <span>📝 Ghi chú của tôi</span>
            <button className="drawer-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Lỗi hay mắc, câu muốn nhớ, từ mới…"
          />
          <div className="notes-saved">Tự động lưu trên máy bạn.</div>
        </div>
      )}
    </>
  )
}
