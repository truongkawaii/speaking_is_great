import React, { useState, useMemo } from 'react'
import { go } from '../hooks/useHashRoute.js'
import { SpeakButton } from '../components/common.jsx'
import { getCompletedIds } from '../lib/bookmarks.js'
import { buildPool, getSession, reviewCard } from '../lib/flashcards.js'
import { creditFlashcards } from '../lib/stats.js'

export default function FlashcardsPage({ topics }) {
  const completedIds = getCompletedIds().filter((id) => topics[id])
  const pool = useMemo(() => buildPool(topics, completedIds), [topics])
  // Phiên cố định tại thời điểm mở để không nhảy thẻ khi cập nhật SRS.
  const [session] = useState(() => getSession(pool))

  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)
  const [finished, setFinished] = useState(false)
  const [xp, setXp] = useState(0)

  if (pool.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">🃏 Flashcard từ vựng</h1>
        <p className="vi-soft">
          Chưa có từ vựng để ôn. Hãy <b>hoàn thành vài hội thoại</b> trước — từ vựng trong các bài đó
          sẽ tự động trở thành thẻ ôn ở đây.
        </p>
        <button className="btn btn-primary" onClick={() => go('#/')}>← Chọn bài để học</button>
      </div>
    )
  }

  if (session.length === 0 || finished) {
    return (
      <div className="page">
        <h1 className="page-title">🃏 Flashcard từ vựng</h1>
        <div className="card flash-done">
          <div className="flash-done-big">{finished ? '🎉' : '✅'}</div>
          {finished ? (
            <>
              <h2>Hoàn thành phiên ôn!</h2>
              <p className="vi-soft">Bạn đã ôn {done} thẻ và nhận <b>+{xp} XP</b>.</p>
            </>
          ) : (
            <>
              <h2>Không có thẻ nào cần ôn lúc này</h2>
              <p className="vi-soft">Tất cả thẻ đã ôn đều chưa tới hạn. Quay lại sau nhé!</p>
            </>
          )}
          <div className="backup-actions" style={{ justifyContent: 'center' }}>
            <button className="btn" onClick={() => go('#/mine')}>Về trang Của tôi</button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Ôn tiếp</button>
          </div>
        </div>
      </div>
    )
  }

  const card = session[i]

  const rate = (rating) => {
    reviewCard(card.id, rating)
    const reviewed = done + 1
    if (i + 1 >= session.length) {
      setDone(reviewed)
      setXp(creditFlashcards(reviewed))
      setFinished(true)
    } else {
      setDone(reviewed)
      setI(i + 1)
      setFlipped(false)
    }
  }

  return (
    <div className="page flash-page">
      <div className="flash-head">
        <button className="back-link" onClick={() => go('#/mine')}>← Của tôi</button>
        <span className="flash-progress">{i + 1} / {session.length}</span>
      </div>

      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => !flipped && setFlipped(true)}>
        <div className="flash-topic">{card.topicTitle}</div>
        <div className="flash-term en">{card.term} <SpeakButton text={card.term} /></div>
        <div className="ipa">{card.ipa}</div>

        {flipped ? (
          <div className="flash-back">
            <div className="flash-vi">{card.vi}</div>
            {card.example && (
              <div className="flash-ex">
                <span className="en">{card.example}</span>
                {card.exampleVi && <div className="vi-soft">{card.exampleVi}</div>}
              </div>
            )}
          </div>
        ) : (
          <div className="flash-hint">Bấm để xem nghĩa</div>
        )}
      </div>

      {flipped ? (
        <div className="flash-rate">
          <button className="btn rate-again" onClick={() => rate('again')}>Chưa nhớ</button>
          <button className="btn rate-ok" onClick={() => rate('ok')}>Tạm ổn</button>
          <button className="btn rate-good" onClick={() => rate('good')}>Nhớ rõ</button>
        </div>
      ) : (
        <div className="flash-rate">
          <button className="btn btn-primary" onClick={() => setFlipped(true)}>Hiện nghĩa</button>
        </div>
      )}
    </div>
  )
}
