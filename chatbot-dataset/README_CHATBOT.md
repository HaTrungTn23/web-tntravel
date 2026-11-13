# Dataset chatbot Du lịch Thái Nguyên — bản đã làm sạch

Nguồn: Cổng Du lịch Thái Nguyên (thainguyentourism.vn), crawl ngày 20/10/2026.
Đây là bản **đã tiền xử lý cho RAG/chatbot** của bộ 218 bài viết gốc: toàn văn được viết lại ở ngôi thứ ba trung tính, loại bỏ phần tác giả kể trải nghiệm cá nhân/gia đình, giữ nguyên mọi dữ kiện (địa danh, khoảng cách, lịch sử, truyền thuyết, giá cả kèm mốc thời gian như trong bài). Quá trình làm sạch **không bổ sung thông tin ngoài bài gốc** — bài gốc ngắn thì bản sạch vẫn ngắn.

## Nội dung gói

| Thành phần | Mô tả |
|---|---|
| `dataset.jsonl` | 207 tài liệu, mỗi dòng 1 JSON: `id` (tn-001…), `title`, `category` (chuyên mục gốc của cổng), `phan_muc` (phân mục theo chủ đề — xem dưới), `category_slug`, `module`, `url` (bài gốc), `flags`, `word_count`, `text` (toàn văn sạch) |
| `chunks.jsonl` | 574 chunk đã cắt sẵn theo đoạn văn (≤ ~1.200 ký tự/chunk, đầu chunk có tiêu đề bài): `chunk_id`, `doc_id`, `title`, `category`, `phan_muc`, `source_url`, `text` — nạp thẳng vào vector DB |
| `articles/` | 207 file Markdown bản sạch (cùng nội dung dataset.jsonl, tiện đọc/gỡ lỗi) |
| `excluded_articles/` | 4 bài đã làm sạch nhưng loại khỏi index vì lạc đề (xem dưới) |

Thống kê: ~107.600 từ; theo chuyên mục — Khám phá điểm đến 170, Ẩm thực 15, Ăn gì? Ở đâu? 5, Doanh nghiệp 9, Lưu trú 4, Giới thiệu 1, Mua sắm 1, Xe du lịch 2.

## Phân mục (`phan_muc`, bổ sung 12/11/2026)

Mỗi tài liệu/chunk có thêm trường `phan_muc` — phân loại theo **chủ đề chính** (đồng nhất với cột "Phân mục" trong catalog 218 bài), dùng để lọc theo chủ đề khi retrieve:

| Phân mục | Tài liệu | Chunk |
|---|---|---|
| Điểm đến | 118 | 329 |
| Ẩm thực | 34 | 82 |
| Lễ hội | 13 | 48 |
| Trà | 17 | 49 |
| Doanh nghiệp & dịch vụ | 25 | 66 |

Trong bản demo gộp (1.270 chunk), 696 chunk sản phẩm trà cũng mang `phan_muc = "Trà"` (tổng Trà = 745 chunk).

## Cờ (flags)

- `short` (18 bài): bài gốc dưới 300 từ — thông tin mỏng, chatbot chỉ nên trả lời trong phạm vi bài có.
- `personal_style` (71 bài): bài gốc vốn là ký sự/trải nghiệm ngôi thứ nhất; bản sạch đã trung tính hoá và bỏ chi tiết cá nhân, nhưng các nhận định mang tính cảm nhận có thể còn sót — nên thận trọng khi chatbot dùng các bài này cho câu hỏi cần độ khách quan cao.

## Cách dùng nhanh

1. Nạp `chunks.jsonl` → tạo embedding cho trường `text` (gợi ý model hỗ trợ tiếng Việt tốt: `bge-m3`, họ `multilingual-e5`, hoặc `text-embedding-3-small/large` của OpenAI).
2. Lưu vào vector DB (Chroma, Qdrant, pgvector, FAISS…), giữ kèm metadata `title`, `category`, `source_url` để trích dẫn.
3. Khi trả lời: retrieve top 4–6 chunk, đưa vào prompt, yêu cầu LLM chỉ trả lời từ ngữ cảnh và dẫn link nguồn.

### Mẫu system prompt (tiếng Việt)

> Bạn là trợ lý du lịch Thái Nguyên. Chỉ trả lời dựa trên thông tin trong các đoạn tài liệu được cung cấp; nếu tài liệu không có thông tin, hãy nói rõ "hiện chưa có thông tin về nội dung này" và không tự suy đoán. Trả lời bằng ngôi thứ ba trung tính, không nhận trải nghiệm cá nhân của bất kỳ tác giả nào làm của mình. Với giá vé, giờ mở cửa, số điện thoại: nêu kèm lưu ý "theo Cổng du lịch Thái Nguyên, thông tin có thể đã thay đổi". Cuối câu trả lời, dẫn nguồn dạng: Nguồn: <tiêu đề bài> (link).

## Bài bị loại khỏi index (11 bài)

- 3 bài thân bài trống trên cổng: Bảo tàng Văn hoá các dân tộc Việt Nam; Tuấn Linh Trà (quảng bá); Vàng Bạc Đá quý Quý Tùng.
- 4 bài lạc địa phương: Lễ hội Tuyết Sa Pa 2018; Con đường hoa giữa lòng Hà Nội; Cuộc thi Ảnh đẹp Du lịch Vĩnh Phúc; Nhà hát Lớn Hà Nội.
- 4 bài phát hiện khi làm sạch (bản sạch lưu ở `excluded_articles/`): Tháp gốm men chùa Trò (Vĩnh Phúc); Lễ hội mùa thu Côn Sơn – Kiếp Bạc 2016 (Hải Dương); Bãi bỏ thu phí tham quan Đền Hùng (Phú Thọ); Du lịch tình nguyện (chủ đề chung, không riêng Thái Nguyên).

## Hạn chế đã biết

- **Không có ngày đăng** cho phần lớn bài (cổng không hiển thị); nhiều bài viết từ ~2015–2021 nên giá cả, số điện thoại, tình trạng dịch vụ có thể đã cũ — chatbot cần gắn nhãn nguồn như mẫu prompt trên.
- **Mâu thuẫn giữa các bài nguồn** (giữ nguyên theo từng bài, không tự hợp nhất): Nhà tù Chợ Chu — năm xây dựng 1913/1916 và ngày vượt ngục khác nhau giữa 2 bài; thứ tự các tầng hang Phượng Hoàng khác nhau giữa 2 bài; tổng số di tích toàn tỉnh "hơn 800" vs "trên 1.000".
- **Trùng chủ đề theo cặp**: một số địa danh có 2 bài (Thái Hải, Hồ Núi Cốc, Đảo hoa, cơm lam, nem chua Đại Từ…) với chi tiết hơi khác nhau — khi retrieve có thể dính cả hai; nên gộp/trích nguồn rõ ràng.
- Một số bài nội dung chính nằm trong ảnh (vd chương trình tour dạng ảnh) nên phần chữ mỏng — đã gắn cờ `short`.
- Số liệu trong bài gốc đôi khi có lỗi gõ (vd "20.000 ngàn đồng"); đa số được giữ nguyên như cổng đăng để truy vết được về nguồn.
