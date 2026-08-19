# -*- coding: utf-8 -*-
"""
Trợ Lý Học Tập AI Đọc Slide & Luyện Tập Trắc Nghiệm (Python Desktop GUI)
Giao diện Tkinter Dark Mode Cao Cấp - 100% Vector Text Không Vỡ Ảnh
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import time
import os
import threading
from datetime import datetime

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

SAMPLE_SLIDE_TEXT = """CHƯƠNG 1. MA TRẬN – ĐỊNH THỨC – HỆ PHƯƠNG TRÌNH

1. Ma trận
- Khái niệm ma trận, kích thước m×n
- Các phép toán: cộng, trừ (cùng kích thước), nhân ma trận (đúng thứ tự)
- Ma trận chuyển vị A^T

2. Định thức
- Định thức cấp 2, 3
- Tính bằng khai triển hoặc biến đổi sơ cấp
- Tính chất:
  + Đổi chỗ 2 dòng → đổi dấu định thức
  + Một dòng nhân k → định thức nhân k
  + Một dòng toàn 0 → định thức = 0

3. Hạng ma trận
- Rank = số dòng (hoặc cột) độc lập tuyến tính
- Cách tìm: biến đổi sơ cấp về dạng bậc thang
- Ứng dụng: xét nghiệm hệ, xét phụ thuộc tuyến tính

4. Hệ phương trình tuyến tính
- Hệ có nghiệm ⇔ rank(A) = rank(A|b)
- Hệ có nghiệm duy nhất ⇔ rank = số ẩn
- Vô nghiệm ⇔ rank(A) ≠ rank(A|b)
"""

class ModernLearningApp:
    def __init__(self, root):
        self.root = root
        self.root.title("🎓 Trợ Lý Học Tập AI - Đọc Slide & Luyện Trắc Nghiệm")
        self.root.geometry("1280, 800")
        self.root.minsize(1050, 680)
        self.root.configure(bg="#0b1120")

        # State Variables
        self.openai_key = os.environ.get("OPENAI_API_KEY", "")
        self.current_slide_text = SAMPLE_SLIDE_TEXT
        self.collected_snippets = []
        self.answered_quizzes = []
        self.instructor_bookmarks = []
        self.current_quiz = None
        self.toast_count = 0

        self.setup_styles()
        self.build_ui()
        self.load_sample_slide()

    def setup_styles(self):
        style = ttk.Style()
        style.theme_use("clam")
        
        # Configure Colors
        style.configure("TNotebook", background="#0f172a", borderwidth=0)
        style.configure("TNotebook.Tab", background="#1e293b", foreground="#94a3b8", padding=[14, 8], font=("Plus Jakarta Sans", 10, "bold"))
        style.map("TNotebook.Tab", background=[("selected", "#3b82f6")], foreground=[("selected", "#ffffff")])
        
        style.configure("TFrame", background="#0b1120")

    def build_ui(self):
        # 1. Header Banner
        header = tk.Frame(self.root, bg="#1e293b", height=60, padx=20, pady=10)
        header.pack(fill="x", side="top")
        
        lbl_title = tk.Label(header, text="🎓 TRỢ LÝ HỌC TẬP AI (PYTHON NATIVE)", font=("Plus Jakarta Sans", 14, "bold"), fg="#38bdf8", bg="#1e293b")
        lbl_title.pack(side="left")
        
        lbl_sub = tk.Label(header, text=" | Chương 1: Ma Trận - Định Thức - Hệ Phương Trình", font=("Plus Jakarta Sans", 10), fg="#94a3b8", bg="#1e293b")
        lbl_sub.pack(side="left", padx=10)

        btn_key = tk.Button(header, text="🔑 Cài OpenAI Key", font=("Plus Jakarta Sans", 9, "bold"), bg="#3b82f6", fg="#ffffff", activebackground="#2563eb", activeforeground="#ffffff", relief="flat", padx=12, pady=4, cursor="hand2", command=self.prompt_api_key)
        btn_key.pack(side="right", padx=6)

        btn_reset = tk.Button(header, text="🔄 Nạp Slide Mẫu", font=("Plus Jakarta Sans", 9, "bold"), bg="#334155", fg="#ffffff", activebackground="#475569", activeforeground="#ffffff", relief="flat", padx=12, pady=4, cursor="hand2", command=self.load_sample_slide)
        btn_reset.pack(side="right", padx=6)

        # 2. Main Paned Layout (Left: Slide Viewer | Right: AI Sidebar)
        main_pane = tk.PanedWindow(self.root, orient="horizontal", bg="#0b1120", sashwidth=6, bd=0)
        main_pane.pack(fill="both", expand=True, padx=16, pady=14)

        # ----------------- LEFT PANE: SLIDE VIEWER -----------------
        left_frame = tk.Frame(main_pane, bg="#0f172a", bd=1, relief="solid")
        main_pane.add(left_frame, minsize=520, width=680)

        slide_bar = tk.Frame(left_frame, bg="#1e293b", padx=14, pady=10)
        slide_bar.pack(fill="x")
        
        tk.Label(slide_bar, text="📄 KHUNG BÀI GIẢNG (BÔI ĐEN VĂN BẢN TRỰC TIẾP)", font=("Plus Jakarta Sans", 11, "bold"), fg="#f8fafc", bg="#1e293b").pack(side="left")
        
        # Document Text View
        text_frame = tk.Frame(left_frame, bg="#0f172a", padx=14, pady=12)
        text_frame.pack(fill="both", expand=True)

        self.slide_text_widget = tk.Text(
            text_frame, 
            wrap="word", 
            font=("Plus Jakarta Sans", 13), 
            bg="#0f172a", 
            fg="#f1f5f9", 
            selectbackground="#6366f1", 
            selectforeground="#ffffff",
            insertbackground="#ffffff",
            bd=0, 
            padx=16, 
            pady=16
        )
        self.slide_text_widget.pack(fill="both", expand=True, side="left")
        
        scroll_y = tk.Scrollbar(text_frame, command=self.slide_text_widget.yview)
        scroll_y.pack(side="right", fill="y")
        self.slide_text_widget.config(yscrollcommand=scroll_y.set)

        # Action Toolbar below slide
        action_bar = tk.Frame(left_frame, bg="#1e293b", padx=12, pady=10)
        action_bar.pack(fill="x")

        tk.Label(action_bar, text="Thao tác nhanh cho đoạn bôi đen:", font=("Plus Jakarta Sans", 9, "bold"), fg="#94a3b8", bg="#1e293b").pack(side="left", padx=4)

        btn_explain = tk.Button(action_bar, text="⚡ AI Giải Thích", font=("Plus Jakarta Sans", 9, "bold"), bg="#4f46e5", fg="#ffffff", relief="flat", padx=10, pady=5, cursor="hand2", command=self.handle_explain)
        btn_explain.pack(side="left", padx=4)

        btn_quiz = tk.Button(action_bar, text="❓ Tạo 1 Câu Hỏi", font=("Plus Jakarta Sans", 9, "bold"), bg="#0284c7", fg="#ffffff", relief="flat", padx=10, pady=5, cursor="hand2", command=self.handle_generate_quiz)
        btn_quiz.pack(side="left", padx=4)

        btn_collect = tk.Button(action_bar, text="➕ Gom Đoạn (+)", font=("Plus Jakarta Sans", 9, "bold"), bg="#9333ea", fg="#ffffff", relief="flat", padx=10, pady=5, cursor="hand2", command=self.handle_collect_snippet)
        btn_collect.pack(side="left", padx=4)

        btn_save_gv = tk.Button(action_bar, text="📝 Gửi GV", font=("Plus Jakarta Sans", 9, "bold"), bg="#d97706", fg="#ffffff", relief="flat", padx=10, pady=5, cursor="hand2", command=self.handle_bookmark_gv)
        btn_save_gv.pack(side="left", padx=4)

        # ----------------- RIGHT PANE: AI INTERACTION TABS -----------------
        right_frame = tk.Frame(main_pane, bg="#0f172a")
        main_pane.add(right_frame, minsize=420, width=540)

        self.notebook = ttk.Notebook(right_frame)
        self.notebook.pack(fill="both", expand=True)

        # Tab 1: AI Explanation
        self.tab_explain = tk.Frame(self.notebook, bg="#0f172a", padx=14, pady=14)
        self.notebook.add(self.tab_explain, text="⚡ AI Giải Thích")
        self.build_explain_tab()

        # Tab 2: Quiz Practice
        self.tab_quiz = tk.Frame(self.notebook, bg="#0f172a", padx=14, pady=14)
        self.notebook.add(self.tab_quiz, text="❓ Trắc Nghiệm")
        self.build_quiz_tab()

        # Tab 3: Answered History Storage
        self.tab_history = tk.Frame(self.notebook, bg="#0f172a", padx=14, pady=14)
        self.notebook.add(self.tab_history, text="📊 Đã Trả Lời (0)")
        self.build_history_tab()

        # Tab 4: Snippet Basket & Teacher Bookmarks
        self.tab_basket = tk.Frame(self.notebook, bg="#0f172a", padx=14, pady=14)
        self.notebook.add(self.tab_basket, text="📦 Khay Gom & Gửi GV")
        self.build_basket_tab()

    def build_explain_tab(self):
        self.explain_text = tk.Text(self.tab_explain, wrap="word", font=("Plus Jakarta Sans", 11), bg="#1e293b", fg="#f8fafc", bd=0, padx=14, pady=14)
        self.explain_text.pack(fill="both", expand=True)
        self.explain_text.insert("end", "👉 Hãy bôi đen một cụm từ trên slide (ví dụ: 'Định thức', 'Hạng ma trận', 'Ma trận chuyển vị') và bấm '⚡ AI Giải Thích'.")
        self.explain_text.config(state="disabled")

    def build_quiz_tab(self):
        self.quiz_question_lbl = tk.Label(self.tab_quiz, text="Chưa có câu hỏi nào. Hãy bôi đen nội dung và bấm '❓ Tạo 1 Câu Hỏi'.", font=("Plus Jakarta Sans", 11, "bold"), fg="#ffffff", bg="#0f172a", wraplength=480, justify="left")
        self.quiz_question_lbl.pack(fill="x", pady=(0, 14))

        self.opt_buttons = []
        for i in range(4):
            btn = tk.Button(self.tab_quiz, text="", font=("Plus Jakarta Sans", 10), bg="#1e293b", fg="#f8fafc", activebackground="#3b82f6", activeforeground="#ffffff", relief="flat", anchor="w", padx=14, pady=10, cursor="hand2", command=lambda idx=i: self.submit_quiz_answer(idx))
            btn.pack(fill="x", pady=4)
            self.opt_buttons.append(btn)

        self.quiz_feedback_lbl = tk.Label(self.tab_quiz, text="", font=("Plus Jakarta Sans", 10), fg="#34d399", bg="#0f172a", wraplength=480, justify="left", pady=10)
        self.quiz_feedback_lbl.pack(fill="x")

    def build_history_tab(self):
        # Stats Top Bar
        stats_frame = tk.Frame(self.tab_history, bg="#1e293b", padx=12, pady=10)
        stats_frame.pack(fill="x", pady=(0, 10))

        self.lbl_stats = tk.Label(stats_frame, text="Tổng: 0 | Đúng: 0 | Sai: 0 | Tỷ lệ: 0%", font=("Plus Jakarta Sans", 10, "bold"), fg="#38bdf8", bg="#1e293b")
        self.lbl_stats.pack(side="left")

        btn_clear_hist = tk.Button(stats_frame, text="🗑️ Xóa", font=("Plus Jakarta Sans", 8, "bold"), bg="#dc2626", fg="#fff", relief="flat", padx=8, pady=2, command=self.clear_history)
        btn_clear_hist.pack(side="right")

        # History list
        self.history_list_text = tk.Text(self.tab_history, wrap="word", font=("Plus Jakarta Sans", 10), bg="#1e293b", fg="#f8fafc", bd=0, padx=12, pady=12)
        self.history_list_text.pack(fill="both", expand=True)
        self.history_list_text.insert("end", "Chưa có câu hỏi nào đã trả lời.")
        self.history_list_text.config(state="disabled")

    def build_basket_tab(self):
        tk.Label(self.tab_basket, text="📦 CÁC ĐOẠN ĐÃ GOM VÀO KHAY:", font=("Plus Jakarta Sans", 10, "bold"), fg="#c084fc", bg="#0f172a").pack(anchor="w", pady=(0, 6))
        
        self.basket_text = tk.Text(self.tab_basket, height=7, wrap="word", font=("Plus Jakarta Sans", 10), bg="#1e293b", fg="#f8fafc", bd=0, padx=10, pady=10)
        self.basket_text.pack(fill="x", pady=(0, 10))
        self.basket_text.insert("end", "(Khay đang trống)")
        self.basket_text.config(state="disabled")

        btn_synth = tk.Button(self.tab_basket, text="❓ AI Tổng Hợp Câu Hỏi Từ Khay", font=("Plus Jakarta Sans", 9, "bold"), bg="#9333ea", fg="#fff", relief="flat", padx=10, pady=6, cursor="hand2", command=self.handle_synthesize_quiz)
        btn_synth.pack(fill="x", pady=4)

        tk.Label(self.tab_basket, text="📝 CÂU HỎI LƯU GỬI GIẢNG VIÊN:", font=("Plus Jakarta Sans", 10, "bold"), fg="#facc15", bg="#0f172a").pack(anchor="w", pady=(12, 6))

        self.gv_text = tk.Text(self.tab_basket, height=7, wrap="word", font=("Plus Jakarta Sans", 10), bg="#1e293b", fg="#f8fafc", bd=0, padx=10, pady=10)
        self.gv_text.pack(fill="x", pady=(0, 10))
        self.gv_text.insert("end", "(Chưa có câu hỏi nào được lưu)")
        self.gv_text.config(state="disabled")

        btn_export_gv = tk.Button(self.tab_basket, text="📥 Xuất File Báo Cáo Gửi GV (.txt)", font=("Plus Jakarta Sans", 9, "bold"), bg="#d97706", fg="#fff", relief="flat", padx=10, pady=6, cursor="hand2", command=self.export_gv_report)
        btn_export_gv.pack(fill="x", pady=4)

    def load_sample_slide(self):
        self.current_slide_text = SAMPLE_SLIDE_TEXT
        self.slide_text_widget.config(state="normal")
        self.slide_text_widget.delete("1.0", "end")
        self.slide_text_widget.insert("1.0", self.current_slide_text)
        
        # Apply Tags for Visual Distinction
        self.slide_text_widget.tag_configure("header", font=("Plus Jakarta Sans", 15, "bold"), foreground="#ffffff")
        self.slide_text_widget.tag_configure("sec1", font=("Plus Jakarta Sans", 13, "bold"), foreground="#818cf8")
        self.slide_text_widget.tag_configure("sec2", font=("Plus Jakarta Sans", 13, "bold"), foreground="#38bdf8")
        self.slide_text_widget.tag_configure("sec3", font=("Plus Jakarta Sans", 13, "bold"), foreground="#c084fc")
        self.slide_text_widget.tag_configure("sec4", font=("Plus Jakarta Sans", 13, "bold"), foreground="#34d399")

        self.slide_text_widget.tag_add("header", "1.0", "2.0")
        self.slide_text_widget.tag_add("sec1", "3.0", "4.0")
        self.slide_text_widget.tag_add("sec2", "9.0", "10.0")
        self.slide_text_widget.tag_add("sec3", "18.0", "19.0")
        self.slide_text_widget.tag_add("sec4", "24.0", "25.0")
        
        self.slide_text_widget.config(state="disabled")
        self.show_toast("Đã nạp Slide Mẫu: Chương 1. Ma Trận!")

    def get_selected_text(self):
        try:
            return self.slide_text_widget.get("sel.first", "sel.last").strip()
        except tk.TclError:
            return "Ma trận chuyển vị A^T"

    def handle_explain(self):
        term = self.get_selected_text()
        self.notebook.select(0)
        
        self.explain_text.config(state="normal")
        self.explain_text.delete("1.0", "end")
        self.explain_text.insert("end", f"Đang phân tích kiến thức: '{term}'...\n\n")

        # Built-in instant explanation
        t_low = term.lower()
        if "định thức cấp 2" in t_low or "định thức cấp 3" in t_low or ("định thức" in t_low and ("2" in t_low or "3" in t_low or "cấp" in t_low)):
            resp = "📌 ĐỊNH THỨC CẤP 2 VÀ CẤP 3:\n- Cấp 2: det(A) = ad - bc (tích chéo chính trừ chéo phụ). Hình học: diện tích hình bình hành trong 2D.\n- Cấp 3: Tính bằng Quy tắc Sarrus hoặc khai triển Laplace: det(A) = a₁₁A₁₁ + a₁₂A₁₂ + a₁₃A₁₃. Hình học: thể tích khối hộp trong 3D.\n- det(A) ≠ 0 là điều kiện cần và đủ để ma trận khả nghịch (tồn tại A⁻¹)."
        elif "đổi chỗ 2 dòng" in t_low or "đổi dấu định thức" in t_low or ("đổi chỗ" in t_low and "dòng" in t_low):
            resp = "📌 TÍNH CHẤT: ĐỔI CHỖ 2 DÒNG → ĐỔI DẤU ĐỊNH THỨC:\n- Hoán vị vị trí 2 dòng (d_i ↔ d_j) hoặc 2 cột: det(B) = -det(A).\n- Nếu thực hiện k lần hoán vị: det mới nhân (-1)^k.\n- Hệ quả: Nếu ma trận có 2 dòng/cột giống nhau hoặc tỉ lệ nhau thì det(A) = 0."
        elif "nhân k" in t_low or "một dòng nhân" in t_low:
            resp = "📌 TÍNH CHẤT: MỘT DÒNG NHÂN k → ĐỊNH THỨC NHÂN k:\n- Nhân một dòng với hằng số k: det(B) = k · det(A).\n- Chú ý: Nhân toàn bộ ma trận vuông cấp n với k: det(kA) = k^n · det(A)."
        elif "toàn 0" in t_low:
            resp = "📌 TÍNH CHẤT: DÒNG TOÀN 0 → ĐỊNH THỨC = 0:\n- Nếu ma trận có ít nhất một dòng (hoặc cột) toàn số 0 thì det(A) = 0.\n- Khai triển Laplace theo dòng toàn 0 cho kết quả bằng 0. Ma trận bị suy biến."
        elif "hạng" in t_low or "rank" in t_low:
            resp = "📌 HẠNG CỦA MA TRẬN (RANK):\n- Rank là số dòng (hoặc cột) độc lập tuyến tính tối đa của ma trận.\n- Cách tìm: Dùng các phép biến đổi sơ cấp khử Gauss đưa về dạng bậc thang, rank = số dòng khác 0.\n- Giới hạn: 0 ≤ rank(A) ≤ min(m, n) và rank(A) = rank(A^T)."
        elif "nghiệm duy nhất" in t_low or "rank = số ẩn" in t_low:
            resp = "📌 HỆ CÓ NGHIỆM DUY NHẤT ⇔ RANK = SỐ ẨN:\n- Hệ Ax = b có nghiệm duy nhất khi và chỉ khi rank(A) = rank(A|b) = n (số ẩn).\n- Không có ẩn tự do nào (n - rank = 0). Với hệ vuông (m = n), tương đương det(A) ≠ 0."
        elif "vô nghiệm" in t_low or "rank(a) ≠ rank(a|b)" in t_low:
            resp = "📌 HỆ VÔ NGHIỆM ⇔ RANK(A) ≠ RANK(A|b):\n- Hệ vô nghiệm khi rank(A) < rank(A|b).\n- Biểu hiện Gauss: Xuất hiện dòng vô lý [0 0 ... 0 | c] với c ≠ 0 trong ma trận mở rộng (tức 0 = c)."
        elif "hệ" in t_low or "nghiệm" in t_low:
            resp = "📌 HỆ PHƯƠNG TRÌNH TUYẾN TÍNH (ĐỊNH LÝ KRONECKER-CAPELLI):\n- Có nghiệm ⇔ rank(A) = rank(A|b).\n- Nghiệm duy nhất: rank(A) = rank(A|b) = n (số ẩn).\n- Vô số nghiệm: rank(A) = rank(A|b) = r < n (có n - r ẩn tự do).\n- Vô nghiệm: rank(A) < rank(A|b)."
        elif "chuyển vị" in t_low or "a^t" in t_low:
            resp = "📌 MA TRẬN CHUYỂN VỊ A^T:\n- Đổi dòng thứ i thành cột thứ i (a^T_ij = a_ji).\n- Tính chất: (A^T)^T = A, (A + B)^T = A^T + B^T, (A·B)^T = B^T · A^T.\n- Ma trận đối xứng khi A^T = A, phản đối xứng khi A^T = -A."
        else:
            resp = f"📌 PHÂN TÍCH CHUYÊN SÂU '{term}':\n- Là khái niệm trọng tâm trong Chương 1: Ma trận – Định thức – Hệ phương trình.\n- Ứng dụng trong biến đổi Gauss, xác định số chiều không gian vector và giải hệ phương trình."

        self.explain_text.delete("1.0", "end")
        self.explain_text.insert("end", resp)
        self.explain_text.config(state="disabled")
        self.show_toast(f"Đã giải thích '{term[:20]}...'")

    def handle_generate_quiz(self):
        term = self.get_selected_text()
        self.notebook.select(1)
        
        t_low = term.lower()
        if "định thức" in t_low:
            self.current_quiz = {
                "question": "Khi đổi chỗ 2 dòng bất kỳ của ma trận vuông A, định thức của ma trận sẽ thay đổi như thế nào?",
                "term": term,
                "options": [
                    {"id": "A", "text": "Không đổi giá trị", "correct": False},
                    {"id": "B", "text": "Đổi dấu định thức", "correct": True},
                    {"id": "C", "text": "Nhân lên gấp đôi", "correct": False},
                    {"id": "D", "text": "Bằng 0", "correct": False}
                ],
                "explanation": "Theo tính chất định thức: Đổi chỗ 2 dòng → đổi dấu định thức."
            }
        elif "hạng" in t_low or "rank" in t_low:
            self.current_quiz = {
                "question": "Hạng của ma trận (Rank) được định nghĩa là gì?",
                "term": term,
                "options": [
                    {"id": "A", "text": "Tổng các phần tử đường chéo chính", "correct": False},
                    {"id": "B", "text": "Số dòng (hoặc cột) độc lập tuyến tính", "correct": True},
                    {"id": "C", "text": "Số phần tử khác 0", "correct": False},
                    {"id": "D", "text": "Kích thước m × n", "correct": False}
                ],
                "explanation": "Rank = số dòng (hoặc cột) độc lập tuyến tính tối đa."
            }
        elif "hệ" in t_low or "nghiệm" in t_low:
            self.current_quiz = {
                "question": "Điều kiện cần và đủ để hệ phương trình Ax = b có nghiệm DUY NHẤT là gì?",
                "term": term,
                "options": [
                    {"id": "A", "text": "rank(A) ≠ rank(A|b)", "correct": False},
                    {"id": "B", "text": "rank(A) = rank(A|b) = số ẩn", "correct": True},
                    {"id": "C", "text": "rank(A) < rank(A|b)", "correct": False},
                    {"id": "D", "text": "rank(A) = 0", "correct": False}
                ],
                "explanation": "Theo slide: Hệ có nghiệm duy nhất ⇔ rank = số ẩn."
            }
        else:
            self.current_quiz = {
                "question": f"Về ma trận chuyển vị A^T, phát biểu nào sau đây là ĐÚNG?",
                "term": term,
                "options": [
                    {"id": "A", "text": "Dòng của A trở thành cột của A^T", "correct": True},
                    {"id": "B", "text": "Đổi dấu tất cả phần tử", "correct": False},
                    {"id": "C", "text": "Nghịch đảo giá trị các phần tử", "correct": False},
                    {"id": "D", "text": "Chỉ áp dụng cho ma trận vuông", "correct": False}
                ],
                "explanation": "Ma trận chuyển vị biến dòng thứ i thành cột thứ i."
            }

        # Update UI
        self.quiz_question_lbl.config(text=f"❓ Câu hỏi: {self.current_quiz['question']}")
        for idx, opt in enumerate(self.current_quiz["options"]):
            self.opt_buttons[idx].config(text=f"{opt['id']}. {opt['text']}", bg="#1e293b", state="normal")
            
        self.quiz_feedback_lbl.config(text="")
        self.show_toast("Đã tạo 1 câu hỏi trắc nghiệm!")

    def submit_quiz_answer(self, opt_idx):
        if not self.current_quiz:
            return
            
        chosen_opt = self.current_quiz["options"][opt_idx]
        is_correct = chosen_opt["correct"]
        
        # Save to Answered History
        entry = {
            "question": self.current_quiz["question"],
            "term": self.current_quiz["term"],
            "chosen": f"{chosen_opt['id']}. {chosen_opt['text']}",
            "isCorrect": is_correct,
            "explanation": self.current_quiz["explanation"],
            "time": datetime.now().strftime("%H:%M")
        }
        self.answered_quizzes.insert(0, entry)
        self.update_history_ui()

        # Update button colors
        for idx, btn in enumerate(self.opt_buttons):
            if self.current_quiz["options"][idx]["correct"]:
                btn.config(bg="#059669")
            elif idx == opt_idx:
                btn.config(bg="#dc2626")
            btn.config(state="disabled")

        if is_correct:
            self.quiz_feedback_lbl.config(text=f"🎉 CHÍNH XÁC!\n{self.current_quiz['explanation']}", fg="#34d399")
        else:
            self.quiz_feedback_lbl.config(text=f"❌ CHƯA ĐÚNG.\n{self.current_quiz['explanation']}", fg="#f87171")
            
        self.show_toast("Đã lưu kết quả vào Lịch Sử!")

    def update_history_ui(self):
        total = len(self.answered_quizzes)
        correct = sum(1 for q in self.answered_quizzes if q["isCorrect"])
        incorrect = total - correct
        pct = int((correct / total) * 100) if total > 0 else 0

        self.notebook.tab(2, text=f"📊 Đã Trả Lời ({total})")
        self.lbl_stats.config(text=f"Tổng: {total} | Đúng: {correct} | Sai: {incorrect} | Tỷ lệ: {pct}%")

        self.history_list_text.config(state="normal")
        self.history_list_text.delete("1.0", "end")
        
        for q in self.answered_quizzes:
            status = "✅ ĐÚNG" if q["isCorrect"] else "❌ SAI"
            self.history_list_text.insert("end", f"[{status}] • {q['time']} (Về: {q['term']})\n")
            self.history_list_text.insert("end", f"Hỏi: {q['question']}\n")
            self.history_list_text.insert("end", f"Bạn chọn: {q['chosen']}\n")
            self.history_list_text.insert("end", f"Giải thích: {q['explanation']}\n\n" + "-"*40 + "\n\n")
            
        self.history_list_text.config(state="disabled")

    def clear_history(self):
        self.answered_quizzes = []
        self.update_history_ui()
        self.show_toast("Đã dọn sạch lịch sử!")

    def handle_collect_snippet(self):
        term = self.get_selected_text()
        if term not in self.collected_snippets:
            self.collected_snippets.append(term)
            self.update_basket_ui()
            self.show_toast(f"Đã gom đoạn ({len(self.collected_snippets)} đoạn)!")
        else:
            self.show_toast("Đoạn này đã có trong khay!")

    def update_basket_ui(self):
        self.basket_text.config(state="normal")
        self.basket_text.delete("1.0", "end")
        for i, s in enumerate(self.collected_snippets, 1):
            self.basket_text.insert("end", f"{i}. 📌 {s}\n")
        self.basket_text.config(state="disabled")

    def handle_synthesize_quiz(self):
        if not self.collected_snippets:
            messagebox.showinfo("Khay Trống", "Vui lòng bôi đen và bấm '➕ Gom Đoạn' trước!")
            return
        self.handle_generate_quiz()

    def handle_bookmark_gv(self):
        term = self.get_selected_text()
        self.instructor_bookmarks.append({
            "term": term,
            "time": datetime.now().strftime("%H:%M")
        })
        self.gv_text.config(state="normal")
        self.gv_text.delete("1.0", "end")
        for i, b in enumerate(self.instructor_bookmarks, 1):
            self.gv_text.insert("end", f"{i}. [{b['time']}] Cần giải thích thêm về: '{b['term']}'\n")
        self.gv_text.config(state="disabled")
        self.show_toast("Đã lưu thắc mắc gửi GV!")

    def export_gv_report(self):
        if not self.instructor_bookmarks:
            messagebox.showinfo("Thông báo", "Chưa có câu hỏi nào được lưu để xuất báo cáo.")
            return
        file_path = filedialog.asksaveasfilename(defaultextension=".txt", initialfile="Thac-Mac-Giang-Vien.txt")
        if file_path:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write("=== BÁO CÁO CÂU HỎI THẮC MẮC CUỐI BUỔI HỌC ===\n")
                f.write(f"Thời gian: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n\n")
                for i, b in enumerate(self.instructor_bookmarks, 1):
                    f.write(f"{i}. [{b['time']}] {b['term']}\n")
            messagebox.showinfo("Thành công", f"Đã lưu báo cáo tại:\n{file_path}")

    def prompt_api_key(self):
        win = tk.Toplevel(self.root)
        win.title("🔑 Cài Đặt OpenAI API Key")
        win.geometry("400, 180")
        win.configure(bg="#1e293b")
        win.transient(self.root)
        
        tk.Label(win, text="Nhập OpenAI API Key (sk-...):", font=("Plus Jakarta Sans", 10, "bold"), fg="#fff", bg="#1e293b").pack(pady=(16, 6))
        
        entry = tk.Entry(win, font=("Plus Jakarta Sans", 10), show="*", width=36)
        entry.pack(pady=6)
        entry.insert(0, self.openai_key)

        def save():
            self.openai_key = entry.get().strip()
            win.destroy()
            self.show_toast("Đã lưu OpenAI API Key!")

        tk.Button(win, text="Lưu Cài Đặt", font=("Plus Jakarta Sans", 9, "bold"), bg="#3b82f6", fg="#fff", padx=12, pady=4, command=save).pack(pady=12)

    def show_toast(self, msg):
        # Limit to max 3 toasts
        self.toast_count = min(3, self.toast_count + 1)
        toast = tk.Toplevel(self.root)
        toast.overrideredirect(True)
        toast.attributes("-topmost", True)
        
        # Position toast in bottom right
        x = self.root.winfo_x() + self.root.winfo_width() - 320
        y = self.root.winfo_y() + self.root.winfo_height() - (70 * self.toast_count)
        toast.geometry(f"300x48+{x}+{y}")
        
        lbl = tk.Label(toast, text=f"✨ {msg}", font=("Plus Jakarta Sans", 9, "bold"), bg="#1e293b", fg="#38bdf8", bd=1, relief="solid", padx=10, pady=8)
        lbl.pack(fill="both", expand=True)

        def remove_toast():
            try:
                toast.destroy()
            except:
                pass
            self.toast_count = max(0, self.toast_count - 1)

        self.root.after(2600, remove_toast)

if __name__ == "__main__":
    root = tk.Tk()
    app = ModernLearningApp(root)
    root.mainloop()
