import React, { useState } from 'react'
import { RegisterBadge, SpeakButton } from './common.jsx'

// Một thẻ từ vựng: nghĩa, ví dụ, lưu ý và danh sách từ đồng nghĩa bung được.
export default function VocabCard({ item }) {
  const [showSyn, setShowSyn] = useState(false)
  const synCount = item.synonyms?.length || 0

  return (
    <div className="card vocab" id={`vocab-${item.term.replace(/\s+/g, '-')}`}>
      <div className="vocab-top">
        <span className="vocab-term en">{item.term}</span>
        <span className="ipa">{item.ipa}</span>
        <SpeakButton text={item.term} />
        <RegisterBadge value={item.register} />
      </div>
      <div className="vocab-vi">{item.vi}</div>

      {item.example && (
        <div className="vocab-ex">
          <span className="en">{item.example}</span>
          {item.exampleVi && <span className="vi-soft"> — {item.exampleVi}</span>}
        </div>
      )}

      {item.note && <div className="vocab-note">💡 {item.note}</div>}

      {synCount > 0 && (
        <>
          <button className="syn-toggle" onClick={() => setShowSyn((s) => !s)}>
            {showSyn ? '▾ Ẩn' : `⇄ ${synCount} từ đồng nghĩa`}
          </button>
          {showSyn && (
            <div className="syn-list">
              {item.synonyms.map((s, i) => (
                <div className="syn" key={i}>
                  <div className="syn-head">
                    <span className="en">{s.term}</span>
                    <span className="ipa">{s.ipa}</span>
                    <SpeakButton text={s.term} />
                    <RegisterBadge value={s.register} />
                  </div>
                  <div className="syn-nuance">{s.nuanceVi}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
