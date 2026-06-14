import React, { useState } from 'react'
import { SpeakButton } from './common.jsx'

// Tách câu theo dấu ____ và chèn ô input cho từng chỗ trống.
function LineText({ line, lineIdx, inputs, setInput, openHints, toggleHint }) {
  const parts = line.text.split('____')
  const blanks = line.blanks || []

  return (
    <>
      <div className="text">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && blanks[i] && (
              <>
                <input
                  className={`blank-input ${blanks[i].type}`}
                  value={inputs[`${lineIdx}-${i}`] || ''}
                  placeholder="…"
                  onChange={(e) => setInput(`${lineIdx}-${i}`, e.target.value)}
                />
                <button
                  className="hint-btn"
                  onClick={() => toggleHint(`${lineIdx}-${i}`)}
                  title="Gợi ý"
                >
                  ?
                </button>
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      {blanks.map((b, i) =>
        openHints.has(`${lineIdx}-${i}`) ? (
          <div className={`hint-box ${b.type}`} key={i}>
            {b.type === 'personal' ? (
              <>💬 {b.hint}</>
            ) : (
              <>
                ✅ Đáp án: <span className="ans">{b.answer}</span>
                {b.explanationVi && <> — {b.explanationVi}</>}
              </>
            )}
          </div>
        ) : null
      )}
    </>
  )
}

// Hội thoại mẫu: bong bóng chat 2 phía, chỗ trống điền + gợi ý, ẩn/hiện bản dịch, nghe TTS.
export default function Dialogue({ dialogue }) {
  const [inputs, setInputs] = useState({})
  const [openHints, setOpenHints] = useState(new Set())
  const [showVi, setShowVi] = useState(new Set())

  const setInput = (key, val) => setInputs((p) => ({ ...p, [key]: val }))
  const toggleHint = (key) =>
    setOpenHints((p) => {
      const n = new Set(p)
      n.has(key) ? n.delete(key) : n.add(key)
      return n
    })
  const toggleVi = (idx) =>
    setShowVi((p) => {
      const n = new Set(p)
      n.has(idx) ? n.delete(idx) : n.add(idx)
      return n
    })

  const revealAll = () => {
    const newInputs = { ...inputs }
    const newHints = new Set(openHints)
    dialogue.lines.forEach((line, li) => {
      ;(line.blanks || []).forEach((b, bi) => {
        newHints.add(`${li}-${bi}`)
        if (b.type === 'knowledge' && b.answer) newInputs[`${li}-${bi}`] = b.answer
      })
    })
    setInputs(newInputs)
    setOpenHints(newHints)
  }

  const reset = () => {
    setInputs({})
    setOpenHints(new Set())
    setShowVi(new Set())
  }

  return (
    <div>
      <div className="dialogue-context">📍 {dialogue.context}</div>
      <div className="dialogue-toolbar">
        <button className="btn" onClick={revealAll}>Hiện tất cả đáp án</button>
        <button className="btn" onClick={reset}>Làm lại</button>
      </div>

      {dialogue.lines.map((line, idx) => {
        const isRight = idx % 2 === 1
        return (
          <div className={`line ${isRight ? 'right' : ''}`} key={idx}>
            <div className="bubble">
              <div className="speaker">
                {line.speaker}
                <SpeakButton text={line.text} />
              </div>
              <LineText
                line={line}
                lineIdx={idx}
                inputs={inputs}
                setInput={setInput}
                openHints={openHints}
                toggleHint={toggleHint}
              />
              {line.ipa && <span className="ipa">{line.ipa}</span>}
              <button className="hint-btn" style={{ verticalAlign: 'baseline' }} onClick={() => toggleVi(idx)}>
                {showVi.has(idx) ? 'Ẩn dịch' : 'Dịch'}
              </button>
              {showVi.has(idx) && <div className="vi">{line.vi}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
