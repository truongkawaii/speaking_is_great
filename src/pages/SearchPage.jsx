import React, { useState, useMemo } from 'react'
import { go } from '../hooks/useHashRoute.js'

const LEVELS = ['A2', 'B1', 'B2', 'C1']

function norm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export default function SearchPage({ index, categories, availableIds }) {
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('')
  const [cat, setCat] = useState('')

  const catName = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.title])), [categories])

  const results = useMemo(() => {
    const nq = norm(q.trim())
    return index.filter((t) => {
      if (level && t.level !== level) return false
      if (cat && t.category !== cat) return false
      if (nq && !norm(t.title).includes(nq) && !norm(t.titleEn).includes(nq)) return false
      return true
    })
  }, [q, level, cat, index])

  return (
    <div className="page">
      <h1 className="page-title">Tìm kiếm hội thoại</h1>

      <div className="search-controls">
        <input
          className="search-input"
          placeholder="Tìm theo tên (tiếng Việt hoặc tiếng Anh)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
        <div className="filter-row">
          <div className="chips">
            <span className="chips-label">Cấp độ:</span>
            <button className={`chip ${level === '' ? 'on' : ''}`} onClick={() => setLevel('')}>Tất cả</button>
            {LEVELS.map((l) => (
              <button key={l} className={`chip ${level === l ? 'on' : ''}`} onClick={() => setLevel(l)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="filter-row">
          <div className="chips">
            <span className="chips-label">Chủ đề:</span>
            <button className={`chip ${cat === '' ? 'on' : ''}`} onClick={() => setCat('')}>Tất cả</button>
            {categories.map((c) => (
              <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
                {c.icon} {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="search-count">{results.length} kết quả</div>

      <div className="topic-list">
        {results.map((t) => (
          <button className="topic-row" key={t.id} onClick={() => go(`#/t/${t.id}`)}>
            <span className="topic-row-main">
              <span className="topic-row-title">{t.title}</span>
              <span className="topic-row-en">{t.titleEn} · {catName[t.category]}</span>
            </span>
            <span className="topic-row-status">
              <span className="badge badge-level">{t.level}</span>
              <span className="chev">›</span>
            </span>
          </button>
        ))}
        {results.length === 0 && <p className="vi-soft">Không tìm thấy hội thoại phù hợp.</p>}
      </div>
    </div>
  )
}
