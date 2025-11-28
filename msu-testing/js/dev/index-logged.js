import "./app.min.js";
/* empty css          */
import "./inner.min.js";
/* empty css                    */
document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("myWideChart");
  const ctx = canvas.getContext("2d");
  const tooltip = document.getElementById("wideTooltip");
  const labels = [
    "01:01",
    "05:01",
    "09:01",
    "13:01",
    "17:01",
    "21:01",
    "25:01",
    "29:01"
  ];
  const data = [0, 320, 488, 200, 100, 600, 950, 1e3];
  function drawWideChart() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const paddingX = 48;
    const paddingY = 56;
    const maxY = 1e3;
    const gridColor = "#2e3646";
    const gradient = ctx.createLinearGradient(paddingX, 0, w - paddingX, 0);
    gradient.addColorStop(0, "#2dffbe");
    gradient.addColorStop(1, "#1affd5");
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    [0, 100, 500, 1e3].forEach((yVal) => {
      const y = h - paddingY - (h - 2 * paddingY) * (yVal / maxY);
      ctx.setLineDash([7, 10]);
      ctx.beginPath();
      ctx.moveTo(paddingX, y);
      ctx.lineTo(w - paddingX, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "15px 'Inter', sans-serif";
      ctx.fillStyle = "#6c7a8c";
      ctx.fillText(yVal === 1e3 ? "1k" : yVal, 10, y + 6);
    });
    ctx.strokeStyle = gridColor;
    ctx.beginPath();
    ctx.moveTo(paddingX, h - paddingY);
    ctx.lineTo(w - paddingX, h - paddingY);
    ctx.stroke();
    ctx.font = "15px 'Inter', sans-serif";
    ctx.fillStyle = "#6c7a8c";
    labels.forEach((label, i) => {
      const x = paddingX + (w - 2 * paddingX) * (i / (labels.length - 1));
      ctx.fillText(label, x - 22, h - paddingY + 32);
    });
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.shadowColor = "#2dffbe44";
    ctx.shadowBlur = 12;
    for (let i = 0; i < data.length; i++) {
      const x = paddingX + (w - 2 * paddingX) * (i / (data.length - 1));
      const y = h - paddingY - (h - 2 * paddingY) * (data[i] / maxY);
      if (i === 0) ctx.moveTo(x, y);
      else {
        const prevX = paddingX + (w - 2 * paddingX) * ((i - 1) / (data.length - 1));
        const prevY = h - paddingY - (h - 2 * paddingY) * (data[i - 1] / maxY);
        const cx = (prevX + x) / 2;
        ctx.bezierCurveTo(cx, prevY, cx, y, x, y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    for (let i = 0; i < data.length; i++) {
      const x = paddingX + (w - 2 * paddingX) * (i / (data.length - 1));
      const y = h - paddingY - (h - 2 * paddingY) * (data[i] / maxY);
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#2dffbe";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
  function resizeAndDraw() {
    const container = document.querySelector(".chart-fullwidth-container");
    canvas.width = container.offsetWidth;
    canvas.height = 320;
    drawWideChart();
  }
  window.addEventListener("resize", resizeAndDraw);
  resizeAndDraw();
  canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;
    const paddingX = 48;
    const paddingY = 56;
    const maxY = 1e3;
    let found = false;
    for (let i = 0; i < data.length; i++) {
      const x = paddingX + (w - 2 * paddingX) * (i / (data.length - 1));
      const y = h - paddingY - (h - 2 * paddingY) * (data[i] / maxY);
      if (Math.abs(mouseX - x) < 14 && Math.abs(mouseY - y) < 14) {
        let left = x;
        let top = y - 24;
        tooltip.innerHTML = `${labels[i]}<br>Views: ${data[i]}`;
        tooltip.style.opacity = 1;
        tooltip.style.display = "block";
        const tipRect = tooltip.getBoundingClientRect();
        canvas.getBoundingClientRect();
        if (left - tipRect.width / 2 < 0) {
          left = tipRect.width / 2 + 2;
        }
        if (left + tipRect.width / 2 > canvas.width) {
          left = canvas.width - tipRect.width / 2 - 2;
        }
        if (top - tipRect.height < 0) {
          top = y + 28;
        }
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        found = true;
        break;
      }
    }
    if (!found) {
      tooltip.style.opacity = 0;
      tooltip.style.display = "none";
    }
  });
  canvas.addEventListener("mouseleave", function() {
    tooltip.style.opacity = 0;
    tooltip.style.display = "none";
  });
});
