import React from 'react'
import { go } from '../hooks/useHashRoute.js'
import { progressFor } from '../lib/progress.js'
import { getDay, getProfile, effectiveStreak, learnerLevel } from '../lib/stats.js'
import { dueCount } from '../lib/srs.js'
import { Ring } from '../components/Ring.jsx'

export default function HomePage({ categories, index, availableIds }) {
  const topicsByCat = (catId) => index.filter((t) => t.category === catId)

  const todayXp = getDay().xp
  const goal = getProfile().dailyGoalXp
  const streak = effectiveStreak()
  const due = dueCount()
  const level = learnerLevel()

  return (
    <div className="page">
      <header className="home-hero">
        <h1>Học đủ nội dung — tự luyện nói với AI</h1>
        <p>
          Mỗi hội thoại cho bạn từ vựng, mẫu câu và tình huống thực tế. Đi hết lộ trình
          để giao tiếp tự tin từ <b>A2 đến C1</b>.
        </p>
      </header>

      <div className="daily-card">
        <div className="daily-ring">
          <Ring value={Math.min(100, Math.round((todayXp / goal) * 100))} size={86} />
          <div className="daily-ring-label">
            <b>{todayXp}</b><span>/{goal} XP</span>
          </div>
        </div>
        <div className="daily-info">
          <div className="daily-stats">
            <span className="daily-stat">🔥 <b>{streak}</b> ngày</span>
            <span className="daily-stat">🏅 {level.name}</span>
          </div>
          <div className="daily-msg">
            {todayXp >= goal ? '🎉 Đã đạt mục tiêu hôm nay! Cứ học thêm để tăng XP nhé.' : `Còn ${goal - todayXp} XP nữa là đạt mục tiêu hôm nay.`}
          </div>
          {due > 0 && (
            <button className="btn btn-primary daily-review" onClick={() => go('#/mine')}>
              🔁 {due} bài cần ôn hôm nay →
            </button>
          )}
        </div>
      </div>

      <div className="cat-grid">
        {categories.map((c) => {
          const topics = topicsByCat(c.id)
          const p = progressFor(topics, availableIds)
          const pct = p.available ? Math.round((p.done / p.available) * 100) : 0
          return (
            <button
              className="cat-card"
              key={c.id}
              onClick={() => go(`#/c/${c.id}`)}
              style={{ '--cat': c.color }}
            >
              <div className="cat-icon">{c.icon}</div>
              <div className="cat-body">
                <div className="cat-title">{c.title}</div>
                <div className="cat-desc">{c.description}</div>
                <div className="cat-meta">
                  <span className="badge badge-level">{c.levelRange}</span>
                  <span className="cat-count">{topics.length} hội thoại</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${pct}%` }} />
                </div>
                <div className="progress-label">
                  {p.available > 0
                    ? `${p.done}/${p.available} bài có nội dung đã xong`
                    : 'Đang biên soạn'}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
