/* 채팅 세션 목록 화면 — 세션 카드 렌더링(고정/검색) + 새 세션 시작(문서 선택) */

DocuMind.requireAuth();

let sessions = [...MOCK_SESSIONS];
let sessionQuery = "";

function renderSessions() {
  document.getElementById("sessionsCount").textContent = `총 ${sessions.length}개의 세션`;

  const filtered = sessions.filter((s) => {
    const q = sessionQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.docName.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const list = document.getElementById("sessionList");
  if (!sorted.length) {
    list.innerHTML = `<div class="empty-state">조건에 맞는 세션이 없습니다.</div>`;
    return;
  }

  list.innerHTML = sorted
    .map(
      (s) => `
    <div class="session-item card" data-id="${s.id}">
      <div class="session-item-main">
        <div class="session-item-title-row">
          ${s.pinned ? `<span class="pinned-badge">📌 고정</span>` : ""}
          <span class="session-item-title">${s.title}</span>
        </div>
        <div class="session-item-question">${s.lastQuestion}</div>
        <div class="session-item-meta">
          <span>📄 ${s.docName}</span>
          <span>💬 ${s.messageCount}개 메시지</span>
        </div>
      </div>
      <div class="session-item-right">
        <span class="session-item-time">${s.updatedAt}</span>
        <button class="icon-btn-sm" data-action="pin" title="고정">${s.pinned ? "📌" : "📍"}</button>
        <button class="icon-btn-sm danger" data-action="delete" title="삭제">🗑️</button>
      </div>
    </div>`
    )
    .join("");

  list.querySelectorAll(".session-item").forEach((item) => {
    const id = Number(item.dataset.id);
    item.addEventListener("click", () => (location.href = `chat-session.html?id=${id}`));
    item.querySelector('[data-action="pin"]').addEventListener("click", (e) => {
      e.stopPropagation();
      const s = sessions.find((x) => x.id === id);
      s.pinned = !s.pinned;
      renderSessions();
    });
    item.querySelector('[data-action="delete"]').addEventListener("click", (e) => {
      e.stopPropagation();
      const s = sessions.find((x) => x.id === id);
      if (confirm(`"${s.title}" 세션을 삭제할까요?`)) {
        sessions = sessions.filter((x) => x.id !== id);
        renderSessions();
        DocuMind.toast("세션이 삭제되었습니다.");
      }
    });
  });
}
renderSessions();

document.getElementById("sessionSearch").addEventListener("input", (e) => {
  sessionQuery = e.target.value.trim();
  renderSessions();
});

document.getElementById("newSessionBtn").addEventListener("click", () => {
  const readyDocs = MOCK_DOCUMENTS.filter((d) => d.status === "READY");
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>어떤 문서에 대해 질문할까요?</h3>
        <button class="icon-btn" id="closePicker">✕</button>
      </div>
      <div class="picker-list">
        ${
          readyDocs.length
            ? readyDocs
                .map(
                  (d) => `<div class="picker-item" data-doc-id="${d.id}"><span>${dmFileIcon(d.fileType).emoji}</span><span>${d.fileName}</span></div>`
                )
                .join("")
            : `<p class="text-muted" style="font-size:13px;">준비완료 상태의 문서가 없습니다. 먼저 문서를 업로드해주세요.</p>`
        }
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.id === "closePicker") overlay.remove();
    const item = e.target.closest(".picker-item");
    if (item) {
      location.href = `chat-session.html?id=new&doc=${item.dataset.docId}`;
    }
  });
});
