// Main Application Controller for PDF/PPT E-Learning & OpenAI Assistant

// Setup PDF.js worker
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const SAMPLE_SLIDES = [
  {
    page: 1,
    title: "CHƯƠNG 4: LÝ THUYẾT CUNG - CẦU & ĐỘ CO GIÃN",
    subtitle: "1. Khái niệm Thị trường & Quy luật Cầu",
    points: [
      "Thị trường là tập hợp các cơ chế giúp người mua và người bán tương tác để trao đổi hàng hóa dịch vụ.",
      "Quy luật Cầu: Khi giá bán của hàng hóa tăng lên (các yếu tố khác giữ nguyên), lượng cầu về hàng hóa đó sẽ giảm.",
      "Đường cầu (D) dốc xuống từ trái sang phải phản ánh mối quan hệ nghịch biến giữa Giá cả (P) và Lượng cầu (Q)."
    ]
  },
  {
    page: 2,
    title: "CHƯƠNG 4: LÝ THUYẾT CUNG - CẦU & ĐỘ CO GIÃN",
    subtitle: "2. Khái niệm Độ co giãn của Cầu theo Giá (PED)",
    points: [
      "Độ co giãn của cầu theo giá (Ed) đo lường mức độ nhạy cảm của lượng cầu khi giá bán sản phẩm biến động.",
      "Công thức: Ed = (% Thay đổi Lượng cầu) / (% Thay đổi Giá bán) = (ΔQ / Q) / (ΔP / P).",
      "Do quy luật cầu nên Ed luôn mang giá trị âm, trong phân tích thực tiễn ta xét giá trị tuyệt đối |Ed|."
    ]
  },
  {
    page: 3,
    title: "CHƯƠNG 4: LÝ THUYẾT CUNG - CẦU & ĐỘ CO GIÃN",
    subtitle: "3. Phân loại các Mức độ Co giãn của Cầu",
    points: [
      "|Ed| > 1: Cầu co giãn nhiều (Elastic Demand) - Giá đổi ít làm lượng cầu đổi nhiều (hàng xa xỉ, nhiều hàng thay thế).",
      "|Ed| < 1: Cầu co giãn ít (Inelastic Demand) - Hàng thiết yếu như thuốc men lương thực, người mua ít nhạy cảm với giá.",
      "|Ed| = 1: Cầu co giãn đơn vị (Unitary Elasticity).",
      "|Ed| = 0: Cầu hoàn toàn không co giãn (Perfectly Inelastic) - Đường cầu thẳng đứng."
    ]
  },
  {
    page: 4,
    title: "CHƯƠNG 4: LÝ THUYẾT CUNG - CẦU & ĐỘ CO GIÃN",
    subtitle: "4. Trường hợp Đặc biệt: Cầu co giãn hoàn toàn (Perfectly Elastic)",
    points: [
      "Cầu co giãn hoàn toàn (|Ed| = ∞): Người tiêu dùng chỉ sẵn sàng mua tại một mức giá thị trường duy nhất P0.",
      "Chỉ cần tăng giá nhẹ lên trên P0 -> Lượng cầu lập tức giảm về bằng 0!",
      "Biểu diễn hình học: Đường cầu D là một ĐƯỜNG THẲNG NẰM NGANG song song với trục hoành (trục sản lượng Q).",
      "Ứng dụng: Doanh nghiệp trong thị trường cạnh tranh hoàn hảo (như nông sản, lúa mì tiêu chuẩn) là người chấp nhận giá."
    ]
  },
  {
    page: 5,
    title: "CHƯƠNG 4: LÝ THUYẾT CUNG - CẦU & ĐỘ CO GIÃN",
    subtitle: "5. Mối quan hệ giữa Độ co giãn và Tổng Doanh Thu (TR)",
    points: [
      "Tổng doanh thu của doanh nghiệp được tính bằng: TR = P × Q (Giá bán nhân Sản lượng tiêu thụ).",
      "Khi Cầu co giãn nhiều (|Ed| > 1): Chiến lược GIẢM GIÁ sẽ giúp TĂNG TỔNG DOANH THU.",
      "Khi Cầu co giãn ít (|Ed| < 1): Chiến lược TĂNG GIÁ sẽ giúp TĂNG TỔNG DOANH THU.",
      "Khi Cầu co giãn hoàn toàn (|Ed| = ∞): Nâng giá bán sẽ khiến toàn bộ khách hàng rời bỏ và doanh thu về 0."
    ]
  }
];

// Rich Sample PowerPoint Presentation Slides (Data Structures & Algorithms for AI)
const SAMPLE_PPT_SLIDES = [
  {
    page: 1,
    title: "CẤU TRÚC DỮ LIỆU & GIẢI THUẬT CHO AI",
    subtitle: "1. Tổng quan về Cấu trúc Dữ liệu & Đánh giá Độ phức tạp (Big-O)",
    points: [
      "Cấu trúc dữ liệu là cách tổ chức, quản lý và lưu trữ dữ liệu nhằm cho phép truy cập và chỉnh sửa hiệu quả.",
      "Độ phức tạp thời gian O(1), O(log n), O(n), O(n log n), O(n²): Đánh giá tốc độ tăng trưởng của số phép toán khi dữ liệu đầu vào N mở rộng.",
      "Trong AI & Deep Learning: Cấu trúc ma trận đa chiều (Tensors) và tính toán song song GPU là nền tảng cốt lõi."
    ]
  },
  {
    page: 2,
    title: "CẤU TRÚC DỮ LIỆU & GIẢI THUẬT CHO AI",
    subtitle: "2. Hash Table & Cơ chế Xử lý Xung đột",
    points: [
      "Hash Table ánh xạ các khóa (Keys) vào các chỉ số mảng bằng hàm băm (Hash Function) cho tốc độ tìm kiếm trung bình O(1).",
      "Kỹ thuật giải quyết va chạm: Separate Chaining (sử dụng danh sách liên kết) và Open Addressing (Linear Probing, Double Hashing).",
      "Ứng dụng trong LLM: Tra cứu Tokenizer Vocabulary (BPE/WordPiece) và lưu trữ Embedding Cache."
    ]
  },
  {
    page: 3,
    title: "CẤU TRÚC DỮ LIỆU & GIẢI THUẬT CHO AI",
    subtitle: "3. Cây Nhị Phân Tìm Kiếm (BST) & Cây Cân Bằng AVL / Red-Black",
    points: [
      "Cây Nhị Phân Tìm Kiếm (BST) duy trì tính chất: mọi nút con bên trái nhỏ hơn nút gốc, mọi nút con bên phải lớn hơn nút gốc.",
      "Hiện tượng suy biến thành danh sách liên kết: Độ phức tạp xấu nhất thành O(n) nếu không có cơ chế tự cân bằng cây.",
      "Cây AVL và Red-Black Tree duy trì độ cao h = O(log n) thông qua các phép quay cây (Rotations), bảo đảm truy vấn tối ưu."
    ]
  },
  {
    page: 4,
    title: "CẤU TRÚC DỮ LIỆU & GIẢI THUẬT CHO AI",
    subtitle: "4. Giải thuật Đồ thị (Graph): Duyệt BFS, DFS & Thuật toán Dijkstra",
    points: [
      "Đồ thị G = (V, E) mô hình hóa mạng lưới quan hệ phức tạp như Knowledge Graph, mạng nơ-ron và bản đồ giao thông.",
      "Duyệt BFS (theo chiều rộng - dùng Queue) tìm đường đi ngắn nhất không trọng số; DFS (theo chiều sâu - dùng Stack/Đệ quy) khám phá toàn bộ không gian trạng thái.",
      "Thuật toán Dijkstra (sử dụng Min-Heap / Priority Queue) tìm đường đi ngắn nhất có trọng số không âm với độ phức tạp O((V + E) log V)."
    ]
  },
  {
    page: 5,
    title: "CẤU TRÚC DỮ LIỆU & GIẢI THUẬT CHO AI",
    subtitle: "5. Vector Database & Thuật toán Tìm kiếm Tương tự (ANN / HNSW)",
    points: [
      "Vector Database lưu trữ các vector nhúng (Embeddings) nhiều chiều từ mô hình ngôn ngữ lớn (OpenAI Text-Embedding, BERT).",
      "Thuật toán HNSW (Hierarchical Navigable Small World) cho phép tìm kiếm K láng giềng gần nhất (Approximate Nearest Neighbors) với thời gian O(log N).",
      "Ứng dụng thực tế: Xây dựng hệ thống RAG (Retrieval-Augmented Generation), Semantic Search và Recommendation Engines."
    ]
  }
];

// Rich Sample Diagram & Image Presentation Slides (AI Architecture & Deep Learning OCR)
const SAMPLE_IMAGE_SLIDES = [
  {
    page: 1,
    title: "KIẾN TRÚC MÔ HÌNH TRANSFORMER & LARGE LANGUAGE MODEL (LLM)",
    subtitle: "1. Cơ chế Self-Attention & Luồng Xử lý Dữ liệu Đa tầng",
    diagramType: "transformer",
    points: [
      "Input Embeddings kết hợp Positional Encoding bảo toàn ngữ cảnh và vị trí tương đối của từng từ trong câu.",
      "Multi-Head Attention tính toán phân phối Attention(Q, K, V) = softmax(QK^T / √d_k)V đồng thời trên nhiều không gian biểu diễn.",
      "Feed Forward Network (FFN) kết hợp Layer Normalization và Residual Connections giúp mô hình hội tụ sâu.",
      "Cơ chế Masked Multi-Head Attention trong Decoder ngăn mô hình nhìn trước các token tương lai khi sinh văn bản."
    ]
  },
  {
    page: 2,
    title: "MẠNG NƠ-RON TÍCH CHẬP: CONVOLUTIONAL NEURAL NETWORK (CNN)",
    subtitle: "2. Trích xuất Đặc trưng Hình ảnh (Feature Maps) & Thị giác Máy tính",
    diagramType: "cnn",
    points: [
      "Convolution Layer áp dụng ma trận tích chập (Filter/Kernel) quét qua ảnh để phát hiện cạnh, góc và kết cấu không gian.",
      "ReLU Activation Function loại bỏ giá trị âm, kích hoạt tính phi tuyến tính giúp mạng học các mẫu phức tạp.",
      "Max Pooling Layer thu nhỏ kích thước không gian (Downsampling), giảm số lượng tham số và tăng tính bất biến với dịch chuyển.",
      "Fully Connected Layer tổng hợp các đặc trưng trừu tượng để dự đoán xác suất phân loại đối tượng."
    ]
  },
  {
    page: 3,
    title: "QUY TRÌNH HỌC TĂNG CƯỜNG TỪ PHẢN HỒI CON NGƯỜI (RLHF)",
    subtitle: "3. Căn chỉnh An toàn & Nâng cao Chất lượng Trả lời của LLM (Alignment)",
    diagramType: "rlhf",
    points: [
      "Giai đoạn 1: Supervised Fine-Tuning (SFT) huấn luyện mô hình nền tảng trên tập dữ liệu hướng dẫn chất lượng cao.",
      "Giai đoạn 2: Reward Modeling (RM) huấn luyện mô hình chấm điểm đánh giá câu trả lời theo tiêu chuẩn con người.",
      "Giai đoạn 3: Proximal Policy Optimization (PPO) tối ưu hóa chính sách sinh văn bản tối đa hóa điểm thưởng Reward.",
      "Cơ chế KL-Divergence Penalty kiểm soát mô hình không bị trôi quá xa so với phân phối ban đầu."
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    pdfDoc: null,
    currentPage: 1,
    totalPages: 5,
    currentScale: 1.25,
    isSamplePDF: true,
    fileType: 'pdf', // 'pdf' | 'pptx' | 'image'
    pdfFileName: "Kinh-te-Vi-mo-Chuong-4.pdf",
    currentSlidesData: null,
    currentSlideFullText: "",
    selectedText: "",
    selectedContext: "",
    bookmarks: [],
    questionHistoryCounter: 0,
    openAIKey: localStorage.getItem('user_openai_api_key') || '',
    openAIModel: localStorage.getItem('user_openai_model') || 'gpt-4o-mini',
    isOcrRunning: false
  };

  // DOM Elements
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

  // OCR & Vision AI Toolbar Buttons
  const btnRunOCR = document.getElementById('btnRunOCR');
  const btnVisionAI = document.getElementById('btnVisionAI');

  // Floating Action Toolbar
  const floatingToolbar = document.getElementById('floatingToolbar');
  const btnTriggerFeature1 = document.getElementById('btnTriggerFeature1');
  const btnTriggerFeature2 = document.getElementById('btnTriggerFeature2');
  const btnTriggerFeature3 = document.getElementById('btnTriggerFeature3');

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
    showEmptyState();
    updateBookmarkBadge();
    setupApiKeyListeners();
    setupEmptyStateListeners();
    setupToolActionListeners();
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

    // Empty state sample PDF button
    btnSamplePDFEmpty.addEventListener('click', () => {
      state.currentPage = 4;
      loadDefaultEconomicsPDF();
    });

    // Empty state sample PPT button
    if (btnSamplePPTEmpty) {
      btnSamplePPTEmpty.addEventListener('click', () => {
        state.currentPage = 1;
        loadDefaultPPTSlides();
      });
    }

    // Empty state sample Image button
    if (btnSampleImageEmpty) {
      btnSampleImageEmpty.addEventListener('click', () => {
        state.currentPage = 1;
        loadDefaultImageSlides();
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
    if (fileType === 'pptx') {
      accentGrad.addColorStop(0, "#ea580c");
      accentGrad.addColorStop(0.5, "#f97316");
      accentGrad.addColorStop(1, "#fbbf24");
    } else if (fileType === 'image') {
      accentGrad.addColorStop(0, "#0284c7");
      accentGrad.addColorStop(0.5, "#38bdf8");
      accentGrad.addColorStop(1, "#a855f7");
    } else {
      accentGrad.addColorStop(0, "#4f46e5");
      accentGrad.addColorStop(0.5, "#6366f1");
      accentGrad.addColorStop(1, "#a855f7");
    }
    ctx.fillStyle = accentGrad;
    ctx.fillRect(80, 45, 1520, 8);

    // Slide Header / Chapter Title
    ctx.font = "bold 26px 'Plus Jakarta Sans', -apple-system, sans-serif";
    ctx.fillStyle = fileType === 'pptx' ? "#fb923c" : (fileType === 'image' ? "#38bdf8" : "#818cf8");
    ctx.fillText(slide.title || "BÀI GIẢNG ĐIỆN TỬ", 80, 105);

    // Subtitle / Heading
    ctx.font = "bold 34px 'Plus Jakarta Sans', -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    const displaySubtitle = slide.subtitle || "";
    if (displaySubtitle) {
      wrapText(ctx, displaySubtitle, 80, 160, 1520, 42);
    }

    const hasDiagram = !!slide.diagramType;
    const hasImage = !!slide.imageElement;
    const isSplitLayout = hasDiagram || hasImage;

    const points = slide.points || [];
    const count = points.length;
    const startY = displaySubtitle ? 230 : 180;
    const availableHeight = 990 - startY;
    const contentWidth = isSplitLayout ? 740 : 1520;
    const spacing = count > 4 ? 12 : 18;
    const cardHeight = Math.min(130, Math.max(60, Math.floor((availableHeight - (count - 1) * spacing) / Math.max(count, 1))));
    const fontSize = cardHeight >= 95 ? 23 : (cardHeight >= 70 ? 19 : 16);
    const textOffsetTop = cardHeight >= 95 ? 26 : (cardHeight >= 70 ? 20 : 16);

    let currentY = startY;
    points.forEach((point) => {
      // Background Card
      drawRoundRect(
        ctx, 
        80, 
        currentY, 
        contentWidth, 
        cardHeight, 
        14, 
        "#1e293b", 
        "rgba(255, 255, 255, 0.08)", 
        1
      );

      // Left Color Pill Accent
      const pillColor = fileType === 'pptx' ? "#f97316" : (fileType === 'image' ? "#38bdf8" : "#6366f1");
      drawRoundRect(ctx, 80, currentY, 8, cardHeight, 4, pillColor);

      // Bullet Circle
      ctx.fillStyle = fileType === 'pptx' ? "#fb923c" : "#38bdf8";
      ctx.beginPath();
      ctx.arc(120, currentY + cardHeight / 2, 6, 0, Math.PI * 2);
      ctx.fill();

      // Point Text
      ctx.font = `500 ${fontSize}px 'Plus Jakarta Sans', -apple-system, sans-serif`;
      ctx.fillStyle = "#f8fafc";
      wrapText(ctx, point, 145, currentY + textOffsetTop + (fontSize / 2), contentWidth - 85, fontSize + 8);

      currentY += cardHeight + spacing;
    });

    // Draw Right Column (Diagram or Image) if Split Layout
    if (hasDiagram) {
      drawSlideDiagram(ctx, slide.diagramType, 860, startY, 740, 760);
    } else if (hasImage && slide.imageElement) {
      const img = slide.imageElement;
      drawRoundRect(ctx, 860, startY, 740, 760, 16, "#131d31", "rgba(56, 189, 248, 0.25)", 1.5);
      const hR = 700 / img.width;
      const vR = 720 / img.height;
      const r = Math.min(hR, vR, 1);
      const w = img.width * r;
      const h = img.height * r;
      const ix = 860 + (740 - w) / 2;
      const iy = startY + (760 - h) / 2;
      ctx.drawImage(img, ix, iy, w, h);
    }

    // Footer Info
    ctx.font = "19px 'Plus Jakarta Sans', -apple-system, sans-serif";
    ctx.fillStyle = "#94a3b8";
    const footerLeftText = fileType === 'image' 
      ? `Slide Ảnh & Sơ đồ Trí tuệ Nhân tạo &bull; Hỗ trợ OCR & OpenAI Vision` 
      : (fileType === 'pptx' 
          ? `Bài giảng PowerPoint (.pptx) &bull; Học tập tương tác thông minh`
          : `Kinh tế Vi mô 101 - TS. Nguyễn Minh Đức - Bộ môn Kinh tế Học`);
    ctx.fillText(footerLeftText, 80, 1030);
    ctx.fillText(`Slide Trang ${slide.page} / ${totalSlides}`, 1420, 1030);

    return canvas.toDataURL('image/png', 0.95);
  }

  function createEconomicsPDFData() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [840, 540]
    });

    SAMPLE_SLIDES.forEach((slide, idx) => {
      if (idx > 0) doc.addPage([840, 540], 'landscape');
      const imgData = renderSlideToImage(slide, SAMPLE_SLIDES.length, 'pdf');
      doc.addImage(imgData, 'PNG', 0, 0, 840, 540, undefined, 'FAST');
    });

    return doc.output('arraybuffer');
  }

  function loadDefaultEconomicsPDF() {
    state.isSamplePDF = true;
    state.currentSlidesData = SAMPLE_SLIDES;
    state.fileType = 'pdf';
    const pdfBytes = createEconomicsPDFData();
    loadPDFDocument(pdfBytes, "Kinh-te-Vi-mo-Chuong-4.pdf", "Kinh tế Vi mô 101 - Bài giảng Cung Cầu");
  }

  function createPPTPDFData() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [840, 540]
    });

    SAMPLE_PPT_SLIDES.forEach((slide, idx) => {
      if (idx > 0) doc.addPage([840, 540], 'landscape');
      const imgData = renderSlideToImage(slide, SAMPLE_PPT_SLIDES.length, 'pptx');
      doc.addImage(imgData, 'PNG', 0, 0, 840, 540, undefined, 'FAST');
    });

    return doc.output('arraybuffer');
  }

  function loadDefaultPPTSlides() {
    state.isSamplePDF = true;
    state.currentSlidesData = SAMPLE_PPT_SLIDES;
    state.fileType = 'pptx';
    const pdfBytes = createPPTPDFData();
    loadPDFDocument(pdfBytes, "Cau-Truc-Du-Lieu-AI.pptx", "Cấu trúc Dữ liệu & Giải thuật cho AI");
  }

  function createImagePDFData() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [840, 540]
    });

    SAMPLE_IMAGE_SLIDES.forEach((slide, idx) => {
      if (idx > 0) doc.addPage([840, 540], 'landscape');
      const imgData = renderSlideToImage(slide, SAMPLE_IMAGE_SLIDES.length, 'image');
      doc.addImage(imgData, 'PNG', 0, 0, 840, 540, undefined, 'FAST');
    });

    return doc.output('arraybuffer');
  }

  function loadDefaultImageSlides() {
    state.isSamplePDF = true;
    state.currentSlidesData = SAMPLE_IMAGE_SLIDES;
    state.fileType = 'image';
    const pdfBytes = createImagePDFData();
    loadPDFDocument(pdfBytes, "So-Do-Kien-Truc-AI-OCR.png", "Sơ đồ & Kiến trúc Mô hình AI (OCR Powered)");
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
      orientation: 'landscape',
      unit: 'pt',
      format: [840, 540]
    });

    slides.forEach((slide, idx) => {
      if (idx > 0) doc.addPage([840, 540], 'landscape');
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

      // Show viewer & hide empty state
      emptyStateCard.style.display = 'none';
      viewerToolbar.style.display = 'flex';
      pdfCard.style.display = 'block';

      renderPageThumbnails();
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
      const fullText = [slide.title, slide.subtitle, ...(slide.points || [])].filter(Boolean).join(" ");
      state.currentSlideFullText = fullText;
      slideContextText.textContent = `${slide.subtitle ? slide.subtitle + "\n" : ""}• ${(slide.points || []).join("\n• ")}`;
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

  // Exact Vietnamese Text Overlay for Selection on Sample / PPT Slides
  function renderCustomTextLayer(slide, viewport, totalSlides = 5) {
    pdfTextLayer.innerHTML = '';
    pdfTextLayer.style.width = `${viewport.width}px`;
    pdfTextLayer.style.height = `${viewport.height}px`;

    const scale = viewport.scale;

    // Header Title span
    const titleSpan = document.createElement('span');
    titleSpan.textContent = slide.title || "";
    titleSpan.style.position = 'absolute';
    titleSpan.style.left = `${40 * scale}px`;
    titleSpan.style.top = `${38 * scale}px`;
    titleSpan.style.fontSize = `${13 * scale}px`;
    titleSpan.style.fontWeight = 'bold';
    titleSpan.style.color = 'transparent';
    pdfTextLayer.appendChild(titleSpan);

    // Subtitle span
    const displaySubtitle = slide.subtitle || "";
    if (displaySubtitle) {
      const subSpan = document.createElement('span');
      subSpan.textContent = displaySubtitle;
      subSpan.style.position = 'absolute';
      subSpan.style.left = `${40 * scale}px`;
      subSpan.style.top = `${68 * scale}px`;
      subSpan.style.fontSize = `${18 * scale}px`;
      subSpan.style.fontWeight = 'bold';
      subSpan.style.color = 'transparent';
      pdfTextLayer.appendChild(subSpan);
    }

    // Points spans with synchronized dynamic layout
    const points = slide.points || [];
    const count = points.length;
    const startY = displaySubtitle ? 245 : 180;
    const availableHeight = 1000 - startY;
    const spacing = count > 5 ? 12 : (count > 3 ? 18 : 26);
    const cardHeight = Math.min(115, Math.max(56, Math.floor((availableHeight - (count - 1) * spacing) / Math.max(count, 1))));
    const fontSize = cardHeight >= 90 ? 25 : (cardHeight >= 70 ? 21 : 17);

    let currentY = startY;
    points.forEach((point) => {
      const pSpan = document.createElement('span');
      pSpan.textContent = point;
      pSpan.style.position = 'absolute';
      pSpan.style.left = `${78 * scale}px`;
      pSpan.style.top = `${(currentY * 0.5) * scale}px`;
      pSpan.style.width = `${710 * scale}px`;
      pSpan.style.minHeight = `${(cardHeight * 0.5) * scale}px`;
      pSpan.style.fontSize = `${(fontSize * 0.5) * scale}px`;
      pSpan.style.lineHeight = `1.4`;
      pSpan.style.color = 'transparent';
      pdfTextLayer.appendChild(pSpan);

      currentY += cardHeight + spacing;
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
    const viewportWidth = document.getElementById('pdfScrollViewport').clientWidth;
    state.currentScale = (viewportWidth - 80) / 840;
    zoomDisplay.textContent = `${Math.round(state.currentScale * 100)}%`;
    renderPDFPage(state.currentPage);
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
    state.currentPage = 4;
    loadDefaultEconomicsPDF();
  });

  if (btnSamplePPT) {
    btnSamplePPT.addEventListener('click', () => {
      state.currentPage = 1;
      loadDefaultPPTSlides();
    });
  }

  if (btnSampleImage) {
    btnSampleImage.addEventListener('click', () => {
      state.currentPage = 1;
      loadDefaultImageSlides();
    });
  }

  // ----------------------------------------------------
  // Text Selection & Floating Action Menu
  // ----------------------------------------------------
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);

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

    if (text.length >= 2) {
      state.selectedText = text;
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

    // Local smart fallback
    feat1Loading.style.display = 'none';
    feat1ContentArea.style.display = 'block';
    feat1SummaryText.textContent = `Dựa trên toàn bộ nội dung Trang ${state.currentPage}, "${term}" được giải thích như sau:`;
    feat1KeypointsList.innerHTML = `
      <li><strong>Bản chất cốt lõi:</strong> Trong ngữ cảnh của slide này, "${term}" phản ánh luận điểm trọng tâm mà bài học muốn truyền tải.</li>
      <li><strong>Mối liên hệ trong slide:</strong> Khái niệm này tương tác trực tiếp với các ý chính: <em>${slideContext.slice(0, 110)}...</em></li>
      <li><strong>Ứng dụng &amp; Lưu ý:</strong> Giúp học viên nắm chắc bản chất, phục vụ phân tích các tình huống thực tế và bài tập kiểm tra.</li>
    `;
    feat1EvidenceText.textContent = `Tổng hợp từ toàn bộ nội dung văn bản Trang ${state.currentPage} (${state.pdfFileName}).`;
    refreshIcons();
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

    feat2SelectedTerm.textContent = `Câu hỏi dựa trên: "${term}" (Lần #${state.questionHistoryCounter})`;

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

      const systemPrompt = `Bạn là chuyên gia ra đề thi và kiểm tra kiến thức học tập. Nhiệm vụ của bạn là dựa vào slide bài giảng và từ khóa bôi đen để tạo ra một câu hỏi trắc nghiệm 4 đáp án (A, B, C, D) hoàn toàn mới mẻ, hấp dẫn và kiểm tra sâu hiểu biết của học viên.
Lưu ý:
- Phải có đúng 1 đáp án ĐÚNG và 3 đáp án SAI nhưng hợp lý (distractors).
- Mỗi lần sinh câu hỏi hãy tiếp cận dưới một góc độ khác nhau (ví dụ: Khái niệm, Phân tích biểu đồ, Bài toán thực tiễn, So sánh, Trường hợp ngoại lệ). Lần sinh hiện tại: #${state.questionHistoryCounter}.
- Trả về JSON theo cấu trúc:
{
  "question": "Nội dung câu hỏi trắc nghiệm rõ ràng",
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

Từ khóa/cụm từ bôi đen:
"${term}"

Hãy tạo 1 câu hỏi trắc nghiệm 4 đáp án mới lạ.`;

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

  // Dynamic Question Generator Engine (Fallback)
  function generateDiverseQuiz(term, slideText, pageNum, seed) {
    const questionTemplates = [
      {
        question: `[Khái niệm & Bản chất] Nhận định nào sau đây là ĐÚNG NHẤT về "${term}" theo nội dung Trang ${pageNum}?`,
        correct: `Là một khái niệm trọng tâm thể hiện sự tác động tương quan trực tiếp trong bối cảnh Trang ${pageNum}.`,
        distractors: [
          `Là trường hợp không bao giờ xuất hiện trong phân tích lý thuyết và thực tiễn.`,
          `Khái niệm này có giá trị cố định bằng 0 và không chịu ảnh hưởng của các yếu tố ngoại cảnh.`,
          `Hoàn toàn trái ngược với các nguyên lý được trình bày trong toàn bộ slide bài giảng.`
        ],
        rationale: `Theo toàn bộ nội dung Trang ${pageNum}, nhận định này phản ánh chính xác nhất bản chất của "${term}".`
      },
      {
        question: `[Ứng dụng Thực tiễn] Khi áp dụng "${term}" vào việc phân tích thực tế tại Trang ${pageNum}, hệ quả nào sau đây sẽ xảy ra?`,
        correct: `Ảnh hưởng trực tiếp đến việc ra quyết định tối ưu và phân tích xu hướng biến động.`,
        distractors: [
          `Doanh thu và sản lượng sẽ không có bất kỳ sự thay đổi nào.`,
          `Mọi đối tượng tham gia đều bị thiệt hại tối đa và thị trường ngừng hoạt động.`,
          `Chỉ áp dụng được khi không có sự tham gia của quy luật cung cầu.`
        ],
        rationale: `Trong bối cảnh bài học, "${term}" là cơ sở then chốt để đưa ra các phân tích tối ưu.`
      },
      {
        question: `[So sánh & Phân loại] Điểm KHÁC BIỆT cốt lõi của "${term}" so với các nội dung khác trong slide Trang ${pageNum} là gì?`,
        correct: `Có tính chất đặc thù về phản ứng và điều kiện cân bằng so với các trường hợp thông thường.`,
        distractors: [
          `Không có bất kỳ điểm khác biệt nào, hoàn toàn tương đồng với mọi khái niệm khác.`,
          `Không thể biểu diễn hoặc mô tả được bằng bất kỳ công cụ lý thuyết nào.`,
          `Chỉ được xét đến trong các bài thi nhưng không có ý nghĩa thực tiễn.`
        ],
        rationale: `Slide Trang ${pageNum} nhấn mạnh tính đặc thù và vai trò quan trọng của "${term}".`
      },
      {
        question: `[Suy luận Tình huống] Giả sử xuất hiện yếu tố "${term}" tại Trang ${pageNum}, nhận định nào sau đây là SAI?`,
        correct: `Thị trường sẽ hoàn toàn vô hiệu hóa và biến mất vĩnh viễn.`,
        distractors: [
          `Người tham gia thị trường sẽ điều chỉnh hành vi theo quy luật tương ứng.`,
          `Mức độ nhạy cảm của các biến số có thể thay đổi đáng kể.`,
          `Cần căn cứ vào các giả định của bài học để đưa ra dự báo phù hợp.`
        ],
        rationale: `Câu hỏi yêu cầu tìm nhận định SAI. Việc cho rằng thị trường biến mất vĩnh viễn là nhận định hoàn toàn không có căn cứ trong bài giảng.`
      }
    ];

    const chosen = questionTemplates[(seed - 1) % questionTemplates.length];
    
    const optionsRaw = [
      { text: chosen.correct, isCorrect: true, explanation: chosen.rationale },
      { text: chosen.distractors[0], isCorrect: false, explanation: "Nhận định này không phù hợp với giả định của bài học." },
      { text: chosen.distractors[1], isCorrect: false, explanation: "Nhận định này trái ngược với bản chất được nêu trong slide." },
      { text: chosen.distractors[2], isCorrect: false, explanation: "Nhận định này thiếu căn cứ lý thuyết trong bài giảng." }
    ];

    // Shuffle options
    for (let i = optionsRaw.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsRaw[i], optionsRaw[j]] = [optionsRaw[j], optionsRaw[i]];
    }

    const letters = ['A', 'B', 'C', 'D'];
    const formattedOptions = optionsRaw.map((opt, idx) => ({
      id: letters[idx],
      text: opt.text,
      isCorrect: opt.isCorrect,
      explanation: opt.explanation
    }));

    return {
      question: chosen.question,
      options: formattedOptions,
      overallExplanation: chosen.rationale
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

  function showToastNotification(term, pageNum) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="bookmark-check" style="width: 20px; height: 20px;"></i>
      </div>
      <div class="toast-content">
        <h4>Đã lưu vào danh sách thắc mắc</h4>
        <p>Đã ghi nhận <strong>"${term}"</strong> tại Trang ${pageNum}. Cuối giờ bạn có thể xem lại trước khi gửi.</p>
        <div class="toast-meta">Trang ${pageNum} &bull; File: ${state.pdfFileName}</div>
      </div>
    `;

    toastContainer.appendChild(toast);
    refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
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

      const toast = document.createElement('div');
      toast.className = 'toast-message';
      toast.style.borderColor = '#10b981';
      toast.innerHTML = `
        <div class="toast-icon">
          <i data-lucide="check-circle-2" style="width: 22px; height: 22px; color: #10b981;"></i>
        </div>
        <div class="toast-content">
          <h4>Đã gửi thành công ${count} câu hỏi!</h4>
          <p>Bản tổng hợp kèm số trang slide PDF và ngữ cảnh đã được chuyển tới Giảng viên.</p>
        </div>
      `;
      toastContainer.appendChild(toast);
      refreshIcons();

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 5000);
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
