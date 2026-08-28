/* 관리자 대시보드 — 요약 통계, 오늘 현황, 사용자 테이블(역할 필터·검색) */

const authAdmin = DocuMind.requireAuth();

if (authAdmin && authAdmin.role !== "ADMIN") {
  document.getElementById("adminGuard").classList.remove("hidden");
}

document.getElementById("adminStats").innerHTML = `
  <div class="stat-box card"><div class="stat-label">전체 문서</div><div class="stat-value">${ADMIN_SUMMARY.totalDocs}</div></div>
  <div class="stat-box card"><div class="stat-label">전체 세션</div><div class="stat-value">${ADMIN_SUMMARY.totalSessions.toLocaleString("ko-KR")}</div></div>
  <div class="stat-box card"><div class="stat-label">토큰 사용량</div><div class="stat-value">${ADMIN_SUMMARY.totalTokens}</div></div>
  <div class="stat-box card"><div class="stat-label">활성 사용자</div><div class="stat-value">${ADMIN_SUMMARY.activeUsers}</div></div>
`;

document.getElementById("growthBadge").textContent = `↑ 전일 대비 ${ADMIN_SUMMARY.growthVsYesterday}`;
document.getElementById("growthNote").textContent = ADMIN_SUMMARY.growthNote;

document.getElementById("todayStats").innerHTML = `
  <div class="today-stat-box"><div class="label">오늘 문서</div><div class="value">${ADMIN_SUMMARY.todayDocs}</div></div>
  <div class="today-stat-box"><div class="label">오늘 세션</div><div class="value">${ADMIN_SUMMARY.todaySessions}</div></div>
  <div class="today-stat-box"><div class="label">오늘 토큰</div><div class="value">${ADMIN_SUMMARY.todayTokens}</div></div>
`;

let activeRole = "ALL";
let adminQuery = "";

function renderTable() {
  const rows = MOCK_ADMIN_ROWS.filter((r) => {
    const matchesRole = activeRole === "ALL" || r.role === activeRole;
    const q = adminQuery.toLowerCase();
    const matchesSearch = r.user.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  document.getElementById("userCount").textContent = `총 ${rows.length}명의 사용자`;

  const body = document.getElementById("adminTableBody");
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="8" class="text-faint">검색 결과가 없습니다.</td></tr>`;
    return;
  }

  body.innerHTML = rows
    .map(
      (r) => `
      <tr>
        <td>
          <div class="table-user-cell">
            <div class="avatar avatar-sm">${DocuMind.initials(r.user)}</div>
            <div>
              <div class="name">${r.user}</div>
              <div class="email">${r.email}</div>
            </div>
          </div>
        </td>
        <td>${r.role}</td>
        <td>${r.docs}</td>
        <td>${r.sessions}</td>
        <td>${r.tokens.toLocaleString("ko-KR")}</td>
        <td><span class="badge ${r.plan === "Pro" ? "badge-plan-pro" : "badge-plan-basic"}">${r.plan}</span></td>
        <td>${r.lastActive}</td>
        <td><span class="status-dot ${r.active ? "active" : "inactive"}">${r.active ? "활성" : "비활성"}</span></td>
      </tr>`
    )
    .join("");
}

renderTable();

document.getElementById("roleTabs").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelectorAll("#roleTabs button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeRole = btn.dataset.role;
  renderTable();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  adminQuery = e.target.value.trim();
  renderTable();
});
