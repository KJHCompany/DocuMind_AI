/* 대시보드 화면 — 인사말, 통계 카드, 최근 문서, 빠른 실행 */

const dashAuth = DocuMind.requireAuth();

if (dashAuth) {
  document.getElementById("greeting").textContent = `안녕하세요, ${dashAuth.name || dashAuth.email}님 👋`;
}

const readyCount = MOCK_DOCUMENTS.filter((d) => d.status === "READY").length;
const tokenLabel = (MOCK_CURRENT_USER_USAGE.tokensUsed / 1000).toFixed(1) + "K";

const stats = [
  { icon: "📄", chip: "icon-chip-indigo", label: "전체 문서", value: `${MOCK_DOCUMENTS.length}건` },
  { icon: "✅", chip: "icon-chip-green", label: "파싱 완료", value: `${readyCount}건` },
  { icon: "💬", chip: "icon-chip-amber", label: "채팅 세션", value: `${MOCK_SESSIONS.length}개` },
  { icon: "🪙", chip: "icon-chip-indigo", label: "사용 토큰", value: tokenLabel },
];

document.getElementById("dashStats").innerHTML = stats
  .map(
    (s) => `
    <div class="dash-stat-card card">
      <div class="icon-chip ${s.chip}">${s.icon}</div>
      <div>
        <div class="stat-label">${s.label}</div>
        <div class="stat-value">${s.value}</div>
      </div>
    </div>`
  )
  .join("");

const recentDocs = [...MOCK_DOCUMENTS].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 3);

document.getElementById("recentDocs").innerHTML = recentDocs
  .map((doc) => {
    const meta = dmFileIcon(doc.fileType);
    return `
    <a href="document-detail.html?id=${doc.id}" class="recent-doc-row">
      <div class="recent-doc-ico ${meta.chip}">${meta.emoji}</div>
      <div class="recent-doc-info">
        <div class="recent-doc-name">${doc.fileName}</div>
        <div class="recent-doc-meta">페이지 ${doc.pageCount} · ${doc.createdAt}</div>
      </div>
      ${dmStatusBadge(doc.status)}
    </a>`;
  })
  .join("");
