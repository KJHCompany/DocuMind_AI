/* ==========================================================================
   DocuMind AI — 공통 스크립트 (모의 인증 상태 · 토스트 · 사이드바/탑바 상호작용)
   실제 백엔드 없이 화면 흐름을 시연하기 위한 목(mock) 로직입니다.
   ========================================================================== */

const DM_AUTH_KEY = "documind_auth";

const DocuMind = {
  getAuth() {
    try {
      const raw = localStorage.getItem(DM_AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setAuth(auth) {
    localStorage.setItem(DM_AUTH_KEY, JSON.stringify(auth));
  },

  logout() {
    localStorage.removeItem(DM_AUTH_KEY);
    window.location.href = "login.html";
  },

  // 로그인이 필요한 화면 상단에서 호출: 비로그인 시 로그인 화면으로 되돌림
  requireAuth() {
    const auth = this.getAuth();
    if (!auth) {
      window.location.href = "login.html";
      return null;
    }
    return auth;
  },

  initials(name) {
    if (!name) return "?";
    return name.trim().slice(0, 1).toUpperCase();
  },

  // 사이드바 하단 유저칩 + 탑바 유저메뉴 채우기, 로그아웃 바인딩, 관리자 전용 메뉴 숨김
  mountUserChip() {
    const auth = this.getAuth();
    if (!auth) return;
    const displayName = auth.name || auth.email;

    document.querySelectorAll("[data-user-name]").forEach((el) => (el.textContent = displayName));
    document.querySelectorAll("[data-user-role]").forEach(
      (el) => (el.textContent = auth.role === "ADMIN" ? "관리자" : "일반 사용자")
    );
    document.querySelectorAll("[data-user-avatar]").forEach((el) => (el.textContent = this.initials(displayName)));

    document.querySelectorAll("[data-admin-only]").forEach((el) => {
      if (auth.role !== "ADMIN") el.classList.add("hidden");
    });

    document.querySelectorAll("[data-logout]").forEach((el) => {
      el.addEventListener("click", () => this.logout());
    });
  },

  // 사이드바 문서/채팅 뱃지 카운트 (해당 목 데이터가 로드된 페이지에서만 채워짐)
  mountNavBadges() {
    const docBadge = document.querySelector('[data-nav-badge="docs"]');
    if (docBadge && typeof MOCK_DOCUMENTS !== "undefined") docBadge.textContent = MOCK_DOCUMENTS.length;

    const chatBadge = document.querySelector('[data-nav-badge="chat"]');
    if (chatBadge && typeof MOCK_SESSIONS !== "undefined") chatBadge.textContent = MOCK_SESSIONS.length;
  },

  mountSidebarCollapse() {
    const btn = document.getElementById("sidebarCollapseBtn");
    const sidebar = document.querySelector(".sidebar");
    if (!btn || !sidebar) return;
    btn.addEventListener("click", () => sidebar.classList.toggle("collapsed"));
  },

  mountNotifications() {
    const btn = document.getElementById("notifBtn");
    const dropdown = document.getElementById("notifDropdown");
    if (!btn || !dropdown) return;

    const list = document.getElementById("notifList");
    if (list && typeof MOCK_NOTIFICATIONS !== "undefined") {
      list.innerHTML = MOCK_NOTIFICATIONS.map(
        (n) => `
        <div class="notif-item">
          <div class="notif-item-ico ${n.chip}">${n.icon}</div>
          <div>
            <div class="notif-item-title">${n.title}</div>
            <div class="notif-item-time">${n.time}</div>
          </div>
        </div>`
      ).join("");
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
      document.getElementById("userMenuDropdown")?.classList.add("hidden");
    });

    const markAllRead = document.getElementById("markAllRead");
    if (markAllRead) {
      markAllRead.addEventListener("click", (e) => {
        e.preventDefault();
        btn.querySelector(".notif-dot")?.classList.add("hidden");
        dropdown.classList.add("hidden");
      });
    }
  },

  mountUserMenu() {
    const btn = document.getElementById("userMenuBtn");
    const dropdown = document.getElementById("userMenuDropdown");
    if (!btn || !dropdown) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
      document.getElementById("notifDropdown")?.classList.add("hidden");
    });
  },

  toast(message, duration = 2200) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), duration);
  },

  formatDate(d) {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  DocuMind.mountUserChip();
  DocuMind.mountNavBadges();
  DocuMind.mountSidebarCollapse();
  DocuMind.mountNotifications();
  DocuMind.mountUserMenu();

  document.addEventListener("click", () => {
    document.getElementById("notifDropdown")?.classList.add("hidden");
    document.getElementById("userMenuDropdown")?.classList.add("hidden");
  });
});
