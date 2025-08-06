import { f as bodyLockStatus, g as bodyLockToggle } from "./app.min.js";
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menudash]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menudash]") ? window.addEventListener("load", menuInit) : null;
