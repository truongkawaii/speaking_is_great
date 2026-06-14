# Schema chuẩn cho dữ liệu chủ đề (Topic)

Tài liệu này là **bản chuẩn** để soạn nội dung mọi chủ đề và để code React render đúng.
File mẫu tham chiếu: `sample-topic-hotel-check-in.json`.

---

## 1. Tổ chức file

```
data/
├── topics-index.json          # Danh sách tất cả chủ đề (để render trang Thế giới / tìm kiếm)
└── topics/
    ├── hotel-check-in.json     # 1 file = 1 chủ đề, tên file = id
    ├── job-interview.json
    └── ...
```

Tách index riêng để trang danh sách/tìm kiếm tải nhẹ, không phải nạp toàn bộ nội dung chi tiết.

---

## 2. Quy ước chung (dùng xuyên suốt)

| Quy ước | Giá trị hợp lệ | Ghi chú |
|---|---|---|
| `id` | kebab-case, không dấu | vd `hotel-check-in`. Trùng tên file. Là khóa định danh duy nhất. |
| `world` | `daily` \| `work` \| `travel` | 3 "thế giới" lớn. |
| `level` | `A2` \| `B1` \| `B2` | Theo khung CEFR. Mặc định dự án nhắm B1. |
| `register` | `formal` \| `neutral` \| `casual` | Mức trang trọng. UI: 🔵 formal / ⚪ neutral / 🟡 casual. |
| `functions` | mảng tag chức năng | Xem danh mục mục 6. Cho phép lọc chéo giữa các chủ đề. |
| Ngôn ngữ | EN = nguyên liệu học, **VI = mọi giải thích** | Field kết thúc bằng `Vi`/`vi` luôn là tiếng Việt. |
| IPA | đặt giữa cặp `/.../ ` | Dùng để TTS đối chiếu; ưu tiên giọng Anh-Mỹ. |

---

## 3. Schema cấp Chủ đề (Topic)

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|:---:|---|
| `id` | string | ✅ | Định danh, kebab-case, trùng tên file. |
| `world` | enum | ✅ | `daily` / `work` / `travel`. |
| `title` | string | ✅ | Tên chủ đề tiếng Việt (hiển thị chính). |
| `titleEn` | string | ✅ | Tên chủ đề tiếng Anh. |
| `level` | enum | ✅ | `A2` / `B1` / `B2`. |
| `functions` | string[] | ✅ | Các tag chức năng (mục 6). |
| `estimatedMinutes` | number | ⬜ | Thời gian học ước tính. |
| `objectives` | string[] (VI) | ✅ | "Sau bài này bạn làm được gì". 3–5 mục. |
| `vocabulary` | Vocab[] | ✅ | Từ vựng chủ đề. Xem mục 4.1. |
| `structures` | Structure[] | ✅ | Mẫu câu theo chức năng. Xem mục 4.2. |
| `adverbsAndPhrases` | Adverb[] | ⬜ | Trạng từ / filler làm câu nói mượt. Xem mục 4.3. |
| `dialogue` | Dialogue | ✅ | Hội thoại mẫu. Xem mục 4.4. |
| `culturalNotes` | string[] (VI) | ⬜ | Lưu ý văn hóa / thực tế. |
| `commonMistakes` | string[] (VI) | ⬜ | 💡 Lỗi người Việt hay mắc ở chủ đề này. |
| `aiPractice` | AiPractice | ✅ | Prompt luyện với AI. Xem mục 4.5. |
| `selfCheck` | string[] (VI) | ⬜ | Câu tự đánh giá cho checklist ☑. |

> 💡 `commonMistakes` là field em đề xuất thêm (đã nhắc ở câu hỏi trước). Tùy chọn — chủ đề nào có lỗi đặc trưng thì điền.

---

## 4. Schema các đối tượng con

### 4.1. Vocab (một từ vựng)

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|:---:|---|
| `term` | string (EN) | ✅ | Từ/cụm từ. |
| `ipa` | string | ✅ | Phiên âm `/.../`. |
| `vi` | string (VI) | ✅ | Nghĩa tiếng Việt. |
| `register` | enum | ⬜ | Mặc định `neutral` nếu bỏ trống. |
| `example` | string (EN) | ✅ | Câu ví dụ. |
| `exampleVi` | string (VI) | ⬜ | Dịch câu ví dụ. |
| `note` | string (VI) | ⬜ | Lưu ý dùng từ / bẫy phát âm / phân biệt. |
| `synonyms` | Synonym[] | ⬜ | 0–4 từ đồng nghĩa. Xem mục 4.1.1. |

#### 4.1.1. Synonym (một từ đồng nghĩa)

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|:---:|---|
| `term` | string (EN) | ✅ | Từ đồng nghĩa. |
| `ipa` | string | ✅ | Phiên âm. |
| `register` | enum | ✅ | Để người dùng chọn đúng ngữ cảnh. |
| `nuanceVi` | string (VI) | ✅ | **Khác biệt sắc thái** so với từ gốc — đây là phần giá trị nhất, giúp người học chọn có ý thức khi nói. |

> Quy ước: chỉ thêm `synonyms` khi thật sự có lựa chọn đáng học. Từ cố định (vd `key card`) thì bỏ trống.

### 4.2. Structure (một mẫu câu theo chức năng)

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|:---:|---|
| `pattern` | string (EN) | ✅ | Khung câu, dùng `[...]` cho chỗ thay thế. vd `I'd like to [động từ], please.` |
| `use` | string (VI) | ✅ | Dùng để làm gì. |
| `register` | enum | ✅ | Mức trang trọng. |
| `examples` | string[] (EN) | ✅ | 1–3 ví dụ hoàn chỉnh. |
| `explanationVi` | string (VI) | ✅ | Giải thích sắc thái, vì sao lịch sự, khi nào dùng. |
| `altOf` | string | ⬜ | 💡 Tag nhóm "anh em thay thế". Các structure cùng `altOf` là các cách nói khác nhau cho cùng một chức năng → UI gom thành "rổ lựa chọn". |

> 💡 `altOf` là cơ chế "đồng nghĩa cấp câu". vd cả `Could I…?` và `Would it be possible to…?` cùng `altOf: "polite-request"`.

### 4.3. Adverb (trạng từ / cụm làm mượt câu)

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|:---:|---|
| `term` | string (EN) | ✅ | Trạng từ/cụm từ. |
| `ipa` | string | ✅ | Phiên âm. |
| `vi` | string (VI) | ✅ | Nghĩa. |
| `when` | string (VI) | ✅ | Khi nào dùng. |
| `example` | string (EN) | ✅ | Ví dụ. |

### 4.4. Dialogue (hội thoại)

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|:---:|---|
| `context` | string (VI) | ✅ | Bối cảnh tình huống. |
| `lines` | Line[] | ✅ | Các lượt thoại. |

#### Line (một lượt thoại)

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|:---:|---|
| `speaker` | string | ✅ | Tên/vai người nói (vd `Lễ tân`, `Bạn`). |
| `text` | string (EN) | ✅ | Câu thoại; chỗ trống đánh dấu bằng `____`. |
| `ipa` | string | ✅ | Phiên âm cả câu. |
| `vi` | string (VI) | ✅ | Bản dịch (ẩn mặc định trên UI). |
| `blanks` | Blank[] | ⬜ | Chỉ có khi câu chứa `____`. Số phần tử = số chỗ trống, theo thứ tự xuất hiện. |

#### Blank (một chỗ trống) — 2 loại

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|:---:|---|
| `type` | enum | ✅ | `personal` (cá nhân hóa) \| `knowledge` (kiến thức). |
| `hint` | string (VI) | ✅ nếu `personal` | Gợi ý ví dụ, KHÔNG có đáp án đúng. |
| `answer` | string (EN) | ✅ nếu `knowledge` | Đáp án đúng. |
| `explanationVi` | string (VI) | ✅ nếu `knowledge` | Giải thích vì sao + liên kết về structure liên quan. |

- **`personal`**: tên, tuổi, số đêm... → nút gợi ý chỉ đưa ví dụ.
- **`knowledge`**: chọn đúng giới từ/thì/từ → nút gợi ý hiện đáp án + giải thích.

### 4.5. AiPractice (luyện với AI)

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|:---:|---|
| `intro` | string (VI) | ✅ | Hướng dẫn ngắn. |
| `prompt` | string (VI) | ✅ | Prompt copy sẵn để dán vào ChatGPT/Gemini. Yêu cầu AI đóng vai + sửa lỗi bằng tiếng Việt + tạo tình huống bất ngờ. |
| `advancedTips` | string[] (VI) | ⬜ | Mẹo nâng độ khó về sau. |

---

## 5. Schema `topics-index.json`

Mảng các bản tóm tắt (rút từ mỗi topic, không chứa nội dung chi tiết):

```jsonc
[
  {
    "id": "hotel-check-in",
    "world": "travel",
    "title": "Nhận phòng khách sạn",
    "titleEn": "Hotel Check-in",
    "level": "B1",
    "functions": ["asking-info", "requesting", "handling-problems"],
    "estimatedMinutes": 15,
    "objectivesCount": 4,
    "vocabCount": 9
  }
]
```

---

## 6. Danh mục tag chức năng (`functions`)

Dùng thống nhất để lọc chéo. Mở rộng dần khi cần:

| Tag | Nghĩa |
|---|---|
| `greetings` | Chào hỏi, giới thiệu |
| `small-talk` | Trò chuyện xã giao |
| `asking-info` | Hỏi thông tin |
| `requesting` | Đề nghị, yêu cầu |
| `suggesting` | Gợi ý, đề xuất |
| `opinions` | Bày tỏ quan điểm |
| `agreeing` | Đồng ý / không đồng ý |
| `apologizing` | Xin lỗi |
| `refusing` | Từ chối lịch sự |
| `complaining` | Phàn nàn, khiếu nại |
| `handling-problems` | Xử lý sự cố/trục trặc |
| `negotiating` | Thương lượng |
| `describing` | Mô tả người/vật/trải nghiệm |

---

## 7. Template rỗng (copy để soạn chủ đề mới)

```jsonc
{
  "id": "",
  "world": "",
  "title": "",
  "titleEn": "",
  "level": "B1",
  "functions": [],
  "estimatedMinutes": 0,
  "objectives": [],
  "vocabulary": [
    { "term": "", "ipa": "", "vi": "", "register": "neutral",
      "example": "", "exampleVi": "", "note": "",
      "synonyms": [ { "term": "", "ipa": "", "register": "", "nuanceVi": "" } ] }
  ],
  "structures": [
    { "pattern": "", "use": "", "register": "neutral",
      "examples": [], "explanationVi": "", "altOf": "" }
  ],
  "adverbsAndPhrases": [
    { "term": "", "ipa": "", "vi": "", "when": "", "example": "" }
  ],
  "dialogue": {
    "context": "",
    "lines": [
      { "speaker": "", "text": "", "ipa": "", "vi": "",
        "blanks": [ { "type": "personal", "hint": "" } ] }
    ]
  },
  "culturalNotes": [],
  "commonMistakes": [],
  "aiPractice": { "intro": "", "prompt": "", "advancedTips": [] },
  "selfCheck": []
}
```

---

## 8. Hướng dẫn biên soạn nội dung (chuẩn chất lượng)

Áp dụng cho MỌI hội thoại. Bài mẫu chuẩn: `topics/hotel-check-in.json` (B1) và `topics/job-interview.json` (B2).

**Độ dài & ngữ pháp hội thoại**
- 7–9 lượt thoại. Câu phải DÀI và tự nhiên, KHÔNG cộc lốc.
- Lồng ngữ pháp kiểu TOEIC: `such as`, `although / even though`, `despite / in spite of`, `in order to`, `not only … but also`, `however / therefore`, `as soon as`, `while / whereas`, mệnh đề quan hệ (`which/who/that`), câu điều kiện.
- Dùng nhiều trạng từ tự nhiên: actually, definitely, fortunately, eventually, gradually, particularly, honestly…

**Theo cấp độ**
- A2: câu ngắn–vừa, từ vựng cơ bản, 1–2 cấu trúc trọng tâm.
- B1: câu vừa, bắt đầu có `such as / because / so`.
- B2: câu dài, đa dạng cấu trúc, có mệnh đề phụ.
- C1: câu phức nhiều tầng, idiom, sắc thái tinh tế, đổi register linh hoạt.

**Định lượng mỗi bài**
- `vocabulary`: 8–12 mục, **đủ các từ loại** (danh từ, động từ, tính từ, trạng từ).
- `synonyms`: BẮT BUỘC phủ nhiều từ loại — tính từ (vd tired → exhausted / worn out), trạng từ (quickly → rapidly / swiftly), danh từ, động từ. Mỗi từ "đáng học" có 2–4 đồng nghĩa kèm `nuanceVi`.
- `structures`: 5–7 mẫu, gắn `altOf` cho nhóm cách nói thay thế.
- `adverbsAndPhrases`: 4–6 mục.
- `culturalNotes`: 2–4 · `commonMistakes`: 3–4 · `selfCheck`: 3 · `aiPractice`: bắt buộc.

**Chất lượng (BẮT BUỘC kiểm tra trước khi lưu)**
- Ngữ pháp tiếng Anh chuẩn, câu tự nhiên như người bản xứ.
- IPA hợp lý.
- Giải thích tiếng Việt CHÍNH XÁC (đặc biệt sắc thái đồng nghĩa & giải thích đáp án chỗ trống).
- JSON hợp lệ, khớp schema, `id` trùng tên file.
