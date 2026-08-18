2\. Chốt Hypothesis Problem

Hypothesis Problem nhóm tiếp tục:

   Khi đang nghe giảng và gặp một nội dung chưa hiểu hoặc cần ghi nhớ, người học gặp khó khăn trong việc ghi lại hoặc tra cứu thông tin mà vẫn theo kịp bài giảng vì việc chuyển sang ghi chú/tra cứu làm gián đoạn sự tập trung và dễ mất ngữ cảnh, dẫn đến đứt mạch nghe giảng và không hiểu rõ hoặc quên kiến thức sau buổi học.

Evidence ban đầu hỗ trợ giả thuyết:

   Qua 2 cuộc phỏng vấn, người học cho biết họ từng bỏ lỡ thông tin khi nghe giảng, phải chuyển qua lại giữa slide và ứng dụng ghi chú, hoặc tra cứu Google/AI khi gặp nội dung chưa hiểu. Việc này khiến họ khó tiếp tục tập trung nghe; sau đó có trường hợp vẫn không hiểu rõ, dễ quên hoặc khó nhớ chính xác mình đã vướng ở đoạn nào.

Điều vẫn chưa được chứng minh:

   Chưa xác định được vấn đề này xảy ra thường xuyên đến mức nào, có phổ biến với nhiều người học khác hay không, và ghi chú/tra cứu trong lúc học có thực sự là nguyên nhân chính gây mất tập trung hay còn do các yếu tố khác như tốc độ giảng, độ khó kiến thức hoặc nền tảng của người học.

| Thành phần  | Quyết định chung cho AI tổng hợp note, và đặt câu hỏi  |
| :---- | :---- |
| Target user  | Học viên  |
| Stiuation  | Học viên chưa hiểu bài cần hiểu kiến thức sau buổi học  |
| Task | Tổng hợp, kiểm tra kiến thức  |
| Desire outcome | Kiến thức được tổng hợp lại |
| Content/data fixture  | Thông tin bài giảng slide |

| Thành phần  | A | B | C |
| :---- | :---- | :---- | :---- |
| Solution mechanism | AI đưa ra được kiến thức liên quan tới note | AI tạo câu hỏi cho học viên hiểu được bài thông qua làm câu hỏi  | AI tổng hơp và đưa ra được vấn đề của học viên cho giảng viên giải đáp  |
| User làm gì  | User bôi đen xong bấm Note Chưa hiểu  | User bôi đen xong bấm Note | User bôi đen xong bấm, yêu cầu giải đáp  |
| AI làm gì  | AI tổng hợp thông tin  | AI tổng hợp thông tin và đưa câu hỏi  | AI tổng hợp Note và đưa cho giảng viên  |
| Trigger  | Bấm chưa hiểu | Bấm tạo câu hỏi  | Kết thúc buổi học  |
| Trade off  | K tập trung bài giảng để đọc lại tổng hợp tù AI  | K tập trung bài giảng để đọc lại tổng hợp tù AI  | Phản hồi bị chậm  |

A khác B vì A giải quyết vấn đề ngay lập tức 

B khác C vì B phản hồi ngay lập tức 

C khác A vì A ưu tiên giải quyết ngay phần kiến thức học viên hỏi 

| Human \- AI decesion | A | B | C |
| :---- | :---- | :---- | :---- |
| User làm gì \- AI làm gì  | User bấm nút  AI tổng hợp và giải thích  | User bấm nút  AI tổng hợp đưu ra câu hỏi  | User bấm nút  AI tổng hợp và đưa cho giảng viên |
| AI Act / Ask / Don't Act? Vì sao?  | Act : AI tự động tổng hợp thông tin ngay khi user bấm nút, không hỏi lan man, dài dòng.  | Act: AI tự tạo câu hỏi sau khi user yêu cầu. Không tự trả lời thông tin  | Ask: AI phải cho user xác nhận trước khi gửi cho giảng viên vì đây là hành động ra bên ngoài và có thể gửi sai ý user.  |
| User hiểu capability/limit bằng gì?  | Câu trả lời của AI  AI chỉ giải thích nội dung liên quan tới slide | Chỉ nằm trong phạm vi slide AI không có kiếm chứng câu hỏi và đáp án  | Thông báo phản hồi cho giảng viên  Không có câu trả lời ngay lập tức, đợi phản hồi từ giảng viên |
| Evidence/uncertainty được thể hiện thế nào?  | Slide kiến thức  Thông báo “AI không có thông tin, có vẻ,...” không chắc chắn, tự bịa  | Cung cấo giải đáp : Tại sao đáp án này đúng theo slide bài giảng  | Trích dẫn nguyên note học viên đã note, cũng cấp đầy đủ ngữ cảnh cho giảng viên  |
| User kiểm soát và recovery thế nào?  | Sửa trước khi bấm nút | Làm lại hoặc bỏ qua câu hỏi. Xem đáp án  | Sửa được bản tổng hợp gửi cho giảng viên |

