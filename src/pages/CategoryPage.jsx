import React from 'react'
import { go } from '../hooks/useHashRoute.js'
import { isCompleted } from '../lib/progress.js'

const LEVEL_ORDER = ['A2', 'B1', 'B2', 'C1']

export default function CategoryPage({ category, index, availableIds }) {
  const topics = index.filter((t) => t.category === category.id)

  // Nhóm theo cấp độ để người dùng thấy lộ trình tăng dần tới C1.
  const groups = LEVEL_ORDER.map((lvl) => ({
    level: lvl,
    items: topics.filter((t) => t.level === lvl),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="page">
      <div className="cat-head" style={{ '--cat': category.color }}>
        <button className="back-link" onClick={() => go('#/')}>← Trang chủ</button>
        <div className="cat-head-row">
          <span className="cat-head-icon">{category.icon}</span>
          <div>
            <h1>{category.title}</h1>
            <p className="subtitle">{category.titleEn} · {category.levelRange}</p>
          </div>
        </div>
        <p className="cat-head-desc">{category.description}</p>
      </div>

      {groups.map((g) => (
        <section className="level-group" key={g.level}>
          <h2 className="level-heading"><span className="badge badge-level">{g.level}</span></h2>
          <div className="topic-list">
            {g.items.map((t) => {
              const available = availableIds.has(t.id)
              const done = available && isCompleted(t.id)
              return (
                <button
                  className={`topic-row ${available ? '' : 'planned'}`}
                  key={t.id}
                  disabled={!available}
                  onClick={() => available && go(`#/t/${t.id}`)}
                >
                  <span className="topic-row-main">
                    <span className="topic-row-title">{t.title}</span>
                    <span className="topic-row-en">{t.titleEn}</span>
                  </span>
                  <span className="topic-row-status">
                    {done && <span className="tick">✓</span>}
                    {available ? <span className="chev">›</span> : <span className="soon">đang biên soạn</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
