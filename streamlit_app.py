# -*- coding: utf-8 -*-
"""
Trợ Lý Học Tập AI Đọc Slide & Tương Tác Trực Tiếp (Python Streamlit)
Chương 1: Ma Trận - Định Thức - Hệ Phương Trình
"""

import streamlit as st
import json
import time
import os
import re
from datetime import datetime

# Optional PyMuPDF / OpenAI imports with graceful fallbacks
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

# ==============================================================================
# PAGE CONFIG & MODERN DARK LUXURY CSS
# ==============================================================================
st.set_page_config(
    page_title="Trợ Lý Học Tập AI - Đọc Slide & Luyện Tập",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling for Sleek, Premium Interface
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    /* Main Background */
    .stApp {
        background-color: #0b1120;
        color: #f1f5f9;
    }
    
    /* Header Branding Banner */
    .brand-header {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95));
        border: 1px solid rgba(99, 102, 241, 0.25);
        border-radius: 14px;
        padding: 16px 20px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15);
    }
    
    .brand-title {
        font-size: 20px;
        font-weight: 800;
        background: linear-gradient(135deg, #a5b4fc, #38bdf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }
    
    .brand-subtitle {
        font-size: 12px;
        color: #94a3b8;
        margin: 2px 0 0 0;
    }
    
    /* Slide Document Container */
    .slide-card-container {
        background: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.1);
        position: relative;
    }
    
    .slide-header-bar {
        border-bottom: 2px solid #334155;
        padding-bottom: 12px;
        margin-bottom: 18px;
    }
    
    .slide-main-title {
        font-size: 20px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: 0.5px;
    }
    
    /* Section Cards Grid */
    .section-card {
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 16px 18px;
        margin-bottom: 14px;
        transition: all 0.2s ease;
    }
    
    .section-card:hover {
        border-color: rgba(99, 102, 241, 0.4);
        background: #243047;
    }
    
    .sec-title-1 { color: #818cf8; font-weight: 700; font-size: 16px; margin-bottom: 8px; }
    .sec-title-2 { color: #38bdf8; font-weight: 700; font-size: 16px; margin-bottom: 8px; }
    .sec-title-3 { color: #c084fc; font-weight: 700; font-size: 16px; margin-bottom: 8px; }
    .sec-title-4 { color: #34d399; font-weight: 700; font-size: 16px; margin-bottom: 8px; }
    
    .bullet-item {
        font-size: 13.5px;
        color: #f1f5f9;
        line-height: 1.6;
        margin-bottom: 4px;
    }
    
    .sub-bullet-item {
        font-size: 13px;
        color: #cbd5e1;
        line-height: 1.5;
        margin-left: 18px;
        margin-bottom: 3px;
    }
    
    /* Stats Bar in Tab 3 */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 14px;
        text-align: center;
    }
    
    .stat-box .num {
        font-size: 18px;
        font-weight: 800;
        font-family: 'JetBrains Mono', monospace;
    }
    
    .stat-box .lbl {
        font-size: 10px;
        color: #94a3b8;
        text-transform: uppercase;
        font-weight: 700;
    }
    
    /* History Card */
    .history-item-card {
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 14px;
        margin-bottom: 10px;
    }
    
    .history-item-card.correct {
        border-left: 4px solid #10b981;
    }
    
    .history-item-card.incorrect {
        border-left: 4px solid #ef4444;
    }
    
    /* Snippet Chip */
    .snippet-pill {
        background: rgba(192, 132, 252, 0.15);
        border: 1px solid rgba(192, 132, 252, 0.3);
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 8px;
        font-size: 12.5px;
        color: #f3e8ff;
    }
</style>
""", unsafe_allow_html=True)

# ==============================================================================
# SAMPLE DATA & CONSTANTS
# ==============================================================================
SAMPLE_SLIDE_DATA = {
    "title": "CHƯƠNG 1. MA TRẬN – ĐỊNH THỨC – HỆ PHƯƠNG TRÌNH",
    "sections": [
        {
            "heading": "1. Ma trận",
            "items": [
                "- Khái niệm ma trận, kích thước m×n",
                "- Các phép toán: cộng, trừ (cùng kích thước), nhân ma trận (đúng thứ tự)",
                "- Ma trận chuyển vị A^T"
            ]
        },
        {
            "heading": "2. Định thức",
            "items": [
                "- Định thức cấp 2, 3",
                "- Tính bằng khai triển hoặc biến đổi sơ cấp",
                "- Tính chất:",
                "  + Đổi chỗ 2 dòng → đổi dấu định thức",
                "  + Một dòng nhân k → định thức nhân k",
                "  + Một dòng toàn 0 → định thức = 0"
            ]
        },
        {
            "heading": "3. Hạng ma trận",
            "items": [
                "- Rank = số dòng (hoặc cột) độc lập tuyến tính",
                "- Cách tìm: biến đổi sơ cấp về dạng bậc thang",
                "- Ứng dụng: xét nghiệm hệ, xét phụ thuộc tuyến tính"
            ]
        },
        {
            "heading": "4. Hệ phương trình tuyến tính",
            "items": [
                "- Hệ có nghiệm ⇔ rank(A) = rank(A|b)",
                "- Hệ có nghiệm duy nhất ⇔ rank = số ẩn",
                "- Vô nghiệm ⇔ rank(A) ≠ rank(A|b)"
            ]
        }
    ]
}

# ==============================================================================
# STATE INITIALIZATION
# ==============================================================================
if "openai_api_key" not in st.session_state:
    st.session_state.openai_api_key = os.environ.get("OPENAI_API_KEY", "")

if "active_slide" not in st.session_state:
    st.session_state.active_slide = SAMPLE_SLIDE_DATA

if "selected_snippet" not in st.session_state:
    st.session_state.selected_snippet = "Ma trận chuyển vị A^T"

if "collected_snippets" not in st.session_state:
    st.session_state.collected_snippets = []

if "answered_quizzes" not in st.session_state:
    st.session_state.answered_quizzes = []

if "instructor_bookmarks" not in st.session_state:
    st.session_state.instructor_bookmarks = []

if "current_quiz" not in st.session_state:
    st.session_state.current_quiz = None

if "current_explanation" not in st.session_state:
    st.session_state.current_explanation = None

if "selection_mode" not in st.session_state:
    st.session_state.selection_mode = "1 Lần"

if "toasts" not in st.session_state:
    st.session_state.toasts = []

# Helper: Keep max 3 notifications
def add_toast(msg: str):
    st.toast(msg)

# ==============================================================================
# AI INTELLIGENCE ENGINE (OPENAI + SMART FALLBACK)
# ==============================================================================
def get_full_slide_context() -> str:
    slide = st.session_state.active_slide
    lines = [slide.get("title", "")]
    for sec in slide.get("sections", []):
        lines.append(sec["heading"])
        lines.extend(sec["items"])
    return "\n".join(lines)

def ai_generate_explanation(term: str) -> dict:
    context = get_full_slide_context()
    api_key = st.session_state.openai_api_key.strip()
    
    if api_key and api_key.startswith("sk-") and OpenAI:
        try:
            client = OpenAI(api_key=api_key)
            prompt = f"""
            Ngữ cảnh toàn bộ slide bài giảng:
            {context}
            
            Phần kiến thức người học bôi đen cần giải thích: "{term}"
            
            Yêu cầu:
            1. Giải thích trọng tâm, cô đọng (2-3 câu).
            2. 2-3 điểm mấu chốt/công thức tư duy.
            3. Dẫn chứng/liên hệ với định lý trên slide.
            Trả về JSON dạng:
            {{
                "summary": "...",
                "keypoints": ["...", "..."],
                "evidence": "..."
            }}
            """
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "Bạn là Giảng viên Đại số Tuyến tính & AI Chuyên nghiệp."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            st.warning(f"Lỗi OpenAI ({e}), đang dùng AI nội bộ.")

    # Smart Built-in Knowledge Base for Linear Algebra
    t_lower = term.lower()
    if "định thức cấp 2" in t_lower or "định thức cấp 3" in t_lower or ("định thức" in t_lower and ("2" in t_lower or "3" in t_lower or "cấp" in t_lower)):
        return {
            "summary": "Định thức cấp 2 và cấp 3 là các đại lượng vô hướng số thực đặc trưng cho ma trận vuông cấp 2 và cấp 3:",
            "keypoints": [
                "Định thức cấp 2: Cho ma trận A = [[a, b], [c, d]], det(A) = ad - bc (tích đường chéo chính trừ chéo phụ). Hình học: diện tích hình bình hành sinh bởi 2 vector cột.",
                "Định thức cấp 3: Tính bằng Quy tắc đường chéo Sarrus hoặc khai triển Laplace theo dòng/cột bất kỳ: det(A) = a₁₁A₁₁ + a₁₂A₁₂ + a₁₃A₁₃. Hình học: thể tích khối hộp 3 chiều.",
                "Ý nghĩa: det(A) ≠ 0 là điều kiện cần và đủ để ma trận A khả nghịch (tồn tại A⁻¹) và hệ Cramer có nghiệm duy nhất."
            ],
            "evidence": "Nằm trong Mục 2 'Định thức' trên slide Chương 1."
        }
    elif "đổi chỗ 2 dòng" in t_lower or "đổi dấu định thức" in t_lower or ("đổi chỗ" in t_lower and "dòng" in t_lower):
        return {
            "summary": "Tính chất phản xứng của Định thức khi hoán vị dòng hoặc cột:",
            "keypoints": [
                "Khi đổi chỗ 2 dòng bất kỳ (d_i ↔ d_j) hoặc 2 cột bất kỳ, định thức đổi dấu: det(B) = -det(A).",
                "Nếu thực hiện k lần đổi chỗ dòng, định thức mới nhân với (-1)^k.",
                "Hệ quả: Nếu ma trận có 2 dòng (hoặc 2 cột) giống nhau hoặc tỉ lệ nhau, định thức chắc chắn bằng 0."
            ],
            "evidence": "Mục 2. Tính chất: 'Đổi chỗ 2 dòng → đổi dấu định thức' trên slide Chương 1."
        }
    elif "nhân k" in t_lower or "một dòng nhân" in t_lower:
        return {
            "summary": "Tính chất đa tuyến tính của Định thức đối với từng dòng:",
            "keypoints": [
                "Khi nhân tất cả phần tử của MỘT dòng với số k, định thức tăng k lần: det(B) = k · det(A).",
                "Phân biệt: Nếu nhân TOÀN BỘ ma trận vuông A cấp n với k thì det(k·A) = k^n · det(A).",
                "Cho phép rút thừa số chung của một dòng ra ngoài dấu định thức."
            ],
            "evidence": "Mục 2. Tính chất: 'Một dòng nhân k → định thức nhân k' trên slide Chương 1."
        }
    elif "toàn 0" in t_lower or "toàn số 0" in t_lower:
        return {
            "summary": "Tính chất suy biến của ma trận khi có dòng toàn 0:",
            "keypoints": [
                "Nếu ma trận vuông có ít nhất một dòng toàn số 0 (hoặc cột toàn 0), định thức chắc chắn bằng 0 (det = 0).",
                "Khai triển Laplace theo dòng toàn 0 cho mọi tích đều bằng 0.",
                "Dòng toàn 0 thể hiện hệ vector dòng phụ thuộc tuyến tính, ma trận không khả nghịch."
            ],
            "evidence": "Mục 2. Tính chất: 'Một dòng toàn 0 → định thức = 0' trên slide Chương 1."
        }
    elif "định thức" in t_lower:
        return {
            "summary": "Định thức (Determinant) là một đại lượng vô hướng đặc trưng cho ma trận vuông, dùng để xác định tính khả nghịch và giải hệ phương trình:",
            "keypoints": [
                "Chỉ ma trận VUÔNG (n×n) mới có định thức.",
                "Tính chất nhân: det(A · B) = det(A) · det(B) và det(A^T) = det(A).",
                "Ứng dụng: Tính ma trận nghịch đảo A⁻¹ = (1/det(A)) · P_A^T và giải hệ phương trình tuyến tính bằng quy tắc Cramer."
            ],
            "evidence": "Nằm trong Mục 2 'Định thức' trên slide Chương 1."
        }
    elif "hạng" in t_lower or "rank" in t_lower or "độc lập tuyến tính" in t_lower:
        return {
            "summary": "Hạng của ma trận (Rank) là số lượng cực đại các dòng (hoặc cột) độc lập tuyến tính:",
            "keypoints": [
                "Tìm rank: Sử dụng phép biến đổi Gauss đưa về dạng bậc thang, rank(A) = Số dòng khác 0.",
                "Với ma trận A cấp m×n, luôn có: 0 ≤ rank(A) ≤ min(m, n) và rank(A) = rank(A^T).",
                "Hệ phương trình tuyến tính có nghiệm khi và chỉ khi rank(A) = rank(A|b)."
            ],
            "evidence": "Nằm trong Mục 3 'Hạng ma trận' trên slide Chương 1."
        }
    elif "nghiệm duy nhất" in t_lower or "rank = số ẩn" in t_lower:
        return {
            "summary": "Điều kiện để hệ phương trình tuyến tính Ax = b có nghiệm duy nhất:",
            "keypoints": [
                "Định lý: Hệ có nghiệm DUY NHẤT ⇔ rank(A) = rank(A|b) = n (trong đó n là số ẩn của hệ).",
                "Khi rank = n, hệ không có ẩn tự do (số ẩn tự do = n - rank = 0).",
                "Với hệ vuông (m = n): Tương đương det(A) ≠ 0, có nghiệm tính theo quy tắc Cramer."
            ],
            "evidence": "Nằm trong Mục 4 'Hệ có nghiệm duy nhất ⇔ rank = số ẩn' trên slide Chương 1."
        }
    elif "vô nghiệm" in t_lower or "rank(a) ≠ rank(a|b)" in t_lower:
        return {
            "summary": "Điều kiện để hệ phương trình tuyến tính Ax = b vô nghiệm:",
            "keypoints": [
                "Định lý: Hệ VÔ NGHIỆM ⇔ rank(A) < rank(A|b).",
                "Biểu hiện Gauss: Xuất hiện dòng có dạng [0 0 ... 0 | c] với c ≠ 0 trong ma trận mở rộng (phương trình vô lý 0 = c).",
                "Hình học: Các siêu phẳng không có điểm giao nhau chung."
            ],
            "evidence": "Nằm trong Mục 4 'Vô nghiệm ⇔ rank(A) ≠ rank(A|b)' trên slide Chương 1."
        }
    elif "hệ phương trình" in t_lower or "nghiệm" in t_lower:
        return {
            "summary": "Định lý Kronecker-Capelli về Điều kiện nghiệm của Hệ Phương trình Tuyến tính Ax = b:",
            "keypoints": [
                "Vô nghiệm: rank(A) < rank(A|b)",
                "Nghiệm duy nhất: rank(A) = rank(A|b) = n (bằng số ẩn)",
                "Vô số nghiệm: rank(A) = rank(A|b) = r < n (có n - r ẩn tự do)"
            ],
            "evidence": "Nằm trong Mục 4 'Hệ phương trình tuyến tính' trên slide Chương 1."
        }
    elif "chuyển vị" in t_lower or "a^t" in t_lower:
        return {
            "summary": "Ma trận chuyển vị A^T thu được bằng cách đổi các dòng của A thành các cột tương ứng:",
            "keypoints": [
                "Tính chất cốt lõi: (A^T)^T = A, (A + B)^T = A^T + B^T, (kA)^T = kA^T.",
                "Đặc biệt: (A · B)^T = B^T · A^T (đảo ngược thứ tự nhân).",
                "Ma trận đối xứng khi A^T = A; ma trận phản đối xứng khi A^T = -A."
            ],
            "evidence": "Nằm trong Mục 1 'Ma trận chuyển vị A^T' trên slide Chương 1."
        }
    else:
        return {
            "summary": f"'{term}' là khái niệm trọng tâm trong Đại số Tuyến tính thuộc Chương 1: Ma trận – Định thức – Hệ phương trình.",
            "keypoints": [
                "Áp dụng trực tiếp trong các phép biến đổi sơ cấp và thuật toán ma trận.",
                "Đảm bảo tuân thủ đúng các điều kiện đại số và kích thước m×n.",
                "Cần nắm chắc mối liên hệ giữa ma trận hệ số và không gian nghiệm."
            ],
            "evidence": "Được trích xuất từ nội dung Chương 1."
        }

def ai_generate_single_quiz(term: str) -> dict:
    context = get_full_slide_context()
    api_key = st.session_state.openai_api_key.strip()
    
    if api_key and api_key.startswith("sk-") and OpenAI:
        try:
            client = OpenAI(api_key=api_key)
            prompt = f"""
            Ngữ cảnh Slide:
            {context}
            
            Phần kiến thức bôi đen: "{term}"
            
            Hãy tạo ĐÚNG 1 CÂU HỎI TRẮC NGHIỆM (4 lựa chọn A, B, C, D) kiểm tra trọng tâm của phần bôi đen này.
            Trả về JSON theo format:
            {{
                "question": "Câu hỏi...",
                "options": [
                    {{"id": "A", "text": "...", "isCorrect": false, "explanation": "..."}},
                    {{"id": "B", "text": "...", "isCorrect": true, "explanation": "..."}},
                    {{"id": "C", "text": "...", "isCorrect": false, "explanation": "..."}},
                    {{"id": "D", "text": "...", "isCorrect": false, "explanation": "..."}}
                ],
                "overallExplanation": "Giải thích tổng quan..."
            }}
            """
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "Bạn là Chuyên gia Khảo thí Đại số Tuyến tính."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            st.warning(f"Lỗi OpenAI ({e}), đang dùng AI nội bộ.")

    # Built-in dynamic question pool (1 question strictly)
    t_lower = term.lower()
    if "định thức" in t_lower:
        return {
            "question": f"Khi thực hiện đổi chỗ 2 dòng bất kỳ của ma trận vuông A, định thức của ma trận mới sẽ thay đổi như thế nào?",
            "options": [
                {"id": "A", "text": "Không đổi giá trị", "isCorrect": False, "explanation": "Sai, đổi chỗ 2 dòng phải đổi dấu định thức."},
                {"id": "B", "text": "Đổi dấu định thức", "isCorrect": True, "explanation": "Chính xác! Theo tính chất định thức: Đổi chỗ 2 dòng → đổi dấu định thức."},
                {"id": "C", "text": "Tăng lên gấp đôi", "isCorrect": False, "explanation": "Sai, chỉ đổi dấu chứ không nhân 2."},
                {"id": "D", "text": "Bằng 0", "isCorrect": False, "explanation": "Sai, định thức chỉ bằng 0 khi có dòng toàn 0 hoặc 2 dòng tỉ lệ."}
            ],
            "overallExplanation": "Theo tính chất định thức trên slide: 'Đổi chỗ 2 dòng → đổi dấu định thức'."
        }
    elif "hệ" in t_lower or "nghiệm" in t_lower:
        return {
            "question": f"Cho hệ phương trình tuyến tính Ax = b. Điều kiện cần và đủ để hệ phương trình có nghiệm DUY NHẤT là gì?",
            "options": [
                {"id": "A", "text": "rank(A) ≠ rank(A|b)", "isCorrect": False, "explanation": "Sai, khi rank(A) ≠ rank(A|b) thì hệ vô nghiệm."},
                {"id": "B", "text": "rank(A) = rank(A|b) = số ẩn", "isCorrect": True, "explanation": "Chính xác! Hệ có nghiệm duy nhất khi và chỉ khi rank(A) = rank(A|b) = số ẩn n."},
                {"id": "C", "text": "rank(A) < rank(A|b)", "isCorrect": False, "explanation": "Sai, điều này tương đương hệ vô nghiệm."},
                {"id": "D", "text": "rank(A) = 0", "isCorrect": False, "explanation": "Sai, ma trận toàn 0 không đảm bảo nghiệm duy nhất."}
            ],
            "overallExplanation": "Theo Mục 4 trên slide: 'Hệ có nghiệm duy nhất ⇔ rank = số ẩn'."
        }
    elif "hạng" in t_lower or "rank" in t_lower:
        return {
            "question": f"Hạng của ma trận (Rank) được định nghĩa chính xác là gì?",
            "options": [
                {"id": "A", "text": "Tổng tất cả các phần tử trên đường chéo chính", "isCorrect": False, "explanation": "Sai, đó là Vết (Trace) của ma trận."},
                {"id": "B", "text": "Số dòng (hoặc cột) độc lập tuyến tính tối đa", "isCorrect": True, "explanation": "Chính xác! Rank bằng số dòng hoặc cột độc lập tuyến tính, tìm qua dạng bậc thang."},
                {"id": "C", "text": "Số phần tử khác 0 của ma trận", "isCorrect": False, "explanation": "Sai, không phản ánh tính độc lập tuyến tính."},
                {"id": "D", "text": "Kích thước m × n của ma trận", "isCorrect": False, "explanation": "Sai, đó là cấp của ma trận."}
            ],
            "overallExplanation": "Theo Mục 3 trên slide: 'Rank = số dòng (hoặc cột) độc lập tuyến tính'."
        }
    else:
        return {
            "question": f"Về ma trận chuyển vị A^T, phát biểu nào sau đây là ĐÚNG?",
            "options": [
                {"id": "A", "text": "Các dòng của ma trận A trở thành các cột của ma trận A^T", "isCorrect": True, "explanation": "Chính xác! Phép chuyển vị biến dòng thứ i thành cột thứ i."},
                {"id": "B", "text": "Đổi dấu tất cả các phần tử của ma trận A", "isCorrect": False, "explanation": "Sai, đó là ma trận đối -A."},
                {"id": "C", "text": "Nghịch đảo giá trị từng phần tử", "isCorrect": False, "explanation": "Sai, đó không phải là phép chuyển vị."},
                {"id": "D", "text": "Chỉ áp dụng được cho ma trận vuông", "isCorrect": False, "explanation": "Sai, ma trận kích thước m×n bất kỳ đều có ma trận chuyển vị n×m."}
            ],
            "overallExplanation": "Phép chuyển vị A^T đổi vị trí giữa các dòng và các cột của ma trận."
        }

# ==============================================================================
# SIDEBAR CONTROLS
# ==============================================================================
with st.sidebar:
    st.markdown("### ⚙️ Cài Đặt & Điều Khiển")
    
    # OpenAI API Key Input
    key_input = st.text_input(
        "OpenAI API Key (Tùy chọn):",
        value=st.session_state.openai_api_key,
        type="password",
        help="Nhập key để sử dụng mô hình GPT-4o-mini trực tiếp từ OpenAI"
    )
    if key_input != st.session_state.openai_api_key:
        st.session_state.openai_api_key = key_input
        add_toast("Đã lưu OpenAI API Key thành công!")
        
    st.divider()
    
    # Selection Mode Selector
    st.markdown("#### 🎯 Chế Độ Bôi Đen")
    mode = st.radio(
        "Chọn hình thức tương tác:",
        options=["1 Lần", "Nhiều Lần (Tự gom)"],
        index=0 if st.session_state.selection_mode == "1 Lần" else 1,
        help="1 Lần: Tương tác ngay cho từng đoạn; Nhiều Lần: Gom nhiều đoạn để tổng hợp câu hỏi liên kết."
    )
    st.session_state.selection_mode = mode
    
    st.divider()
    
    # Upload custom document or reset to sample
    st.markdown("#### 📂 Tài Liệu Học Tập")
    uploaded_file = st.file_uploader("Tải tài liệu (PDF / TXT):", type=["pdf", "txt"])
    if uploaded_file is not None:
        if uploaded_file.type == "text/plain":
            txt_content = uploaded_file.read().decode("utf-8")
            st.session_state.active_slide = {
                "title": uploaded_file.name,
                "sections": [{"heading": "Nội dung tải lên", "items": [txt_content]}]
            }
            add_toast(f"Đã nạp file {uploaded_file.name}")
        elif fitz and uploaded_file.type == "application/pdf":
            doc = fitz.open(stream=uploaded_file.read(), filetype="pdf")
            extracted_pages = []
            for i, page in enumerate(doc):
                extracted_pages.append(page.get_text())
            full_pdf_text = "\n".join(extracted_pages)
            st.session_state.active_slide = {
                "title": uploaded_file.name,
                "sections": [{"heading": "Văn bản PDF", "items": full_pdf_text.split("\n")[:20]}]
            }
            add_toast(f"Đã trích xuất PDF: {uploaded_file.name}")

    if st.button("🔄 Nạp Lại Slide Mẫu (Chương 1. Ma Trận)", use_container_width=True):
        st.session_state.active_slide = SAMPLE_SLIDE_DATA
        add_toast("Đã nạp lại Slide Mẫu Chương 1: Ma Trận")
        st.rerun()

# ==============================================================================
# MAIN VIEWPORT LAYOUT (2 COLUMNS)
# ==============================================================================
st.markdown("""
<div class="brand-header">
    <div>
        <div class="brand-title">🎓 TRỢ LÝ HỌC TẬP AI (PYTHON POWERED)</div>
        <div class="brand-subtitle">Đọc Slide Văn Bản Thuần Túy • Giải Thích Ngữ Cảnh • Tạo Trắc Nghiệm Động • Lưu Trữ Lịch Sử</div>
    </div>
    <div>
        <span style="background: rgba(16,185,129,0.2); color: #34d399; font-weight:700; font-size:12px; padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(16,185,129,0.4);">
            ● Hệ Thống Sẵn Sàng
        </span>
    </div>
</div>
""", unsafe_allow_html=True)

col_slide, col_ai = st.columns([1.1, 0.9], gap="large")

# ------------------------------------------------------------------------------
# LEFT COLUMN: SLIDE VIEWER & TEXT SELECTION HUB
# ------------------------------------------------------------------------------
with col_slide:
    st.markdown("### 📄 Khung Bài Giảng Slide")
    
    slide = st.session_state.active_slide
    
    # Render Clean Document Slide Card
    with st.container():
        st.markdown(f"""
        <div class="slide-card-container">
            <div class="slide-header-bar">
                <div class="slide-main-title">{slide.get('title', 'BÀI GIẢNG')}</div>
            </div>
        """, unsafe_allow_html=True)
        
        # Display 4 Sections
        for idx, sec in enumerate(slide.get("sections", [])):
            sec_cls = f"sec-title-{(idx % 4) + 1}"
            st.markdown(f'<div class="section-card"><div class="{sec_cls}">{sec["heading"]}</div>', unsafe_allow_html=True)
            for item in sec["items"]:
                if item.strip().startswith("+"):
                    st.markdown(f'<div class="sub-bullet-item">{item.strip()}</div>', unsafe_allow_html=True)
                else:
                    st.markdown(f'<div class="bullet-item">{item.strip()}</div>', unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)
            
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("---")
    
    # Concept Highlighter & Selector Bar
    st.markdown("#### 🎯 Chọn / Nhập Đoạn Cần Tương Tác:")
    
    # Pre-populated key terms from slide
    key_terms = [
        "1. Ma trận",
        "Khái niệm ma trận, kích thước m×n",
        "Ma trận chuyển vị A^T",
        "2. Định thức",
        "Định thức cấp 2, 3",
        "Đổi chỗ 2 dòng → đổi dấu định thức",
        "Một dòng toàn 0 → định thức = 0",
        "3. Hạng ma trận",
        "Rank = số dòng (hoặc cột) độc lập tuyến tính",
        "4. Hệ phương trình tuyến tính",
        "Hệ có nghiệm ⇔ rank(A) = rank(A|b)",
        "Hệ có nghiệm duy nhất ⇔ rank = số ẩn",
        "Vô nghiệm ⇔ rank(A) ≠ rank(A|b)"
    ]
    
    selected_option = st.selectbox("Chọn nhanh đoạn kiến thức từ slide:", options=key_terms, index=2)
    custom_snippet = st.text_input("Hoặc gõ/dán cụm từ bất kỳ từ slide:", value=selected_option)
    
    st.session_state.selected_snippet = custom_snippet.strip()
    
    # Action Buttons Toolbar
    btn_col1, btn_col2, btn_col3, btn_col4 = st.columns(4)
    
    with btn_col1:
        if st.button("⚡ AI Giải Thích", use_container_width=True, type="primary"):
            st.session_state.current_explanation = ai_generate_explanation(st.session_state.selected_snippet)
            add_toast(f"Đã giải thích: '{st.session_state.selected_snippet[:25]}...'")
            
    with btn_col2:
        if st.button("❓ Tạo Câu Hỏi", use_container_width=True):
            st.session_state.current_quiz = ai_generate_single_quiz(st.session_state.selected_snippet)
            st.session_state.quiz_answered = False
            add_toast(f"Đã sinh 1 câu hỏi cho '{st.session_state.selected_snippet[:20]}...'")
            
    with btn_col3:
        if st.button("➕ Gom Đoạn (+)", use_container_width=True):
            if st.session_state.selected_snippet not in st.session_state.collected_snippets:
                st.session_state.collected_snippets.append(st.session_state.selected_snippet)
                add_toast(f"Đã gom đoạn vào khay ({len(st.session_state.collected_snippets)} đoạn)!")
            else:
                add_toast("Đoạn này đã có trong khay!")
                
    with btn_col4:
        if st.button("📝 Lưu Gửi GV", use_container_width=True):
            st.session_state.instructor_bookmarks.append({
                "term": st.session_state.selected_snippet,
                "note": f"Em cần giảng viên giải thích thêm về: '{st.session_state.selected_snippet}'",
                "time": datetime.now().strftime("%H:%M")
            })
            add_toast(f"Đã lưu câu hỏi gửi Giảng viên!")

    # Multi-Highlight Snippet Basket View
    if st.session_state.collected_snippets:
        with st.expander(f"📦 Khay Đoạn Đã Bôi Đen ({len(st.session_state.collected_snippets)} đoạn)", expanded=True):
            for snip in st.session_state.collected_snippets:
                st.markdown(f'<div class="snippet-pill">📌 {snip}</div>', unsafe_allow_html=True)
            
            sc1, sc2 = st.columns(2)
            with sc1:
                if st.button("❓ AI Tổng Hợp Câu Hỏi Từ Khay", use_container_width=True):
                    combined_terms = " & ".join(st.session_state.collected_snippets)
                    st.session_state.current_quiz = ai_generate_single_quiz(combined_terms)
                    add_toast("Đã tổng hợp câu hỏi từ các đoạn đã gom!")
            with sc2:
                if st.button("🗑️ Xóa Sạch Khay", use_container_width=True):
                    st.session_state.collected_snippets = []
                    add_toast("Đã dọn sạch khay gom đoạn!")
                    st.rerun()

# ------------------------------------------------------------------------------
# RIGHT COLUMN: AI ASSISTANT, QUIZ PRACTICE & ANSWERED HISTORY STORAGE
# ------------------------------------------------------------------------------
with col_ai:
    tab_explain, tab_quiz, tab_history, tab_bookmarks = st.tabs([
        "⚡ AI Giải Thích",
        "❓ Luyện Trắc Nghiệm",
        f"📊 Đã Trả Lời ({len(st.session_state.answered_quizzes)})",
        f"📝 Gửi GV ({len(st.session_state.instructor_bookmarks)})"
    ])
    
    # TAB 1: AI EXPLANATION
    with tab_explain:
        st.markdown("#### ⚡ AI Phân Tích & Giải Thích")
        if st.session_state.current_explanation:
            exp = st.session_state.current_explanation
            st.info(f"**Trọng tâm:** {exp.get('summary', '')}")
            
            st.markdown("**Điểm mấu chốt cần nhớ:**")
            for kp in exp.get("keypoints", []):
                st.markdown(f"- 💡 {kp}")
                
            st.success(f"**Dẫn chứng slide:** {exp.get('evidence', '')}")
        else:
            st.markdown("""
            *Chọn bất kỳ phần chữ nào trên slide bên trái và bấm **"⚡ AI Giải Thích"** để xem phân tích chuyên sâu.*
            """)
            
    # TAB 2: DYNAMIC 4-CHOICE QUIZ (1 QUESTION STRICTLY)
    with tab_quiz:
        st.markdown("#### ❓ Câu Hỏi Kiểm Tra Kiến Thức (1 Câu / Phần Bôi Đen)")
        
        quiz = st.session_state.current_quiz
        if quiz:
            st.markdown(f"**Câu hỏi:** {quiz.get('question', '')}")
            
            options = quiz.get("options", [])
            for opt in options:
                opt_id = opt["id"]
                opt_text = opt["text"]
                
                # Option Button
                if st.button(f"👉 **{opt_id}.** {opt_text}", key=f"btn_opt_{opt_id}", use_container_width=True):
                    is_correct = opt.get("isCorrect", False)
                    explanation = opt.get("explanation", quiz.get("overallExplanation", ""))
                    
                    # Store in Answered History
                    history_entry = {
                        "id": f"q_{int(time.time()*1000)}",
                        "question": quiz["question"],
                        "term": st.session_state.selected_snippet,
                        "chosen": f"{opt_id}. {opt_text}",
                        "isCorrect": is_correct,
                        "correctOpt": next((f"{o['id']}. {o['text']}" for o in options if o.get("isCorrect")), "N/A"),
                        "explanation": explanation,
                        "time": datetime.now().strftime("%H:%M")
                    }
                    st.session_state.answered_quizzes.insert(0, history_entry)
                    
                    if is_correct:
                        st.balloons()
                        st.success(f"🎉 **Chính xác! (Đáp án {opt_id})**\n\n*Giải thích:* {explanation}")
                    else:
                        st.error(f"❌ **Chưa chính xác.**\n\n*Giải thích:* {explanation}")
                        
                    add_toast("Đã lưu kết quả vào Tab 'Đã Trả Lời'!")
        else:
            st.markdown("""
            *Chọn nội dung trên slide và bấm **"❓ Tạo Câu Hỏi"** để sinh bài tập trắc nghiệm 4 lựa chọn.*
            """)
            
    # TAB 3: ANSWERED QUIZ HISTORY STORAGE & STATS
    with tab_history:
        st.markdown("#### 📊 Lịch Sử Câu Hỏi Đã Trả Lời")
        
        history = st.session_state.answered_quizzes
        total_ans = len(history)
        correct_ans = sum(1 for h in history if h.get("isCorrect"))
        incorrect_ans = total_ans - correct_ans
        acc_pct = int((correct_ans / total_ans) * 100) if total_ans > 0 else 0
        
        # Stats Bar
        st.markdown(f"""
        <div class="stats-grid">
            <div class="stat-box">
                <div class="num" style="color: #fff;">{total_ans}</div>
                <div class="lbl">Tổng câu</div>
            </div>
            <div class="stat-box">
                <div class="num" style="color: #34d399;">{correct_ans}</div>
                <div class="lbl">Đúng</div>
            </div>
            <div class="stat-box">
                <div class="num" style="color: #f87171;">{incorrect_ans}</div>
                <div class="lbl">Sai</div>
            </div>
            <div class="stat-box">
                <div class="num" style="color: #38bdf8;">{acc_pct}%</div>
                <div class="lbl">Tỷ lệ</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # History Filter
        filter_opt = st.radio("Lọc danh sách:", ["Tất cả", "Chỉ câu đúng", "Chỉ câu sai"], horizontal=True)
        
        filtered_history = history
        if filter_opt == "Chỉ câu đúng":
            filtered_history = [h for h in history if h.get("isCorrect")]
        elif filter_opt == "Chỉ câu sai":
            filtered_history = [h for h in history if not h.get("isCorrect")]
            
        if filtered_history:
            for item in filtered_history:
                card_class = "correct" if item.get("isCorrect") else "incorrect"
                status_badge = "✅ Đúng" if item.get("isCorrect") else "❌ Sai"
                
                st.markdown(f"""
                <div class="history-item-card {card_class}">
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8; margin-bottom:4px;">
                        <span><strong>{status_badge}</strong> • Về: <em>{item.get('term', '')}</em></span>
                        <span>{item.get('time', '')}</span>
                    </div>
                    <div style="font-size:13px; font-weight:700; color:#f8fafc; margin-bottom:6px;">{item.get('question', '')}</div>
                    <div style="font-size:12px; color: {'#34d399' if item.get('isCorrect') else '#f87171'};">
                        <strong>Bạn chọn:</strong> {item.get('chosen', '')}
                    </div>
                    {f"<div style='font-size:12px; color:#34d399;'><strong>Đáp án đúng:</strong> {item.get('correctOpt', '')}</div>" if not item.get('isCorrect') else ""}
                    <div style="font-size:11.5px; color:#94a3b8; margin-top:6px; border-left: 2px solid #38bdf8; padding-left:8px; font-style:italic;">
                        {item.get('explanation', '')}
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
            if st.button("🗑️ Xóa Toàn Bộ Lịch Sử", use_container_width=True):
                st.session_state.answered_quizzes = []
                add_toast("Đã xóa toàn bộ lịch sử câu hỏi!")
                st.rerun()
        else:
            st.info("Chưa có câu hỏi nào trong mục này.")
            
    # TAB 4: INSTRUCTOR BOOKMARKS & END OF SESSION
    with tab_bookmarks:
        st.markdown("#### 📝 Danh Sách Thắc Mắc Gửi Giảng Viên")
        
        bm_list = st.session_state.instructor_bookmarks
        if bm_list:
            for idx, bm in enumerate(bm_list):
                st.markdown(f"""
                <div style="background:#1e293b; border-radius:8px; padding:10px 12px; margin-bottom:8px; border-left:3px solid #facc15;">
                    <div style="font-size:11px; color:#94a3b8;">#{idx+1} • {bm.get('time')}</div>
                    <div style="font-size:12.5px; color:#fff; font-weight:600;">{bm.get('term')}</div>
                    <div style="font-size:12px; color:#cbd5e1; margin-top:4px;">{bm.get('note')}</div>
                </div>
                """, unsafe_allow_html=True)
                
            # Export Report
            report_text = f"=== BÁO CÁO CÂU HỎI THẮC MẮC CUỐI BUỔI HỌC ===\nThời gian: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n\n"
            for i, b in enumerate(bm_list, 1):
                report_text += f"{i}. [{b['term']}]\n   Nội dung: {b['note']}\n\n"
                
            st.download_button(
                label="📥 Tải Báo Cáo Thắc Mắc (.txt)",
                data=report_text,
                file_name="Cau-Hoi-Gui-Giang-Vien.txt",
                mime="text/plain",
                use_container_width=True
            )
            
            if st.button("🗑️ Xóa Danh Sách Đã Lưu", use_container_width=True):
                st.session_state.instructor_bookmarks = []
                add_toast("Đã dọn sạch danh sách gửi GV!")
                st.rerun()
        else:
            st.info("Chưa có câu hỏi nào được lưu để gửi giảng viên.")
