// Main Application Controller for PDF E-Learning & OpenAI Assistant

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

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    pdfDoc: null,
    currentPage: 4, // Default to Slide 4
    totalPages: 5,
    currentScale: 1.25,
    isSamplePDF: true,
    pdfFileName: "Kinh-te-Vi-mo-Chuong-4.pdf",
    currentSlideFullText: "",
    selectedText: "",
    selectedContext: "",
    bookmarks: [],
    questionHistoryCounter: 0,
    openAIKey: localStorage.getItem('user_openai_api_key') || '',
    openAIModel: localStorage.getItem('user_openai_model') || 'gpt-4o-mini'
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
  const slideContextText = document.getElementById('slideContextText');

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

  // ----------------------------------------------------
  // Initial Setup
  // ----------------------------------------------------
  function init() {
    updateAIStatusBadge();
    showEmptyState();
    updateBookmarkBadge();
    setupApiKeyListeners();
    setupEmptyStateListeners();
    refreshIcons();
  }

  function showEmptyState() {
    state.pdfDoc = null;
    state.currentPage = 0;
    state.totalPages = 0;
    state.currentSlideFullText = "";
    
    pdfTitleDisplay.textContent = "Chưa có tài liệu";
    pdfFileBadge.textContent = "Chưa nạp file";
    totalPagesBadge.textContent = "0 Trang";
    
    pageListContainer.innerHTML = `
      <div class="empty-sidebar-placeholder">
        <i data-lucide="file-x" style="width: 32px; height: 32px; opacity: 0.35; margin-bottom: 8px; display: inline-block;"></i>
        <p>Chưa có file PDF nào được nạp.</p>
      </div>
    `;

    slideContextText.textContent = "Chưa có tài liệu. Vui lòng tải file PDF để trích xuất nội dung slide.";
    viewerToolbar.style.display = 'none';
    pdfCard.style.display = 'none';
    emptyStateCard.style.display = 'flex';
  }

  function setupEmptyStateListeners() {
    // Empty state upload
    pdfFileInputEmpty.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        state.isSamplePDF = false;
        const reader = new FileReader();
        reader.onload = function() {
          const typedArray = new Uint8Array(this.result);
          loadPDFDocument(typedArray, file.name, file.name.replace('.pdf', ''));
        };
        reader.readAsArrayBuffer(file);
      }
    });

    // Empty state sample button
    btnSamplePDFEmpty.addEventListener('click', () => {
      state.currentPage = 4;
      loadDefaultEconomicsPDF();
    });
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
  // Ultra-Crisp Canvas Slide Generator (100% Vietnamese UTF-8)
  // ----------------------------------------------------
  function drawRoundRect(ctx, x, y, width, height, radius, fillStyle) {
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
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  function renderSlideToImage(slide) {
    const canvas = document.createElement('canvas');
    canvas.width = 1680;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Deep modern dark background
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, 1680, 1080);

    // Top Indigo Accent Line
    ctx.fillStyle = "#6366f1";
    ctx.fillRect(80, 50, 1520, 8);

    // Slide Header
    ctx.font = "bold 26px 'Plus Jakarta Sans', -apple-system, sans-serif";
    ctx.fillStyle = "#818cf8";
    ctx.fillText(slide.title, 80, 110);

    // Subtitle / Heading
    ctx.font = "bold 38px 'Plus Jakarta Sans', -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(slide.subtitle, 80, 175);

    // Points cards
    let y = 260;
    slide.points.forEach((point) => {
      drawRoundRect(ctx, 80, y - 35, 1520, 105, 16, "#1e293b");
      drawRoundRect(ctx, 80, y - 35, 12, 105, 6, "#6366f1");

      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(130, y + 16, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "26px 'Plus Jakarta Sans', -apple-system, sans-serif";
      ctx.fillStyle = "#f1f5f9";
      wrapText(ctx, point, 165, y + 25, 1400, 38);

      y += 140;
    });

    // Footer
    ctx.font = "20px 'Plus Jakarta Sans', -apple-system, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Kinh tế Vi mô 101 - TS. Nguyễn Minh Đức - Bộ môn Kinh tế Học", 80, 1010);
    ctx.fillText(`Slide Trang ${slide.page} / 5`, 1440, 1010);

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
      const imgData = renderSlideToImage(slide);
      doc.addImage(imgData, 'PNG', 0, 0, 840, 540, undefined, 'FAST');
    });

    return doc.output('arraybuffer');
  }

  function loadDefaultEconomicsPDF() {
    state.isSamplePDF = true;
    const pdfBytes = createEconomicsPDFData();
    loadPDFDocument(pdfBytes, "Kinh-te-Vi-mo-Chuong-4.pdf", "Kinh tế Vi mô 101 - Bài giảng Cung Cầu");
  }

  // ----------------------------------------------------
  // Load PDF Document into PDF.js
  // ----------------------------------------------------
  async function loadPDFDocument(pdfSource, fileName = "Slide.pdf", title = "") {
    try {
      state.pdfFileName = fileName;
      pdfTitleDisplay.textContent = title || fileName;
      pdfFileBadge.textContent = fileName;

      const loadingTask = pdfjsLib.getDocument(pdfSource);
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
    } catch (err) {
      console.error("Lỗi đọc PDF:", err);
      alert("Không thể đọc file PDF này. Vui lòng thử file PDF khác!");
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

    // Render Text Layer
    if (state.isSamplePDF && SAMPLE_SLIDES[pageNumber - 1]) {
      const slide = SAMPLE_SLIDES[pageNumber - 1];
      state.currentSlideFullText = [slide.title, slide.subtitle, ...slide.points].join(" ");
      slideContextText.textContent = `${slide.subtitle}\n• ${slide.points.join("\n• ")}`;
      renderCustomTextLayer(slide, viewport);
    } else {
      pdfTextLayer.innerHTML = '';
      pdfTextLayer.style.width = `${viewport.width}px`;
      pdfTextLayer.style.height = `${viewport.height}px`;

      const textContent = await page.getTextContent();
      const fullTextArray = textContent.items.map(item => item.str).filter(str => str.trim().length > 0);
      state.currentSlideFullText = fullTextArray.join(" ");
      slideContextText.textContent = fullTextArray.join("\n• ");

      pdfjsLib.renderTextLayer({
        textContent: textContent,
        container: pdfTextLayer,
        viewport: viewport,
        textDivs: []
      });
    }

    refreshIcons();
  }

  // Exact Vietnamese Text Overlay for Selection on Sample Slides
  function renderCustomTextLayer(slide, viewport) {
    pdfTextLayer.innerHTML = '';
    pdfTextLayer.style.width = `${viewport.width}px`;
    pdfTextLayer.style.height = `${viewport.height}px`;

    const scale = viewport.scale;

    // Header Title span
    const titleSpan = document.createElement('span');
    titleSpan.textContent = slide.title;
    titleSpan.style.position = 'absolute';
    titleSpan.style.left = `${40 * scale}px`;
    titleSpan.style.top = `${40 * scale}px`;
    titleSpan.style.fontSize = `${13 * scale}px`;
    titleSpan.style.fontWeight = 'bold';
    titleSpan.style.color = 'transparent';
    pdfTextLayer.appendChild(titleSpan);

    // Subtitle span
    const subSpan = document.createElement('span');
    subSpan.textContent = slide.subtitle;
    subSpan.style.position = 'absolute';
    subSpan.style.left = `${40 * scale}px`;
    subSpan.style.top = `${70 * scale}px`;
    subSpan.style.fontSize = `${19 * scale}px`;
    subSpan.style.fontWeight = 'bold';
    subSpan.style.color = 'transparent';
    pdfTextLayer.appendChild(subSpan);

    // Points spans
    let y = 115;
    slide.points.forEach((point) => {
      const pSpan = document.createElement('span');
      pSpan.textContent = point;
      pSpan.style.position = 'absolute';
      pSpan.style.left = `${82 * scale}px`;
      pSpan.style.top = `${y * scale}px`;
      pSpan.style.width = `${700 * scale}px`;
      pSpan.style.fontSize = `${13 * scale}px`;
      pSpan.style.lineHeight = `1.5`;
      pSpan.style.color = 'transparent';
      pdfTextLayer.appendChild(pSpan);

      y += 70;
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
  // PDF Navigation & Controls
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

  // Upload Local PDF File
  pdfFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      state.isSamplePDF = false;
      const reader = new FileReader();
      reader.onload = function() {
        const typedArray = new Uint8Array(this.result);
        loadPDFDocument(typedArray, file.name, file.name.replace('.pdf', ''));
      };
      reader.readAsArrayBuffer(file);
    }
  });

  btnSamplePDF.addEventListener('click', () => {
    state.currentPage = 4;
    loadDefaultEconomicsPDF();
  });

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
