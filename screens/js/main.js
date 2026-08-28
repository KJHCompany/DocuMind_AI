/* 메인 랜딩 화면 — FAQ 아코디언 + 라이브 프리뷰 탭 전환 */

document.querySelectorAll(".faq-item .faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((el) => el.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
  });
});

const previewTabs = document.getElementById("previewTabs");
if (previewTabs) {
  previewTabs.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      previewTabs.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.tab;
      document.querySelectorAll(".preview-body").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.panel !== target);
      });
    });
  });
}
