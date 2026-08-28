/* 로그인 / 회원가입 폼 — 실제 인증 없이 흐름만 시연하는 목 로직 */

function showAuthError(msg) {
  const el = document.getElementById("authError");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
}

/* ---------- 로그인 ---------- */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showAuthError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    const role = email.toLowerCase().includes("admin") ? "ADMIN" : "USER";
    const name = email.split("@")[0];

    DocuMind.setAuth({ email, name, role });
    window.location.href = "dashboard.html";
  });
}

const demoUserBtn = document.getElementById("demoUserBtn");
if (demoUserBtn) {
  demoUserBtn.addEventListener("click", () => {
    DocuMind.setAuth({ email: "minjun@example.com", name: "김민준", role: "USER" });
    window.location.href = "dashboard.html";
  });
}

const demoAdminBtn = document.getElementById("demoAdminBtn");
if (demoAdminBtn) {
  demoAdminBtn.addEventListener("click", () => {
    DocuMind.setAuth({ email: "admin@example.com", name: "관리자", role: "ADMIN" });
    window.location.href = "dashboard.html";
  });
}

/* ---------- 회원가입 ---------- */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const agree = document.getElementById("agree").checked;

    if (!name || !email || password.length < 8) {
      showAuthError("이름, 이메일, 8자 이상의 비밀번호를 입력해주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      showAuthError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agree) {
      showAuthError("이용약관 및 개인정보처리방침에 동의해주세요.");
      return;
    }

    DocuMind.setAuth({ email, name, role: "USER" });
    window.location.href = "login.html";
  });
}
