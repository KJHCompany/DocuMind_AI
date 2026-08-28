/* 문서 상세 화면 — 쿼리스트링 id로 목 데이터 조회 후 렌더링 */

DocuMind.requireAuth();

const params = new URLSearchParams(location.search);
const docId = Number(params.get("id"));
const doc = MOCK_DOCUMENTS.find((d) => d.id === docId) || MOCK_DOCUMENTS[0];
const fileMeta = dmFileIcon(doc.fileType);

function renderDetail() {
  const content = document.getElementById("detailContent");
  content.innerHTML = `
    <div class="detail-grid">
      <div>
        <div class="detail-file-card card">
          <div class="detail-file-top">
            <div class="detail-file-icon ${fileMeta.chip}">${fileMeta.emoji}</div>
            ${dmStatusBadge(doc.status)}
          </div>
          <h2>${doc.fileName}</h2>

          <div class="detail-info-grid">
            <div class="detail-info-box">
              <div class="info-label">📄 페이지</div>
              <div class="info-value">${doc.pageCount}</div>
            </div>
            <div class="detail-info-box">
              <div class="info-label">🧩 청크</div>
              <div class="info-value">${doc.chunkCount}</div>
            </div>
            <div class="detail-info-box">
              <div class="info-label">💾 용량</div>
              <div class="info-value">${doc.fileSizeMB} MB</div>
            </div>
            <div class="detail-info-box">
              <div class="info-label">📅 업로드</div>
              <div class="info-value">${doc.createdAt}</div>
            </div>
            <div class="detail-info-box">
              <div class="info-label">🏷️ 카테고리</div>
              <div class="info-value">${doc.category}</div>
            </div>
            <div class="detail-info-box">
              <div class="info-label">📁 파일 형식</div>
              <div class="info-value">${doc.fileType.toUpperCase()}</div>
            </div>
          </div>
        </div>

        <div class="detail-actions-card card">
          <h3>문서 작업</h3>
          <a href="chat-session.html?id=new&doc=${doc.id}" class="doc-action-row">💬 이 문서로 채팅하기</a>
          <button class="doc-action-row" id="downloadBtn">⬇️ 원본 다운로드</button>
          <button class="doc-action-row danger" id="deleteDocBtn">🗑️ 문서 삭제</button>
        </div>
      </div>

      <div class="detail-preview-card card">
        <div class="preview-toolbar">
          <div class="preview-toolbar-dots"><span></span><span></span><span></span></div>
          <span class="preview-toolbar-title">${doc.fileName}</span>
          <div class="preview-toolbar-zoom">
            <button class="icon-btn" style="width:28px;height:28px;">−</button>
            <button class="icon-btn" style="width:28px;height:28px;">+</button>
          </div>
        </div>
        <div class="detail-preview-body">
          <div class="preview-placeholder">
            <div class="ico ${fileMeta.chip}">${fileMeta.emoji}</div>
            <div class="file-name">${doc.fileName}</div>
            <div class="file-meta">${doc.pageCount}페이지 · ${doc.fileSizeMB}MB</div>
            <div class="note">미리보기는 준비 중입니다.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("deleteDocBtn").addEventListener("click", () => {
    if (confirm(`"${doc.fileName}" 문서를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) {
      DocuMind.toast("문서가 삭제되었습니다.");
      setTimeout(() => (location.href = "documents.html"), 600);
    }
  });

  document.getElementById("downloadBtn").addEventListener("click", () => {
    DocuMind.toast("데모 화면에서는 실제 다운로드가 제공되지 않습니다.");
  });
}

renderDetail();
