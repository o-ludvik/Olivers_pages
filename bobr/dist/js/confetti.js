export function confetti() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.getElementById("confetti"), ctx = cv && cv.getContext("2d"); if (!ctx) return;
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ["#E9A72B", "#2C88B0", "#2F8A50", "#D9533B", "#94592F"];
  const parts = Array.from({ length: 90 }, () => ({ x: innerWidth / 2, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 12 - 3, s: Math.random() * 7 + 4, c: cols[Math.floor(Math.random() * cols.length)], r: Math.random() * 6 }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.r += .1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); });
    if (++f < 110) requestAnimationFrame(tick); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}
