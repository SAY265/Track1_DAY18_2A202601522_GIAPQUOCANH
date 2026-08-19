// Main Application Controller for PDF/PPT E-Learning & OpenAI Assistant

// Setup PDF.js worker
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const SAMPLE_SLIDES = [
  {
    page: 1,
    title: "CHƯƠNG 1. MA TRẬN – ĐỊNH THỨC – HỆ PHƯƠNG TRÌNH",
    sections: [
      {
        heading: "1. Ma trận",
        items: [
          "- Khái niệm ma trận, kích thước m×n",
          "- Các phép toán: cộng, trừ (cùng kích thước), nhân ma trận (đúng thứ tự)",
          "- Ma trận chuyển vị A^T"
        ]
      },
      {
        heading: "2. Định thức",
        items: [
          "- Định thức cấp 2, 3",
          "- Tính bằng khai triển hoặc biến đổi sơ cấp",
          "- Tính chất:",
          "+ Đổi chỗ 2 dòng → đổi dấu định thức",
          "+ Một dòng nhân k → định thức nhân k",
          "+ Một dòng toàn 0 → định thức = 0"
        ]
      },
      {
        heading: "3. Hạng ma trận",
        items: [
          "- Rank = số dòng (hoặc cột) độc lập tuyến tính",
          "- Cách tìm: biến đổi sơ cấp về dạng bậc thang",
          "- Ứng dụng: xét nghiệm hệ, xét phụ thuộc tuyến tính"
        ]
      },
      {
        heading: "4. Hệ phương trình tuyến tính",
        items: [
          "- Hệ có nghiệm ⇔ rank(A) = rank(A|b)",
          "- Hệ có nghiệm duy nhất ⇔ rank = số ẩn",
          "- Vô nghiệm ⇔ rank(A) ≠ rank(A|b)"
        ]
      }
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    pdfDoc: null,
    currentPage: 1,
    totalPages: 1,
    currentScale: 1.0,
    isSamplePDF: true,
    fileType: 'pdf', // 'pdf' | 'pptx' | 'image'
    pdfFileName: "Chuong-1-Ma-Tran-Dinh-Thuc.pdf",
    currentSlidesData: SAMPLE_SLIDES,
    currentSlideFullText: "",
    selectedText: "",
    selectedContext: "",
    selectionMode: "single", // "single" (1 lần) | "multi" (nhiều lần - tự động gom)
    collectedSnippets: [],
    quizHistory: JSON.parse(localStorage.getItem('saved_quiz_history') || '[]'),
    quizHistoryFilter: 'all', // 'all' | 'correct' | 'incorrect'
    bookmarks: [],
    questionHistoryCounter: 0,
    openAIKey: localStorage.getItem('user_openai_api_key') || '',
    openAIModel: localStorage.getItem('user_openai_model') || 'gpt-4o-mini',
    isOcrRunning: false
  };

  // DOM Elements
  const slideNativeCard = document.getElementById('slideNativeCard');
  const pdfCanvas = document.getElementById('pdfCanvas');
  const pdfTextLayer = document.getElementById('pdfTextLayer');
  const pdfContainer = document.getElementById('pdfContainer');
  const pdfTitleDisplay = document.getElementById('pdfTitleDisplay');
  const pdfFileBadge = document.getElementById('pdfFileBadge');
  const aiStatusBadge = document.getElementById('aiStatusBadge');
  const aiStatusText = document.getElementById('aiStatusText');
  const pageListContainer = document.getElementById('pageListContainer');
  const totalPagesBadge = document.getElementById('totalPagesBadge');
  const pageNumberInput = document.getElementById('pageNumberInput');
  const pageTotalDisplay = document.getElementById('pageTotalDisplay');
  const btnPrevPage = document.getElementById('btnPrevPage');
  const btnNextPage = document.getElementById('btnNextPage');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnFitWidth = document.getElementById('btnFitWidth');
  const zoomDisplay = document.getElementById('zoomDisplay');
  const pdfFileInput = document.getElementById('pdfFileInput');
  const btnSamplePDF = document.getElementById('btnSamplePDF');
  const btnSamplePPT = document.getElementById('btnSamplePPT');
  const btnSampleImage = document.getElementById('btnSampleImage');
  const slideContextText = document.getElementById('slideContextText');

  // Selection Mode Toggle Elements (1 Lần vs Nhiều Lần)
  const btnModeSingle = document.getElementById('btnModeSingle');
  const btnModeMulti = document.getElementById('btnModeMulti');
  const modeStatusBadge = document.getElementById('modeStatusBadge');
  const btnToggleQuickMode = document.getElementById('btnToggleQuickMode');
  const btnToggleQuickModeText = document.getElementById('btnToggleQuickModeText');

  // OCR & Vision AI Toolbar Buttons
  const btnRunOCR = document.getElementById('btnRunOCR');
  const btnVisionAI = document.getElementById('btnVisionAI');

  // Floating Action Toolbar
  const floatingToolbar = document.getElementById('floatingToolbar');
  const btnTriggerCollect = document.getElementById('btnTriggerCollect');
  const btnTriggerFeature1 = document.getElementById('btnTriggerFeature1');
  const btnTriggerFeature2 = document.getElementById('btnTriggerFeature2');
  const btnTriggerFeature3 = document.getElementById('btnTriggerFeature3');

  // Right Sidebar Tab Elements & Multi-Highlight Synthesizer
  const tabBtnAssistant = document.getElementById('tabBtnAssistant');
  const tabBtnSnippets = document.getElementById('tabBtnSnippets');
  const tabBtnHistory = document.getElementById('tabBtnHistory');
  const tabContentAssistant = document.getElementById('tabContentAssistant');
  const tabContentSnippets = document.getElementById('tabContentSnippets');
  const tabContentHistory = document.getElementById('tabContentHistory');
  const snippetCountBadge = document.getElementById('snippetCountBadge');
  const snippetCountText = document.getElementById('snippetCountText');
  const historyCountBadge = document.getElementById('historyCountBadge');
  const btnClearSnippets = document.getElementById('btnClearSnippets');
  const collectedSnippetsList = document.getElementById('collectedSnippetsList');
  const synthesizerActionsBox = document.getElementById('synthesizerActionsBox');
  const btnSynthesizeQuiz = document.getElementById('btnSynthesizeQuiz');
  const btnSynthesizeInstructor = document.getElementById('btnSynthesizeInstructor');
  const btnSynthesizeExplain = document.getElementById('btnSynthesizeExplain');

  // Tab 3: Answered Quiz Storage Elements
  const statTotalAnswered = document.getElementById('statTotalAnswered');
  const statCorrectCount = document.getElementById('statCorrectCount');
  const statIncorrectCount = document.getElementById('statIncorrectCount');
  const statAccuracyPercent = document.getElementById('statAccuracyPercent');
  const btnFilterAll = document.getElementById('btnFilterAll');
  const btnFilterCorrect = document.getElementById('btnFilterCorrect');
  const btnFilterIncorrect = document.getElementById('btnFilterIncorrect');
  const btnClearHistory = document.getElementById('btnClearHistory');
  const quizHistoryList = document.getElementById('quizHistoryList');

  // Feature 1: AI Explanation Popover Elements
  const popoverFeature1 = document.getElementById('popoverFeature1');
  const feat1SelectedTerm = document.getElementById('feat1SelectedTerm');
  const feat1Loading = document.getElementById('feat1Loading');
  const feat1ContentArea = document.getElementById('feat1ContentArea');
  const feat1SummaryText = document.getElementById('feat1SummaryText');
  const feat1KeypointsList = document.getElementById('feat1KeypointsList');
  const feat1EvidenceText = document.getElementById('feat1EvidenceText');
  const btnCloseFeature1 = document.getElementById('btnCloseFeature1');
  const btnCloseFeature1Footer = document.getElementById('btnCloseFeature1Footer');
  const btnFeat1ToInstructor = document.getElementById('btnFeat1ToInstructor');

  // Feature 2: Quiz Modal Elements
  const popoverFeature2 = document.getElementById('popoverFeature2');
  const feat2SelectedTerm = document.getElementById('feat2SelectedTerm');
  const feat2Loading = document.getElementById('feat2Loading');
  const feat2ContentArea = document.getElementById('feat2ContentArea');
  const feat2QuestionText = document.getElementById('feat2QuestionText');
  const feat2OptionsList = document.getElementById('feat2OptionsList');
  const feat2FeedbackCard = document.getElementById('feat2FeedbackCard');
  const feat2FeedbackTitle = document.getElementById('feat2FeedbackTitle');
  const feat2FeedbackDetail = document.getElementById('feat2FeedbackDetail');
  const btnFeat2GenerateNew = document.getElementById('btnFeat2GenerateNew');
  const btnCloseFeature2 = document.getElementById('btnCloseFeature2');
  const btnCloseFeature2Footer = document.getElementById('btnCloseFeature2Footer');
  const btnFeat2ToInstructor = document.getElementById('btnFeat2ToInstructor');

  // OpenAI API Key Modal Elements
  const btnOpenApiKeyModal = document.getElementById('btnOpenApiKeyModal');
  const apiKeyModal = document.getElementById('apiKeyModal');
  const btnCloseApiKeyModal = document.getElementById('btnCloseApiKeyModal');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const modelSelect = document.getElementById('modelSelect');
  const btnToggleKeyVisibility = document.getElementById('btnToggleKeyVisibility');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');
  const btnRemoveKey = document.getElementById('btnRemoveKey');

  // Feature 3: Toast & End of Session Modal Elements
  const toastContainer = document.getElementById('toastContainer');
  const bookmarkCountBadge = document.getElementById('bookmarkCountBadge');
  const btnOpenBookmarks = document.getElementById('btnOpenBookmarks');
  const btnEndSession = document.getElementById('btnEndSession');
  const endSessionModal = document.getElementById('endSessionModal');
  const btnCloseSessionModal = document.getElementById('btnCloseSessionModal');
  const btnCloseSessionModalFooter = document.getElementById('btnCloseSessionModalFooter');
  const bookmarksReviewList = document.getElementById('bookmarksReviewList');
  const submitCountBadge = document.getElementById('submitCountBadge');
  const btnConfirmSendToInstructor = document.getElementById('btnConfirmSendToInstructor');

  // Empty State & Toolbar Elements
  const viewerToolbar = document.getElementById('viewerToolbar');
  const emptyStateCard = document.getElementById('emptyStateCard');
  const pdfCard = document.getElementById('pdfCard');
  const pdfFileInputEmpty = document.getElementById('pdfFileInputEmpty');
  const btnSamplePDFEmpty = document.getElementById('btnSamplePDFEmpty');
  const btnSamplePPTEmpty = document.getElementById('btnSamplePPTEmpty');
  const btnSampleImageEmpty = document.getElementById('btnSampleImageEmpty');
  const pdfScrollViewport = document.getElementById('pdfScrollViewport');

  // ----------------------------------------------------
  // Initial Setup
  // ----------------------------------------------------
  function init() {
    updateAIStatusBadge();
    loadDefaultSampleSlide();
    updateBookmarkBadge();
    setupApiKeyListeners();
    setupEmptyStateListeners();
    setupToolActionListeners();
    setupSelectionModeListeners();
    setupSnippetBasketListeners();
    setupQuizHistoryListeners();
    renderCollectedSnippets();
    renderQuizHistory();
    setupDragAndDrop();
    refreshIcons();
  }

  function showEmptyState() {
    state.pdfDoc = null;
    state.currentPage = 0;
    state.totalPages = 0;
    state.currentSlideFullText = "";
    state.currentSlidesData = null;
    
    pdfTitleDisplay.textContent = "Chưa có tài liệu";
    pdfFileBadge.textContent = "Chưa nạp file";
    pdfFileBadge.className = "file-tag";
    totalPagesBadge.textContent = "0 Trang";
    
    pageListContainer.innerHTML = `
      <div class="empty-sidebar-placeholder">
        <i data-lucide="image" style="width: 32px; height: 32px; opacity: 0.35; margin-bottom: 8px; display: inline-block;"></i>
        <p>Chưa có file PDF, PPTX hoặc Ảnh nào được nạp.</p>
      </div>
    `;

    slideContextText.textContent = "Chưa có tài liệu. Vui lòng tải file PDF, PPTX hoặc Ảnh bài giảng để AI trích xuất nội dung.";
    viewerToolbar.style.display = 'none';
    pdfCard.style.display = 'none';
    if (slideNativeCard) slideNativeCard.style.display = 'none';
    emptyStateCard.style.display = 'flex';
  }

  function setupEmptyStateListeners() {
    // Empty state upload
    pdfFileInputEmpty.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        handleFileUploadBatch(files);
      }
      e.target.value = '';
    });

    // Empty state sample slide button
    if (btnSamplePDFEmpty) {
      btnSamplePDFEmpty.addEventListener('click', () => {
        loadDefaultSampleSlide();
      });
    }
  }

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ----------------------------------------------------
  // OpenAI API Service
  // ----------------------------------------------------
  function updateAIStatusBadge() {
    if (state.openAIKey && state.openAIKey.startsWith('sk-')) {
      aiStatusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      aiStatusBadge.style.color = '#6ee7b7';
      aiStatusBadge.style.borderColor = 'rgba(16, 185, 129, 0.35)';
      aiStatusText.textContent = `OpenAI: ${state.openAIModel}`;
    } else {
      aiStatusBadge.style.background = 'rgba(250, 204, 21, 0.12)';
      aiStatusBadge.style.color = '#fde047';
      aiStatusBadge.style.borderColor = 'rgba(250, 204, 21, 0.3)';
      aiStatusText.textContent = `AI Nội Bộ (Nhập Key để dùng OpenAI)`;
    }
  }

  async function callOpenAI({ systemPrompt, userPrompt, jsonMode = false }) {
    if (!state.openAIKey) {
      return null;
    }

    const payload = {
      model: state.openAIModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    };

    if (jsonMode) {
      payload.response_format = { type: "json_object" };
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${state.openAIKey.trim()}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn("OpenAI API Error:", errorData);
        alert(`OpenAI API Lỗi (${response.status}): ${errorData.error?.message || "Vui lòng kiểm tra lại API Key!"}`);
        return null;
      }

      const data = await response.json();
      return data.choices[0]?.message?.content;
    } catch (err) {
      console.warn("Lỗi kết nối OpenAI:", err);
      alert("Không thể kết nối đến OpenAI API. Đang sử dụng bộ giải đáp thông minh nội bộ.");
      return null;
    }
  }

  // ----------------------------------------------------
  // OpenAI API Key Modal Controls
  // ----------------------------------------------------
  function setupApiKeyListeners() {
    btnOpenApiKeyModal.addEventListener('click', () => {
      apiKeyInput.value = state.openAIKey;
      modelSelect.value = state.openAIModel;
      apiKeyModal.style.display = 'flex';
      refreshIcons();
    });

    btnCloseApiKeyModal.addEventListener('click', () => {
      apiKeyModal.style.display = 'none';
    });

    btnToggleKeyVisibility.addEventListener('click', () => {
      const isPassword = apiKeyInput.type === 'password';
      apiKeyInput.type = isPassword ? 'text' : 'password';
      btnToggleKeyVisibility.innerHTML = isPassword 
        ? '<i data-lucide="eye-off" style="width: 16px; height: 16px;"></i>' 
        : '<i data-lucide="eye" style="width: 16px; height: 16px;"></i>';
      refreshIcons();
    });

    btnSaveApiKey.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      const model = modelSelect.value;
      state.openAIKey = key;
      state.openAIModel = model;
      localStorage.setItem('user_openai_api_key', key);
      localStorage.setItem('user_openai_model', model);
      updateAIStatusBadge();
      apiKeyModal.style.display = 'none';
      alert('Đã lưu cấu hình OpenAI thành công! Giờ đây các tính năng AI sẽ sử dụng mô hình ' + model + '.');
    });

    btnRemoveKey.addEventListener('click', () => {
      state.openAIKey = '';
      localStorage.removeItem('user_openai_api_key');
      apiKeyInput.value = '';
      updateAIStatusBadge();
      apiKeyModal.style.display = 'none';
      alert('Đã xóa API Key. Ứng dụng sẽ hoạt động ở chế độ mô phỏng thông minh nội bộ.');
    });
  }

  // ----------------------------------------------------
  // Diagram & Visual Canvas Painter (Transformer, CNN, RLHF)
  // ----------------------------------------------------
  function drawSlideDiagram(ctx, type, x, y, width, height) {
    // Diagram Card Background
    drawRoundRect(ctx, x, y, width, height, 16, "#131d31", "rgba(56, 189, 248, 0.25)", 1.5);

    if (type === "transformer") {
      // Header Label
      ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("SƠ ĐỒ KIẾN TRÚC TRANSFORMER (ATTENTION)", x + 24, y + 45);

      // Block 1: Output Probabilities (Top)
      drawRoundRect(ctx, x + 80, y + 70, width - 160, 50, 10, "#0284c7");
      ctx.font = "bold 17px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText("Output Probabilities (Softmax & Linear)", x + width / 2, y + 101);

      // Arrow Down
      drawArrow(ctx, x + width / 2, y + 120, x + width / 2, y + 145, "#38bdf8");

      // Block 2: Feed Forward Network (FFN)
      drawRoundRect(ctx, x + 80, y + 150, width - 160, 60, 10, "#4f46e5");
      ctx.fillText("Feed Forward Network (Add & LayerNorm)", x + width / 2, y + 186);

      // Arrow Down
      drawArrow(ctx, x + width / 2, y + 210, x + width / 2, y + 235, "#38bdf8");

      // Block 3: Multi-Head Attention
      drawRoundRect(ctx, x + 50, y + 240, width - 100, 140, 12, "rgba(99, 102, 241, 0.25)", "#6366f1", 1.5);
      ctx.fillStyle = "#818cf8";
      ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("Multi-Head Attention (Self-Attention Layer)", x + width / 2, y + 272);

      // Q, K, V Pills inside Attention
      const qkWidth = (width - 160) / 3;
      ["Queries (Q)", "Keys (K)", "Values (V)"].forEach((label, i) => {
        drawRoundRect(ctx, x + 70 + i * (qkWidth + 10), y + 295, qkWidth, 65, 8, "#1e293b", "rgba(56, 189, 248, 0.4)", 1);
        ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(label, x + 70 + i * (qkWidth + 10) + qkWidth / 2, y + 333);
      });

      // Arrow Down
      drawArrow(ctx, x + width / 2, y + 380, x + width / 2, y + 415, "#38bdf8");

      // Block 4: Positional Encoding & Input Embeddings (Bottom)
      drawRoundRect(ctx, x + 60, y + 420, width - 120, 75, 10, "#10b981");
      ctx.font = "bold 17px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Input Embeddings + Positional Encoding (PE)", x + width / 2, y + 455);
      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#d1fae5";
      ctx.fillText("Bảo toàn thứ tự từ ngữ và ngữ nghĩa vector không gian", x + width / 2, y + 478);
      ctx.textAlign = "left";

    } else if (type === "cnn") {
      ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("SƠ ĐỒ TẦNG TÍCH CHẬP CONVOLUTIONAL NEURAL NETWORK", x + 24, y + 45);

      const steps = [
        { title: "1. Input Image Matrix", desc: "Ảnh RGB 3 chiều (Height × Width × 3)", color: "#0284c7" },
        { title: "2. Convolution & Kernel Filter", desc: "Phép nhân tích chập ma trận 3×3 & Stride", color: "#4f46e5" },
        { title: "3. ReLU Non-Linear Activation", desc: "Hàm kích hoạt loại bỏ giá trị âm f(x) = max(0, x)", color: "#9333ea" },
        { title: "4. Max Pooling (2×2)", desc: "Giảm 50% kích thước không gian & giữ đặc trưng mạnh", color: "#f59e0b" },
        { title: "5. Fully Connected & Softmax", desc: "Dự đoán xác suất nhãn đối tượng (Output Classification)", color: "#10b981" }
      ];

      let stepY = y + 70;
      steps.forEach((step, idx) => {
        drawRoundRect(ctx, x + 50, stepY, width - 100, 68, 10, step.color);
        ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(step.title, x + 75, stepY + 28);
        ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fillText(step.desc, x + 75, stepY + 52);

        if (idx < steps.length - 1) {
          drawArrow(ctx, x + width / 2, stepY + 68, x + width / 2, stepY + 84, "#38bdf8");
        }
        stepY += 84;
      });
    } else if (type === "rlhf") {
      ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("QUY TRÌNH ALIGNMENT RLHF CHO LARGE LANGUAGE MODEL", x + 24, y + 45);

      const rlhfSteps = [
        { num: "BƯỚC 1", title: "Supervised Fine-Tuning (SFT)", desc: "Huấn luyện Base Model trên tập Prompt & Response chuẩn", color: "#4f46e5" },
        { num: "BƯỚC 2", title: "Reward Model Training (RM)", desc: "Con người xếp hạng câu trả lời -> Huấn luyện mô hình chấm điểm", color: "#0284c7" },
        { num: "BƯỚC 3", title: "PPO Policy Optimization", desc: "Tối ưu hóa LLM sinh câu trả lời đạt điểm Reward cao nhất kèm KL-penalty", color: "#10b981" }
      ];

      let stepY = y + 80;
      rlhfSteps.forEach((s, idx) => {
        drawRoundRect(ctx, x + 45, stepY, width - 90, 115, 12, "#1e293b", "rgba(255, 255, 255, 0.1)", 1);
        drawRoundRect(ctx, x + 45, stepY, 10, 115, 5, s.color);

        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillStyle = s.color;
        ctx.fillText(s.num, x + 75, stepY + 28);

        ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(s.title, x + 75, stepY + 58);

        ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#94a3b8";
        wrapText(ctx, s.desc, x + 75, stepY + 85, width - 150, 20);

        if (idx < rlhfSteps.length - 1) {
          drawArrow(ctx, x + width / 2, stepY + 115, x + width / 2, stepY + 140, "#38bdf8");
        }
        stepY += 140;
      });
    }
  }

  function drawArrow(ctx, fromX, fromY, toX, toY, color) {
    const headLength = 8;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  // ----------------------------------------------------
  // Ultra-Crisp Canvas Slide Generator (Support Text, Diagram, Image)
  // ----------------------------------------------------
  function drawRoundRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle = null, lineWidth = 1) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text || "").split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY;
  }

  function renderSlideToImage(slide, totalSlides = 5, fileType = 'pdf') {
    const canvas = document.createElement('canvas');
    canvas.width = 1680;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Deep modern dark luxury background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 1680, 1080);

    // If slide is a full-bleed user uploaded image
    if (slide.isFullImage && slide.imageElement) {
      const img = slide.imageElement;
      const hRatio = 1600 / img.width;
      const vRatio = 980 / img.height;
      const ratio = Math.min(hRatio, vRatio, 1);
      const drawW = img.width * ratio;
      const drawH = img.height * ratio;
      const drawX = (1680 - drawW) / 2;
      const drawY = (1080 - drawH) / 2;

      // Draw backdrop card
      drawRoundRect(ctx, drawX - 10, drawY - 10, drawW + 20, drawH + 20, 16, "#1e293b", "rgba(56, 189, 248, 0.3)", 2);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Top title badge
      ctx.font = "bold 22px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`Hình ảnh Slide #${slide.page}: ${slide.title}`, 80, 40);

      return canvas.toDataURL('image/png', 0.95);
    }

    // Subtle background mesh glow
    const radialGrad = ctx.createRadialGradient(840, 200, 50, 840, 540, 900);
    if (fileType === 'pptx') {
      radialGrad.addColorStop(0, "rgba(249, 115, 22, 0.12)");
      radialGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
    } else if (fileType === 'image') {
      radialGrad.addColorStop(0, "rgba(56, 189, 248, 0.15)");
      radialGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
    } else {
      radialGrad.addColorStop(0, "rgba(99, 102, 241, 0.12)");
      radialGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
    }
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, 1680, 1080);

    // Top Glowing Accent Line
    const accentGrad = ctx.createLinearGradient(80, 0, 1600, 0);
    accentGrad.addColorStop(0, "#4f46e5");
    accentGrad.addColorStop(0.5, "#6366f1");
    accentGrad.addColorStop(1, "#38bdf8");
    ctx.fillStyle = accentGrad;
    ctx.fillRect(80, 38, 1520, 6);

    // Slide Header / Chapter Title
    ctx.font = "bold 32px 'Plus Jakarta Sans', -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(slide.title || "CHƯƠNG 1. MA TRẬN – ĐỊNH THỨC – HỆ PHƯƠNG TRÌNH", 80, 92);

    // Render 4 Sections (2 Columns x 2 Rows Grid)
    if (slide.sections && slide.sections.length >= 4) {
      const colW = 735;
      const colGap = 50;
      const leftX = 80;
      const rightX = leftX + colW + colGap;

      // Section 1: 1. Ma trận (Left Top)
      const sec1 = slide.sections[0];
      drawSectionCard(ctx, leftX, 130, colW, 410, sec1, "#818cf8", "#6366f1");

      // Section 2: 2. Định thức (Left Bottom)
      const sec2 = slide.sections[1];
      drawSectionCard(ctx, leftX, 565, colW, 475, sec2, "#38bdf8", "#0284c7");

      // Section 3: 3. Hạng ma trận (Right Top)
      const sec3 = slide.sections[2];
      drawSectionCard(ctx, rightX, 130, colW, 410, sec3, "#c084fc", "#9333ea");

      // Section 4: 4. Hệ phương trình tuyến tính (Right Bottom)
      const sec4 = slide.sections[3];
      drawSectionCard(ctx, rightX, 565, colW, 475, sec4, "#34d399", "#059669");
    } else if (slide.points) {
      // Fallback for standard list of bullet points
      let currentY = 150;
      const points = slide.points;
      const cardHeight = Math.floor(830 / points.length) - 15;
      points.forEach(pt => {
        drawRoundRect(ctx, 80, currentY, 1520, cardHeight, 12, "#1e293b", "rgba(255, 255, 255, 0.08)", 1);
        drawRoundRect(ctx, 80, currentY, 8, cardHeight, 4, "#6366f1");
        ctx.font = "500 22px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#f8fafc";
        wrapText(ctx, pt, 110, currentY + 35, 1450, 32);
        currentY += cardHeight + 15;
      });
    }

    // Footer Info
    ctx.font = "18px 'Plus Jakarta Sans', -apple-system, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Đại số Tuyến tính &bull; Chương 1: Ma trận, Định thức & Hệ phương trình", 80, 1062);
    ctx.fillText(`Slide Trang ${slide.page} / ${totalSlides}`, 1440, 1062);

    return canvas.toDataURL('image/png', 0.95);
  }

  function drawSectionCard(ctx, x, y, width, height, section, titleColor, accentColor) {
    // Card background
    drawRoundRect(ctx, x, y, width, height, 14, "#1e293b", "rgba(255, 255, 255, 0.08)", 1);

    // Left accent pill
    drawRoundRect(ctx, x, y, 6, height, 3, accentColor);

    // Section Heading
    ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = titleColor;
    ctx.fillText(section.heading, x + 28, y + 42);

    // Section Items
    let lineY = y + 84;
    section.items.forEach(item => {
      const isSubBullet = item.trim().startsWith('+');
      const itemX = isSubBullet ? x + 55 : x + 28;
      ctx.font = isSubBullet ? "500 20px 'Plus Jakarta Sans', sans-serif" : "500 21px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = isSubBullet ? "#94a3b8" : "#f1f5f9";
      lineY = wrapText(ctx, item.trim(), itemX, lineY, width - 56, 32);
      lineY += isSubBullet ? 8 : 12;
    });
  }

  function createSamplePDFData() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: [840, 540]
    });

    SAMPLE_SLIDES.forEach((slide, idx) => {
      if (idx > 0) doc.addPage([840, 540], 'p');
      const imgData = renderSlideToImage(slide, SAMPLE_SLIDES.length, 'pdf');
      doc.addImage(imgData, 'PNG', 0, 0, 840, 540, undefined, 'FAST');
    });

    return doc.output('arraybuffer');
  }

  function loadDefaultSampleSlide() {
    state.isSamplePDF = true;
    state.currentSlidesData = SAMPLE_SLIDES;
    state.fileType = 'pdf';
    state.currentPage = 1;
    state.totalPages = 1;
    state.pdfFileName = "Chuong-1-Ma-Tran-Dinh-Thuc.pdf";

    // Set UI Header & Badges
    pdfTitleDisplay.textContent = "Chương 1. Ma Trận – Định Thức – Hệ Phương Trình";
    pdfFileBadge.textContent = "Slide Mẫu (Ma Trận)";
    pdfFileBadge.className = "file-tag tag-pdf";
    totalPagesBadge.textContent = "1 Trang";
    pageNumberInput.value = 1;
    pageTotalDisplay.textContent = "/ 1";

    state.currentSlideFullText = `CHƯƠNG 1. MA TRẬN – ĐỊNH THỨC – HỆ PHƯƠNG TRÌNH

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
- Vô nghiệm ⇔ rank(A) ≠ rank(A|b)`;

    slideContextText.textContent = state.currentSlideFullText;

    // Show Native Vector Slide Card (Zero image artifacts, 100% sharp text)
    emptyStateCard.style.display = 'none';
    pdfCard.style.display = 'none';
    if (slideNativeCard) slideNativeCard.style.display = 'flex';
    viewerToolbar.style.display = 'flex';

    renderPageThumbnails();
    refreshIcons();
    showToastNotification("Đã nạp Slide Mẫu", "Chương 1: Ma Trận - Định Thức - Hệ Phương Trình");
  }

  // ----------------------------------------------------
  // PowerPoint (.pptx) Parsing Engine
  // ----------------------------------------------------
  function extractSlideTextFromXml(xmlStr, slideIndex, fileName) {
    let slideTitle = "";
    let slideSubtitle = "";
    const paragraphs = [];

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, "application/xml");

      if (xmlDoc && !xmlDoc.querySelector("parsererror")) {
        const allElements = Array.from(xmlDoc.getElementsByTagName("*"));
        const shapes = allElements.filter(el => el.localName === 'sp');

        shapes.forEach(shape => {
          const children = Array.from(shape.getElementsByTagName("*"));
          const phEl = children.find(el => el.localName === 'ph');
          const phType = phEl ? (phEl.getAttribute("type") || "") : "";

          const pEls = children.filter(el => el.localName === 'p');
          const shapeLines = [];
          pEls.forEach(p => {
            const tEls = Array.from(p.getElementsByTagName("*")).filter(el => el.localName === 't');
            const pText = tEls.map(t => t.textContent).join("").trim();
            if (pText) shapeLines.push(pText);
          });

          if (shapeLines.length > 0) {
            if (phType === "title" || phType === "ctrTitle") {
              slideTitle = shapeLines.join(" ");
            } else if (phType === "subTitle" && !slideSubtitle) {
              slideSubtitle = shapeLines.join(" ");
            } else {
              paragraphs.push(...shapeLines);
            }
          }
        });

        // Also check table cells
        const tcEls = allElements.filter(el => el.localName === 'tc');
        tcEls.forEach(tc => {
          const tEls = Array.from(tc.getElementsByTagName("*")).filter(el => el.localName === 't');
          const text = tEls.map(t => t.textContent).join("").trim();
          if (text) paragraphs.push(text);
        });
      }
    } catch (err) {
      console.warn("DOM parsing error, falling back to regex:", err);
    }

    // Fallback: If no paragraphs extracted with DOM, use universal regex
    if (!slideTitle && paragraphs.length === 0) {
      const tMatches = [];
      const regex = /<(?:\w+:)?t[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/gi;
      let match;
      while ((match = regex.exec(xmlStr)) !== null) {
        const val = match[1].replace(/<[^>]+>/g, '').trim();
        if (val) tMatches.push(val);
      }

      if (tMatches.length > 0) {
        slideTitle = tMatches[0];
        if (tMatches.length > 1 && tMatches[1].length < 80) {
          slideSubtitle = tMatches[1];
          paragraphs.push(...tMatches.slice(2));
        } else {
          paragraphs.push(...tMatches.slice(1));
        }
      }
    }

    if (!slideTitle && paragraphs.length > 0) {
      slideTitle = paragraphs.shift();
    }
    if (!slideSubtitle && paragraphs.length > 1 && paragraphs[0].length < 80) {
      slideSubtitle = paragraphs.shift();
    }

    return {
      page: slideIndex + 1,
      title: slideTitle || `${fileName.replace(/\.[^/.]+$/, '')} - Slide ${slideIndex + 1}`,
      subtitle: slideSubtitle || `Nội dung Slide ${slideIndex + 1}`,
      points: paragraphs.length > 0 ? paragraphs : ["(Slide chứa hình ảnh, sơ đồ hoặc bảng dữ liệu)"]
    };
  }

  async function parsePPTXFile(arrayBuffer, fileName) {
    if (!window.JSZip) {
      throw new Error("Thư viện giải nén JSZip chưa sẵn sàng.");
    }

    const zip = await JSZip.loadAsync(arrayBuffer);
    let slideFiles = [];

    // Attempt 1: Read relationship mapping from presentation.xml.rels
    try {
      const relsXmlStr = await zip.file("ppt/_rels/presentation.xml.rels")?.async("text");
      if (relsXmlStr) {
        const parser = new DOMParser();
        const relsDoc = parser.parseFromString(relsXmlStr, "application/xml");
        const rels = Array.from(relsDoc.getElementsByTagName("*")).filter(el => el.localName === 'Relationship');

        const slideRels = rels
          .filter(r => (r.getAttribute("Type") || "").includes("slide") && !(r.getAttribute("Type") || "").includes("slideLayout") && !(r.getAttribute("Type") || "").includes("slideMaster"))
          .map(r => {
            let target = r.getAttribute("Target") || "";
            if (!target.startsWith("ppt/")) {
              target = target.startsWith("/") ? target.slice(1) : "ppt/" + target.replace(/^..\//, "");
            }
            return { id: r.getAttribute("Id"), target };
          });

        const presXmlStr = await zip.file("ppt/presentation.xml")?.async("text");
        if (presXmlStr) {
          const presDoc = parser.parseFromString(presXmlStr, "application/xml");
          const sldIds = Array.from(presDoc.getElementsByTagName("*")).filter(el => el.localName === 'sldId');
          sldIds.forEach(sld => {
            const rId = sld.getAttribute("r:id") || sld.getAttribute("id");
            const matchRel = slideRels.find(rel => rel.id === rId);
            if (matchRel && zip.file(matchRel.target)) {
              slideFiles.push(matchRel.target);
            }
          });
        }
      }
    } catch (err) {
      console.warn("Could not parse presentation rels, using numerical fallback:", err);
    }

    // Fallback: list all ppt/slides/slide*.xml files sorted numerically
    if (slideFiles.length === 0) {
      const slideEntries = Object.keys(zip.files).filter(path => /^ppt\/slides\/slide\d+\.xml$/i.test(path));
      slideEntries.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
        return numA - numB;
      });
      slideFiles = slideEntries;
    }

    if (slideFiles.length === 0) {
      throw new Error("Không tìm thấy trang slide nào trong file PowerPoint.");
    }

    const parsedSlides = [];
    for (let i = 0; i < slideFiles.length; i++) {
      const slidePath = slideFiles[i];
      const slideXmlStr = await zip.file(slidePath).async("text");
      const slideData = extractSlideTextFromXml(slideXmlStr, i, fileName);
      parsedSlides.push(slideData);
    }

    return parsedSlides;
  }

  // Fallback Binary PPT Text Extractor (for legacy .ppt files)
  function parseLegacyPPT(arrayBuffer, fileName) {
    const uint8 = new Uint8Array(arrayBuffer);
    let text = "";
    try {
      const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
      text = utf8Decoder.decode(uint8);
    } catch (e) {
      text = String.fromCharCode.apply(null, uint8);
    }

    const lines = text.split(/[\r\n\x00-\x08\x0B\x0C\x0E-\x1F]+/)
      .map(l => l.trim())
      .filter(l => l.length >= 6 && /[\p{L}\p{N}]/u.test(l) && !/^[\x20-\x2F\x3A-\x40]+$/.test(l));

    if (lines.length === 0) return null;

    const slides = [];
    const chunkSize = 4;
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize);
      slides.push({
        page: Math.floor(i / chunkSize) + 1,
        title: chunk[0] || `${fileName} - Slide ${Math.floor(i / chunkSize) + 1}`,
        subtitle: chunk[1] || "",
        points: chunk.slice(2).length > 0 ? chunk.slice(2) : [chunk[0]]
      });
    }
    return slides.length > 0 ? slides : null;
  }

  // Load Parsed Slide Objects as jsPDF Document
  async function loadSlidesDataAsPDF(slides, fileName, title, fileType = 'pptx') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: [840, 540]
    });

    slides.forEach((slide, idx) => {
      if (idx > 0) doc.addPage([840, 540], 'p');
      const imgData = renderSlideToImage(slide, slides.length, fileType);
      doc.addImage(imgData, 'PNG', 0, 0, 840, 540, undefined, 'FAST');
    });

    const pdfBytes = doc.output('arraybuffer');
    state.isSamplePDF = true;
    state.currentSlidesData = slides;
    state.fileType = fileType;
    await loadPDFDocument(pdfBytes, fileName, title);
  }

  // ----------------------------------------------------
  // Image & Batch File Upload Engine (PDF, PPTX, PPT, PNG, JPG, WEBP)
  // ----------------------------------------------------
  async function handleFileUploadBatch(files) {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const imageFiles = fileList.filter(f => /\.(png|jpe?g|webp|bmp|gif)$/i.test(f.name) || f.type.startsWith('image/'));

    if (imageFiles.length > 0 && imageFiles.length === fileList.length) {
      // User uploaded one or multiple images
      showToastNotification("Đang xử lý Ảnh bài giảng...", `Đang nạp ${imageFiles.length} hình ảnh slide...`);
      try {
        const slidePromises = imageFiles.map((file, idx) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
              const img = new Image();
              img.onload = () => {
                resolve({
                  page: idx + 1,
                  title: file.name.replace(/\.[^/.]+$/, ''),
                  subtitle: `Hình ảnh bài giảng (${(file.size / 1024).toFixed(0)} KB)`,
                  isFullImage: true,
                  imageElement: img,
                  points: ["(Ảnh bài giảng - Bấm 'Quét chữ (OCR)' hoặc 'AI Đọc Sơ Đồ' để phân tích)"]
                });
              };
              img.onerror = () => reject(new Error(`Không thể nạp ảnh: ${file.name}`));
              img.src = e.target.result;
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
        });

        const slides = await Promise.all(slidePromises);
        state.isSamplePDF = false;
        state.currentSlidesData = slides;
        state.fileType = 'image';

        const mainTitle = imageFiles.length === 1 
          ? imageFiles[0].name.replace(/\.[^/.]+$/, '') 
          : `Tập ảnh bài giảng (${imageFiles.length} ảnh)`;

        await loadSlidesDataAsPDF(slides, imageFiles[0].name, mainTitle, 'image');
        showToastNotification("Nạp Ảnh Thành Công!", `Đã mở ${slides.length} ảnh bài giảng. Đang tự động quét chữ (OCR)...`);

        // Automatically trigger OCR on page 1
        setTimeout(() => {
          runOcrOnCurrentSlide(true);
        }, 600);
      } catch (err) {
        console.error("Lỗi nạp ảnh:", err);
        alert("Lỗi khi mở hình ảnh: " + err.message);
      }
      return;
    }

    // Otherwise handle first file as document
    handleFileUpload(fileList[0]);
  }

  async function handleFileUpload(file) {
    if (!file) return;
    const fileName = file.name;
    const lowerName = fileName.toLowerCase();

    console.log("Bắt đầu xử lý file tải lên:", fileName, file.type, file.size);

    if (/\.(png|jpe?g|webp|bmp|gif)$/i.test(lowerName) || file.type.startsWith('image/')) {
      handleFileUploadBatch([file]);
      return;
    }

    if (lowerName.endsWith('.pptx')) {
      showToastNotification("Đang xử lý Slide PowerPoint...", `Đang đọc và phân tích các slide trong file ${fileName}`);
      const reader = new FileReader();
      reader.onload = async function() {
        try {
          const slides = await parsePPTXFile(this.result, fileName);
          console.log("Đã trích xuất thành công các slide PPTX:", slides);
          await loadSlidesDataAsPDF(slides, fileName, fileName.replace(/\.pptx$/i, ''), 'pptx');
          showToastNotification("Nạp PowerPoint Thành Công!", `Đã mở thành công ${slides.length} slide bài giảng. AI đã sẵn sàng!`);
        } catch (err) {
          console.error("Lỗi đọc PPTX:", err);
          alert(`Không thể đọc file PowerPoint (${fileName}): ${err.message || "Định dạng không hợp lệ."}`);
        }
      };
      reader.onerror = function() {
        alert("Lỗi đọc file: " + reader.error);
      };
      reader.readAsArrayBuffer(file);
    } else if (lowerName.endsWith('.ppt')) {
      showToastNotification("Đang xử lý file PPT...", `Đang trích xuất nội dung từ ${fileName}`);
      const reader = new FileReader();
      reader.onload = async function() {
        try {
          let slides = null;
          try {
            slides = await parsePPTXFile(this.result, fileName);
          } catch (e) {
            slides = parseLegacyPPT(this.result, fileName);
          }

          if (slides && slides.length > 0) {
            await loadSlidesDataAsPDF(slides, fileName, fileName.replace(/\.ppt$/i, ''), 'pptx');
            showToastNotification("Nạp PPT Thành Công!", `Đã trích xuất ${slides.length} trang slide bài giảng.`);
          } else {
            alert("File PPT phiên bản cũ này không thể phân tích trực tiếp. Vui lòng mở bằng PowerPoint và chọn 'Lưu thành .pptx' hoặc '.pdf' để có trải nghiệm tốt nhất!");
          }
        } catch (err) {
          alert("Lỗi khi mở file PPT: " + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (lowerName.endsWith('.pdf') || file.type === 'application/pdf') {
      showToastNotification("Đang mở file PDF...", `Đang nạp file tài liệu ${fileName}`);
      state.isSamplePDF = false;
      state.currentSlidesData = null;
      state.fileType = 'pdf';
      const reader = new FileReader();
      reader.onload = async function() {
        try {
          const typedArray = new Uint8Array(this.result);
          await loadPDFDocument(typedArray, fileName, fileName.replace(/\.pdf$/i, ''));
          showToastNotification("Nạp PDF Thành Công!", `Đã nạp file tài liệu ${fileName}.`);
        } catch (err) {
          console.error("Lỗi nạp PDF:", err);
          alert("Không thể hiển thị file PDF này: " + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Định dạng file không hỗ trợ. Vui lòng chọn file Slide PDF (.pdf), PowerPoint (.pptx / .ppt) hoặc Hình ảnh (.png, .jpg, .webp)!");
    }
  }

  // ----------------------------------------------------
  // Optical Character Recognition (OCR) Engine via Tesseract.js (Auto-integrated)
  // ----------------------------------------------------
  function updateOcrStatusPill(status, customText = "") {
    const ocrStatusPill = document.getElementById('ocrStatusPill');
    const ocrStatusPillText = document.getElementById('ocrStatusPillText');
    if (!ocrStatusPill || !ocrStatusPillText) return;

    if (status === 'scanning') {
      ocrStatusPill.className = 'ocr-status-pill scanning';
      ocrStatusPill.innerHTML = `<i data-lucide="loader" class="spin" style="width: 12px; height: 12px; animation: spin 1s linear infinite;"></i> <span>Đang quét OCR...</span>`;
    } else if (status === 'ready') {
      ocrStatusPill.className = 'ocr-status-pill ready';
      ocrStatusPill.innerHTML = `<i data-lucide="check-circle" style="width: 12px; height: 12px; color: #10b981;"></i> <span>${customText || "OCR: Sẵn sàng"}</span>`;
    } else {
      ocrStatusPill.className = 'ocr-status-pill';
      ocrStatusPill.innerHTML = `<i data-lucide="sparkles" style="width: 12px; height: 12px;"></i> <span>${customText || "OCR Tự động: Sẵn sàng"}</span>`;
    }
    refreshIcons();
  }

  async function runOcrOnCurrentSlide(isSilent = false) {
    if (state.isOcrRunning) return;
    if (!window.Tesseract) {
      if (!isSilent) alert("Thư viện nhận diện chữ Tesseract OCR đang được nạp, vui lòng thử lại sau 2 giây.");
      return;
    }

    const currentDoc = state.pdfFileName || "slide";
    const currentPageNum = state.currentPage || 1;
    const cacheKey = `${currentDoc}_p${currentPageNum}`;

    state.isOcrRunning = true;
    updateOcrStatusPill('scanning');

    // Add subtle scanning laser beam overlay if manually requested or image slide
    let overlay = null;
    if (!isSilent || state.fileType === 'image') {
      overlay = document.createElement('div');
      overlay.className = 'ocr-scanning-overlay';
      overlay.id = 'ocrScanningOverlay';
      overlay.innerHTML = '<div class="ocr-scan-line"></div>';
      pdfContainer.appendChild(overlay);
    }

    if (!isSilent) {
      showToastNotification("Đang Quét Chữ OCR...", "AI đang phân tích và bóc tách toàn bộ chữ từ hình ảnh slide...");
    }

    try {
      const result = await Tesseract.recognize(pdfCanvas, 'vie+eng', {
        logger: m => {
          if (m.status === 'recognizing text' && Math.round(m.progress * 100) % 30 === 0) {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      const extractedText = (result.data.text || "").trim();
      const words = result.data.words || [];

      // Save to cache
      if (!state.pageOcrCache) state.pageOcrCache = {};
      state.pageOcrCache[cacheKey] = {
        text: extractedText,
        words: words,
        wordsCount: words.length
      };

      if (extractedText && words.length > 0) {
        // If current slide has little text, enrich with OCR text
        if (!state.currentSlideFullText || state.currentSlideFullText.length < 50 || state.fileType === 'image') {
          state.currentSlideFullText = extractedText;
          slideContextText.textContent = extractedText;
        }

        // Render selectable bounding box spans
        renderOcrBoundingBoxes(words);

        updateOcrStatusPill('ready', `⚡ OCR: ${words.length} từ khóa`);
        if (!isSilent) {
          showToastNotification("Quét Chữ Thành Công!", `Đã trích xuất ${words.length} từ ngữ từ ảnh. Bạn có thể bôi đen bất kỳ từ nào để AI giải thích!`);
        }
      } else {
        updateOcrStatusPill('idle', `OCR: 0 từ`);
        if (!isSilent) {
          showToastNotification("Kết quả Quét", "Không phát hiện thấy văn bản rõ ràng. Bạn có thể dùng nút 'AI Đọc Sơ Đồ' để phân tích hình ảnh!");
        }
      }
    } catch (ocrErr) {
      console.warn("Lỗi OCR:", ocrErr);
      updateOcrStatusPill('idle', "OCR Tự động: Sẵn sàng");
      if (!isSilent) {
        alert("Lỗi khi thực hiện OCR quét chữ: " + ocrErr.message);
      }
    } finally {
      state.isOcrRunning = false;
      const activeOverlay = document.getElementById('ocrScanningOverlay');
      if (activeOverlay) activeOverlay.remove();
    }
  }

  function renderOcrBoundingBoxes(words) {
    if (!words || words.length === 0) return;
    const canvasW = pdfCanvas.width;
    const canvasH = pdfCanvas.height;

    // Check if text layer already has items
    const existingSpans = pdfTextLayer.querySelectorAll('span');
    if (existingSpans.length > 0 && state.fileType !== 'image') {
      return; // Keep existing structured text layer
    }

    pdfTextLayer.innerHTML = '';
    words.forEach(w => {
      if (!w.text || !w.text.trim()) return;
      const span = document.createElement('span');
      span.textContent = w.text + " ";
      span.style.position = 'absolute';
      span.style.left = `${(w.bbox.x0 / canvasW) * 100}%`;
      span.style.top = `${(w.bbox.y0 / canvasH) * 100}%`;
      span.style.width = `${((w.bbox.x1 - w.bbox.x0) / canvasW) * 100}%`;
      span.style.height = `${((w.bbox.y1 - w.bbox.y0) / canvasH) * 100}%`;
      span.style.fontSize = `${Math.max(12, (w.bbox.y1 - w.bbox.y0) * 0.9)}px`;
      span.style.color = 'transparent';
      span.style.cursor = 'text';
      span.style.userSelect = 'text';
      pdfTextLayer.appendChild(span);
    });
  }

  // ----------------------------------------------------
  // OpenAI Vision & Diagram Deep Analysis Engine
  // ----------------------------------------------------
  async function analyzeSlideWithVisionAI() {
    if (!state.pdfDoc && !state.currentSlidesData) {
      alert("Vui lòng mở slide hoặc hình ảnh bài giảng trước khi phân tích.");
      return;
    }

    hideAllPopups();
    popoverFeature1.style.display = 'block';
    feat1SelectedTerm.textContent = `Toàn bộ Sơ đồ / Hình ảnh Slide Trang ${state.currentPage}`;
    feat1Loading.style.display = 'flex';
    feat1ContentArea.style.display = 'none';

    // Position in center of viewport
    const viewportRect = pdfScrollViewport.getBoundingClientRect();
    popoverFeature1.style.left = `${viewportRect.left + (viewportRect.width - 480) / 2}px`;
    popoverFeature1.style.top = `${viewportRect.top + 80}px`;

    const canvasBase64 = pdfCanvas.toDataURL('image/jpeg', 0.85);
    const currentText = state.currentSlideFullText || "Sơ đồ kiến trúc / Biểu đồ bài giảng";

    try {
      if (state.openAIKey) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${state.openAIKey}`
          },
          body: JSON.stringify({
            model: state.openAIModel.includes("gpt-4") ? state.openAIModel : "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "Bạn là giảng viên đại học xuất sắc. Hãy phân tích chuyên sâu hình ảnh slide bài giảng, giải thích chi tiết các sơ đồ, biểu đồ, công thức toán và quy trình được minh họa. Trả về JSON chuẩn với cấu trúc: {\"summary\": \"...\", \"keypoints\": [\"...\", \"...\", \"...\"], \"evidence\": \"...\"}"
              },
              {
                role: "user",
                content: [
                  { type: "text", text: `Hãy phân tích chi tiết sơ đồ / hình ảnh của slide bài giảng này. Ngữ cảnh slide: ${currentText}` },
                  { type: "image_url", image_url: { url: canvasBase64 } }
                ]
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || "Lỗi kết nối OpenAI Vision API");
        }

        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);

        feat1SummaryText.textContent = parsed.summary || "Đã phân tích cấu trúc sơ đồ thành công.";
        feat1KeypointsList.innerHTML = (parsed.keypoints || []).map(kp => `<li>${kp}</li>`).join("");
        feat1EvidenceText.textContent = parsed.evidence || "Trích xuất từ hình ảnh và sơ đồ slide thị giác.";
      } else {
        // Intelligent Local Diagram Analysis Fallback
        await new Promise(r => setTimeout(r, 700));

        let summary = "";
        let keypoints = [];
        let evidence = "";

        if (state.currentSlideFullText.includes("TRANSFORMER") || state.currentSlideFullText.includes("Attention")) {
          summary = "Sơ đồ minh họa kiến trúc Transformer kinh điển của mô hình ngôn ngữ lớn (LLM). Cơ chế Self-Attention cho phép các token tính toán độ tương quan chéo không gian đa chiều.";
          keypoints = [
            "Input Embeddings & Positional Encoding: Mã hóa vị trí chuỗi từ ngữ trước khi đưa vào các khối tính toán.",
            "Multi-Head Attention: Phân tách Query, Key, Value thành nhiều đầu chú ý song song để bao quát ngữ nghĩa.",
            "Feed Forward Network & Residual Connections: Tăng cường tính phi tuyến tính và chống triệt tiêu đạo hàm gradient."
          ];
          evidence = "Căn cứ vào các khối Multi-Head Attention, Add & Norm, và FFN hiển thị trên slide.";
        } else if (state.currentSlideFullText.includes("CNN") || state.currentSlideFullText.includes("Convolutional")) {
          summary = "Sơ đồ mô tả quy trình trích xuất đặc trưng thị giác máy tính của Mạng Nơ-ron Tích chập (CNN).";
          keypoints = [
            "Tầng Convolution quét bộ lọc Kernel 3x3 để bắt trọn các đường nét (Edges) và họa tiết (Textures).",
            "Hàm kích hoạt ReLU tạo tính phi tuyến tính bằng cách triệt tiêu các giá trị âm.",
            "Tầng Max Pooling giảm kích thước không gian 50%, bảo toàn các đặc trưng quan trọng nhất."
          ];
          evidence = "Trích xuất từ luồng xử lý ma trận ảnh và các tầng tích chập trên sơ đồ.";
        } else {
          summary = `Phân tích thị giác AI cho Slide ${state.currentPage}: Hình ảnh trình bày các luận điểm cốt lõi và cấu trúc liên kết nội dung bài giảng.`;
          keypoints = [
            `Nội dung trọng tâm: ${state.currentSlideFullText.slice(0, 120)}...`,
            "Các khái niệm được liên kết chặt chẽ theo sơ đồ luồng dữ liệu logic.",
            "Đã đồng bộ hóa văn bản nhận diện qua OCR để sẵn sàng phục vụ học tập và ôn thi."
          ];
          evidence = `Dựa trên phân tích bố cục hình ảnh và dữ liệu trích xuất từ slide bài giảng.`;
        }

        feat1SummaryText.textContent = summary;
        feat1KeypointsList.innerHTML = keypoints.map(kp => `<li>${kp}</li>`).join("");
        feat1EvidenceText.textContent = evidence;
      }
    } catch (err) {
      feat1SummaryText.textContent = `Lỗi phân tích Vision: ${err.message}`;
      feat1KeypointsList.innerHTML = `<li>Vui lòng kiểm tra lại OpenAI API Key hoặc kết nối mạng.</li>`;
      feat1EvidenceText.textContent = "Không thể hoàn tất phân tích thị giác.";
    } finally {
      feat1Loading.style.display = 'none';
      feat1ContentArea.style.display = 'block';
      refreshIcons();
    }
  }

  function setupToolActionListeners() {
    if (btnRunOCR) {
      btnRunOCR.addEventListener('click', () => {
        runOcrOnCurrentSlide(false);
      });
    }

    if (btnVisionAI) {
      btnVisionAI.addEventListener('click', () => {
        analyzeSlideWithVisionAI();
      });
    }

    if (btnSampleImage) {
      btnSampleImage.addEventListener('click', () => {
        state.currentPage = 1;
        loadDefaultImageSlides();
      });
    }
  }

  function showToastNotification(title, message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.borderColor = '#38bdf8';
    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="sparkles" style="width: 22px; height: 22px; color: #38bdf8;"></i>
      </div>
      <div class="toast-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;
    toastContainer.appendChild(toast);
    refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // ----------------------------------------------------
  // Drag and Drop Setup
  // ----------------------------------------------------
  function setupDragAndDrop() {
    ['dragenter', 'dragover'].forEach(eventName => {
      window.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pdfScrollViewport) pdfScrollViewport.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      window.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pdfScrollViewport) pdfScrollViewport.classList.remove('dragover');
      }, false);
    });

    window.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        handleFileUploadBatch(Array.from(files));
      }
    });
  }

  // ----------------------------------------------------
  // Load PDF Document into PDF.js
  // ----------------------------------------------------
  async function loadPDFDocument(pdfSource, fileName = "Slide.pdf", title = "") {
    try {
      state.pdfFileName = fileName;
      pdfTitleDisplay.textContent = title || fileName;
      if (!state.pageOcrCache) state.pageOcrCache = {};
      
      const isPPT = fileName.toLowerCase().endsWith('.pptx') || fileName.toLowerCase().endsWith('.ppt');
      const isImg = fileName.toLowerCase().endsWith('.png') || fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.webp') || state.fileType === 'image';
      
      if (isImg) {
        pdfFileBadge.textContent = `IMG: ${fileName}`;
        pdfFileBadge.className = "file-tag tag-image";
      } else if (isPPT) {
        pdfFileBadge.textContent = `PPTX: ${fileName}`;
        pdfFileBadge.className = "file-tag tag-pptx";
      } else {
        pdfFileBadge.textContent = `PDF: ${fileName}`;
        pdfFileBadge.className = "file-tag tag-pdf";
      }

      let docParam = pdfSource;
      if (pdfSource instanceof Uint8Array) {
        docParam = { data: pdfSource };
      } else if (pdfSource instanceof ArrayBuffer) {
        docParam = { data: new Uint8Array(pdfSource) };
      } else if (typeof pdfSource === 'object' && pdfSource !== null && !pdfSource.data && !pdfSource.url) {
        docParam = { data: new Uint8Array(pdfSource) };
      }

      const loadingTask = pdfjsLib.getDocument(docParam);
      state.pdfDoc = await loadingTask.promise;
      state.totalPages = state.pdfDoc.numPages;
      state.currentPage = Math.min(state.currentPage || 1, state.totalPages);

      totalPagesBadge.textContent = `${state.totalPages} Trang`;
      pageTotalDisplay.textContent = `/ ${state.totalPages}`;
      pageNumberInput.max = state.totalPages;

      // Show viewer & hide empty state and native slide
      emptyStateCard.style.display = 'none';
      if (slideNativeCard) slideNativeCard.style.display = 'none';
      viewerToolbar.style.display = 'flex';
      pdfCard.style.display = 'inline-flex';

      renderPageThumbnails();
      await autoFitSlideViewport(false);
      await renderPDFPage(state.currentPage);

      // Auto-trigger OCR on initial load
      setTimeout(() => {
        runOcrOnCurrentSlide(true);
      }, 500);
    } catch (err) {
      console.error("Lỗi đọc PDF/PPT/Ảnh:", err);
      alert("Không thể hiển thị tài liệu này. Chi tiết: " + (err.message || err));
    }
  }

  // ----------------------------------------------------
  // Automatic Slide Alignment & Viewport Fitting
  // ----------------------------------------------------
  async function autoFitSlideViewport(shouldRender = true) {
    if (!state.pdfDoc) return;
    try {
      const page = await state.pdfDoc.getPage(state.currentPage || 1);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      
      const container = pdfScrollViewport;
      if (!container) return;

      const availWidth = Math.max(300, container.clientWidth - 50);
      const availHeight = Math.max(200, container.clientHeight - 50);

      const scaleX = availWidth / unscaledViewport.width;
      const scaleY = availHeight / unscaledViewport.height;

      // Calculate perfect proportional fit scale
      let optimalScale = Math.min(scaleX, scaleY);
      optimalScale = Math.max(0.4, Math.min(optimalScale, 1.8));
      optimalScale = Math.round(optimalScale * 100) / 100;

      state.currentScale = optimalScale;
      zoomDisplay.textContent = `${Math.round(state.currentScale * 100)}%`;

      if (shouldRender) {
        await renderPDFPage(state.currentPage);
      }
    } catch (e) {
      console.warn("Auto-fit scale calculation error:", e);
    }
  }

  // ----------------------------------------------------
  // Render Specific PDF Page (Canvas + TextLayer)
  // ----------------------------------------------------
  async function renderPDFPage(pageNumber) {
    if (!state.pdfDoc) return;
    state.currentPage = pageNumber;
    pageNumberInput.value = pageNumber;

    hideAllPopups();
    btnPrevPage.disabled = (pageNumber <= 1);
    btnNextPage.disabled = (pageNumber >= state.totalPages);

    document.querySelectorAll('.page-item-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === pageNumber - 1);
    });

    const page = await state.pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: state.currentScale });

    // Canvas sizing
    const ctx = pdfCanvas.getContext('2d');
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;
    pdfCanvas.style.width = `${viewport.width}px`;
    pdfCanvas.style.height = `${viewport.height}px`;

    pdfContainer.style.width = `${viewport.width}px`;
    pdfContainer.style.height = `${viewport.height}px`;

    if (pdfCard) {
      pdfCard.style.width = `${viewport.width}px`;
      pdfCard.style.height = `${viewport.height}px`;
    }

    // Render Canvas
    await page.render({
      canvasContext: ctx,
      viewport: viewport
    }).promise;

    const currentDoc = state.pdfFileName || "slide";
    const cacheKey = `${currentDoc}_p${pageNumber}`;
    const cachedOcr = state.pageOcrCache ? state.pageOcrCache[cacheKey] : null;

    // Render Text Layer
    const activeSlides = state.currentSlidesData || (state.isSamplePDF ? SAMPLE_SLIDES : null);
    if (activeSlides && activeSlides[pageNumber - 1]) {
      const slide = activeSlides[pageNumber - 1];
      if (slide.sections) {
        const textBlocks = [slide.title];
        slide.sections.forEach(s => {
          textBlocks.push(s.heading);
          s.items.forEach(it => textBlocks.push(it));
        });
        state.currentSlideFullText = textBlocks.join("\n");
        slideContextText.textContent = textBlocks.join("\n");
      } else {
        const fullText = [slide.title, slide.subtitle, ...(slide.points || [])].filter(Boolean).join(" ");
        state.currentSlideFullText = fullText;
        slideContextText.textContent = `${slide.subtitle ? slide.subtitle + "\n" : ""}• ${(slide.points || []).join("\n• ")}`;
      }
      renderCustomTextLayer(slide, viewport, activeSlides.length);

      if (cachedOcr) {
        updateOcrStatusPill('ready', `⚡ OCR: ${cachedOcr.wordsCount} từ khóa`);
      } else if (slide.diagramType || slide.isFullImage || slide.imageElement) {
        // Auto-run OCR in background for diagram/image slides
        setTimeout(() => runOcrOnCurrentSlide(true), 400);
      } else {
        updateOcrStatusPill('ready', `Slide Vector Đã sẵn sàng`);
      }
    } else {
      pdfTextLayer.innerHTML = '';
      pdfTextLayer.style.width = `${viewport.width}px`;
      pdfTextLayer.style.height = `${viewport.height}px`;

      const textContent = await page.getTextContent();
      const fullTextArray = textContent.items.map(item => item.str).filter(str => str.trim().length > 0);
      
      if (fullTextArray.length > 0) {
        state.currentSlideFullText = fullTextArray.join(" ");
        slideContextText.textContent = fullTextArray.join("\n• ");

        pdfjsLib.renderTextLayer({
          textContent: textContent,
          container: pdfTextLayer,
          viewport: viewport,
          textDivs: []
        });

        if (cachedOcr) {
          updateOcrStatusPill('ready', `⚡ OCR: ${cachedOcr.wordsCount} từ khóa`);
        } else {
          updateOcrStatusPill('ready', `Text Layer: ${fullTextArray.length} đoạn`);
        }
      } else {
        // Scanned PDF / Image Slide with NO text layer
        if (cachedOcr) {
          state.currentSlideFullText = cachedOcr.text;
          slideContextText.textContent = cachedOcr.text;
          renderOcrBoundingBoxes(cachedOcr.words);
          updateOcrStatusPill('ready', `⚡ OCR: ${cachedOcr.wordsCount} từ khóa`);
        } else {
          // Auto-trigger OCR in background
          updateOcrStatusPill('scanning');
          setTimeout(() => runOcrOnCurrentSlide(true), 300);
        }
      }
    }

    refreshIcons();
  }

  // Exact Vietnamese Text Overlay for Selection on Sample Slide (Chương 1. Ma Trận)
  function renderCustomTextLayer(slide, viewport, totalSlides = 1) {
    pdfTextLayer.innerHTML = '';
    pdfTextLayer.style.width = `${viewport.width}px`;
    pdfTextLayer.style.height = `${viewport.height}px`;

    const scale = viewport.scale;

    // Header Title span
    const titleSpan = document.createElement('span');
    titleSpan.textContent = slide.title || "";
    titleSpan.style.position = 'absolute';
    titleSpan.style.left = `${40 * scale}px`;
    titleSpan.style.top = `${36 * scale}px`;
    titleSpan.style.fontSize = `${16 * scale}px`;
    titleSpan.style.fontWeight = 'bold';
    titleSpan.style.color = 'transparent';
    pdfTextLayer.appendChild(titleSpan);

    if (slide.sections && slide.sections.length >= 4) {
      const colW = 367.5 * scale;
      const leftX = 40 * scale;
      const rightX = 435 * scale;

      // Section 1: 1. Ma trận (Left Top)
      renderSectionTextLayerSpans(slide.sections[0], leftX, 65 * scale, colW, 10.5 * scale, scale);

      // Section 2: 2. Định thức (Left Bottom)
      renderSectionTextLayerSpans(slide.sections[1], leftX, 282 * scale, colW, 10 * scale, scale);

      // Section 3: 3. Hạng ma trận (Right Top)
      renderSectionTextLayerSpans(slide.sections[2], rightX, 65 * scale, colW, 10.5 * scale, scale);

      // Section 4: 4. Hệ phương trình tuyến tính (Right Bottom)
      renderSectionTextLayerSpans(slide.sections[3], rightX, 282 * scale, colW, 10 * scale, scale);
    } else if (slide.points) {
      let currentY = 75 * scale;
      slide.points.forEach((point) => {
        const pSpan = document.createElement('span');
        pSpan.textContent = point;
        pSpan.style.position = 'absolute';
        pSpan.style.left = `${40 * scale}px`;
        pSpan.style.top = `${currentY}px`;
        pSpan.style.width = `${760 * scale}px`;
        pSpan.style.fontSize = `${11 * scale}px`;
        pSpan.style.lineHeight = `1.4`;
        pSpan.style.color = 'transparent';
        pdfTextLayer.appendChild(pSpan);
        currentY += 35 * scale;
      });
    }
  }

  function renderSectionTextLayerSpans(section, x, y, width, fontSize, scale) {
    // Heading
    const headSpan = document.createElement('span');
    headSpan.textContent = section.heading;
    headSpan.style.position = 'absolute';
    headSpan.style.left = `${x + 14 * scale}px`;
    headSpan.style.top = `${y + 12 * scale}px`;
    headSpan.style.fontSize = `${fontSize * 1.25}px`;
    headSpan.style.fontWeight = 'bold';
    headSpan.style.color = 'transparent';
    pdfTextLayer.appendChild(headSpan);

    let curY = y + 36 * scale;
    section.items.forEach(item => {
      const isSub = item.trim().startsWith('+');
      const iSpan = document.createElement('span');
      iSpan.textContent = item.trim();
      iSpan.style.position = 'absolute';
      iSpan.style.left = `${x + (isSub ? 26 : 14) * scale}px`;
      iSpan.style.top = `${curY}px`;
      iSpan.style.width = `${width - 24 * scale}px`;
      iSpan.style.fontSize = `${fontSize}px`;
      iSpan.style.lineHeight = `${fontSize * 1.45}px`;
      iSpan.style.color = 'transparent';
      pdfTextLayer.appendChild(iSpan);

      const estLines = Math.ceil(item.length / 34);
      curY += (estLines * fontSize * 1.45) + (isSub ? 3 * scale : 6 * scale);
    });
  }

  function renderPageThumbnails() {
    pageListContainer.innerHTML = '';
    for (let i = 1; i <= state.totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = `page-item-btn ${i === state.currentPage ? 'active' : ''}`;
      btn.innerHTML = `
        <span>Trang ${i}</span>
        <span class="page-number-tag">#${i}</span>
      `;
      btn.addEventListener('click', () => {
        renderPDFPage(i);
      });
      pageListContainer.appendChild(btn);
    }
  }

  // ----------------------------------------------------
  // PDF / PPT Navigation & Controls
  // ----------------------------------------------------
  btnPrevPage.addEventListener('click', () => {
    if (state.currentPage > 1) renderPDFPage(state.currentPage - 1);
  });

  btnNextPage.addEventListener('click', () => {
    if (state.currentPage < state.totalPages) renderPDFPage(state.currentPage + 1);
  });

  pageNumberInput.addEventListener('change', (e) => {
    let p = parseInt(e.target.value);
    if (p >= 1 && p <= state.totalPages) {
      renderPDFPage(p);
    } else {
      pageNumberInput.value = state.currentPage;
    }
  });

  btnZoomIn.addEventListener('click', () => {
    if (state.currentScale < 2.4) {
      state.currentScale += 0.15;
      zoomDisplay.textContent = `${Math.round(state.currentScale * 100)}%`;
      renderPDFPage(state.currentPage);
    }
  });

  btnZoomOut.addEventListener('click', () => {
    if (state.currentScale > 0.7) {
      state.currentScale -= 0.15;
      zoomDisplay.textContent = `${Math.round(state.currentScale * 100)}%`;
      renderPDFPage(state.currentPage);
    }
  });

  btnFitWidth.addEventListener('click', () => {
    autoFitSlideViewport(true);
  });

  // Window Resize Auto-Alignment Handler (Debounced)
  let resizeDebounceTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounceTimer);
    resizeDebounceTimer = setTimeout(() => {
      if (state.pdfDoc && pdfCard && pdfCard.style.display !== 'none') {
        autoFitSlideViewport(true);
      }
    }, 180);
  });

  // Upload Local File (PDF, PPTX/PPT, or Images)
  pdfFileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUploadBatch(files);
    }
    e.target.value = '';
  });

  btnSamplePDF.addEventListener('click', () => {
    loadDefaultSampleSlide();
  });

  // ----------------------------------------------------
  // Text Selection & Floating Action Menu (Strictly Inside Slide)
  // ----------------------------------------------------
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);

  function isSelectionInsideSlide(selection) {
    if (!selection || !selection.rangeCount) return false;
    const range = selection.getRangeAt(0);

    const slideNative = document.getElementById('slideNativeCard');
    const pdfCont = document.getElementById('pdfContainer');
    const pdfTextL = document.getElementById('pdfTextLayer');
    const pdfCardEl = document.getElementById('pdfCard');

    const ancestor = range.commonAncestorContainer;
    const startNode = range.startContainer;
    const endNode = range.endContainer;

    const getElement = (node) => (node && node.nodeType === 1 ? node : (node ? node.parentElement : null));
    const ancestorEl = getElement(ancestor);
    const startEl = getElement(startNode);
    const endEl = getElement(endNode);

    const isInsideTarget = (el) => {
      if (!el) return false;
      if (slideNative && slideNative.contains(el)) return true;
      if (pdfCont && pdfCont.contains(el)) return true;
      if (pdfTextL && pdfTextL.contains(el)) return true;
      if (pdfCardEl && pdfCardEl.contains(el)) return true;
      return false;
    };

    if (isInsideTarget(ancestorEl) || isInsideTarget(startEl) || isInsideTarget(endEl)) {
      return true;
    }

    return false;
  }

  function handleTextSelection(e) {
    if (
      e.target.closest('#floatingToolbar') ||
      e.target.closest('#popoverFeature1') ||
      e.target.closest('#popoverFeature2') ||
      e.target.closest('#apiKeyModal') ||
      e.target.closest('#endSessionModal')
    ) {
      return;
    }

    const selection = window.getSelection();
    const text = selection.toString().trim();

    // STRICT CHECK: Only process selections strictly inside the slide!
    // Selections outside the slide (sidebar, header, instructions) will NOT record or trigger popups
    if (!isSelectionInsideSlide(selection)) {
      if (!popoverFeature1.style.display || popoverFeature1.style.display === 'none') {
        if (!popoverFeature2.style.display || popoverFeature2.style.display === 'none') {
          floatingToolbar.style.display = 'none';
        }
      }
      return;
    }

    if (text.length >= 2) {
      state.selectedText = text;
      
      if (state.selectionMode === 'multi') {
        // Auto-add to basket ONLY when selecting inside slide
        addCurrentSelectionToSnippets(true);
      }

      showFloatingToolbar(selection);
      return;
    }

    if (!popoverFeature1.style.display || popoverFeature1.style.display === 'none') {
      if (!popoverFeature2.style.display || popoverFeature2.style.display === 'none') {
        floatingToolbar.style.display = 'none';
      }
    }
  }

  function showFloatingToolbar(selection) {
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    floatingToolbar.style.display = 'flex';
    floatingToolbar.style.top = `${rect.top + window.scrollY}px`;
    floatingToolbar.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
  }

  function positionPopup(popupEl, rect) {
    popupEl.style.display = 'block';
    const topPos = Math.max(70, rect.top + window.scrollY - 10);
    let leftPos = rect.left + rect.width / 2 + window.scrollX;

    const maxLeft = window.innerWidth - popupEl.offsetWidth - 20;
    const minLeft = popupEl.offsetWidth / 2 + 20;

    leftPos = Math.max(minLeft, Math.min(leftPos, maxLeft));

    popupEl.style.top = `${topPos}px`;
    popupEl.style.left = `${leftPos}px`;
    popupEl.style.transform = 'translate(-50%, 0)';
  }

  function hideAllPopups() {
    floatingToolbar.style.display = 'none';
    popoverFeature1.style.display = 'none';
    popoverFeature2.style.display = 'none';
  }

  // ----------------------------------------------------
  // SELECTION MODE HANDLERS (1 LẦN VS NHIỀU LẦN)
  // ----------------------------------------------------
  function setupSelectionModeListeners() {
    if (btnModeSingle) {
      btnModeSingle.addEventListener('click', () => setSelectionMode('single'));
    }
    if (btnModeMulti) {
      btnModeMulti.addEventListener('click', () => setSelectionMode('multi'));
    }
    if (btnToggleQuickMode) {
      btnToggleQuickMode.addEventListener('click', () => {
        const newMode = state.selectionMode === 'single' ? 'multi' : 'single';
        setSelectionMode(newMode);
      });
    }
  }

  function setSelectionMode(mode) {
    state.selectionMode = mode;
    if (btnModeSingle && btnModeMulti) {
      btnModeSingle.classList.toggle('active', mode === 'single');
      btnModeMulti.classList.toggle('active', mode === 'multi');
    }
    if (modeStatusBadge) {
      modeStatusBadge.innerHTML = mode === 'multi' 
        ? 'Chế độ: <strong style="color: #c084fc;">Nhiều Lần (Tự gom)</strong>' 
        : 'Chế độ: <strong style="color: #818cf8;">1 Lần (Đơn lẻ)</strong>';
    }
    if (btnToggleQuickModeText) {
      btnToggleQuickModeText.textContent = mode === 'multi' 
        ? 'Đổi sang Chế độ 1 Lần' 
        : 'Bật Chế độ Nhiều Lần (Tự gom)';
    }

    if (mode === 'multi') {
      showToastNotification(
        "Chế độ Bôi đen Nhiều Lần: BẬT",
        "Mỗi khi bạn bôi đen trên Slide, đoạn trích sẽ được tự động gom vào khay để tổng hợp câu hỏi."
      );
    } else {
      showToastNotification(
        "Chế độ Bôi đen 1 Lần: BẬT",
        "Bạn có thể thao tác giải thích hoặc tạo câu hỏi tức thì cho từng đoạn bôi đen đơn lẻ."
      );
    }
    refreshIcons();
  }

  // ----------------------------------------------------
  // MULTI-HIGHLIGHT SNIPPET COLLECTOR & SYNTHESIZER
  // ----------------------------------------------------
  function setupSnippetBasketListeners() {
    // Sidebar Tabs Switcher
    if (tabBtnAssistant && tabBtnSnippets) {
      tabBtnAssistant.addEventListener('click', () => switchSidebarTab('assistant'));
      tabBtnSnippets.addEventListener('click', () => switchSidebarTab('snippets'));
    }

    // Floating Collect Button
    if (btnTriggerCollect) {
      btnTriggerCollect.addEventListener('click', () => {
        addCurrentSelectionToSnippets(false);
      });
    }

    // Clear All Snippets
    if (btnClearSnippets) {
      btnClearSnippets.addEventListener('click', () => {
        if (state.collectedSnippets.length === 0) return;
        if (confirm(`Bạn có chắc muốn xóa tất cả ${state.collectedSnippets.length} đoạn đã bôi đen khỏi khay?`)) {
          state.collectedSnippets = [];
          renderCollectedSnippets();
          showToastNotification("Đã xóa khay bôi đen", "Khay thu thập đoạn bôi đen đã được dọn sạch.");
        }
      });
    }

    // Multi-Snippet AI Synthesize Actions
    if (btnSynthesizeQuiz) {
      btnSynthesizeQuiz.addEventListener('click', () => {
        triggerMultiSnippetQuiz();
      });
    }

    if (btnSynthesizeInstructor) {
      btnSynthesizeInstructor.addEventListener('click', () => {
        triggerMultiSnippetInstructorDraft();
      });
    }

    if (btnSynthesizeExplain) {
      btnSynthesizeExplain.addEventListener('click', () => {
        triggerMultiSnippetExplanation();
      });
    }
  }

  function switchSidebarTab(tabName) {
    const tabs = [
      { name: 'assistant', btn: tabBtnAssistant, content: tabContentAssistant },
      { name: 'snippets', btn: tabBtnSnippets, content: tabContentSnippets },
      { name: 'history', btn: tabBtnHistory, content: tabContentHistory }
    ];

    tabs.forEach(t => {
      if (t.btn && t.content) {
        if (t.name === tabName) {
          t.btn.classList.add('active');
          t.content.style.display = 'flex';
        } else {
          t.btn.classList.remove('active');
          t.content.style.display = 'none';
        }
      }
    });
    refreshIcons();
  }

  function addCurrentSelectionToSnippets(isAuto = false) {
    const text = (state.selectedText || window.getSelection().toString()).trim();
    if (!text || text.length < 2) {
      if (!isAuto) alert("Vui lòng bôi đen một đoạn văn bản trên slide trước khi gom!");
      return;
    }

    // Check duplicate
    const exists = state.collectedSnippets.some(s => s.text.toLowerCase() === text.toLowerCase());
    if (exists) {
      if (!isAuto) {
        showToastNotification("Đoạn bôi đen đã tồn tại", `"${text.slice(0, 35)}..." đã có sẵn trong Khay bôi đen.`);
        switchSidebarTab('snippets');
      }
      return;
    }

    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const newSnippet = {
      id: `snp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: text,
      page: state.currentPage,
      fileName: state.pdfFileName || "Slide",
      timestamp: timeNow
    };

    state.collectedSnippets.push(newSnippet);
    renderCollectedSnippets();

    if (!isAuto) {
      floatingToolbar.style.display = 'none';
      switchSidebarTab('snippets');
      try {
        window.getSelection()?.removeAllRanges();
      } catch (e) {}
    }

    // Visual feedback
    showToastNotification(
      isAuto ? `⚡ Tự động gom đoạn #${state.collectedSnippets.length}` : `Đã gom đoạn bôi đen #${state.collectedSnippets.length}`,
      `"${text.slice(0, 45)}${text.length > 45 ? '...' : ''}" (Trang ${state.currentPage})`
    );
  }

  function renderCollectedSnippets() {
    const count = state.collectedSnippets.length;
    if (snippetCountBadge) snippetCountBadge.textContent = count;
    if (snippetCountText) snippetCountText.textContent = count;

    if (!collectedSnippetsList) return;
    collectedSnippetsList.innerHTML = '';

    const hasSnippets = count > 0;
    if (btnSynthesizeQuiz) btnSynthesizeQuiz.disabled = !hasSnippets;
    if (btnSynthesizeInstructor) btnSynthesizeInstructor.disabled = !hasSnippets;
    if (btnSynthesizeExplain) btnSynthesizeExplain.disabled = !hasSnippets;
    if (btnClearSnippets) btnClearSnippets.style.display = hasSnippets ? 'inline-flex' : 'none';

    if (!hasSnippets) {
      collectedSnippetsList.innerHTML = `
        <div class="empty-snippets-box">
          <i data-lucide="layers" style="width: 32px; height: 32px; color: #c084fc; opacity: 0.6;"></i>
          <p><strong>Khay tổng hợp đang trống</strong></p>
          <p style="font-size: 11px; color: var(--text-muted);">Bôi đen bất kỳ đoạn văn bản nào trên Slide và bấm nút <strong>"Gom đoạn (+)"</strong> để tổng hợp nhiều khái niệm cùng lúc.</p>
        </div>
      `;
      refreshIcons();
      return;
    }

    state.collectedSnippets.forEach((snp, idx) => {
      const card = document.createElement('div');
      card.className = 'snippet-card';
      card.innerHTML = `
        <div class="snippet-card-top">
          <span class="snippet-page-chip">#${idx + 1} &bull; Trang ${snp.page}</span>
          <button class="btn-remove-snippet" data-remove-id="${snp.id}" title="Xóa đoạn này">
            <i data-lucide="x" style="width: 13px; height: 13px;"></i>
          </button>
        </div>
        <div class="snippet-card-text">"${snp.text}"</div>
      `;

      card.querySelector('[data-remove-id]').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSnippet(snp.id);
      });

      collectedSnippetsList.appendChild(card);
    });

    refreshIcons();
  }

  function deleteSnippet(id) {
    state.collectedSnippets = state.collectedSnippets.filter(s => s.id !== id);
    renderCollectedSnippets();
  }

  // Multi-Snippet Synthesis: 1. Quiz Generation
  async function triggerMultiSnippetQuiz() {
    if (state.collectedSnippets.length === 0) {
      alert("Vui lòng bôi đen và gom ít nhất 1 đoạn văn bản trước khi tạo câu hỏi tổng hợp!");
      return;
    }

    state.questionHistoryCounter++;
    const count = state.collectedSnippets.length;
    const snippetBullets = state.collectedSnippets.map((s, i) => `(${i + 1}) [Trang ${s.page}]: "${s.text}"`).join("\n");
    const pages = [...new Set(state.collectedSnippets.map(s => s.page))].join(", ");

    feat2SelectedTerm.textContent = `Tổng hợp ${count} đoạn bôi đen (Trang ${pages}) - Lần #${state.questionHistoryCounter}`;

    // Position modal
    const rect = pdfCanvas.getBoundingClientRect();
    positionPopup(popoverFeature2, rect);

    if (state.openAIKey) {
      feat2Loading.style.display = 'flex';
      feat2ContentArea.style.display = 'none';

      const systemPrompt = `Bạn là chuyên gia ra đề thi học tập xuất sắc. Nhiệm vụ của bạn là dựa vào ${count} đoạn văn bản học viên đã bôi đen từ slide bài giảng để tạo ra 1 câu hỏi trắc nghiệm 4 đáp án (A, B, C, D) chất lượng cao.
Câu hỏi PHẢI kiểm tra sự liên kết logic, so sánh, đối chiếu hoặc nguyên nhân - kết quả giữa các đoạn văn bản này.
Đảm bảo 1 đáp án đúng và 3 đáp án sai hợp lý.
Trả về JSON theo cấu trúc:
{
  "question": "Nội dung câu hỏi trắc nghiệm tổng hợp",
  "options": [
    { "id": "A", "text": "Đáp án A", "isCorrect": false, "explanation": "Giải thích" },
    { "id": "B", "text": "Đáp án B", "isCorrect": true, "explanation": "Giải thích vì sao đúng" },
    { "id": "C", "text": "Đáp án C", "isCorrect": false, "explanation": "Giải thích" },
    { "id": "D", "text": "Đáp án D", "isCorrect": false, "explanation": "Giải thích" }
  ],
  "overallExplanation": "Giải thích mối tương quan giữa các đoạn đã bôi đen"
}`;

      const userPrompt = `Danh sách ${count} đoạn văn bản học viên đã bôi đen:
${snippetBullets}

Ngữ cảnh trang hiện tại (Trang ${state.currentPage}):
"${state.currentSlideFullText}"

Hãy sinh 1 câu hỏi trắc nghiệm tổng hợp 4 đáp án mới lạ.`;

      const response = await callOpenAI({ systemPrompt, userPrompt, jsonMode: true });
      feat2Loading.style.display = 'none';
      feat2ContentArea.style.display = 'block';

      if (response) {
        try {
          const parsed = JSON.parse(response);
          feat2QuestionText.textContent = parsed.question;
          feat2FeedbackCard.className = 'quiz-feedback-card';
          feat2FeedbackCard.style.display = 'none';
          renderQuizOptions(parsed);
          refreshIcons();
          return;
        } catch (e) {
          console.error("Lỗi parse OpenAI Quiz JSON:", e);
        }
      }
    }

    // Local dynamic multi-concept fallback
    feat2Loading.style.display = 'none';
    feat2ContentArea.style.display = 'block';
    
    const combinedTerms = state.collectedSnippets.map(s => `"${s.text}"`).slice(0, 3).join(" và ");
    const synthQuiz = {
      question: `[Tổng hợp Kiến thức] Khi kết hợp và phân tích mối liên hệ giữa các nội dung ${combinedTerms} (Trang ${pages}), kết luận nào sau đây là CHÍNH XÁC NHẤT?`,
      options: [
        {
          id: 'A',
          text: `Các khái niệm này có mối liên hệ mật thiết, bổ trợ lẫn nhau trong việc phân tích toàn diện mô hình bài học.`,
          isCorrect: true,
          explanation: `Theo tài liệu bài giảng, việc liên kết các luận điểm tại Trang ${pages} giúp tạo nên bức tranh tổng thể về lý thuyết và ứng dụng thực tiễn.`
        },
        {
          id: 'B',
          text: `Các luận điểm này hoàn toàn mâu thuẫn và phủ định tính đúng đắn của nhau.`,
          isCorrect: false,
          explanation: `Các khái niệm trong bài giảng được xây dựng trên cùng hệ quy chiếu, không phủ định nhau.`
        },
        {
          id: 'C',
          text: `Chỉ có đoạn đầu tiên có giá trị thực tiễn, các phần bôi đen còn lại chỉ mang tính trang trí.`,
          isCorrect: false,
          explanation: `Tất cả các luận điểm được nêu đều là mắt xích quan trọng trong cấu trúc bài giảng.`
        },
        {
          id: 'D',
          text: `Không có bất kỳ mối liên hệ logic hay toán học nào giữa các khái niệm này.`,
          isCorrect: false,
          explanation: `Các phần bôi đen được kết nối qua các định luật và công thức nền tảng của bài học.`
        }
      ],
      overallExplanation: `Phân tích tổng hợp từ ${count} đoạn bôi đen tại các Trang: ${pages}.`
    };

    // Shuffle options
    for (let i = synthQuiz.options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [synthQuiz.options[i], synthQuiz.options[j]] = [synthQuiz.options[j], synthQuiz.options[i]];
    }
    const letters = ['A', 'B', 'C', 'D'];
    synthQuiz.options.forEach((opt, idx) => { opt.id = letters[idx]; });

    feat2QuestionText.textContent = synthQuiz.question;
    feat2FeedbackCard.className = 'quiz-feedback-card';
    feat2FeedbackCard.style.display = 'none';
    renderQuizOptions(synthQuiz);
    refreshIcons();
  }

  // Multi-Snippet Synthesis: 2. Instructor Question Note
  function triggerMultiSnippetInstructorDraft() {
    if (state.collectedSnippets.length === 0) {
      alert("Vui lòng bôi đen và gom ít nhất 1 đoạn văn bản trước khi soạn câu hỏi gửi giảng viên!");
      return;
    }

    const count = state.collectedSnippets.length;
    const pages = [...new Set(state.collectedSnippets.map(s => s.page))].join(", ");
    const snippetListText = state.collectedSnippets.map((s, i) => `${i + 1}. [Trang ${s.page}]: "${s.text}"`).join("\n");
    
    const termTitle = `Tổng hợp thắc mắc ${count} đoạn bôi đen (Trang ${pages})`;
    const customNote = `Kính gửi Thầy/Cô, em đang học bài giảng ${state.pdfFileName || ""} và có thắc mắc cần Thầy/Cô giải đáp về mối liên kết giữa ${count} luận điểm sau:\n\n${snippetListText}\n\nThầy/Cô vui lòng hướng dẫn giúp em cách xâu chuỗi logic và ứng dụng thực tiễn của các khái niệm này ạ.`;

    saveToBookmarks(termTitle, customNote);
    showToastNotification(
      "Đã soạn xong câu hỏi gửi Giảng viên",
      `Đã tổng hợp ${count} đoạn bôi đen thành câu hỏi hoàn chỉnh trong danh sách thắc mắc đã lưu.`
    );
  }

  // Multi-Snippet Synthesis: 3. Explanation of Relationships
  async function triggerMultiSnippetExplanation() {
    if (state.collectedSnippets.length === 0) {
      alert("Vui lòng bôi đen và gom ít nhất 1 đoạn văn bản trước khi giải thích mối liên hệ!");
      return;
    }

    const count = state.collectedSnippets.length;
    const pages = [...new Set(state.collectedSnippets.map(s => s.page))].join(", ");
    const snippetBullets = state.collectedSnippets.map((s, i) => `(${i + 1}) [Trang ${s.page}]: "${s.text}"`).join("\n");

    feat1SelectedTerm.textContent = `Tổng hợp mối liên hệ ${count} đoạn bôi đen (Trang ${pages})`;

    // Position popover
    const rect = pdfCanvas.getBoundingClientRect();
    positionPopup(popoverFeature1, rect);

    if (state.openAIKey) {
      feat1Loading.style.display = 'flex';
      feat1ContentArea.style.display = 'none';

      const systemPrompt = `Bạn là trợ lý giảng dạy AI cấp cao. Học viên đã bôi đen ${count} đoạn văn bản quan trọng trong slide bài giảng.
Nhiệm vụ của bạn là phân tích MỐI QUAN HỆ HỆ THỐNG, điểm tương đồng, sự khác biệt và cách kết hợp các luận điểm này lại với nhau một cách dễ hiểu, mạch lạc.
Trả về JSON thuần:
{
  "summary": "Tóm tắt mối quan hệ cốt lõi giữa các đoạn trong 2 câu",
  "keypoints": [
    "Liên kết 1: Tính chất tương tác trực tiếp",
    "Liên kết 2: Ứng dụng khi kết hợp cùng nhau",
    "Liên kết 3: Lưu ý quan trọng để tránh nhầm lẫn"
  ]
}`;

      const userPrompt = `Các đoạn học viên đã bôi đen:
${snippetBullets}

Slide hiện tại:
"${state.currentSlideFullText}"`;

      const response = await callOpenAI({ systemPrompt, userPrompt, jsonMode: true });
      feat1Loading.style.display = 'none';
      feat1ContentArea.style.display = 'block';

      if (response) {
        try {
          const parsed = JSON.parse(response);
          feat1SummaryText.textContent = parsed.summary || "Đã tổng hợp mối quan hệ giữa các đoạn bôi đen.";
          feat1KeypointsList.innerHTML = '';
          (parsed.keypoints || []).forEach(kp => {
            const li = document.createElement('li');
            li.innerHTML = kp;
            feat1KeypointsList.appendChild(li);
          });
          feat1EvidenceText.textContent = `OpenAI tổng hợp từ ${count} đoạn bôi đen trên các Trang: ${pages}.`;
          refreshIcons();
          return;
        } catch (e) {
          console.error("Lỗi parse JSON:", e);
        }
      }
    }

    // Local smart fallback
    feat1Loading.style.display = 'none';
    feat1ContentArea.style.display = 'block';
    feat1SummaryText.textContent = `Tổng hợp mối liên hệ logic giữa ${count} đoạn văn bản đã bôi đen tại các Trang: ${pages}:`;
    feat1KeypointsList.innerHTML = `
      <li><strong>Mối liên hệ khái niệm:</strong> Các đoạn bôi đen cấu thành các mặt khác nhau của cùng một chủ đề bài giảng, giúp bổ sung ngữ cảnh cho nhau.</li>
      <li><strong>Quy luật tác động:</strong> Khi một yếu tố thay đổi, các yếu tố liên quan được bôi đen sẽ có xu hướng biến thiên theo quy luật tương quan trong mô hình.</li>
      <li><strong>Ứng dụng tổng hợp:</strong> Nắm vững liên kết này giúp học viên giải quyết nhanh các bài tập tình huống và câu hỏi trắc nghiệm phức hợp.</li>
    `;
    feat1EvidenceText.textContent = `Tổng hợp thông minh từ ${count} đoạn bôi đen đã gom (Trang ${pages}).`;
    refreshIcons();
  }

  // ----------------------------------------------------
  // TÍNH NĂNG 1: AI Giải thích (Tổng hợp theo toàn bộ Slide)
  // ----------------------------------------------------
  btnTriggerFeature1.addEventListener('click', triggerFeature1);

  async function triggerFeature1() {
    floatingToolbar.style.display = 'none';
    const term = state.selectedText || "Nội dung bôi đen";
    const slideContext = state.currentSlideFullText || "Nội dung slide hiện tại";

    feat1SelectedTerm.textContent = `Phần bôi đen: "${term}"`;
    
    // Position popover
    const sel = window.getSelection();
    let rect = sel.rangeCount > 0 && sel.toString().trim().length > 0 
      ? sel.getRangeAt(0).getBoundingClientRect() 
      : pdfCanvas.getBoundingClientRect();
    positionPopup(popoverFeature1, rect);

    // If OpenAI key is present, request live explanation
    if (state.openAIKey) {
      feat1Loading.style.display = 'flex';
      feat1ContentArea.style.display = 'none';

      const systemPrompt = `Bạn là trợ lý học tập AI chuyên nghiệp. Nhiệm vụ của bạn là đọc toàn bộ nội dung của slide PDF được cung cấp dưới đây, sau đó giải thích ngắn gọn, súc tích và chính xác phần văn bản mà học viên bôi đen. Hãy đảm bảo giải thích đặt trong mối tương quan với toàn bộ slide.
Trả về định dạng JSON thuần:
{
  "summary": "Tóm tắt định nghĩa/ý nghĩa chính của đoạn bôi đen trong 1-2 câu",
  "keypoints": [
    "Ý 1: Vai trò hoặc mối liên hệ trong slide",
    "Ý 2: Điểm đặc thù hoặc công thức/tính chất",
    "Ý 3: Ứng dụng thực tiễn hoặc lưu ý"
  ]
}`;

      const userPrompt = `Slide Trang ${state.currentPage} (${state.pdfFileName}):
"${slideContext}"

Đoạn học viên bôi đen:
"${term}"`;

      const response = await callOpenAI({ systemPrompt, userPrompt, jsonMode: true });
      feat1Loading.style.display = 'none';
      feat1ContentArea.style.display = 'block';

      if (response) {
        try {
          const parsed = JSON.parse(response);
          feat1SummaryText.textContent = parsed.summary || `Giải thích về "${term}":`;
          feat1KeypointsList.innerHTML = '';
          (parsed.keypoints || []).forEach(kp => {
            const li = document.createElement('li');
            li.innerHTML = kp;
            feat1KeypointsList.appendChild(li);
          });
          feat1EvidenceText.textContent = `OpenAI (${state.openAIModel}) tổng hợp từ toàn bộ Trang ${state.currentPage} (${state.pdfFileName}).`;
          refreshIcons();
          return;
        } catch (e) {
          console.error("Lỗi parse OpenAI JSON:", e);
        }
      }
    }

    // In-depth Pedagogical Explanation Engine for Linear Algebra Concepts
    feat1Loading.style.display = 'none';
    feat1ContentArea.style.display = 'block';

    const detailExp = getDetailedExplanationForTerm(term, slideContext, state.currentPage);
    feat1SummaryText.innerHTML = detailExp.summary;
    feat1KeypointsList.innerHTML = '';
    detailExp.keypoints.forEach(kp => {
      const li = document.createElement('li');
      li.innerHTML = kp;
      feat1KeypointsList.appendChild(li);
    });
    feat1EvidenceText.textContent = detailExp.evidence;
    refreshIcons();
  }

  // ----------------------------------------------------
  // Chuyên Sâu: Knowledge Base & Semantic Matcher cho Đại Số Tuyến Tính
  // ----------------------------------------------------
  function getDetailedExplanationForTerm(term, slideContext, pageNum) {
    const t = term.toLowerCase().trim();

    // 1. Định thức cấp 2, 3
    if (t.includes("định thức cấp 2") || t.includes("định thức cấp 3") || (t.includes("định thức") && (t.includes("2") || t.includes("3") || t.includes("cấp")))) {
      return {
        summary: `<strong>Định thức cấp 2 và cấp 3</strong> là các đại lượng vô hướng số thực đặc trưng cho ma trận vuông cấp 2 và cấp 3:`,
        keypoints: [
          `<strong>Định thức cấp 2:</strong> Cho ma trận A = [[a, b], [c, d]], giá trị định thức là <code>det(A) = ad - bc</code> (tích các phần tử trên đường chéo chính trừ tích đường chéo phụ). Về mặt hình học, trị tuyệt đối |det(A)| biểu diễn <em>diện tích hình bình hành</em> tạo bởi 2 vector cột trong không gian 2D.`,
          `<strong>Định thức cấp 3:</strong> Cho ma trận vuông 3×3, định thức được tính nhanh bằng <em>Quy tắc đường chéo Sarrus</em> (cộng tích 3 đường chéo thuận trừ tích 3 đường chéo nghịch) hoặc khai triển Laplace theo một dòng/cột bất kỳ: <code>det(A) = a₁₁A₁₁ + a₁₂A₁₂ + a₁₃A₁₃</code>. Về mặt hình học: |det(A)| là <em>thể tích khối hộp</em> tạo bởi 3 vector cột trong không gian 3D.`,
          `<strong>Ý nghĩa cốt lõi:</strong> <code>det(A) ≠ 0</code> là điều kiện cần và đủ để ma trận A khả nghịch (tồn tại ma trận nghịch đảo A⁻¹) và hệ phương trình Cramer có nghiệm duy nhất.`
        ],
        evidence: `Mục 2. 'Định thức' trên slide Chương 1.`
      };
    }

    // 2. Khai triển hoặc biến đổi sơ cấp
    if (t.includes("khai triển") || (t.includes("biến đổi sơ cấp") && t.includes("định thức"))) {
      return {
        summary: `<strong>Phương pháp tính định thức bằng Khai triển Laplace và Biến đổi sơ cấp</strong> đưa về dạng ma trận tam giác:`,
        keypoints: [
          `<strong>Khai triển Laplace:</strong> Cho phép hạ bậc định thức cấp n về tổng các định thức con cấp (n - 1) nhân với phần bù đại số <code>A_ij = (-1)^{i+j} M_ij</code>.`,
          `<strong>Biến đổi sơ cấp tối ưu:</strong> Sử dụng phép cộng dòng <code>d_i ← d_i + k·d_j</code> (phép toán này KHÔNG làm thay đổi giá trị định thức) để tạo ra một dòng hoặc cột có nhiều số 0 nhất có thể trước khi khai triển.`,
          `<strong>Đưa về ma trận tam giác:</strong> Khi khử Gauss đưa ma trận về dạng tam giác trên hoặc tam giác dưới, định thức bằng đúng tích các phần tử trên đường chéo chính: <code>det(A) = a₁₁ · a₂₂ ··· a_nn</code>.`
        ],
        evidence: `Mục 2. 'Tính bằng khai triển hoặc biến đổi sơ cấp' trên slide Chương 1.`
      };
    }

    // 3. Đổi chỗ 2 dòng → đổi dấu định thức
    if (t.includes("đổi chỗ 2 dòng") || t.includes("đổi dấu định thức") || (t.includes("đổi chỗ") && t.includes("dòng"))) {
      return {
        summary: `<strong>Tính chất phản xứng (Antisymmetric) của Định thức</strong> khi hoán vị dòng hoặc cột:`,
        keypoints: [
          `<strong>Quy tắc đổi dấu:</strong> Khi hoán vị vị trí của 2 dòng bất kỳ (<code>d_i ↔ d_j</code>) hoặc 2 cột bất kỳ của ma trận vuông A, định thức của ma trận mới B sẽ bị đảo dấu: <code>det(B) = -det(A)</code>.`,
          `<strong>Số lần hoán vị:</strong> Nếu thực hiện k lần đổi chỗ dòng/cột liên tiếp, định thức mới sẽ nhân với hệ số <code>(-1)^k</code>.`,
          `<strong>Hệ quả cực kỳ quan trọng:</strong> Nếu ma trận có 2 dòng (hoặc 2 cột) GIỐNG NHAU hoặc TỈ LỆ VỚI NHAU, định thức của ma trận đó chắc chắn bằng 0 (vì đổi chỗ 2 dòng giống nhau thì det(A) = -det(A) ⇒ 2·det(A) = 0 ⇒ det(A) = 0).`
        ],
        evidence: `Mục 2. Tính chất: 'Đổi chỗ 2 dòng → đổi dấu định thức' trên slide Chương 1.`
      };
    }

    // 4. Một dòng nhân k → định thức nhân k
    if (t.includes("nhân k") || t.includes("nhân hằng số") || (t.includes("một dòng nhân") && t.includes("định thức"))) {
      return {
        summary: `<strong>Tính chất đa tuyến tính (Multilinear) của Định thức</strong> đối với từng dòng/cột:`,
        keypoints: [
          `<strong>Nhân một dòng:</strong> Khi nhân tất cả các phần tử của MỘT dòng (hoặc MỘT cột) với hằng số k, định thức của ma trận sẽ tăng gấp k lần: <code>det(B) = k · det(A)</code>. Cho phép rút thừa số chung của một dòng ra ngoài dấu định thức.`,
          `<strong>Phân biệt với nhân toàn bộ ma trận:</strong> Nếu nhân toàn bộ ma trận A vuông cấp n với hằng số k (tức là mọi dòng đều nhân k), định thức sẽ bằng: <code>det(k·A) = k^n · det(A)</code>.`,
          `<strong>Hệ quả:</strong> Nhân một dòng với 0 sẽ biến dòng đó thành dòng toàn số 0 và kéo theo định thức bằng 0.`
        ],
        evidence: `Mục 2. Tính chất: 'Một dòng nhân k → định thức nhân k' trên slide Chương 1.`
      };
    }

    // 5. Một dòng toàn 0 → định thức = 0
    if (t.includes("toàn 0") || t.includes("toàn số 0") || (t.includes("dòng toàn 0") && t.includes("định thức"))) {
      return {
        summary: `<strong>Tính chất suy biến của ma trận khi có dòng hoặc cột toàn số 0:</strong>`,
        keypoints: [
          `<strong>Định lý:</strong> Nếu ma trận vuông A có ít nhất một dòng toàn số 0 (hoặc một cột toàn số 0), thì giá trị định thức chắc chắn bằng 0: <code>det(A) = 0</code>.`,
          `<strong>Chứng minh bằng khai triển:</strong> Khai triển Laplace theo dòng toàn số 0 đó, mọi số hạng đều có dạng <code>0 · A_ij = 0</code> nên tổng định thức bằng 0.`,
          `<strong>Ý nghĩa đại số tuyến tính:</strong> Dòng toàn 0 thể hiện hệ vector dòng bị phụ thuộc tuyến tính, ma trận bị suy biến (Singular Matrix), không khả nghịch và không có ma trận nghịch đảo.`
        ],
        evidence: `Mục 2. Tính chất: 'Một dòng toàn 0 → định thức = 0' trên slide Chương 1.`
      };
    }

    // 6. Định thức (Tổng quan)
    if (t.includes("định thức") || t.includes("determinant") || t.includes("det")) {
      return {
        summary: `<strong>Định thức (Determinant)</strong> là một đại lượng vô hướng số thực gán cho mỗi ma trận vuông A, phản ánh độ co giãn thể tích và tính khả nghịch:`,
        keypoints: [
          `<strong>Điều kiện tồn tại:</strong> Chỉ có MA TRẬN VUÔNG (cấp n×n) mới có định thức, ma trận chữ nhật m×n (m ≠ n) không có định thức.`,
          `<strong>Tính chất nhân:</strong> <code>det(A · B) = det(A) · det(B)</code> và <code>det(A^T) = det(A)</code>. Nếu A khả nghịch thì <code>det(A⁻¹) = 1 / det(A)</code>.`,
          `<strong>Ứng dụng cốt lõi:</strong> Tính ma trận nghịch đảo A⁻¹ = (1/det(A)) · P_A^T, giải hệ phương trình tuyến tính bằng quy tắc Cramer và kiểm tra tính độc lập tuyến tính của n vector trong không gian R^n.`
        ],
        evidence: `Mục 2. 'Định thức' trên slide Chương 1.`
      };
    }

    // 7. Ma trận chuyển vị A^T
    if (t.includes("chuyển vị") || t.includes("a^t") || t.includes("transpose")) {
      return {
        summary: `<strong>Ma trận chuyển vị A^T (Transpose Matrix)</strong> là phép toán biến đổi hình học cơ bản trên ma trận:`,
        keypoints: [
          `<strong>Định nghĩa:</strong> Cho ma trận A kích thước m×n, ma trận chuyển vị A^T có kích thước n×m, thu được bằng cách đổi dòng thứ i của A thành cột thứ i của A^T (công thức phần tử: <code>a^T_ij = a_ji</code>).`,
          `<strong>Các tính chất quan trọng:</strong><br>• <code>(A^T)^T = A</code><br>• <code>(A + B)^T = A^T + B^T</code><br>• <code>(k·A)^T = k·A^T</code><br>• <code>(A · B)^T = B^T · A^T</code> (chú ý: đảo ngược thứ tự nhân!)`,
          `<strong>Phân loại ma trận đặc biệt:</strong><br>• Ma trận đối xứng: <code>A^T = A</code> (đối xứng qua đường chéo chính).<br>• Ma trận phản đối xứng: <code>A^T = -A</code> (các phần tử chéo chính bắt buộc bằng 0).`
        ],
        evidence: `Mục 1. 'Ma trận chuyển vị A^T' trên slide Chương 1.`
      };
    }

    // 8. Các phép toán ma trận: cộng, trừ, nhân
    if (t.includes("phép toán") || t.includes("cộng, trừ") || t.includes("nhân ma trận") || t.includes("phép nhân") || t.includes("cộng trừ")) {
      return {
        summary: `<strong>Các quy tắc và điều kiện thực hiện các phép toán đại số ma trận:</strong>`,
        keypoints: [
          `<strong>Phép cộng và trừ:</strong> CHỈ THỰC HIỆN ĐƯỢC khi hai ma trận có CÙNG KÍCH THƯỚC m×n. Phép tính thực hiện bằng cách cộng/trừ từng phần tử ở vị trí tương ứng: <code>C_ij = A_ij ± B_ij</code>.`,
          `<strong>Phép nhân hai ma trận A_{m×k} · B_{k×n}:</strong> Điều kiện bắt buộc là SỐ CỘT CỦA A PHẢI BẰNG SỐ DÒNG CỦA B (cùng bằng k). Kết quả thu được ma trận C có kích thước m×n.`,
          `<strong>Quy tắc dòng nhân cột:</strong> Phần tử <code>c_ij = a_i1·b_1j + a_i2·b_2j + ... + a_ik·b_kj</code> (tích vô hướng giữa dòng i của A và cột j của B).`,
          `<strong>Lưu ý:</strong> Phép nhân ma trận KHÔNG CÓ TÍNH GIAO HOÁN (nói chung <code>A·B ≠ B·A</code>).`
        ],
        evidence: `Mục 1. 'Các phép toán: cộng, trừ, nhân ma trận' trên slide Chương 1.`
      };
    }

    // 9. Khái niệm ma trận, kích thước m×n
    if (t.includes("khái niệm ma trận") || t.includes("kích thước m×n") || t.includes("kích thước m") || (t.includes("ma trận") && (t.includes("m×n") || t.includes("khái niệm")))) {
      return {
        summary: `<strong>Ma trận</strong> là một bảng số chữ nhật gồm m hàng và n cột, ký hiệu A = [a_ij]_{m×n}:`,
        keypoints: [
          `<strong>Cấu trúc & Ký hiệu:</strong> Kích thước m×n đọc là "m nhân n" (m là số dòng, n là số cột). Phần tử <code>a_ij</code> nằm ở giao điểm giữa dòng i và cột j.`,
          `<strong>Các dạng ma trận tiêu biểu:</strong><br>• Ma trận vuông: m = n (có đường chéo chính và đường chéo phụ).<br>• Ma trận dòng (1×n) và Ma trận cột (m×1 - vector cột).<br>• Ma trận đơn vị I_n: ma trận vuông có đường chéo chính toàn số 1, các vị trí khác bằng 0 (I·A = A·I = A).<br>• Ma trận không O: mọi phần tử đều bằng 0.`,
          `<strong>Ý nghĩa thực tế:</strong> Biểu diễn dữ liệu đa chiều, bảng trọng số mạng nơ-ron (Neural Network Weights), và toán tử biến đổi tuyến tính trong không gian số.`
        ],
        evidence: `Mục 1. 'Khái niệm ma trận, kích thước m×n' trên slide Chương 1.`
      };
    }

    // 10. Hạng ma trận & Rank
    if (t.includes("hạng ma trận") || t.includes("hạng") || t.includes("rank") || t.includes("độc lập tuyến tính")) {
      return {
        summary: `<strong>Hạng của ma trận (Rank)</strong>, ký hiệu rank(A) hoặc r(A), là số lượng cực đại các vector dòng (hoặc cột) độc lập tuyến tính:`,
        keypoints: [
          `<strong>Bản chất đại số:</strong> Rank phản ánh số chiều (dimension) của không gian vector sinh bởi các dòng của ma trận.`,
          `<strong>Cách tìm bằng biến đổi Gauss:</strong> Dùng 3 phép biến đổi sơ cấp trên dòng đưa ma trận A về dạng bậc thang. Khi đó: <code>rank(A) = Số dòng khác 0 của ma trận bậc thang</code>.`,
          `<strong>Tính chất giới hạn:</strong> Với ma trận A kích thước m×n, ta luôn có <code>0 ≤ rank(A) ≤ min(m, n)</code> và <code>rank(A) = rank(A^T)</code>. Ma trận A vuông cấp n có rank(A) = n khi và chỉ khi det(A) ≠ 0 (ma trận đủ hạng / không suy biến).`,
          `<strong>Ứng dụng:</strong> Xét điều kiện có nghiệm của hệ phương trình tuyến tính (Định lý Kronecker-Capelli) và xác định cơ sở không gian vector.`
        ],
        evidence: `Mục 3. 'Hạng ma trận' trên slide Chương 1.`
      };
    }

    // 11. Biến đổi sơ cấp về dạng bậc thang
    if (t.includes("bậc thang") || t.includes("dạng bậc thang") || t.includes("biến đổi sơ cấp về dạng")) {
      return {
        summary: `<strong>Thuật toán Khử Gauss biến đổi ma trận về Dạng Bậc Thang (Echelon Form):</strong>`,
        keypoints: [
          `<strong>3 phép biến đổi sơ cấp trên dòng:</strong><br>1. Đổi chỗ hai dòng: <code>d_i ↔ d_j</code><br>2. Nhân một dòng với số k ≠ 0: <code>d_i ← k·d_i</code><br>3. Cộng vào một dòng tích của dòng khác với số k: <code>d_i ← d_i + k·d_j</code>`,
          `<strong>Đặc điểm nhận diện ma trận bậc thang:</strong><br>• Tất cả các dòng toàn số 0 (nếu có) luôn bị dồn xuống dưới cùng của ma trận.<br>• Phần tử khác 0 đầu tiên của mỗi dòng (gọi là phần tử cơ sở / Pivot) luôn nằm nghiêm ngặt về phía bên phải của phần tử cơ sở ở dòng phía trên.`,
          `<strong>Bảo toàn hạng:</strong> Các phép biến đổi sơ cấp KHÔNG LÀM THAY ĐỔI hạng của ma trận, giúp tính rank(A) một cách dễ dàng và trực quan.`
        ],
        evidence: `Mục 3. 'Cách tìm: biến đổi sơ cấp về dạng bậc thang' trên slide Chương 1.`
      };
    }

    // 12. Hệ có nghiệm ⇔ rank(A) = rank(A|b) (Định lý Kronecker-Capelli)
    if (t.includes("rank(a) = rank(a|b)") || t.includes("hệ có nghiệm") || (t.includes("rank(a)") && t.includes("rank(a|b)"))) {
      return {
        summary: `<strong>Định lý Kronecker-Capelli về Điều Kiện Có Nghiệm của Hệ Phương Trình Tuyến Tính Ax = b:</strong>`,
        keypoints: [
          `<strong>Ký hiệu:</strong> A là ma trận hệ số (kích thước m×n) và <code>(A|b)</code> là ma trận mở rộng ghép thêm cột hệ số tự do b (kích thước m×(n+1)).`,
          `<strong>Điều kiện có nghiệm (Tương thích):</strong> Hệ phương trình Ax = b có nghiệm KHI VÀ CHỈ KHI hạng của ma trận hệ số bằng hạng của ma trận mở rộng: <code>rank(A) = rank(A|b)</code>.`,
          `<strong>Ý nghĩa hình học/đại số:</strong> Điều này tương đương với việc vector cột tự do b nằm trong không gian sinh bởi các vector cột của ma trận A (b là tổ hợp tuyến tính của các cột của A).`
        ],
        evidence: `Mục 4. 'Hệ phương trình tuyến tính' trên slide Chương 1.`
      };
    }

    // 13. Hệ có nghiệm duy nhất ⇔ rank = số ẩn
    if (t.includes("nghiệm duy nhất") || t.includes("rank = số ẩn") || t.includes("hệ có nghiệm duy nhất")) {
      return {
        summary: `<strong>Điều kiện để Hệ Phương Trình Tuyến Tính Ax = b có Nghiệm Duy Nhất:</strong>`,
        keypoints: [
          `<strong>Định lý:</strong> Hệ phương trình tuyến tính có nghiệm DUY NHẤT khi và chỉ khi: <code>rank(A) = rank(A|b) = n</code> (trong đó n là tổng số ẩn số của hệ).`,
          `<strong>Bản chất:</strong> Khi rank = n, hệ không có bất kỳ ẩn tự do nào (số ẩn tự do = n - rank = 0). Quá trình giải Gauss đưa về dạng tam giác xác định rõ từng giá trị x₁, x₂, ..., x_n.`,
          `<strong>Trường hợp hệ vuông (m = n):</strong> Tương đương với <code>det(A) ≠ 0</code>. Khi đó nghiệm được tính trực tiếp bằng ma trận nghịch đảo <code>x = A⁻¹·b</code> hoặc công thức nghiệm Cramer: <code>x_i = det(A_i) / det(A)</code>.`
        ],
        evidence: `Mục 4. 'Hệ có nghiệm duy nhất ⇔ rank = số ẩn' trên slide Chương 1.`
      };
    }

    // 14. Vô nghiệm ⇔ rank(A) ≠ rank(A|b)
    if (t.includes("vô nghiệm") || t.includes("rank(a) ≠ rank(a|b)") || t.includes("không có nghiệm")) {
      return {
        summary: `<strong>Điều kiện để Hệ Phương Trình Tuyến Tính Ax = b Vô Nghiệm (Không Tương Thích):</strong>`,
        keypoints: [
          `<strong>Định lý:</strong> Hệ phương trình vô nghiệm khi và chỉ khi: <code>rank(A) < rank(A|b)</code> (hạng của ma trận hệ số nhỏ hơn hạng của ma trận mở rộng).`,
          `<strong>Biểu hiện trong thuật toán Gauss:</strong> Khi đưa ma trận mở rộng (A|b) về dạng bậc thang, xuất hiện một dòng có dạng: <code>[0  0  ...  0 | c]</code> với hằng số c ≠ 0. Dòng này tương ứng với phương trình vô lý: <code>0·x₁ + 0·x₂ + ... + 0·x_n = c ≠ 0</code> (tức 0 = c).`,
          `<strong>Ý nghĩa hình học:</strong> Các siêu phẳng biểu diễn các phương trình trong hệ song song hoặc không cùng giao nhau tại bất kỳ điểm chung nào trong không gian.`
        ],
        evidence: `Mục 4. 'Vô nghiệm ⇔ rank(A) ≠ rank(A|b)' trên slide Chương 1.`
      };
    }

    // 15. Hệ phương trình tuyến tính (Tổng quan)
    if (t.includes("hệ phương trình") || t.includes("tuyến tính") || t.includes("hệ pt")) {
      return {
        summary: `<strong>Hệ phương trình đại số tuyến tính</strong> gồm m phương trình và n ẩn số, viết dưới dạng ma trận Ax = b:`,
        keypoints: [
          `<strong>Biểu diễn ma trận:</strong> A là ma trận hệ số cấp m×n, x là vector ẩn số n×1, và b là vector hệ số tự do m×1. Ma trận mở rộng là <code>(A|b)</code>.`,
          `<strong>3 trạng thái nghiệm theo Kronecker-Capelli:</strong><br>1. <em>Vô nghiệm:</em> <code>rank(A) < rank(A|b)</code><br>2. <em>Nghiệm duy nhất:</em> <code>rank(A) = rank(A|b) = n</code> (bằng số ẩn)<br>3. <em>Vô số nghiệm:</em> <code>rank(A) = rank(A|b) = r < n</code> (hệ có n - r ẩn tự do)`,
          `<strong>Các phương pháp giải chính:</strong> Phương pháp khử Gauss (Gauss-Jordan), phương pháp ma trận nghịch đảo x = A⁻¹b, và quy tắc định thức Cramer.`
        ],
        evidence: `Mục 4. 'Hệ phương trình tuyến tính' trên slide Chương 1.`
      };
    }

    // 16. Phụ thuộc tuyến tính / độc lập tuyến tính
    if (t.includes("phụ thuộc tuyến tính") || t.includes("xét phụ thuộc") || t.includes("tổ hợp tuyến tính")) {
      return {
        summary: `<strong>Khái niệm Độc lập tuyến tính & Phụ thuộc tuyến tính</strong> của hệ vector:`,
        keypoints: [
          `<strong>Định nghĩa:</strong> Hệ k vector {v₁, v₂, ..., v_k} độc lập tuyến tính nếu phương trình tổ hợp <code>c₁v₁ + c₂v₂ + ... + c_k v_k = 0</code> CHỈ CÓ NGHIỆM DUY NHẤT c₁ = c₂ = ... = c_k = 0. Nếu tồn tại ít nhất một hệ số c_i ≠ 0 thì hệ là phụ thuộc tuyến tính.`,
          `<strong>Xét bằng Ma trận:</strong> Ghép các vector thành các dòng của ma trận A rồi tìm rank(A). Nếu rank(A) = k (đúng bằng số vector) thì hệ ĐỘC LẬP tuyến tính; nếu rank(A) < k thì hệ PHỤ THUỘC tuyến tính.`,
          `<strong>Ý nghĩa:</strong> Độc lập tuyến tính đảm bảo không có thông tin dư thừa, các vector có thể làm cơ sở (Basis) sinh ra không gian vector.`
        ],
        evidence: `Mục 3. 'Ứng dụng: xét nghiệm hệ, xét phụ thuộc tuyến tính' trên slide Chương 1.`
      };
    }

    // Fallback: Dynamic Smart Context Extractor
    return {
      summary: `<strong>Phân tích chuyên sâu về khái niệm "${term}"</strong> trong Đại số Tuyến tính:`,
      keypoints: [
        `<strong>Bản chất khái niệm:</strong> "${term}" là một nội dung kiến thức trọng tâm thuộc Chương 1: Ma trận, Định thức & Hệ phương trình.`,
        `<strong>Ngữ cảnh & Mối tương quan trong bài học:</strong> Khái niệm này liên kết trực tiếp với cấu trúc bài giảng: <em>${slideContext.slice(0, 140)}...</em>`,
        `<strong>Phương pháp áp dụng:</strong> Đòi hỏi kết hợp biến đổi sơ cấp ma trận, tính toán định thức và suy luận logic về số chiều không gian nghiệm.`
      ],
      evidence: `Trích xuất từ nội dung Trang ${pageNum} (${state.pdfFileName || "Bài giảng"}).`
    };
  }

  btnCloseFeature1.addEventListener('click', () => { popoverFeature1.style.display = 'none'; });
  btnCloseFeature1Footer.addEventListener('click', () => { popoverFeature1.style.display = 'none'; });

  btnFeat1ToInstructor.addEventListener('click', () => {
    popoverFeature1.style.display = 'none';
    saveToBookmarks(
      state.selectedText || "Nội dung slide",
      `Em đã đọc phần AI giải thích tổng hợp cho '${state.selectedText}' tại Trang ${state.currentPage} nhưng muốn thầy cô giải thích thêm ví dụ thực tế.`
    );
  });

  // ----------------------------------------------------
  // TÍNH NĂNG 2: AI Tạo câu hỏi động (Khác biệt mỗi lần)
  // ----------------------------------------------------
  btnTriggerFeature2.addEventListener('click', () => {
    triggerFeature2();
  });

  btnFeat2GenerateNew.addEventListener('click', () => {
    triggerFeature2();
  });

  async function triggerFeature2() {
    floatingToolbar.style.display = 'none';
    const term = state.selectedText || "Nội dung bôi đen";
    state.questionHistoryCounter++;

    feat2SelectedTerm.textContent = `1 Câu hỏi trắc nghiệm cho phần bôi đen: "${term.length > 40 ? term.slice(0, 40) + '...' : term}"`;

    // Position modal
    const sel = window.getSelection();
    let rect = sel.rangeCount > 0 && sel.toString().trim().length > 0 
      ? sel.getRangeAt(0).getBoundingClientRect() 
      : pdfCanvas.getBoundingClientRect();
    positionPopup(popoverFeature2, rect);

    // If OpenAI key is present, generate fresh live question
    if (state.openAIKey) {
      feat2Loading.style.display = 'flex';
      feat2ContentArea.style.display = 'none';

      const systemPrompt = `Bạn là chuyên gia ra đề thi và kiểm tra kiến thức học tập. Nhiệm vụ của bạn là dựa vào slide bài giảng và đoạn văn bản được bôi đen để tạo ra ĐÚNG 1 CÂU HỎI TRẮC NGHIỆM DUY NHẤT (gồm 4 đáp án A, B, C, D) tập trung trực tiếp và sâu sắc vào đoạn bôi đen này.
Lưu ý quan trọng:
- CHỈ TẠO ĐÚNG 1 CÂU HỎI TRẮC NGHIỆM DUY NHẤT cho 1 phần bôi đen này (tuyệt đối không tạo danh sách nhiều câu hỏi).
- Phải có đúng 1 đáp án ĐÚNG và 3 đáp án SAI nhưng có tính thuyết phục (distractors).
- Trả về JSON theo cấu trúc:
{
  "question": "Nội dung 1 câu hỏi trắc nghiệm",
  "options": [
    { "id": "A", "text": "Đáp án A", "isCorrect": false, "explanation": "Giải thích vì sao sai" },
    { "id": "B", "text": "Đáp án B", "isCorrect": true, "explanation": "Giải thích vì sao đúng theo slide" },
    { "id": "C", "text": "Đáp án C", "isCorrect": false, "explanation": "Giải thích vì sao sai" },
    { "id": "D", "text": "Đáp án D", "isCorrect": false, "explanation": "Giải thích vì sao sai" }
  ],
  "overallExplanation": "Giải thích tổng quan trích xuất từ slide"
}`;

      const userPrompt = `Nội dung Slide Trang ${state.currentPage} (${state.pdfFileName}):
"${state.currentSlideFullText}"

Đoạn văn bản bôi đen:
"${term}"

Hãy tạo đúng 1 câu hỏi trắc nghiệm 4 đáp án cho đoạn bôi đen trên.`;

      const response = await callOpenAI({ systemPrompt, userPrompt, jsonMode: true });
      feat2Loading.style.display = 'none';
      feat2ContentArea.style.display = 'block';

      if (response) {
        try {
          const parsed = JSON.parse(response);
          feat2QuestionText.textContent = parsed.question;
          feat2FeedbackCard.className = 'quiz-feedback-card';
          feat2FeedbackCard.style.display = 'none';
          renderQuizOptions(parsed);
          refreshIcons();
          return;
        } catch (e) {
          console.error("Lỗi parse OpenAI Quiz JSON:", e);
        }
      }
    }

    // Local dynamic fallback
    feat2Loading.style.display = 'none';
    feat2ContentArea.style.display = 'block';
    const dynamicQuiz = generateDiverseQuiz(term, state.currentSlideFullText, state.currentPage, state.questionHistoryCounter);
    feat2QuestionText.textContent = dynamicQuiz.question;
    feat2FeedbackCard.className = 'quiz-feedback-card';
    feat2FeedbackCard.style.display = 'none';
    renderQuizOptions(dynamicQuiz);
    refreshIcons();
  }

  // Dynamic Question Generator Engine (Fallback - Accurate for Matrix Chapter)
  function generateDiverseQuiz(term, slideText, pageNum, seed) {
    const t = term.toLowerCase().trim();

    if (t.includes("định thức cấp 2") || t.includes("định thức cấp 3") || (t.includes("định thức") && (t.includes("2") || t.includes("3") || t.includes("cấp")))) {
      return {
        question: `Cho ma trận vuông A = [[2, 3], [1, 5]]. Giá trị định thức det(A) bằng bao nhiêu và ý nghĩa hình học của nó là gì?`,
        options: [
          { id: 'A', text: `det(A) = 7, biểu diễn diện tích hình bình hành tạo bởi 2 vector cột trong mặt phẳng 2D.`, isCorrect: true, explanation: `Chính xác! det(A) = (2)(5) - (3)(1) = 10 - 3 = 7. Về hình học, |det(A)| là diện tích hình bình hành tạo bởi 2 vector cột.` },
          { id: 'B', text: `det(A) = 13, biểu diễn tổng chiều dài 2 đường chéo.`, isCorrect: false, explanation: `Sai công thức tính định thức cấp 2: det = ad - bc chứ không phải ad + bc.` },
          { id: 'C', text: `det(A) = 0, ma trận bị suy biến.`, isCorrect: false, explanation: `Sai, ma trận A có 2 dòng độc lập tuyến tính nên det(A) = 7 ≠ 0.` },
          { id: 'D', text: `det(A) = -7, do các phần tử đường chéo phụ lớn hơn đường chéo chính.`, isCorrect: false, explanation: `Sai dấu, tích chéo chính là 10, chéo phụ là 3, hiệu bằng +7.` }
        ],
        overallExplanation: `Định thức cấp 2: det(A) = ad - bc.`
      };
    }

    if (t.includes("đổi chỗ 2 dòng") || t.includes("đổi dấu định thức") || (t.includes("đổi chỗ") && t.includes("dòng"))) {
      return {
        question: `Khi thực hiện đổi chỗ 2 dòng bất kỳ của một ma trận vuông A để được ma trận B, khẳng định nào sau đây là ĐÚNG?`,
        options: [
          { id: 'A', text: `det(B) = -det(A) (định thức đổi dấu).`, isCorrect: true, explanation: `Chính xác! Theo tính chất phản xứng của định thức: Đổi chỗ 2 dòng → đổi dấu định thức.` },
          { id: 'B', text: `det(B) = det(A) (giá trị định thức không thay đổi).`, isCorrect: false, explanation: `Sai, chỉ phép cộng dòng d_i ← d_i + k·d_j mới giữ nguyên định thức.` },
          { id: 'C', text: `det(B) = 0.`, isCorrect: false, explanation: `Sai, định thức chỉ đổi dấu chứ không triệt tiêu về 0.` },
          { id: 'D', text: `det(B) = 1 / det(A).`, isCorrect: false, explanation: `Sai, đó là định thức của ma trận nghịch đảo A⁻¹.` }
        ],
        overallExplanation: `Theo Mục 2 slide: 'Đổi chỗ 2 dòng → đổi dấu định thức'.`
      };
    }

    if (t.includes("nhân k") || t.includes("một dòng nhân")) {
      return {
        question: `Cho ma trận vuông A cấp 3 có det(A) = 4. Nếu nhân tất cả các phần tử của DÒNG THỨ NHẤT với 3, định thức ma trận mới bằng:`,
        options: [
          { id: 'A', text: `12 (chỉ một dòng nhân 3 nên định thức nhân 3: 4 × 3 = 12).`, isCorrect: true, explanation: `Chính xác! Theo tính chất: Một dòng nhân k → định thức nhân k.` },
          { id: 'B', text: `108 (vì 4 × 3³ = 108).`, isCorrect: false, explanation: `Sai, 108 là kết quả khi nhân TOÀN BỘ ma trận cấp 3 với 3 (det(3A) = 3³ det(A)).` },
          { id: 'C', text: `4 (không đổi giá trị).`, isCorrect: false, explanation: `Sai, nhân một dòng với k thì định thức phải nhân k.` },
          { id: 'D', text: `0.`, isCorrect: false, explanation: `Sai, k = 3 ≠ 0 nên định thức không bằng 0.` }
        ],
        overallExplanation: `Theo Mục 2 slide: 'Một dòng nhân k → định thức nhân k'.`
      };
    }

    if (t.includes("toàn 0") || t.includes("toàn số 0")) {
      return {
        summary: `Tính chất định thức khi có dòng toàn 0.`,
        question: `Nếu ma trận vuông A có ít nhất một dòng toàn số 0, khẳng định nào sau đây luôn ĐÚNG?`,
        options: [
          { id: 'A', text: `det(A) = 0 và ma trận A không khả nghịch.`, isCorrect: true, explanation: `Chính xác! Dòng toàn 0 khiến định thức bằng 0 và ma trận bị suy biến.` },
          { id: 'B', text: `det(A) = 1 và A là ma trận đơn vị.`, isCorrect: false, explanation: `Sai, ma trận đơn vị có đường chéo bằng 1, không có dòng toàn 0.` },
          { id: 'C', text: `rank(A) = số ẩn.`, isCorrect: false, explanation: `Sai, dòng toàn 0 làm giảm hạng của ma trận.` },
          { id: 'D', text: `det(A) không xác định được.`, isCorrect: false, explanation: `Sai, định thức luôn xác định và bằng đúng 0.` }
        ],
        overallExplanation: `Theo Mục 2 slide: 'Một dòng toàn 0 → định thức = 0'.`
      };
    }

    if (t.includes("hạng ma trận") || t.includes("hạng") || t.includes("rank") || t.includes("độc lập tuyến tính")) {
      return {
        question: `Hạng của ma trận (Rank) được xác định chính xác bằng phương pháp nào sau đây?`,
        options: [
          { id: 'A', text: `Biến đổi sơ cấp về dạng bậc thang, rank bằng số dòng khác 0 của ma trận bậc thang.`, isCorrect: true, explanation: `Chính xác! Rank bằng số dòng khác 0 sau khi khử Gauss về dạng bậc thang.` },
          { id: 'B', text: `Tổng tất cả các phần tử trên đường chéo chính của ma trận.`, isCorrect: false, explanation: `Sai, đó là Vết (Trace) của ma trận.` },
          { id: 'C', text: `Tích của số hàng và số cột của ma trận (m × n).`, isCorrect: false, explanation: `Sai, đó là kích thước (cấp) của ma trận.` },
          { id: 'D', text: `Số lượng phần tử có giá trị bằng 0 trong ma trận.`, isCorrect: false, explanation: `Sai, số 0 không phản ánh số dòng độc lập tuyến tính.` }
        ],
        overallExplanation: `Theo Mục 3 slide: 'Rank = số dòng (hoặc cột) độc lập tuyến tính'.`
      };
    }

    if (t.includes("bậc thang") || t.includes("dạng bậc thang")) {
      return {
        question: `Trong quá trình biến đổi Gauss đưa ma trận về dạng bậc thang, phát biểu nào sau đây là ĐÚNG?`,
        options: [
          { id: 'A', text: `Các phép biến đổi sơ cấp trên dòng không làm thay đổi hạng (rank) của ma trận.`, isCorrect: true, explanation: `Chính xác! Biến đổi sơ cấp bảo toàn không gian sinh bởi các vector dòng nên rank(A) không đổi.` },
          { id: 'B', text: `Mọi ma trận đều có thể biến đổi về ma trận đơn vị.`, isCorrect: false, explanation: `Sai, chỉ ma trận vuông không suy biến (det ≠ 0) mới đưa về ma trận đơn vị.` },
          { id: 'C', text: `Các dòng toàn số 0 phải nằm ở dòng trên cùng.`, isCorrect: false, explanation: `Sai, dòng toàn số 0 bắt buộc phải nằm ở dưới cùng trong ma trận bậc thang.` },
          { id: 'D', text: `Định thức luôn được bảo toàn nguyên vẹn qua mọi phép nhân dòng.`, isCorrect: false, explanation: `Sai, nhân dòng với k làm định thức nhân k.` }
        ],
        overallExplanation: `Mục 3: 'Biến đổi sơ cấp về dạng bậc thang'.`
      };
    }

    if (t.includes("nghiệm duy nhất") || t.includes("rank = số ẩn")) {
      return {
        question: `Cho hệ phương trình tuyến tính Ax = b gồm m phương trình và n ẩn số. Hệ có NGHIỆM DUY NHẤT khi và chỉ khi:`,
        options: [
          { id: 'A', text: `rank(A) = rank(A|b) = n (hạng bằng đúng số ẩn).`, isCorrect: true, explanation: `Chính xác! Theo định lý Kronecker-Capelli: Hệ có nghiệm duy nhất ⇔ rank = số ẩn.` },
          { id: 'B', text: `rank(A) < rank(A|b).`, isCorrect: false, explanation: `Sai, trường hợp này hệ vô nghiệm.` },
          { id: 'C', text: `rank(A) = rank(A|b) < n.`, isCorrect: false, explanation: `Sai, trường hợp này hệ có vô số nghiệm (với n - rank ẩn tự do).` },
          { id: 'D', text: `rank(A) = 0.`, isCorrect: false, explanation: `Sai, rank = 0 là ma trận toàn số 0.` }
        ],
        overallExplanation: `Theo Mục 4 slide: 'Hệ có nghiệm duy nhất ⇔ rank = số ẩn'.`
      };
    }

    if (t.includes("vô nghiệm") || t.includes("rank(a) ≠ rank(a|b)")) {
      return {
        question: `Khi giải hệ phương trình tuyến tính Ax = b bằng phương pháp Gauss, dấu hiệu nào cho biết hệ VÔ NGHIỆM?`,
        options: [
          { id: 'A', text: `rank(A) < rank(A|b) (xuất hiện dòng có dạng [0 0 ... 0 | c] với c ≠ 0 trong ma trận mở rộng).`, isCorrect: true, explanation: `Chính xác! Phương trình 0 = c (với c ≠ 0) là mâu thuẫn, dẫn đến hệ vô nghiệm.` },
          { id: 'B', text: `rank(A) = rank(A|b) = n.`, isCorrect: false, explanation: `Sai, đây là điều kiện để hệ có nghiệm duy nhất.` },
          { id: 'C', text: `Ma trận A có định thức det(A) ≠ 0.`, isCorrect: false, explanation: `Sai, khi det(A) ≠ 0 thì hệ vuông chắc chắn có nghiệm duy nhất.` },
          { id: 'D', text: `Số phương trình m lớn hơn số ẩn n.`, isCorrect: false, explanation: `Sai, số phương trình nhiều hơn vẫn có thể có nghiệm nếu các phương trình phụ thuộc tuyến tính.` }
        ],
        overallExplanation: `Theo Mục 4 slide: 'Vô nghiệm ⇔ rank(A) ≠ rank(A|b)'.`
      };
    }

    if (t.includes("hệ có nghiệm") || (t.includes("rank(a)") && t.includes("rank(a|b)"))) {
      return {
        question: `Theo Định lý Kronecker-Capelli, điều kiện cần và đủ để hệ phương trình Ax = b CÓ NGHIỆM là gì?`,
        options: [
          { id: 'A', text: `rank(A) = rank(A|b).`, isCorrect: true, explanation: `Chính xác! Hệ có nghiệm ⇔ rank(A) = rank(A|b).` },
          { id: 'B', text: `rank(A) > rank(A|b).`, isCorrect: false, explanation: `Sai, rank(A) luôn luôn ≤ rank(A|b).` },
          { id: 'C', text: `det(A) = 0.`, isCorrect: false, explanation: `Sai, det(A) = 0 không đảm bảo hệ có nghiệm hay vô nghiệm.` },
          { id: 'D', text: `Số ẩn bằng số phương trình.`, isCorrect: false, explanation: `Sai, số ẩn bằng số phương trình vẫn có thể vô nghiệm.` }
        ],
        overallExplanation: `Mục 4: 'Hệ có nghiệm ⇔ rank(A) = rank(A|b)'.`
      };
    }

    if (t.includes("chuyển vị") || t.includes("a^t")) {
      return {
        question: `Cho hai ma trận A và B khả tích (nhân được với nhau). Tính chất nào sau đây của ma trận chuyển vị là ĐÚNG?`,
        options: [
          { id: 'A', text: `(A · B)^T = B^T · A^T (đảo ngược thứ tự nhân).`, isCorrect: true, explanation: `Chính xác! Phép chuyển vị của một tích bằng tích các ma trận chuyển vị theo thứ tự đảo ngược.` },
          { id: 'B', text: `(A · B)^T = A^T · B^T.`, isCorrect: false, explanation: `Sai, đây là lỗi sai phổ biến nhất do không đảo thứ tự nhân.` },
          { id: 'C', text: `(A^T)^T = -A.`, isCorrect: false, explanation: `Sai, chuyển vị 2 lần trở về ma trận gốc: (A^T)^T = A.` },
          { id: 'D', text: `Chỉ ma trận vuông mới có ma trận chuyển vị.`, isCorrect: false, explanation: `Sai, ma trận kích thước m×n bất kỳ đều có ma trận chuyển vị n×m.` }
        ],
        overallExplanation: `Mục 1: 'Ma trận chuyển vị A^T'.`
      };
    }

    // Default concept quiz template
    return {
      question: `Theo nội dung bài giảng Chương 1, nhận định nào sau đây là CHÍNH XÁC NHẤT về "${term}"?`,
      options: [
        { id: 'A', text: `Là một khái niệm trọng tâm thể hiện mối quan hệ logic và điều kiện đại số trong slide Chương 1.`, isCorrect: true, explanation: `Chính xác theo nội dung và cấu trúc bài giảng Chương 1.` },
        { id: 'B', text: `Khái niệm này hoàn toàn không thể áp dụng trong tính toán ma trận và hệ phương trình.`, isCorrect: false, explanation: `Sai, đây là công cụ cốt lõi trong giải hệ phương trình và không gian vector.` },
        { id: 'C', text: `Luôn có giá trị bằng 0 trong mọi trường hợp.`, isCorrect: false, explanation: `Sai, giá trị phụ thuộc vào các phần tử của ma trận.` },
        { id: 'D', text: `Chỉ có ý nghĩa trang trí trên slide bài giảng.`, isCorrect: false, explanation: `Sai, đây là kiến thức nền tảng trong kỳ thi.` }
      ],
      overallExplanation: `Nội dung Chương 1: Ma Trận - Định Thức - Hệ Phương Trình.`
    };
  }

  function renderQuizOptions(quizData) {
    feat2OptionsList.innerHTML = '';
    quizData.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="opt-badge">${opt.id}</span>
        <span>${opt.text}</span>
      `;

      btn.addEventListener('click', () => {
        handleQuizOptionSelect(btn, opt, quizData);
      });

      feat2OptionsList.appendChild(btn);
    });
  }

  function handleQuizOptionSelect(selectedBtn, selectedOpt, quizData) {
    const allBtns = feat2OptionsList.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selectedOpt.isCorrect) {
      selectedBtn.classList.add('correct');
      feat2FeedbackCard.className = 'quiz-feedback-card correct';
      feat2FeedbackTitle.innerHTML = `<strong>🎉 Chính xác! (Đáp án ${selectedOpt.id})</strong>`;
      feat2FeedbackDetail.innerHTML = `<em>Giải thích:</em> ${selectedOpt.explanation || quizData.overallExplanation}`;
    } else {
      selectedBtn.classList.add('incorrect');
      feat2FeedbackCard.className = 'quiz-feedback-card incorrect';
      feat2FeedbackTitle.innerHTML = `<strong>❌ Chưa chính xác.</strong>`;
      feat2FeedbackDetail.innerHTML = `<em>Giải thích:</em> ${selectedOpt.explanation || quizData.overallExplanation}`;

      // Highlight the correct answer
      quizData.options.forEach((opt, idx) => {
        if (opt.isCorrect) {
          allBtns[idx].classList.add('correct');
        }
      });
    }

    feat2FeedbackCard.style.display = 'block';

    // Auto-save answered question to Quiz History Storage (Tab 3)
    saveAnsweredQuiz(quizData, selectedOpt);

    refreshIcons();
  }

  // ----------------------------------------------------
  // ANSWERED QUIZ STORAGE & REVIEW ENGINE (TAB 3)
  // ----------------------------------------------------
  function setupQuizHistoryListeners() {
    if (tabBtnHistory) {
      tabBtnHistory.addEventListener('click', () => switchSidebarTab('history'));
    }

    if (btnFilterAll) {
      btnFilterAll.addEventListener('click', () => setQuizHistoryFilter('all'));
    }
    if (btnFilterCorrect) {
      btnFilterCorrect.addEventListener('click', () => setQuizHistoryFilter('correct'));
    }
    if (btnFilterIncorrect) {
      btnFilterIncorrect.addEventListener('click', () => setQuizHistoryFilter('incorrect'));
    }

    if (btnClearHistory) {
      btnClearHistory.addEventListener('click', () => {
        if (state.quizHistory.length === 0) return;
        if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ ${state.quizHistory.length} câu hỏi đã lưu trong lịch sử?`)) {
          state.quizHistory = [];
          localStorage.removeItem('saved_quiz_history');
          renderQuizHistory();
          showToastNotification("Đã xóa lịch sử câu hỏi", "Toàn bộ câu hỏi trắc nghiệm đã trả lời đã được dọn sạch.");
        }
      });
    }
  }

  function setQuizHistoryFilter(filter) {
    state.quizHistoryFilter = filter;
    [btnFilterAll, btnFilterCorrect, btnFilterIncorrect].forEach(b => {
      if (b) b.classList.toggle('active', b.getAttribute('data-filter') === filter);
    });
    renderQuizHistory();
  }

  function saveAnsweredQuiz(quizData, selectedOpt) {
    if (!quizData || !selectedOpt) return;

    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const correctOpt = quizData.options.find(o => o.isCorrect) || { id: "?", text: "N/A" };

    const historyItem = {
      id: `qh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      question: quizData.question,
      term: state.selectedText || "Đoạn bôi đen",
      page: state.currentPage,
      fileName: state.pdfFileName || "Slide",
      options: quizData.options,
      selectedOption: { id: selectedOpt.id, text: selectedOpt.text },
      correctOption: { id: correctOpt.id, text: correctOpt.text },
      isCorrect: selectedOpt.isCorrect,
      explanation: selectedOpt.explanation || quizData.overallExplanation || "",
      timestamp: timeNow
    };

    // Add to beginning of array
    state.quizHistory.unshift(historyItem);
    try {
      localStorage.setItem('saved_quiz_history', JSON.stringify(state.quizHistory));
    } catch (e) {
      console.warn("Storage write error:", e);
    }

    renderQuizHistory();

    // Show visual confirmation toast
    showToastNotification(
      selectedOpt.isCorrect ? "Đã lưu câu trả lời đúng ✅" : "Đã lưu câu trả lời vào Lịch sử 📝",
      `"${quizData.question.slice(0, 45)}..." (Trang ${state.currentPage})`
    );
  }

  function renderQuizHistory() {
    const total = state.quizHistory.length;
    const correctCount = state.quizHistory.filter(q => q.isCorrect).length;
    const incorrectCount = total - correctCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    if (historyCountBadge) historyCountBadge.textContent = total;
    if (statTotalAnswered) statTotalAnswered.textContent = total;
    if (statCorrectCount) statCorrectCount.textContent = correctCount;
    if (statIncorrectCount) statIncorrectCount.textContent = incorrectCount;
    if (statAccuracyPercent) statAccuracyPercent.textContent = `${accuracy}%`;

    if (!quizHistoryList) return;
    quizHistoryList.innerHTML = '';

    if (total === 0) {
      quizHistoryList.innerHTML = `
        <div class="empty-history-box">
          <i data-lucide="help-circle" style="width: 32px; height: 32px; opacity: 0.4; color: #10b981;"></i>
          <p>Chưa có câu hỏi trắc nghiệm nào được trả lời.</p>
          <span style="font-size: 11px; color: var(--text-muted);">Bôi đen văn bản trên slide và chọn <strong>"Tạo câu hỏi"</strong> để luyện tập và lưu kết quả tại đây.</span>
        </div>
      `;
      refreshIcons();
      return;
    }

    // Filter
    let displayedList = state.quizHistory;
    if (state.quizHistoryFilter === 'correct') {
      displayedList = state.quizHistory.filter(q => q.isCorrect);
    } else if (state.quizHistoryFilter === 'incorrect') {
      displayedList = state.quizHistory.filter(q => !q.isCorrect);
    }

    if (displayedList.length === 0) {
      quizHistoryList.innerHTML = `
        <div class="empty-history-box">
          <p>Không có câu hỏi nào thuộc bộ lọc này.</p>
        </div>
      `;
      refreshIcons();
      return;
    }

    displayedList.forEach(item => {
      const card = document.createElement('div');
      card.className = `quiz-history-card ${item.isCorrect ? 'card-correct' : 'card-incorrect'}`;
      card.innerHTML = `
        <div class="quiz-hist-top">
          <span class="quiz-hist-badge ${item.isCorrect ? 'badge-correct' : 'badge-incorrect'}">
            ${item.isCorrect ? '✅ Chính xác' : '❌ Chưa chính xác'}
          </span>
          <span class="quiz-hist-time">Trang ${item.page} &bull; ${item.timestamp}</span>
        </div>

        <div class="quiz-hist-question">${item.question}</div>

        <div class="quiz-hist-answers-box">
          <div class="quiz-hist-choice-row" style="color: ${item.isCorrect ? '#34d399' : '#f87171'}; font-weight: 600;">
            <span>Bạn chọn:</span>
            <span><strong>${item.selectedOption.id}.</strong> ${item.selectedOption.text}</span>
          </div>
          ${!item.isCorrect ? `
            <div class="quiz-hist-choice-row" style="color: #34d399; font-weight: 600;">
              <span>Đáp án đúng:</span>
              <span><strong>${item.correctOption.id}.</strong> ${item.correctOption.text}</span>
            </div>
          ` : ''}
        </div>

        ${item.explanation ? `
          <div class="quiz-hist-explanation-box">
            ${item.explanation}
          </div>
        ` : ''}

        <div class="quiz-hist-actions">
          <button class="btn-hist-retry" data-retry-id="${item.id}" title="Làm lại câu hỏi này">
            <i data-lucide="refresh-cw" style="width: 12px; height: 12px;"></i>
            <span>Thử lại</span>
          </button>
          <div style="display: flex; gap: 6px;">
            <button class="btn-action-send-gv" data-gv-id="${item.id}" style="padding: 4px 8px; font-size: 11px;" title="Lưu thắc mắc về câu này để gửi giảng viên">
              <i data-lucide="bookmark-plus" style="width: 12px; height: 12px;"></i>
              <span>Gửi GV</span>
            </button>
            <button class="btn-hist-delete" data-delete-id="${item.id}" title="Xóa câu này khỏi lịch sử">
              <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
            </button>
          </div>
        </div>
      `;

      // Event: Retry
      card.querySelector('[data-retry-id]').addEventListener('click', () => {
        retryQuizQuestion(item);
      });

      // Event: Gửi GV
      card.querySelector('[data-gv-id]').addEventListener('click', () => {
        saveToBookmarks(
          item.term || "Câu hỏi trắc nghiệm",
          `Em muốn hỏi thêm về câu trắc nghiệm tại Trang ${item.page}: "${item.question}". Em đã chọn [${item.selectedOption.id}] (${item.isCorrect ? "Đúng" : "Sai"}), xin thầy cô giải thích thêm.`
        );
      });

      // Event: Delete
      card.querySelector('[data-delete-id]').addEventListener('click', () => {
        deleteQuizHistoryItem(item.id);
      });

      quizHistoryList.appendChild(card);
    });

    refreshIcons();
  }

  function deleteQuizHistoryItem(id) {
    state.quizHistory = state.quizHistory.filter(q => q.id !== id);
    try {
      localStorage.setItem('saved_quiz_history', JSON.stringify(state.quizHistory));
    } catch (e) {}
    renderQuizHistory();
  }

  function retryQuizQuestion(historyItem) {
    if (!historyItem) return;
    state.selectedText = historyItem.term;
    feat2SelectedTerm.textContent = `Làm lại câu hỏi (Trang ${historyItem.page}): "${(historyItem.term || "").slice(0, 35)}"`;

    const rect = pdfCanvas.getBoundingClientRect();
    positionPopup(popoverFeature2, rect);

    feat2Loading.style.display = 'none';
    feat2ContentArea.style.display = 'block';
    feat2QuestionText.textContent = historyItem.question;
    feat2FeedbackCard.className = 'quiz-feedback-card';
    feat2FeedbackCard.style.display = 'none';

    renderQuizOptions({
      question: historyItem.question,
      options: historyItem.options,
      overallExplanation: historyItem.explanation
    });

    refreshIcons();
  }

  btnCloseFeature2.addEventListener('click', () => { popoverFeature2.style.display = 'none'; });
  btnCloseFeature2Footer.addEventListener('click', () => { popoverFeature2.style.display = 'none'; });

  btnFeat2ToInstructor.addEventListener('click', () => {
    popoverFeature2.style.display = 'none';
    saveToBookmarks(
      state.selectedText || "Câu hỏi trắc nghiệm",
      `Em đã làm câu hỏi trắc nghiệm của AI về '${state.selectedText}' tại Trang ${state.currentPage} nhưng cần giảng viên hướng dẫn rõ hơn về phương pháp tư duy.`
    );
  });

  // ----------------------------------------------------
  // TÍNH NĂNG 3: Tổng hợp gửi Giảng viên & Toast Thông báo
  // ----------------------------------------------------
  btnTriggerFeature3.addEventListener('click', () => {
    floatingToolbar.style.display = 'none';
    saveToBookmarks(state.selectedText || "Nội dung bôi đen");
  });

  function saveToBookmarks(term, customNote = "") {
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    const newBookmark = {
      id: `bm-${Date.now()}`,
      term: term,
      page: state.currentPage,
      fileName: state.pdfFileName,
      timestamp: timeNow,
      contextSnippet: `Trích từ Trang ${state.currentPage} (${state.pdfFileName}): "${term}..."`,
      userNote: customNote || `Thầy/Cô vui lòng giải đáp giúp em về phần '${term}' tại Trang ${state.currentPage} của bài giảng.`
    };

    state.bookmarks.push(newBookmark);
    updateBookmarkBadge(true);
    showToastNotification(term, state.currentPage);
  }

  function showToastNotification(param1, param2, type = 'info') {
    if (!toastContainer) return;

    // STRICT RULE: Tối đa 3 thông báo cùng một lúc
    const MAX_TOASTS = 3;
    while (toastContainer.children.length >= MAX_TOASTS) {
      const oldestToast = toastContainer.firstElementChild;
      if (oldestToast) {
        oldestToast.remove();
      } else {
        break;
      }
    }

    let title = "";
    let message = "";
    let icon = "sparkles";
    let borderColor = "rgba(99, 102, 241, 0.4)";
    let iconColor = "#818cf8";

    if (typeof param2 === 'number') {
      // Called from saveToBookmarks(term, pageNum)
      title = "Đã lưu vào danh sách thắc mắc";
      message = `Đã ghi nhận <strong>"${param1}"</strong> tại Trang ${param2}. Cuối giờ bạn có thể xem lại trước khi gửi.`;
      icon = "bookmark-check";
      borderColor = "rgba(16, 185, 129, 0.5)";
      iconColor = "#10b981";
    } else {
      // Called with (title, message)
      title = String(param1 || "Thông báo");
      message = String(param2 || "");
      const titleLower = title.toLowerCase();
      if (titleLower.includes("lỗi") || titleLower.includes("thất bại") || titleLower.includes("cảnh báo")) {
        icon = "alert-circle";
        borderColor = "rgba(239, 68, 68, 0.5)";
        iconColor = "#ef4444";
      } else if (titleLower.includes("thành công") || titleLower.includes("đã lưu") || titleLower.includes("đã gửi")) {
        icon = "check-circle-2";
        borderColor = "rgba(16, 185, 129, 0.5)";
        iconColor = "#10b981";
      } else if (titleLower.includes("gom")) {
        icon = "layers";
        borderColor = "rgba(192, 132, 252, 0.5)";
        iconColor = "#c084fc";
      }
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.borderColor = borderColor;
    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="${icon}" style="width: 20px; height: 20px; color: ${iconColor};"></i>
      </div>
      <div class="toast-content" style="flex: 1;">
        <h4 style="color: ${iconColor};">${title}</h4>
        <p>${message}</p>
      </div>
      <button class="btn-toast-close" style="background: transparent; border: none; color: rgba(255,255,255,0.4); cursor: pointer; padding: 2px; margin-left: 4px; display: flex; align-items: center;" title="Đóng">
        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('.btn-toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
      });
    }

    toastContainer.appendChild(toast);
    refreshIcons();

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
      }
    }, 4500);
  }

  function updateBookmarkBadge(animate = false) {
    const count = state.bookmarks.length;
    bookmarkCountBadge.textContent = count;
    submitCountBadge.textContent = count;

    if (animate) {
      bookmarkCountBadge.classList.remove('badge-bounce');
      void bookmarkCountBadge.offsetWidth;
      bookmarkCountBadge.classList.add('badge-bounce');
    }
  }

  // ----------------------------------------------------
  // End of Session Review Modal (Batch Review & Submit)
  // ----------------------------------------------------
  btnOpenBookmarks.addEventListener('click', openEndSessionModal);
  btnEndSession.addEventListener('click', openEndSessionModal);

  function openEndSessionModal() {
    renderBookmarksReviewList();
    endSessionModal.style.display = 'flex';
    refreshIcons();
  }

  function renderBookmarksReviewList() {
    bookmarksReviewList.innerHTML = '';
    
    if (state.bookmarks.length === 0) {
      bookmarksReviewList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;"></i>
          <p style="font-size: 14px;">Bạn chưa đánh dấu thắc mắc nào trong buổi học này.</p>
          <p style="font-size: 12px; margin-top: 4px;">Hãy dùng chuột bôi đen từ khóa khó hiểu trên Slide PDF và chọn <strong>"Gửi giảng viên"</strong> để lưu nháp.</p>
        </div>
      `;
      btnConfirmSendToInstructor.disabled = true;
      btnConfirmSendToInstructor.style.opacity = '0.5';
      return;
    }

    btnConfirmSendToInstructor.disabled = false;
    btnConfirmSendToInstructor.style.opacity = '1';

    state.bookmarks.forEach((bm) => {
      const card = document.createElement('div');
      card.className = 'bookmark-card';
      card.innerHTML = `
        <div class="bookmark-card-top">
          <span class="bookmark-term-tag">${bm.term}</span>
          <span class="bookmark-meta-time">Trang ${bm.page} &bull; ${bm.timestamp}</span>
        </div>

        <div class="bookmark-quote-box">
          "${bm.contextSnippet}"
        </div>

        <div class="bookmark-edit-group">
          <label>Nội dung câu hỏi gửi Giảng viên (Bạn có thể gõ sửa trực tiếp):</label>
          <textarea class="bookmark-textarea" data-id="${bm.id}">${bm.userNote}</textarea>
        </div>

        <div class="bookmark-card-actions">
          <button class="btn-card-delete" data-delete-id="${bm.id}">
            <i data-lucide="trash-2" style="width: 12px; height: 12px; display: inline;"></i> Đã hiểu / Xóa câu này
          </button>
        </div>
      `;

      const textarea = card.querySelector('.bookmark-textarea');
      textarea.addEventListener('input', (e) => {
        bm.userNote = e.target.value;
      });

      const deleteBtn = card.querySelector('[data-delete-id]');
      deleteBtn.addEventListener('click', () => {
        state.bookmarks = state.bookmarks.filter(b => b.id !== bm.id);
        updateBookmarkBadge();
        renderBookmarksReviewList();
      });

      bookmarksReviewList.appendChild(card);
    });

    submitCountBadge.textContent = state.bookmarks.length;
  }

  btnCloseSessionModal.addEventListener('click', () => { endSessionModal.style.display = 'none'; });
  btnCloseSessionModalFooter.addEventListener('click', () => { endSessionModal.style.display = 'none'; });

  btnConfirmSendToInstructor.addEventListener('click', () => {
    if (state.bookmarks.length === 0) return;
    const count = state.bookmarks.length;

    const isConfirmed = confirm(`Bạn có chắc chắn muốn gửi bản tổng hợp gồm ${count} câu hỏi thắc mắc đến Giảng viên không?`);
    if (isConfirmed) {
      endSessionModal.style.display = 'none';
      state.bookmarks = [];
      updateBookmarkBadge();

      showToastNotification(
        `Đã gửi thành công ${count} câu hỏi!`,
        "Bản tổng hợp kèm số trang slide PDF và ngữ cảnh đã được chuyển tới Giảng viên."
      );
    }
  });

  // Keyboard Shortcuts (Esc to close all modals)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideAllPopups();
      endSessionModal.style.display = 'none';
      apiKeyModal.style.display = 'none';
    } else if (e.key === 'ArrowRight') {
      if (state.currentPage < state.totalPages) renderPDFPage(state.currentPage + 1);
    } else if (e.key === 'ArrowLeft') {
      if (state.currentPage > 1) renderPDFPage(state.currentPage - 1);
    }
  });

  // Launch App
  init();
});
