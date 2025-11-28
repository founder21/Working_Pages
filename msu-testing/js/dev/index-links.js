import "./app.min.js";
import "./popup.min.js";
/* empty css          */
import "./inner.min.js";
/* empty css                    */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("createLinkBtn");
  const panel = document.getElementById("createLinkContainer");
  const content = document.querySelector(".linked__container");
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
