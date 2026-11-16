// Pure game logic (no DOM) so it can be unit-tested in node.
(function () { // IIFE: keep names out of the global scope so index.html can destructure them
const W = 640, H = 400, PW = 10, PH = 70, BS = 10, PSPEED = 300, AISPEED = 220, WIN = 7;

function newState() {
  return { ball: { x: W / 2, y: H / 2, vx: 240, vy: 120 }, p: H / 2 - PH / 2, ai: H / 2 - PH / 2, score: [0, 0], over: false };
}

function serve(s, dir) {
  s.ball = { x: W / 2, y: H / 2, vx: 240 * dir, vy: (Math.random() < 0.5 ? -1 : 1) * 120 };
}

const clamp = (v) => Math.max(0, Math.min(H - PH, v));

// input: -1 up, 0 none, 1 down; dt in seconds
function step(s, input, dt) {
  if (s.over) return s;
  const b = s.ball;
  s.p = clamp(s.p + input * PSPEED * dt);
  // AI tracks ball center with capped speed so it is beatable
  const diff = b.y - (s.ai + PH / 2);
  s.ai = clamp(s.ai + Math.sign(diff) * Math.min(Math.abs(diff), AISPEED * dt));
  const px = b.x;
  b.x += b.vx * dt; b.y += b.vy * dt;
  if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy); }
  if (b.y > H - BS) { b.y = H - BS; b.vy = -Math.abs(b.vy); }
  // paddles: player at left, ai at right
  const hit = (py) => b.y + BS > py && b.y < py + PH;
  if (b.vx < 0 && b.x <= PW && px >= PW && hit(s.p)) bounce(b, s.p, 1);
  if (b.vx > 0 && b.x + BS >= W - PW && px + BS < W && hit(s.ai)) bounce(b, s.ai, -1);
  if (b.x + BS < 0) point(s, 1);
  else if (b.x > W) point(s, 0);
  return s;
}

function bounce(b, py, dir) {
  const off = (b.y + BS / 2 - (py + PH / 2)) / (PH / 2); // -1..1
  const speed = Math.min(Math.hypot(b.vx, b.vy) * 1.05, 520);
  const ang = off * (Math.PI / 4);
  b.vx = dir * speed * Math.cos(ang); b.vy = speed * Math.sin(ang);
  b.x = dir > 0 ? PW : W - PW - BS;
}

function point(s, who) {
  s.score[who]++;
  if (s.score[who] >= WIN) { s.over = true; return; }
  serve(s, who === 0 ? 1 : -1); // loser receives serve
}

const api = { W, H, PW, PH, BS, WIN, newState, step };
if (typeof module !== 'undefined') module.exports = api; else globalThis.Pong = api;
})();
