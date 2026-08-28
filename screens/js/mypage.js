/* 마이페이지 화면 — 계정 정보 · 사용량 · 보안 · 위험 구역 */

const auth = DocuMind.requireAuth();

function fillProfile() {
  if (!auth) return;
  const displayName = auth.name || auth.email;

  document.getElementById("bigAvatar").textContent = DocuMind.initials(displayName);
  document.getElementById("displayName").textContent = displayName;
  document.getElementById("displayEmail").textContent = auth.email;
  document.getElementById("roleBadge").textContent = auth.role === "ADMIN" ? "관리자" : "일반 회원";
  document.getElementById("joinedAt").textContent = `가입일 ${MOCK_CURRENT_USER_USAGE.joinedAt}`;
  document.getElementById("planBadge").textContent = `${MOCK_CURRENT_USER_USAGE.plan} 플랜`;

  document.getElementById("pEmail").value = auth.email;
  document.getElementById("pName").value = displayName;
  document.getElementById("pCompany").value = auth.company || "";
}
fillProfile();

function renderUsage() {
  const u = MOCK_CURRENT_USER_USAGE;
  const tokenPct = Math.min(100, (u.tokensUsed / u.tokensLimit) * 100);
  const docPct = Math.min(100, (u.docsUsed / u.docsLimit) * 100);

  document.getElementById("tokenUsageLabel").textContent = `${(u.tokensUsed / 1000).toFixed(1)}K / ${(u.tokensLimit / 1000).toFixed(0)}K`;
  document.getElementById("tokenUsageFill").style.width = `${tokenPct}%`;
  document.getElementById("docUsageLabel").textContent = `${u.docsUsed} / ${u.docsLimit}`;
  document.getElementById("docUsageFill").style.width = `${docPct}%`;
}
renderUsage();

document.getElementById("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const newName = document.getElementById("pName").value.trim();
  if (!newName) return;
  auth.name = newName;
  auth.company = document.getElementById("pCompany").value.trim();
  DocuMind.setAuth(auth);
  DocuMind.toast("계정 정보가 저장되었습니다.");
  fillProfile();
  DocuMind.mountUserChip();
});

document.getElementById("securityForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const pw = document.getElementById("newPassword").value;
  const pwConfirm = document.getElementById("newPasswordConfirm").value;
  if (pw.length < 8) {
    DocuMind.toast("비밀번호는 8자 이상이어야 합니다.");
    return;
  }
  if (pw !== pwConfirm) {
    DocuMind.toast("비밀번호가 일치하지 않습니다.");
    return;
  }
  DocuMind.toast("비밀번호가 변경되었습니다.");
  e.target.reset();
});

document.getElementById("upgradeBtn").addEventListener("click", (e) => {
  e.preventDefault();
  DocuMind.toast("데모 화면에서는 실제 결제가 진행되지 않습니다.");
});

document.getElementById("deleteAccountBtn").addEventListener("click", () => {
  if (confirm("정말로 계정을 삭제할까요? 모든 문서와 채팅 기록이 영구적으로 삭제되며 되돌릴 수 없습니다.")) {
    DocuMind.logout();
  }
});
