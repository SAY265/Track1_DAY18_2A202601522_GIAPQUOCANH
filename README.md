# BÀI TẬP DAY 17: PRODUCT & SOLUTION DEFINITION
**Học viên:** Giáp Quốc Anh — **Mã học viên:** 2A202601522  
**Chương trình:** VinUni AI20K Track 1 — Cohort 4  

---

## 1. Solution — Gỡ solution khỏi hình thức cụ thể

### 📌 Case đã chọn:
**Case B — AI Notes: Personal Learning Notes**

---

### 📝 Ghi lại Directive nguyên văn:

> *"Trong khi học, học viên có thể highlight một đoạn nội dung, đánh dấu “Chưa hiểu”, hoặc viết một câu hỏi hay ghi chú ngắn.*  
> *Khi bài học kết thúc, AI Notes kết hợp những dấu vết này với nội dung bài để tạo một bản ghi chú có cấu trúc. Học viên có thể chỉnh sửa và xác nhận trước khi lưu."*

---

### 🔍 Trả lời các câu hỏi dẫn dắt:

1. **Câu nào trong directive đang mô tả giao diện, tên feature hoặc công nghệ?**
   - **Giao diện & Thao tác UI cụ thể:** *"highlight một đoạn nội dung"*, *"đánh dấu 'Chưa hiểu'"*, *"viết một câu hỏi hay ghi chú ngắn"*, *"chỉnh sửa và xác nhận trước khi lưu"*.
   - **Tên Feature cụ thể:** *"AI Notes"*.
   - **Công nghệ / Hành động đóng khung (AI-specific label):** *"AI Notes kết hợp những dấu vết này với nội dung bài"*, *"AI action: Chọn lọc, nhóm và tổ chức thông tin"*.

2. **Nếu bỏ tên nút, màn hình và AI action, khả năng cần tạo ra là gì?**
   - **Khả năng ghi nhận tín hiệu tương tác:** Thu thập các điểm lưu ý, thắc mắc, phân đoạn quan trọng và phản hồi cá nhân của người học trong quá trình tiếp nhận nội dung.
   - **Khả năng liên kết & tổng hợp tri thức:** Kết nối các tín hiệu/dấu vết tương tác cá nhân với ngữ cảnh nội dung gốc để cấu trúc hóa lại thành tài liệu tóm tắt/ôn tập hoàn chỉnh.
   - **Khả năng kiểm soát tri thức (Human-in-the-loop):** Cho phép người học rà soát, hiệu chỉnh và cá nhân hóa nội dung tổng hợp trước khi lưu trữ vào kho kiến thức.

3. **Nhóm có đang mặc định cách triển khai được giao là cách duy nhất không?**
   - **Có.** Nhóm có thể đang vô tình bị đóng khung vào các giả định triển khai cố định:
     - **Về Trigger:** Mặc định chỉ kích hoạt *khi kết thúc bài học* (thực tế có thể tổng hợp theo yêu cầu bất kỳ lúc nào - on-demand, tổng hợp theo chương/module, hoặc tạo bộ ôn tập sau 1 tuần).
     - **Về Phương thức nhập (Input/UI):** Mặc định phải là *bôi đen text (highlight)* hoặc bấm nút gắn cờ *'Chưa hiểu'* trên web đọc tài liệu (thực tế người học có thể thu âm giọng nói, chụp ảnh ghi chú viết tay, bài giảng video/podcast).
     - **Về Định dạng đầu ra (Output):** Mặc định là một *bản ghi chú văn bản* (thực tế có thể là bộ câu hỏi Flashcard Spaced Repetition, sơ đồ tư duy Mindmap, danh sách hành động/Checklist, hoặc bài tập củng cố cá nhân hóa).
     - **Về Cơ chế xử lý:** Mặc định phải gọi một *AI feature đơn lẻ* (thực tế có thể là pipeline xử lý dữ liệu kết hợp Rule-based context extraction + LLM).

4. **Capability có thể được mô tả mà không dùng tên feature không?**
   - **Hoàn toàn có thể.** Năng lực được mô tả tập trung vào giá trị chuyển đổi từ **Tín hiệu tương tác học tập + Ngữ cảnh bài học** sang **Hệ thống tài liệu ôn tập có cấu trúc và có thể kiểm soát bởi người học**, không phụ thuộc vào tên gọi "AI Notes" hay thành phần UI cụ thể.

---

### 🎯 Solution Directive vs. Capability Trung Tính:

#### 📌 Solution Directive:
> *"Trong khi học, học viên có thể highlight một đoạn nội dung, đánh dấu “Chưa hiểu”, hoặc viết một câu hỏi hay ghi chú ngắn. Khi bài học kết thúc, AI Notes kết hợp những dấu vết này với nội dung bài để tạo một bản ghi chú có cấu trúc. Học viên có thể chỉnh sửa và xác nhận trước khi lưu."*

#### 💡 Capability Trung Tính:
> **"Khả năng thu thập các dấu vết tương tác và thắc mắc của người học, liên kết với ngữ cảnh nội dung bài học để tự động tổng hợp thành tài liệu ôn tập có cấu trúc, đồng thời cho phép người học xem xét và tinh chỉnh theo nhu cầu cá nhân."**

---

### 📊 Bảng phân tích cấu trúc thành phần:

| Thành phần | Solution đã mô tả (Hình thức cụ thể) | Bóc tách & Mở rộng Capability (Bản chất trung tính) |
| :--- | :--- | :--- |
| **Trigger** | Học viên hoàn thành bài học | Khi hoàn thành bài học, theo yêu cầu chủ động (on-demand), hoặc định kỳ ôn tập |
| **Input** | Nội dung bài, highlights, điểm “Chưa hiểu”, câu hỏi và ghi chú cá nhân | Dữ liệu nội dung gốc + Tập hợp các tín hiệu tương tác/thắc mắc của người học đa phương thức |
| **Processing (Core Action)** | AI Notes: Chọn lọc, nhóm và tổ chức thông tin | Trích xuất ngữ cảnh, đối chiếu thắc mắc với nội dung gốc, phân loại và tái cấu trúc thông tin |
| **Output** | Bản ghi chú cá nhân có cấu trúc | Tài liệu ôn tập có cấu trúc (Summary, Flashcard, Mindmap, Q&A Checklist cá nhân) |
| **User Control** | Học viên chỉnh sửa và xác nhận trước khi lưu | Cơ chế Human-in-the-loop: xem xét, sửa đổi, bổ sung và xác thực tri thức trước khi lưu trữ |
