import React, { useEffect } from 'react'
import { go } from '../hooks/useHashRoute.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { effectiveStreak } from '../lib/stats.js'
import { dueCount } from '../lib/srs.js'

const LINKS = [
  { path: '#/search', label: 'Tìm kiếm' },
  { path: '#/cards', label: 'Flashcard' },
  { path: '#/mine', label: 'Của tôi' },
  { path: '#/how', label: 'Luyện với AI' },
]

export default function TopNav({ route }) {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const streak = effectiveStreak()
  const due = dueCount()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <button className="brand" onClick={() => go('#/')}>
          🗣️ <span>Speaking English</span>
        </button>
        <div className="topnav-links">
          {streak > 0 && <span className="nav-streak" title="Chuỗi ngày học">🔥 {streak}</span>}
          {due > 0 && (
            <a href="#/mine" className="nav-due" title="Số bài đến hạn ôn">🔁 {due}</a>
          )}
          {LINKS.map((l) => (
            <a
              key={l.path}
              href={l.path}
              className={`nav-link ${route?.name === l.path.replace('#/', '') ? 'active' : ''}`}
            >
              {l.label}
            </a>
          ))}
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}
