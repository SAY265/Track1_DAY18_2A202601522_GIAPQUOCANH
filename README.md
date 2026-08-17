# BÀI TẬP DAY 17: PRODUCT & SOLUTION DEFINITION
**Học viên:** Giáp Quốc Anh — **Mã học viên:** 2A202601522  
**Chương trình:** VinUni AI20K Track 1 — Cohort 4  

---

## 1. Solution — Gỡ solution khỏi hình thức cụ thể

### 📌 Case đã chọn:
**Hệ thống AI Agent tự động hóa phân tích yêu cầu và thiết kế mô hình dữ liệu (AI Data Modeling / Data Warehouse Assistant)**

---

### 📝 Ghi nhận & Phân tích Directive

#### 1. Solution Directive (Nguyên văn theo yêu cầu ban đầu):
> *"Xây dựng một màn hình Dashboard có nút bấm 'AI Smart Generate', khi người dùng bấm vào và tải lên file SQL DDL, một popup chatbot AI (sử dụng GPT-4) sẽ tự động sinh sơ đồ ERD trực quan (dùng Mermaid.js) gồm các bảng Fact và Dimension kèm theo thanh trượt kéo thả độ tin cậy để người dùng duyệt mô hình."*

---

### 🔍 Trả lời các câu hỏi dẫn dắt:

1. **Câu nào trong directive đang mô tả giao diện, tên feature hoặc công nghệ?**
   - **Mô tả giao diện (UI Elements):** *"màn hình Dashboard"*, *"nút bấm"*, *"popup chatbot"*, *"thanh trượt kéo thả"*, *"sơ đồ trực quan"*.
   - **Tên Feature cụ thể:** *"'AI Smart Generate'"*.
   - **Công nghệ/Framework cụ thể:** *"file SQL DDL"*, *"sử dụng GPT-4"*, *"Mermaid.js"*.

2. **Nếu bỏ tên nút, màn hình và AI action, khả năng cần tạo ra là gì?**
   - Khả năng **tiếp nhận thông tin cấu trúc dữ liệu nguồn** (schema/metadata).
   - Khả năng **suy luận, chuẩn hóa và chuyển đổi cấu trúc dữ liệu nguồn thành cấu trúc dữ liệu đa chiều (Fact/Dimension)** phục vụ nhu cầu phân tích (OLAP).
   - Khả năng **đánh giá mức độ phù hợp/độ tin cậy** của mô hình đề xuất và **cho phép người dùng kiểm soát, tinh chỉnh** kết quả.

3. **Nhóm có đang mặc định cách triển khai được giao là cách duy nhất không?**
   - **Có.** Directive ban đầu đang mặc định rằng:
     - Phải có *giao diện Web/Dashboard* với *nút bấm* và *popup chatbot*.
     - Phải dùng *GPT-4* và render bằng *Mermaid.js*.
     - Đầu vào bắt buộc phải là *file SQL DDL*.
   - **Thực tế có nhiều cách triển khai khác:**
     - *Phương thức tiếp nhận:* Có thể qua REST API, CLI tool, CI/CD pipeline, kết nối trực tiếp database (JDBC/ODBC) thay vì chỉ upload file DDL qua Web UI.
     - *Xử lý suy luận:* Có thể kết hợp Rule-based engine + Heuristic + Semantic Parser + bất kỳ LLM nào (OpenAI, Claude, Local LLM/Gemini).
     - *Tương tác & Duyệt:* Có thể xuất ra file cấu hình (YAML/JSON/DBML), code review PR, hoặc giao diện bảng tính (data grid) thay vì thanh trượt hay chatbot.

4. **Capability có thể được mô tả mà không dùng tên feature không?**
   - **Hoàn toàn có thể.** Khi mô tả dưới dạng capability, ta tập trung vào **đầu vào (Input) -> Năng lực chuyển đổi lõi (Core Processing/Transformation) -> Đầu ra (Output) & Cơ chế kiểm soát (Governance/Control)** mà không gắn chặt vào bất kỳ thành phần UI hay công nghệ cụ thể nào.

---

### 🎯 Capability trung tính (Neutral Capability):

> **"Khả năng phân tích định nghĩa cấu trúc dữ liệu nguồn, tự động đề xuất mô hình dữ liệu đa chiều (Fact/Dimension) kèm căn cứ đánh giá, và hỗ trợ người dùng xem xét, điều chỉnh mô hình theo mục tiêu phân tích."**

---

### 📊 Bảng so sánh đối chiếu:

| Tiêu chí | Solution Directive (Hình thức cụ thể) | Capability Trung Tính (Bản chất năng lực) |
| :--- | :--- | :--- |
| **Giao diện / Kênh tiếp cận** | Nút bấm, popup chatbot, màn hình dashboard | Độc lập giao diện (hỗ trợ Web, CLI, API, Pipeline) |
| **Đầu vào (Input)** | Bắt buộc upload file SQL DDL | Mọi định dạng mô tả cấu trúc dữ liệu (DDL, Schema JSON, Database Catalog, v.v.) |
| **Công nghệ xử lý** | Ép cứng GPT-4, Mermaid.js | Động cơ chuyển đổi & đề xuất mô hình (Rule Engine / AI / Multi-LLM) |
| **Kiểm soát & Đánh giá** | Thanh trượt kéo thả trong popup | Cơ chế lượng giá mức độ tin cậy và cho phép người dùng điều chỉnh/xác nhận |
| **Mục tiêu cốt lõi** | Trình diễn tính năng AI trên UI | Tự động hóa và chuẩn hóa quy trình thiết kế mô hình dữ liệu phân tích |
