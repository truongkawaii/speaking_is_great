import React from 'react'
import { RegisterBadge, SpeakButton } from './common.jsx'

const ALT_LABEL = {
  'making-request': 'Cùng diễn đạt "đề nghị / yêu cầu" — chọn theo độ lịch sự',
}

function StructureItem({ s }) {
  return (
    <div className="card structure">
      <div className="vocab-top">
        <span className="pattern">{s.pattern}</span>
        <RegisterBadge value={s.register} />
      </div>
      <div className="use">{s.use}</div>
      <ul className="examples">
        {s.examples.map((ex, i) => (
          <li key={i}>
            <span className="en">{ex}</span> <SpeakButton text={ex} />
          </li>
        ))}
      </ul>
      {s.explanationVi && <div className="explain">{s.explanationVi}</div>}
    </div>
  )
}

// Mẫu câu theo chức năng. Các structure cùng `altOf` được gom thành "rổ lựa chọn".
export default function StructureList({ structures }) {
  const groups = []
  const byAlt = {}
  for (const s of structures) {
    if (s.altOf) {
      if (!byAlt[s.altOf]) {
        byAlt[s.altOf] = { altOf: s.altOf, items: [] }
        groups.push(byAlt[s.altOf])
      }
      byAlt[s.altOf].items.push(s)
    } else {
      groups.push({ single: s })
    }
  }

  return (
    <div className="stack">
      {groups.map((g, i) =>
        g.single ? (
          <StructureItem key={i} s={g.single} />
        ) : (
          <div className="alt-group" key={i}>
            <div className="alt-group-label">⇄ {ALT_LABEL[g.altOf] || 'Các cách nói thay thế'}</div>
            <div className="stack">
              {g.items.map((s, j) => (
                <StructureItem key={j} s={s} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  )
}
