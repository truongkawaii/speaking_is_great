import React, { useMemo, useState, useRef } from 'react'
import { go } from '../hooks/useHashRoute.js'
import { Ring } from '../components/Ring.jsx'
import { getBookmarkedIds, getNotes, getCompletedIds } from '../lib/bookmarks.js'
import {
  getDay, getProfile, setDailyGoal, getTotalXp, learnerLevel,
  effectiveStreak, getStreak, getLastDays, dateKey, getTotalReviews,
} from '../lib/stats.js'
import { getDueIds } from '../lib/srs.js'
import { requestNotify, notifyPermission } from '../lib/notify.js'
import { exportString, importString } from '../lib/backup.js'
import { computeBadges } from '../lib/badges.js'
import { buildPool, dueCardCount, newCardCount, learnedCount } from '../lib/flashcards.js'

const LEVELS = ['A2', 'B1', 'B2', 'C1']
const GOALS = [{ xp: 50, label: '🌱 Nhẹ' }, { xp: 100, label: '⚖️ Đều đặn' }, { xp: 150, label: '🔥 Nghiêm túc' }]
const WD = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function heatLevel(xp) {
  if (xp <= 0) return 0
  if (xp < 50) return 1
  if (xp < 100) return 2
  if (xp < 150) return 3
  return 4
}

export default function MinePage({ index, categories, topics }) {
  const byId = useMemo(() => Object.fromEntries(index.map((t) => [t.id, t])), [index])
  const [goal, setGoalState] = useState(() => getProfile().dailyGoalXp)
  const [notifyState, setNotifyState] = useState(() => notifyPermission())

  const completed = getCompletedIds().filter((id) => byId[id])
  const completedSet = new Set(completed)
  const bookmarks = getBookmarkedIds().map((id) => byId[id]).filter(Boolean)
  const notes = getNotes().filter((n) => byId[n.id])
  const dueIds = getDueIds().filter((id) => byId[id])

  const totalXp = getTotalXp()
  const level = learnerLevel(totalXp)
  const streak = effectiveStreak()
  const longest = getStreak().longest
  const todayXp = getDay().xp
  const last7 = getLastDays(7)
  const last84 = getLastDays(84)
  const maxBar = Math.max(goal, ...last7.map((d) => d.xp), 1)

  const cefr = LEVELS.map((lv) => {
    const all = index.filter((t) => t.level === lv)
    const done = all.filter((t) => completedSet.has(t.id)).length
    return { lv, done, total: all.length }
  })

  const catProgress = categories.map((c) => {
    const all = index.filter((t) => t.category === c.id)
    const done = all.filter((t) => completedSet.has(t.id)).length
    return { ...c, done, total: all.length }
  })

  // Flashcard từ vựng (gom từ các bài đã hoàn thành)
  const pool = useMemo(() => buildPool(topics || {}, completed), [topics, completed.length])
  const cardsDue = dueCardCount(pool)
  const cardsNew = newCardCount(pool)
  const cardsLearned = learnedCount(pool)

  // Huy hiệu
  const anyCategoryComplete = catProgress.some((c) => c.total > 0 && c.done === c.total)
  const categoriesTouched = catProgress.filter((c) => c.done > 0).length
  const badges = computeBadges({
    completed: completed.length,
    totalTopics: index.length,
    c1Done: index.filter((t) => t.level === 'C1' && completedSet.has(t.id)).length,
    anyCategoryComplete,
    categoriesTouched,
    totalCategories: categories.length,
    longestStreak: longest,
    totalXp,
    totalReviews: getTotalReviews(),
  })

  const chooseGoal = (xp) => { setDailyGoal(xp); setGoalState(xp) }
  const enableNotify = async () => setNotifyState(await requestNotify())

  const fileRef = useRef(null)
  const exportBackup = () => {
    const blob = new Blob([exportString()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `speaking-english-backup-${dateKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  const onImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const n = importString(String(reader.result))
        alert(`Đã khôi phục ${n} mục dữ liệu. Trang sẽ tải lại.`)
        window.location.reload()
      } catch {
        alert('File sao lưu không hợp lệ.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="page">
      <h1 className="page-title">Của tôi</h1>

      {/* Hero */}
      <div className="mine-hero">
        <div className="daily-ring">
          <Ring value={Math.min(100, Math.round((todayXp / goal) * 100))} size={92} />
          <div className="daily-ring-label"><b>{todayXp}</b><span>/{goal}</span></div>
        </div>
        <div className="mine-hero-stats">
          <div className="hero-stat"><b>🔥 {streak}</b><span>chuỗi ngày (kỷ lục {longest})</span></div>
          <div className="hero-stat"><b>{totalXp}</b><span>tổng XP</span></div>
          <div className="hero-stat"><b>{level.name}</b><span>cấp độ người học</span></div>
          <div className="hero-stat"><b>{completed.length}/{index.length}</b><span>bài hoàn thành</span></div>
        </div>
      </div>

      {/* Mục tiêu ngày */}
      <section className="mine-block">
        <h2 className="mine-h">🎯 Mục tiêu mỗi ngày</h2>
        <div className="goal-picker">
          {GOALS.map((g) => (
            <button key={g.xp} className={`chip ${goal === g.xp ? 'on' : ''}`} onClick={() => chooseGoal(g.xp)}>
              {g.label} · {g.xp} XP
            </button>
          ))}
        </div>
      </section>

      {/* Cần ôn */}
      <section className="mine-block">
        <h2 className="mine-h">🔁 Cần ôn hôm nay ({dueIds.length})</h2>
        {dueIds.length === 0 ? (
          <p className="vi-soft">Chưa có bài nào tới hạn ôn. Hoàn thành thêm bài để hệ thống lên lịch ôn lặp lại nhé.</p>
        ) : (
          <div className="topic-list">
            {dueIds.map((id) => (
              <button className="topic-row" key={id} onClick={() => go(`#/t/${id}`)}>
                <span className="topic-row-main">
                  <span className="topic-row-title">{byId[id].title}</span>
                  <span className="topic-row-en">{byId[id].titleEn}</span>
                </span>
                <span className="topic-row-status"><span className="badge badge-level">{byId[id].level}</span><span className="chev">›</span></span>
              </button>
            ))}
          </div>
        )}
        {notifyState !== 'granted' && notifyState !== 'unsupported' && (
          <button className="btn" style={{ marginTop: 10 }} onClick={enableNotify}>🔔 Bật nhắc ôn qua thông báo</button>
        )}
        {notifyState === 'granted' && <div className="notes-saved" style={{ marginTop: 8 }}>🔔 Đã bật thông báo nhắc ôn.</div>}
      </section>

      {/* Flashcard từ vựng */}
      <section className="mine-block">
        <h2 className="mine-h">🃏 Flashcard từ vựng</h2>
        <div className="card flash-cta">
          <div className="flash-cta-stats">
            <span className="flash-cta-stat"><b>{cardsDue}</b><span>cần ôn</span></span>
            <span className="flash-cta-stat"><b>{cardsNew}</b><span>từ mới</span></span>
            <span className="flash-cta-stat"><b>{cardsLearned}</b><span>đã học</span></span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => go('#/cards')}
            disabled={pool.length === 0}
          >
            {pool.length === 0 ? 'Hoàn thành bài để có từ ôn' : 'Bắt đầu ôn từ →'}
          </button>
        </div>
      </section>

      {/* Huy hiệu */}
      <section className="mine-block">
        <h2 className="mine-h">🏅 Huy hiệu ({badges.filter((b) => b.earned).length}/{badges.length})</h2>
        <div className="badge-grid">
          {badges.map((b) => (
            <div className={`badge-card ${b.earned ? 'earned' : 'locked'}`} key={b.id} title={b.desc}>
              <div className="badge-ic">{b.earned ? b.icon : '🔒'}</div>
              <div className="badge-tt">{b.title}</div>
              <div className="badge-ds">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Lộ trình CEFR */}
      <section className="mine-block">
        <h2 className="mine-h">📈 Lộ trình tới C1</h2>
        <div className="cefr">
          {cefr.map((c) => (
            <div className="cefr-item" key={c.lv}>
              <div className="cefr-top"><span className="badge badge-level">{c.lv}</span><span className="cefr-num">{c.done}/{c.total}</span></div>
              <div className="progress"><div className="progress-bar" style={{ width: `${Math.round((c.done / c.total) * 100)}%`, background: 'var(--accent)' }} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* XP 7 ngày */}
      <section className="mine-block">
        <h2 className="mine-h">📊 XP 7 ngày qua</h2>
        <div className="bars">
          {last7.map((d) => (
            <div className="bar-col" key={d.date}>
              <div className="bar-track">
                <div className="bar-fill" style={{ height: `${Math.round((d.xp / maxBar) * 100)}%` }} title={`${d.xp} XP`} />
              </div>
              <div className="bar-label">{WD[new Date(d.date).getDay()]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Lịch hoạt động */}
      <section className="mine-block">
        <h2 className="mine-h">🗓️ Hoạt động ~12 tuần</h2>
        <div className="heatmap">
          {last84.map((d) => (
            <div key={d.date} className={`heat heat-${heatLevel(d.xp)}`} title={`${d.date}: ${d.xp} XP`} />
          ))}
        </div>
        <div className="heat-legend"><span>Ít</span><span className="heat heat-0" /><span className="heat heat-1" /><span className="heat heat-2" /><span className="heat heat-3" /><span className="heat heat-4" /><span>Nhiều</span></div>
      </section>

      {/* Tiến độ chủ đề */}
      <section className="mine-block">
        <h2 className="mine-h">🗂️ Tiến độ theo chủ đề</h2>
        <div className="stack">
          {catProgress.map((c) => (
            <button className="cat-prog-row" key={c.id} onClick={() => go(`#/c/${c.id}`)} style={{ '--cat': c.color }}>
              <span className="cat-prog-name">{c.icon} {c.title}</span>
              <span className="cat-prog-bar"><span className="cat-prog-fill" style={{ width: `${Math.round((c.done / c.total) * 100)}%` }} /></span>
              <span className="cat-prog-num">{c.done}/{c.total}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Đã lưu */}
      <section className="mine-block">
        <h2 className="mine-h">🔖 Đã lưu ({bookmarks.length})</h2>
        {bookmarks.length === 0 ? <p className="vi-soft">Chưa có hội thoại nào được lưu.</p> : (
          <div className="topic-list">
            {bookmarks.map((t) => (
              <button className="topic-row" key={t.id} onClick={() => go(`#/t/${t.id}`)}>
                <span className="topic-row-main"><span className="topic-row-title">{t.title}</span><span className="topic-row-en">{t.titleEn}</span></span>
                <span className="topic-row-status"><span className="badge badge-level">{t.level}</span><span className="chev">›</span></span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Ghi chú */}
      <section className="mine-block">
        <h2 className="mine-h">📝 Ghi chú ({notes.length})</h2>
        {notes.length === 0 ? <p className="vi-soft">Chưa có ghi chú nào.</p> : (
          <div className="stack">
            {notes.map((n) => (
              <div className="card note-card" key={n.id}>
                <button className="note-card-title" onClick={() => go(`#/t/${n.id}`)}>{byId[n.id].title} ›</button>
                <div className="note-card-text">{n.text}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sao lưu dữ liệu */}
      <section className="mine-block">
        <h2 className="mine-h">💾 Sao lưu & khôi phục</h2>
        <p className="vi-soft" style={{ marginTop: 0 }}>
          Mọi tiến độ lưu trên máy này. Hãy tải file sao lưu để không mất khi đổi máy hoặc xóa trình duyệt.
        </p>
        <div className="backup-actions">
          <button className="btn" onClick={exportBackup}>⬇️ Tải file sao lưu</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>⬆️ Khôi phục từ file</button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={onImportFile} hidden />
        </div>
      </section>
    </div>
  )
}
