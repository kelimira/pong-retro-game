const test = require('node:test'), assert = require('node:assert');
const { newState, step, H, PH, W, WIN } = require('./pong.js');

test('paddle clamps to walls', () => {
  const s = newState(); step(s, -1, 10); assert.equal(s.p, 0);
  step(s, 1, 10); assert.equal(s.p, H - PH);
});
test('ball bounces off top wall', () => {
  const s = newState(); s.ball = { x: 300, y: 1, vx: 0, vy: -100 }; step(s, 0, 0.1);
  assert.ok(s.ball.vy > 0);
});
test('player paddle returns ball', () => {
  const s = newState(); s.p = 100; s.ball = { x: 12, y: 130, vx: -200, vy: 0 }; step(s, 0, 0.01);
  assert.ok(s.ball.vx > 0); assert.equal(s.score[1], 0);
});
test('AI paddle returns ball', () => {
  const s = newState(); s.ai = 100; s.ball = { x: W - 22, y: 130, vx: 200, vy: 0 }; step(s, 0, 0.01);
  assert.ok(s.ball.vx < 0);
});
test('AI moves toward ball, speed-capped', () => {
  const s = newState(); s.ai = 0; s.ball = { x: 300, y: 390, vx: 0, vy: 0 }; step(s, 0, 0.1);
  assert.ok(s.ai > 0 && s.ai <= 22 + 1e-9);
});
test('missed ball scores for opponent and re-serves', () => {
  const s = newState(); s.p = 0; s.ball = { x: -20, y: 300, vx: -200, vy: 0 }; step(s, 0, 0.01);
  assert.deepEqual(s.score, [0, 1]); assert.equal(s.ball.x, W / 2);
  s.ball = { x: W + 5, y: 300, vx: 200, vy: 0 }; step(s, 0, 0.01);
  assert.deepEqual(s.score, [1, 1]);
});
test('game ends at WIN and freezes', () => {
  const s = newState(); s.score = [WIN - 1, 0]; s.ball = { x: W + 5, y: 300, vx: 200, vy: 0 }; step(s, 0, 0.01);
  assert.ok(s.over); const x = s.ball.x; step(s, 0, 0.1); assert.equal(s.ball.x, x);
});
test('ball bounces off bottom wall', () => {
  const s = newState(); s.ball = { x: 300, y: H - 11, vx: 0, vy: 100 }; step(s, 0, 0.1);
  assert.ok(s.ball.vy < 0);
});
test('bounce angle follows hit offset and speed is capped', () => {
  const s = newState(); s.p = 100; s.ball = { x: 12, y: 100, vx: -200, vy: 0 }; step(s, 0, 0.01);
  assert.ok(s.ball.vy < 0); // hit above paddle center -> deflect up
  const t = newState(); t.p = 100; t.ball = { x: 12, y: 130, vx: -2000, vy: 0 }; step(t, 0, 0.001);
  assert.ok(Math.hypot(t.ball.vx, t.ball.vy) <= 520 + 1e-9);
});
test('fast ball does not tunnel through paddle after a frame hitch', () => {
  const s = newState(); s.p = 100; s.ball = { x: 20, y: 130, vx: -520, vy: 0 }; step(s, 0, 0.05);
  assert.ok(s.ball.vx > 0); assert.equal(s.score[1], 0);
  const a = newState(); a.ai = 100; a.ball = { x: W - 30, y: 130, vx: 520, vy: 0 }; step(a, 0, 0.05);
  assert.ok(a.ball.vx < 0); assert.equal(a.score[0], 0);
});
test('loser receives the serve', () => {
  const s = newState(); s.ball = { x: W + 5, y: 300, vx: 200, vy: 0 }; step(s, 0, 0.01);
  assert.ok(s.ball.vx > 0); // player scored, AI (loser) receives
});
