import React, { useState } from 'react'
import { Section } from '../components/common.jsx'
import VocabCard from '../components/VocabCard.jsx'
import StructureList from '../components/StructureList.jsx'
import Dialogue from '../components/Dialogue.jsx'
import { AiPractice, NotesDrawer, SelfCheck } from '../components/Sidebars.jsx'
import { isCompleted, setCompleted } from '../lib/progress.js'
import { isBookmarked, setBookmarked } from '../lib/bookmarks.js'
import { creditCompletion, creditReview, creditAiPractice, practicedToday } from '../lib/stats.js'
import { scheduleNew, review, isDue } from '../lib/srs.js'

const FN_LABEL = {
  'asking-info': 'Hỏi thông tin', requesting: 'Đề nghị', 'handling-problems': 'Xử lý sự cố',
  greetings: 'Chào hỏi', 'small-talk': 'Trò chuyện', suggesting: 'Gợi ý', opinions: 'Quan điểm',
  agreeing: 'Đồng ý', apologizing: 'Xin lỗi', refusing: 'Từ chối', complaining: 'Phàn nàn',
  negotiating: 'Thương lượng', describing: 'Mô tả',
}

const TABS = [
  { key: 'dialogue', label: '💬 Hội thoại' },
  { key: 'structures', label: '🧩 Mẫu câu' },
  { key: 'vocab', label: '📖 Từ vựng' },
  { key: 'notes-info', label: '🌏 Lưu ý' },
  { key: 'ai', label: '🤖 Luyện AI' },
]

export default function TopicPage({ topic, category }) {
  const [tab, setTab] = useState('dialogue')
  const [done, setDone] = useState(() => isCompleted(topic.id))
  const [marked, setMarked] = useState(() => isBookmarked(topic.id))
  const [due, setDue] = useState(() => isDue(topic.id))
  const [practiced, setPracticed] = useState(() => practicedToday(topic.id))
  const [xpMsg, setXpMsg] = useState('')

  const flashXp = (n) => {
    if (n > 0) { setXpMsg(`+${n} XP`); setTimeout(() => setXpMsg(''), 1700) }
  }

  const toggleDone = () => {
    const next = !done
    setDone(next)
    setCompleted(topic.id, next)
    if (next) { scheduleNew(topic.id); flashXp(creditCompletion(topic.id)) }
  }

  const toggleMark = () => {
    const next = !marked
    setMarked(next)
    setBookmarked(topic.id, next)
  }

  const doReview = (rating) => {
    review(topic.id, rating)
    flashXp(creditReview(topic.id))
    setDue(false)
  }

  const doPracticed = () => {
    const g = creditAiPractice(topic.id)
    if (g) { setPracticed(true); flashXp(g) }
  }

  return (
    <>
      <div className="page topic-page">
        <span className="breadcrumb">
          <a href="#/">Trang chủ</a> /{' '}
          <a href={`#/c/${category?.id || ''}`}>{category?.title || 'Chủ đề'}</a> /{' '}
          <b>{topic.title}</b>
        </span>

        {due && (
          <div className="review-banner">
            <div className="review-banner-text">
              🔁 <b>Đến hạn ôn tập!</b> Hãy tự nói lại bài này (ẩn đáp án) rồi tự chấm:
            </div>
            <div className="review-rate">
              <button className="btn rate-again" onClick={() => doReview('again')}>Chưa nhớ</button>
              <button className="btn rate-ok" onClick={() => doReview('ok')}>Tạm ổn</button>
              <button className="btn rate-good" onClick={() => doReview('good')}>Nhớ rõ</button>
            </div>
          </div>
        )}

        <header className="topic-head">
          <div className="subtitle">{topic.titleEn}</div>
          <h1>{topic.title}</h1>
          <div className="topic-meta">
            <span className="badge badge-level">{topic.level}</span>
            {topic.estimatedMinutes && <span className="badge badge-mins">⏱ {topic.estimatedMinutes} phút</span>}
            {topic.functions?.map((f) => <span className="badge badge-fn" key={f}>{FN_LABEL[f] || f}</span>)}
            <button className={`btn done-toggle ${done ? 'is-done' : ''}`} onClick={toggleDone}>
              {done ? '✓ Đã hoàn thành' : 'Đánh dấu hoàn thành'}
            </button>
            <button className={`btn mark-toggle ${marked ? 'is-marked' : ''}`} onClick={toggleMark}>
              {marked ? '🔖 Đã lưu' : '🔖 Lưu'}
            </button>
          </div>

          <div className="objectives-strip">
            <span className="obj-label">🎯 Mục tiêu:</span>
            <ul>{topic.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
          </div>
        </header>

        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="tab-panel">
          {tab === 'dialogue' && (
            <Section title="Hội thoại mẫu" sub="Điền vào chỗ trống; bấm “?” để xem gợi ý, “Dịch” để hiện bản dịch.">
              <Dialogue dialogue={topic.dialogue} />
            </Section>
          )}

          {tab === 'structures' && (
            <Section title="Mẫu câu theo chức năng" sub="Khung nét đứt gom các cách nói thay thế cho cùng một mục đích — chọn theo độ lịch sự.">
              <StructureList structures={topic.structures} />
            </Section>
          )}

          {tab === 'vocab' && (
            <>
              <Section title="Từ vựng" sub="Bấm “⇄ từ đồng nghĩa” để xem lựa chọn khác và chọn từ hợp ngữ cảnh khi nói.">
                <div className="stack">
                  {topic.vocabulary.map((v, i) => <VocabCard item={v} key={i} />)}
                </div>
              </Section>
              {topic.adverbsAndPhrases?.length > 0 && (
                <Section title="Trạng từ & cụm làm mượt câu" sub="Giúp lời nói tự nhiên, đỡ khựng.">
                  <div className="stack">
                    {topic.adverbsAndPhrases.map((a, i) => (
                      <div className="card adverb" key={i}>
                        <div className="a-top">
                          <span className="en">{a.term}</span>
                          <span className="ipa">{a.ipa}</span>
                          <span className="vi-soft">— {a.vi}</span>
                        </div>
                        <div className="a-when">Khi nào dùng: {a.when}</div>
                        <div className="a-ex en">{a.example}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </>
          )}

          {tab === 'notes-info' && (
            <>
              {topic.culturalNotes?.length > 0 && (
                <Section title="🌏 Lưu ý văn hóa & thực tế">
                  <div className="card" style={{ padding: '14px 16px' }}>
                    <ul className="bullets">{topic.culturalNotes.map((n, i) => <li key={i}>{n}</li>)}</ul>
                  </div>
                </Section>
              )}
              {topic.commonMistakes?.length > 0 && (
                <Section title="⚠️ Lỗi người Việt hay mắc">
                  <div className="card" style={{ padding: '14px 16px' }}>
                    <ul className="bullets">{topic.commonMistakes.map((n, i) => <li key={i}>{n}</li>)}</ul>
                  </div>
                </Section>
              )}
            </>
          )}

          {tab === 'ai' && (
            <>
              <Section title="Luyện nói với AI" sub="Copy prompt rồi dán vào ChatGPT/Gemini để luyện như thật.">
                <AiPractice ai={topic.aiPractice} />
                <button className={`btn practiced-btn ${practiced ? 'is-on' : ''}`} onClick={doPracticed} disabled={practiced}>
                  {practiced ? '✓ Đã luyện với AI hôm nay (+20 XP)' : '✅ Tôi đã luyện bài này với AI hôm nay (+20 XP)'}
                </button>
              </Section>
              {topic.selfCheck?.length > 0 && (
                <Section title="Tự đánh giá">
                  <SelfCheck topicId={topic.id} items={topic.selfCheck} />
                </Section>
              )}
            </>
          )}
        </div>
      </div>

      {xpMsg && <div className="xp-toast">{xpMsg}</div>}
      <NotesDrawer topicId={topic.id} />
    </>
  )
}
