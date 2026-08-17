# BÀI TẬP DAY 17: PRODUCT & SOLUTION DEFINITION
**Học viên:** Giáp Quốc Anh — **Mã học viên:** 2A202601522  
**Chương trình:** VinUni AI20K Track 1 — Cohort 4  

---

## 1. Solution — Gỡ solution khỏi hình thức cụ thể

### 📌 Case đã chọn:
**Vấn đề note lại kiến thức chưa hiểu trong khi học (Note thắc mắc kèm ngữ cảnh học tập)**

---

### 📝 Ghi lại Directive nguyên văn:

> **Solution directive:**  
> *"Một công cụ/nút bấm giúp người học ghi lại thắc mắc sau khi kết thúc buổi học và gửi cho giảng viên."*

---

### 🔍 Trả lời các câu hỏi dẫn dắt:

1. **Câu nào trong directive đang mô tả giao diện, tên feature hoặc công nghệ?**
   - **Giao diện & Thành phần cụ thể:** *"Một công cụ / nút bấm"*, *"gửi cho giảng viên sau khi kết thúc buổi học"*.

2. **Nếu bỏ tên nút, màn hình và AI action, khả năng cần tạo ra là gì?**
   - Khả năng thu thập, lưu trữ ngữ cảnh (thời điểm, nội dung, slide/video) và truyền đạt các thắc mắc phát sinh của người học đến người dạy sau giờ học, không làm gián đoạn luồng tiếp thu kiến thức.

3. **Nhóm có đang mặc định cách triển khai được giao là cách duy nhất không?**
   - **Có.** Directive đang mặc định phải là một *"nút bấm"* hoặc một *"công cụ riêng biệt"*, và chỉ kích hoạt *"sau khi kết thúc buổi học"*.
   - *Thực tế:* Có thể triển khai qua phím tắt nhanh, tiện ích mở rộng (browser extension), tự động ghim timestamp/slide khi người học gõ ghi chú, hoặc tổng hợp câu hỏi theo từng chương/phần học.

4. **Capability có thể được mô tả mà không dùng tên feature không?**
   - **Hoàn toàn có thể.** Mô tả tập trung vào năng lực thu thập dữ liệu ngữ cảnh và kênh truyền tải thông tin hai chiều giữa người học và giảng viên.

---

### 🎯 Capability trung tính (Neutral Capability):

> **"Khả năng thu thập, lưu trữ ngữ cảnh (thời điểm, nội dung) và truyền đạt các thắc mắc phát sinh của người học đến người dạy sau giờ học, không làm gián đoạn luồng tiếp thu."**

---

## 2. Change — Làm lộ chuỗi thay đổi được kỳ vọng

### 📈 Các thay đổi được kỳ vọng:
1. **Đối với người học:** Không bị quên mất mình định hỏi gì sau khi kết thúc bài học.
2. **Đối với giảng viên:** Hiểu rõ sinh viên đang không hiểu ở đoạn nào (slide nào, phút thứ mấy) thay vì nhận một câu hỏi chung chung, mơ hồ.
3. **Đối với tương tác chung:** Tăng sự tương tác chủ động giữa người học và giảng viên, giảm đáng kể rào cản tâm lý "ngại hỏi".

---

## 3. Actor — Xác định các nhóm người có liên quan

| Nhóm người (Actor) | Họ đang làm gì? | Pain hoặc hậu quả có thể có | Họ hưởng lợi thế nào? |
| :--- | :--- | :--- | :--- |
| **Học viên (Learner / Student)** | Đang nghe giảng / tự học và cố gắng hiểu bài. | Quên mất câu hỏi, ngại diễn đạt lại vì khó mô tả ngữ cảnh, dẫn đến hổng kiến thức. | Được giải đáp kịp thời, hiểu bài sâu hơn. |
| **Giảng viên / Trợ giảng (Instructor / TA)** | Tiếp nhận và giải đáp câu hỏi của sinh viên. | Mất thời gian hỏi ngược lại sinh viên xem vướng mắc ở đoạn nào, trả lời sai trọng tâm. | Tiết kiệm thời gian hỗ trợ, nắm bắt được phần kiến thức sinh viên hay mắc lỗi. |

---

## 4. Situation & Job — User đang cố làm gì trong tình huống nào?

### 📍 Mô tả Situation & Job:
Khi đang theo dõi bài giảng (video/tài liệu) và gặp một khái niệm khó, người học đang cố lưu lại thắc mắc đó để nhờ giải đáp sau bằng cách mở một tab note khác, gõ ra giấy, hoặc cố nhớ trong đầu. Tuy nhiên họ bắt đầu gặp vướng mắc ở chỗ việc chuyển đổi qua lại làm đứt mạch học, và lúc note lại không đính kèm được slide/đoạn video tương ứng khiến lúc hỏi lại rất khó diễn đạt.

### 🎯 JTBD Hypothesis (Giả thuyết Job-to-be-Done):
> *"Khi đang học và gặp khúc mắc, tôi muốn lưu lại ngay câu hỏi kèm theo chính xác vị trí bài học (ngữ cảnh), để có thể hỏi giảng viên một cách rõ ràng và nhận được câu trả lời đi thẳng vào vấn đề."*

---

## 5. Pain — Viết các cách giải thích cạnh tranh

- **Pain Hypothesis A (Tập trung vào người học):**  
  Khi đang học, người học gặp khó khăn trong việc ghi chú lại câu hỏi vì thao tác lưu trữ thủ công làm mất bối cảnh bài học, dẫn đến hậu quả là họ thường lười không hỏi nữa hoặc hỏi lủng củng khiến vấn đề không được giải quyết.

- **Pain Hypothesis B (Tập trung vào giảng viên):**  
  Khi tiếp nhận câu hỏi hỗ trợ, giảng viên gặp khó khăn trong việc đưa ra câu trả lời ngay vì sinh viên đặt câu hỏi quá chung chung và thiếu bối cảnh, dẫn đến việc họ phải tốn gấp đôi thời gian để trao đổi qua lại xác minh.

- **👉 Giả thuyết nhóm chọn để điều tra trước:** **Giả thuyết A**.
- **💡 Lý do chọn:** Vấn đề bắt nguồn từ quá trình lưu trữ của người học. Nếu giải quyết được việc người học tạo ra một "note" có chất lượng cao (đủ ngữ cảnh), thì nỗi đau B của giảng viên cũng sẽ tự động được giải quyết.

---

## 6. Evidence — Xác định điều cần tìm trước khi viết câu hỏi

| Cần kiểm tra | Evidence làm nhóm tin hơn | Evidence làm nhóm nghi ngờ hoặc bác bỏ |
| :--- | :--- | :--- |
| **Situation có thật** | Học viên có thể kể lại chi tiết 1 lần gần nhất muốn hỏi giảng viên nhưng không biết hỏi thế nào. | Học viên báo rằng luôn hiểu bài trên lớp, hoặc nếu không hiểu thì tra Google là ra. |
| **Pain có ý nghĩa** | Học viên thừa nhận từng bỏ qua không hỏi nữa vì ngại diễn đạt lại hoàn cảnh lúc đó. | Học viên thoải mái chat trực tiếp với giảng viên mọi lúc và thấy việc này rất dễ dàng. |
| **Workaround tồn tại** | Đang phải dùng cách chụp ảnh màn hình, lưu link, gửi vào Zalo "truyền file" hoặc note nháp ra sổ. | Không hề có hành động cố gắng lưu lại câu hỏi nào. |
| **Consequence tồn tại** | Sai bài tập phần đó, hoặc điểm thấp do hổng kiến thức kéo dài. | Cuối kỳ xem lại slide vẫn qua môn bình thường. |
