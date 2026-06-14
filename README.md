# Speaking is Great 🗣️

Website tổng hợp **168 chủ đề giao tiếp tiếng Anh (A2 → C1)** để người học **tự luyện nói với AI** (ChatGPT / Gemini). Web chỉ cung cấp nội dung; phần luyện nói thực hiện với AI bằng các prompt soạn sẵn.

## Tính năng

- **168 hội thoại** thuộc 8 chủ đề lớn (Hằng ngày, Gia đình, Du lịch, Bạn bè, Công việc, Dịch vụ, Quan điểm, Nâng cao), trải đều A2 → C1.
- Mỗi bài: từ vựng (kèm **đồng nghĩa đa từ loại**), mẫu câu theo chức năng (ngữ pháp TOEIC), trạng từ, **hội thoại có chỗ trống + gợi ý**, IPA + nút dịch, lưu ý văn hóa, lỗi hay mắc, **prompt luyện với AI**, tự đánh giá.
- **Học như chơi game:** XP, streak, mục tiêu mỗi ngày, huy hiệu.
- **Lặp lại ngắt quãng 2 tầng:** ôn nguyên bài + flashcard từ vựng (Leitner).
- **Dashboard phân tích** (trang "Của tôi"): tiến độ CEFR, biểu đồ XP, heatmap hoạt động.
- Nhắc nhở ôn tập, **sao lưu/khôi phục dữ liệu**, dark mode.
- Dữ liệu lưu hoàn toàn ở `localStorage` (không cần tài khoản/backend).

## Công nghệ

React + Vite, dữ liệu JSON tĩnh trong `data/`.

## Chạy local

```bash
npm install
npm run dev      # phát triển
npm run build    # build production -> dist/
npm run preview  # xem thử bản build
```

## Cấu trúc

- `data/categories.json` — 8 chủ đề lớn
- `data/topics-index.json` — danh sách 168 hội thoại
- `data/topics/<id>.json` — nội dung từng hội thoại (theo `data/SCHEMA.md`)
- `src/` — mã nguồn React
