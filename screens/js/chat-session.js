/* 채팅 상세(Split-View) 화면 — 좌: 대화(SSE 스트리밍 흉내), 우: PDF 뷰어(인용 하이라이팅) */

DocuMind.requireAuth();

const qs = new URLSearchParams(location.search);
const sessionIdParam = qs.get("id");

let sessionTitle = "새 대화";
let docName = "문서.pdf";
let pageCount = 12;
let messages = [];

if (sessionIdParam && sessionIdParam !== "new") {
  const session = MOCK_SESSIONS.find((s) => String(s.id) === sessionIdParam);
  if (session) {
    sessionTitle = session.title;
    docName = session.docName;
    const doc = MOCK_DOCUMENTS.find((d) => d.fileName === docName);
    if (doc) pageCount = doc.pageCount;
    messages = JSON.parse(JSON.stringify(MOCK_MESSAGES[session.id] || []));
  }
} else {
  const docId = Number(qs.get("doc"));
  const doc = MOCK_DOCUMENTS.find((d) => d.id === docId);
  if (doc) {
    docName = doc.fileName;
    pageCount = doc.pageCount;
  }
  sessionTitle = "새 대화";
}

document.getElementById("sessionTitle").textContent = sessionTitle;
document.getElementById("sessionDocName").textContent = docName;
document.getElementById("pdfDocName").textContent = docName;

/* ---------- 세션 메뉴( ⋮ ) ---------- */
const sessionMenuBtn = document.getElementById("sessionMenuBtn");
const sessionMenuDropdown = document.getElementById("sessionMenuDropdown");
sessionMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  sessionMenuDropdown.classList.toggle("hidden");
});
document.addEventListener("click", () => sessionMenuDropdown.classList.add("hidden"));

document.getElementById("deleteSessionBtn").addEventListener("click", () => {
  if (confirm(`"${sessionTitle}" 세션을 삭제할까요?`)) {
    DocuMind.toast("세션이 삭제되었습니다.");
    setTimeout(() => (location.href = "chat.html"), 500);
  }
});

/* ---------- 메시지 렌더 ---------- */
const chatMessages = document.getElementById("chatMessages");
const resetHighlightRow = document.getElementById("resetHighlightRow");

function renderMessages() {
  if (!messages.length) {
    chatMessages.innerHTML = `<div class="empty-state" style="padding:40px 0;">이 문서에 대해 궁금한 점을 질문해보세요.</div>`;
    return;
  }

  chatMessages.innerHTML = messages
    .map((m) => {
      const isUser = m.role === "user";
      if (isUser) {
        return `
          <div class="msg-row user">
            <div class="msg-avatar">🧑</div>
            <div class="msg-content"><div class="msg-bubble">${m.content}</div></div>
          </div>`;
      }

      const citeLine = m.citations
        ? `<div class="cite-line">출처:
            ${m.citations
              .map((c, i) => `<span class="citation-badge" data-page="${c.page}">📄 [${i + 1}] ${c.label} ↵</span>`)
              .join(" ")}
          </div>`
        : "";

      return `
        <div class="msg-row">
          <div class="msg-avatar">🤖</div>
          <div class="msg-content">
            <div class="msg-sender-row">
              <span>DocuMind AI</span>
              ${m._streaming ? "" : `<span class="badge badge-ready">✓ 출처 확인됨</span>`}
            </div>
            <div class="msg-bubble">${m.content}${m._streaming ? '<span class="cursor"></span>' : ""}</div>
            ${citeLine}
          </div>
        </div>`;
    })
    .join("");
  chatMessages.scrollTop = chatMessages.scrollHeight;

  chatMessages.querySelectorAll(".citation-badge").forEach((badge) => {
    badge.addEventListener("click", () => goToPage(Number(badge.dataset.page), true));
  });
}

/* ---------- 답변 스트리밍(SSE) 흉내 ---------- */
const CANNED_ANSWERS = [
  "문서를 확인한 결과, 관련 내용은 본문에 명시되어 있습니다. 핵심 조건과 절차는 아래 인용된 페이지에서 자세히 확인하실 수 있습니다.",
  "질문과 가장 관련도가 높은 문단을 검색했습니다. 요약하면, 해당 절차는 문서에 정의된 기준을 따르며 예외 사항도 함께 명시되어 있습니다.",
  "해당 항목은 문서 내 별도 섹션에서 다루고 있습니다. 조건을 충족하는 경우와 그렇지 않은 경우가 구분되어 설명되어 있습니다.",
];

function askQuestion(question) {
  messages.push({ role: "user", content: question });
  renderMessages();

  const answerText = CANNED_ANSWERS[Math.floor(Math.random() * CANNED_ANSWERS.length)];
  const citedPage = Math.max(1, Math.floor(Math.random() * pageCount));
  const citedPage2 = Math.max(1, Math.min(pageCount, citedPage + 2));
  const assistantMsg = { role: "assistant", content: "", _streaming: true };
  messages.push(assistantMsg);
  renderMessages();

  const words = answerText.split(" ");
  let i = 0;
  const timer = setInterval(() => {
    i++;
    assistantMsg.content = words.slice(0, i).join(" ");
    renderMessages();
    if (i >= words.length) {
      clearInterval(timer);
      assistantMsg._streaming = false;
      assistantMsg.citations = [
        { page: citedPage, label: `${citedPage}페이지` },
        { page: citedPage2, label: `${citedPage2}페이지` },
      ];
      renderMessages();
    }
  }, 70);
}

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;
  chatInput.value = "";
  askQuestion(value);
});

document.querySelectorAll(".qq-chip").forEach((chip) => {
  chip.addEventListener("click", () => askQuestion(chip.dataset.q));
});

/* ---------- PDF 뷰어 패널 ---------- */
let currentPage = 1;
let zoom = 100;
const pdfPageEl = document.getElementById("pdfPage");
const pdfPageLabel = document.getElementById("pdfPageLabel");
const zoomLabel = document.getElementById("zoomLabel");
const pdfThumbStrip = document.getElementById("pdfThumbStrip");

const LOREM_LINES = [
  "본 조항은 서비스 이용과 관련하여 이용자와 회사 간의 권리 및 의무를 규정한다.",
  "관련 절차는 별도 고지된 기준에 따라 순차적으로 적용되며, 예외 사항은 하단에 기재한다.",
  "산정 기준일은 신청일을 기준으로 하며, 이후 변동 사항은 재산정하지 않는다.",
  "세부 시행 지침은 내부 운영 정책에 따라 분기별로 갱신될 수 있다.",
];

function renderThumbStrip() {
  const items = [];
  for (let p = 1; p <= pageCount; p++) {
    items.push(`<button class="pdf-thumb-item ${p === currentPage ? "active" : ""}" data-page="${p}">${p}</button>`);
  }
  pdfThumbStrip.innerHTML = items.join("");
  pdfThumbStrip.querySelectorAll(".pdf-thumb-item").forEach((btn) => {
    btn.addEventListener("click", () => goToPage(Number(btn.dataset.page), false));
  });
}

function renderPdfPage(highlightIndex) {
  pdfPageLabel.textContent = `${currentPage} / ${pageCount}`;
  pdfPageEl.style.transform = `scale(${zoom / 100})`;
  pdfPageEl.style.transformOrigin = "top center";

  const lines = LOREM_LINES.map((line, idx) => {
    const content = `${line} (p.${currentPage})`;
    return idx === highlightIndex ? `<p><span class="pdf-highlight">${content}</span></p>` : `<p>${content}</p>`;
  }).join("");

  pdfPageEl.innerHTML = `<strong style="color:var(--color-text);font-size:13px;">— ${currentPage}페이지 —</strong>${lines}`;
  renderThumbStrip();
}

function goToPage(page, highlight) {
  currentPage = Math.min(Math.max(page, 1), pageCount);
  renderPdfPage(highlight ? 1 : -1);
  resetHighlightRow.classList.toggle("hidden", !highlight);
  if (highlight) {
    const target = pdfPageEl.querySelector(".pdf-highlight");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

document.getElementById("resetHighlightBtn").addEventListener("click", () => {
  renderPdfPage(-1);
  resetHighlightRow.classList.add("hidden");
});

document.getElementById("zoomIn").addEventListener("click", () => {
  zoom = Math.min(zoom + 10, 150);
  zoomLabel.textContent = `${zoom}%`;
  renderPdfPage(-1);
});
document.getElementById("zoomOut").addEventListener("click", () => {
  zoom = Math.max(zoom - 10, 70);
  zoomLabel.textContent = `${zoom}%`;
  renderPdfPage(-1);
});

renderMessages();
renderPdfPage(-1);
