import React from 'react'

const STEPS = [
  { n: 1, t: 'Chọn một hội thoại', d: 'Vào chủ đề bạn cần, chọn bài hợp cấp độ. Đọc trước phần Từ vựng và Mẫu câu để có "nguyên liệu".' },
  { n: 2, t: 'Tự điền & tự nói thử', d: 'Ở tab Hội thoại, điền vào chỗ trống bằng thông tin của bạn. Nói to từng câu trước khi bấm nút Dịch để kiểm tra.' },
  { n: 3, t: 'Copy prompt luyện nói', d: 'Vào tab "Luyện AI", bấm "Copy prompt luyện nói", rồi dán vào ChatGPT hoặc Gemini.' },
  { n: 4, t: 'Luyện hội thoại thật với AI', d: 'AI sẽ đóng vai và sửa lỗi cho bạn. Hãy trả lời bằng tiếng Anh, cố dùng các mẫu câu vừa học.' },
  { n: 5, t: 'Ghi lại lỗi & ôn lại', d: 'Mở ngăn 📝 Ghi chú, ghi những lỗi AI chỉ ra. Lần sau quay lại bài, đọc ghi chú trước khi luyện tiếp.' },
]

const TIPS = [
  'Yêu cầu AI nói chậm hơn lúc đầu, rồi tăng tốc khi đã quen.',
  'Cuối buổi, bảo AI tổng kết 3 lỗi bạn hay mắc nhất.',
  'Nhờ AI gợi ý cách nói tự nhiên/“bản xứ” hơn cho câu của bạn.',
  'Dùng nút 🔊 để nghe phát âm mẫu trước khi nói theo.',
]

export default function HowToAiPage() {
  return (
    <div className="page">
      <h1 className="page-title">Cách luyện nói với AI</h1>
      <p className="vi-soft" style={{ maxWidth: 640 }}>
        Trang web cung cấp <b>nội dung</b>; phần luyện nói bạn thực hiện với ChatGPT hoặc Gemini.
        Quy trình 5 bước dưới đây giúp bạn tận dụng tối đa.
      </p>

      <div className="steps">
        {STEPS.map((s) => (
          <div className="step" key={s.n}>
            <div className="step-num">{s.n}</div>
            <div>
              <div className="step-t">{s.t}</div>
              <div className="step-d">{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mine-h" style={{ marginTop: 28 }}>Mẹo nâng cao</h2>
      <div className="card" style={{ padding: '14px 16px' }}>
        <ul className="bullets">{TIPS.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>
    </div>
  )
}
