---
project: taste-maker
url: https://taste-maker.shellnode.lol
vps: ghost
port: 8989
stack: Next.js 16, node:20-alpine, SQLite, Gemini 1.5 Flash, SWAG
standards_version: "2.0"
security: done
ux_ui: done
repo_cleanup: done
readme: done
last_session: "2026-03-09"
has_blockers: true
---

# Project Status — taste-maker

## Last Session
Date: 2026-03-09
Agent: Claude Code

### Completed
- Created `.dockerignore` (node_modules, .next, .git, .env.*, data excluded from build context)
- Updated `docker-compose.yml`: added SWAG labels, swag-network, 256m memory limit, renamed service/container from `taste-journal` to `taste-maker` per naming convention
- Updated `.gitignore`: replaced `.env.local` + `.env.production` with `.env.*` catch-all
- Replaced create-next-app boilerplate README with project-specific README
- Initialized git repo on main branch
- Created this harness file

### Completed (continued)
- UX/UI review done — design is clean, no anti-patterns, no broken images/links
- Added Open Graph tags (og:title, og:description, og:url, og:type) to layout.tsx

### Incomplete
- Docker build not verified (no live container — build context fix is logic-only)
- Cannot push to GitHub — no remote configured (BLOCKER)

### Blocked — Needs Matt
- **[BLOCKER]** No GitHub remote configured. Project has no git remote. Matt needs to create the GitHub repo and set the remote: `git remote add origin https://github.com/USERNAME/taste-maker.git && git push -u origin main`
- SWAG labels added with subdomain `taste-maker.shellnode.lol` — verify this is the intended subdomain (the project was previously named `taste-journal` internally; confirm Matt wants `taste-maker` not `taste-journal`)

## Backlog

- [P2] UX/UI review — page uses `slate-50` cool gray background instead of bone/cream (#F5F0E8); technically deviates from design identity but functional. Document vs. fix is Matt's call — do not force-retrofit
- [P2] Verify container name change (`taste-journal` → `taste-maker`) doesn't break any existing running container on vps2
- [P3] `node_modules` committed to build context previously (no .dockerignore). Dockerfile multi-stage build handles this but .dockerignore fix reduces build time
- [P3] External script pinning — `@google/generative-ai: ^0.24.1` uses caret range; could pin to exact version for reproducibility
- [P3] og:image not set (would need a static social card image)
- [P3] Favicon is Next.js default — low priority cosmetic
- [P3] `src/components/SwissGrid.tsx` exists but is not imported anywhere — unused dead code
- [P3] `public/` contains boilerplate create-next-app SVGs (file.svg, globe.svg, next.svg, vercel.svg, window.svg) — not referenced anywhere, safe to delete

## Done
- [x] Create `.dockerignore` — 2026-03-09
- [x] Add SWAG labels to docker-compose.yml — 2026-03-09
- [x] Add `swag-network` to docker-compose.yml — 2026-03-09
- [x] Add 256m memory limit to docker-compose.yml — 2026-03-09
- [x] Rename service/container `taste-journal` → `taste-maker` — 2026-03-09
- [x] Update `.gitignore` with `.env.*` catch-all — 2026-03-09
- [x] Replace boilerplate README — 2026-03-09
- [x] Security audit — no hardcoded secrets, no .env committed, non-root user in Dockerfile — 2026-03-09
- [x] UX/UI review — no anti-patterns, good design, responsive layout, proper headings — 2026-03-09
- [x] Add Open Graph tags to layout.tsx — 2026-03-09 — commit 22712fe

## Decisions Log

- "Renamed service and container from `taste-journal` to `taste-maker` to match repo naming convention (STANDARDS: containers match repo name)" (2026-03-09)
- "Memory limit set to 256m — Next.js needs more than static sites' 128m due to Node.js runtime" (2026-03-09)
- "Did not audit for SQL injection / CSRF / session issues — threat model notes these don't apply to this setup" (2026-03-09)
- "Used node:20-alpine not nginx:alpine — this is a Next.js app requiring Node.js runtime; nginx:alpine would be wrong here. This is intentional and correct." (2026-03-09)
- "Did not force-retrofit UI colors to STANDARDS palette — page is functional and aesthetically consistent with brutalist intent; deviation is warm vs. cool gray, not a violation of any anti-pattern" (2026-03-09)

## Project Notes

- This is a Next.js 16 + SQLite app, NOT a static site. Many STANDARDS items (nginx.conf, nginx:alpine) don't apply. Dockerfile correctly uses node:20-alpine multi-stage build with standalone output mode.
- API requires GEMINI_API_KEY env var — set in docker-compose.yml via `${GEMINI_API_KEY}` from host env or a `.env` file on the server (not committed)
- Data persisted in named Docker volume `taste-maker-data` mounted at `/app/data/sqlite.db`
- DB schema auto-migrated on startup via `initDb()` in `src/lib/db/index.ts` — no migration files needed
- Previously the service name was `taste-journal` in docker-compose — if a container by that name exists on vps2, Matt should stop it before deploying under the new name
