/* 문서 목록 화면 — 필터/검색, 카드 렌더링, 업로드 모달(선택 → 진행률 → PARSING → READY) */

DocuMind.requireAuth();

let docs = [...MOCK_DOCUMENTS];
let nextDocId = Math.max(...docs.map((d) => d.id)) + 1;
let activeFilter = "ALL";
let searchQuery = "";

function renderDocs() {
  document.getElementById("docsCount").textContent = `총 ${docs.length}개의 문서`;

  const filtered = docs.filter((d) => {
    const matchesFilter = activeFilter === "ALL" || d.status === activeFilter;
    const matchesSearch = d.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const grid = document.getElementById("docGrid");
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state">조건에 맞는 문서가 없습니다.</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((doc) => {
      const meta = dmFileIcon(doc.fileType);
      return `
      <div class="doc-card card" data-id="${doc.id}">
        <div class="doc-card-top">
          <div class="doc-ico ${meta.chip}">${meta.emoji}</div>
          ${dmStatusBadge(doc.status)}
        </div>
        <div class="doc-name">${doc.fileName}</div>
        <div class="doc-category">${doc.category}</div>
        <div class="doc-meta-row">
          <span>📄 ${doc.pageCount}페이지</span>
          <span>🧩 ${doc.chunkCount}청크</span>
          <span>💾 ${doc.fileSizeMB}MB</span>
        </div>
        <div class="doc-card-footer">
          <span class="text-faint">${doc.createdAt}</span>
          <div class="doc-card-actions">
            <button class="icon-btn-sm" data-action="chat" title="이 문서로 채팅">💬</button>
            <button class="icon-btn-sm danger" data-action="delete" title="삭제">🗑️</button>
          </div>
        </div>
      </div>`;
    })
    .join("");

  grid.querySelectorAll(".doc-card").forEach((card) => {
    const id = Number(card.dataset.id);
    card.addEventListener("click", () => (location.href = `document-detail.html?id=${id}`));
    card.querySelector('[data-action="chat"]').addEventListener("click", (e) => {
      e.stopPropagation();
      location.href = `chat-session.html?id=new&doc=${id}`;
    });
    card.querySelector('[data-action="delete"]').addEventListener("click", (e) => {
      e.stopPropagation();
      const doc = docs.find((d) => d.id === id);
      if (confirm(`"${doc.fileName}" 문서를 삭제할까요?`)) {
        docs = docs.filter((d) => d.id !== id);
        renderDocs();
        DocuMind.toast("문서가 삭제되었습니다.");
      }
    });
  });
}

renderDocs();

document.getElementById("filterTabs").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelectorAll("#filterTabs button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  renderDocs();
});

document.getElementById("docsSearch").addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderDocs();
});

/* ---------- 업로드 모달 ---------- */
const uploadModal = document.getElementById("uploadModal");
const dropzone = document.getElementById("dropzone");
const selectedFileRow = document.getElementById("selectedFileRow");
const selectedFileName = document.getElementById("selectedFileName");
const uploadProgress = document.getElementById("uploadProgress");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const uploadFileName = document.getElementById("uploadFileName");
const startUploadBtn = document.getElementById("startUploadBtn");

let pendingFileName = null;

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".pdf,.docx,.pptx,.txt";
fileInput.className = "hidden";
document.body.appendChild(fileInput);

function openModal() {
  uploadModal.classList.remove("hidden");
  dropzone.classList.remove("hidden");
  selectedFileRow.classList.add("hidden");
  uploadProgress.classList.add("hidden");
  progressBar.style.width = "0%";
  startUploadBtn.disabled = true;
  pendingFileName = null;
}

function closeModal() {
  uploadModal.classList.add("hidden");
}

document.getElementById("openUploadModal").addEventListener("click", openModal);
document.getElementById("closeUploadModal").addEventListener("click", closeModal);
document.getElementById("cancelUpload").addEventListener("click", closeModal);
uploadModal.addEventListener("click", (e) => {
  if (e.target === uploadModal) closeModal();
});

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  if (e.dataTransfer.files.length) selectFile(e.dataTransfer.files[0].name);
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) selectFile(fileInput.files[0].name);
  fileInput.value = "";
});

function selectFile(fileName) {
  pendingFileName = fileName;
  selectedFileName.textContent = fileName;
  selectedFileRow.classList.remove("hidden");
  startUploadBtn.disabled = false;
}

document.getElementById("clearSelectedFile").addEventListener("click", () => {
  pendingFileName = null;
  selectedFileRow.classList.add("hidden");
  startUploadBtn.disabled = true;
});

startUploadBtn.addEventListener("click", () => {
  if (!pendingFileName) return;
  startUpload(pendingFileName);
});

function startUpload(fileName) {
  dropzone.classList.add("hidden");
  selectedFileRow.classList.add("hidden");
  startUploadBtn.disabled = true;
  uploadProgress.classList.remove("hidden");
  uploadFileName.textContent = fileName;

  let pct = 0;
  const timer = setInterval(() => {
    pct += Math.random() * 22 + 8;
    if (pct >= 100) {
      pct = 100;
      clearInterval(timer);
      progressBar.style.width = "100%";
      progressLabel.textContent = "업로드 완료 · 파싱 대기 중";
      setTimeout(() => {
        closeModal();
        addParsingDoc(fileName);
      }, 500);
      return;
    }
    progressBar.style.width = pct + "%";
    progressLabel.textContent = `업로드 중… ${Math.floor(pct)}%`;
  }, 260);
}

function guessFileType(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();
  return ["pdf", "docx", "pptx", "txt"].includes(ext) ? ext : "pdf";
}

function addParsingDoc(fileName) {
  const doc = {
    id: nextDocId++,
    fileName,
    category: "기타",
    fileType: guessFileType(fileName),
    status: "PARSING",
    pageCount: Math.floor(Math.random() * 20) + 3,
    chunkCount: 0,
    fileSizeMB: (Math.random() * 10 + 0.5).toFixed(1),
    createdAt: new Date().toISOString().slice(0, 10),
  };
  docs.unshift(doc);
  renderDocs();
  DocuMind.toast(`"${fileName}" 업로드 완료. 파싱을 시작합니다.`);

  setTimeout(() => {
    doc.status = "READY";
    doc.chunkCount = doc.pageCount * (Math.floor(Math.random() * 3) + 3);
    renderDocs();
    DocuMind.toast(`"${fileName}" 파싱이 완료되었습니다.`);
  }, 3500);
}
