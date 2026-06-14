import React, { useEffect } from 'react'
import { useHashRoute, go } from './hooks/useHashRoute.js'
import { maybeRemindReviews } from './lib/notify.js'
import TopNav from './components/TopNav.jsx'
import HomePage from './pages/HomePage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import TopicPage from './pages/TopicPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import MinePage from './pages/MinePage.jsx'
import FlashcardsPage from './pages/FlashcardsPage.jsx'
import HowToAiPage from './pages/HowToAiPage.jsx'

import categories from '../data/categories.json'
import index from '../data/topics-index.json'

// Nạp sẵn mọi file nội dung hội thoại trong data/topics/*.json (Vite glob).
// Một hội thoại "có nội dung" khi tồn tại file tương ứng — không cần status thủ công.
const topicModules = import.meta.glob('../data/topics/*.json', { eager: true })
const topics = {}
for (const path in topicModules) {
  const t = topicModules[path].default
  topics[t.id] = t
}
const availableIds = new Set(Object.keys(topics))

export default function App() {
  const route = useHashRoute()

  useEffect(() => { maybeRemindReviews() }, [])

  return (
    <>
      <TopNav route={route} />
      <Page route={route} />
    </>
  )
}

function Page({ route }) {
  if (route.name === 'category') {
    const category = categories.find((c) => c.id === route.id)
    if (!category) return <NotFound />
    return <CategoryPage category={category} index={index} availableIds={availableIds} />
  }
  if (route.name === 'topic') {
    const topic = topics[route.id]
    if (!topic) return <NotFound />
    const category = categories.find((c) => c.id === topic.category)
    return <TopicPage topic={topic} category={category} />
  }
  if (route.name === 'search') return <SearchPage index={index} categories={categories} availableIds={availableIds} />
  if (route.name === 'mine') return <MinePage index={index} categories={categories} topics={topics} />
  if (route.name === 'cards') return <FlashcardsPage topics={topics} />

  if (route.name === 'how') return <HowToAiPage />
  return <HomePage categories={categories} index={index} availableIds={availableIds} />
}

function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h1>Không tìm thấy nội dung</h1>
      <p className="vi-soft">Hội thoại này đang được biên soạn.</p>
      <button className="btn btn-primary" onClick={() => go('#/')}>← Về trang chủ</button>
    </div>
  )
}
