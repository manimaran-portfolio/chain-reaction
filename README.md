# Chain Reaction

A browser strategy game for 2–8 human players. Play on the same device or host an online room and share a six-character code or invite link.

**[Play the game](https://chain-reaction-cube.m4n1g.chatgpt.site/)**

## Gameplay demo

[Watch the 5-second recording of actual gameplay](docs/chain-reaction-demo.mp4) — a corner explosion, capture, and victory.

## Features

- 6 × 6 and 8 × 8 boards
- Animated simultaneous chain reactions, captures, and synthesized 8-bit sound
- Turn-colored grid lines and a distraction-free focus mode
- Online rooms with server-validated turns, refresh recovery, and disconnected-host handoff
- Immediate local placement feedback with authoritative server reconciliation

## Run locally

Requires Node.js 22.13 or later (the preview uses built-in SQLite).

```sh
npm ci
npm run build
npm run dev
```

Open http://127.0.0.1:4173/. Rebuild after changing source; the preview loads the latest Worker build automatically. Local room data lives in the ignored `.sites-runtime/rooms.sqlite`.

```sh
npm test
```

## Rules

Place an orb in an empty cell or one of your own color. Critical mass equals the number of orthogonal neighbors: corners burst at 2, sides at 3, and interiors at 4. A burst distributes one orb to every neighbor and converts its existing orbs. Reactions finish before the next turn. Players who have entered the game are eliminated when they lose all their orbs; the final survivor wins.

## Source

- `web/index.html`: interface, graphics, audio, and multiplayer client
- `worker/api.mjs`: room API and authoritative move resolution
- `worker/engine.mjs`: game engine, generated from the inline engine in the HTML by the build
- `db/schema.ts` and `drizzle/`: D1 schema and migrations
- `scripts/`: build and local preview
- `tests/`: game client and multiplayer API tests

The current production deployment uses Sites, a Cloudflare Worker, and D1. `.openai/hosting.json` identifies the existing Site; replace its project registration for your own deployment. The local Node preview is a development adapter, not a production server. Online updates currently use short conditional polling.

The 3D implementation is retained in the source; the current interface intentionally exposes only the 2D board.
