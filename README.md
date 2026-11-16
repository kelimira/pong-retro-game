# Pong Retro Game

Classic Pong on a retro black-and-white canvas. You (left paddle) play an AI (right paddle).

## Run
Open `index.html` in a browser. No build or dependencies.

## Controls
- **W / ↑**: move paddle up
- **S / ↓**: move paddle down
- **Enter**: restart after a game ends

## Rules
- First to **7** points wins.
- Ball speeds up 5% per paddle hit (capped); hit position on the paddle sets the bounce angle.
- The player who loses a point receives the next serve.
- The AI paddle has capped speed, so it is beatable.

## Development
- `pong.js`: DOM-free game logic (`newState`, `step`), also exported for Node.
- `index.html`: canvas rendering and input.
- Tests: `npm test` (Node built-in test runner).
