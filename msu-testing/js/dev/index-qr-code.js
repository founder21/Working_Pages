import "./app.min.js";
import "./tabs.min.js";
import "./popup.min.js";
/* empty css          */
import "./inner.min.js";
/* empty css                    */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("createCodeBtn");
  const panel = document.getElementById("createCodeContainer");
  const content = document.querySelector(".qr-code__container");
  const closeBtn = panel.querySelector(".close-panel");
  if (!btn || !panel || !content) {
    console.error("Нет кнопки, панели или контейнера в DOM");
    return;
  }
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    content.style.display = "none";
    panel.classList.add("active");
  });
  closeBtn.addEventListener("click", () => {
    panel.classList.remove("active");
    setTimeout(() => {
      content.style.display = "";
    }, 400);
  });
});
