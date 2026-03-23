# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

enStudy（英文每日練習系統）— A daily English vocabulary learning app with spaced repetition, quizzes, reading, grammar, games, and audio playback. UI is in Chinese; vocabulary content is English.

## Commands

```bash
# Install all dependencies (root + server + client)
npm run install:all

# Development (starts both server:3001 and client:3000)
npm run dev

# Server only
npm run server

# Client only
npm run client

# Production build
npm run build    # outputs to client/dist
```

Windows shortcut: `start.bat`

## Architecture

**Client:** React 18 + Vite + React Router. Pages in `client/src/pages/`, components in `client/src/components/`. Vite proxies `/api/*` to the Express server.

**Server:** Express on port 3001. Routes in `server/routes/` delegate to services in `server/services/`. Static vocabulary/phrase/grammar data lives in `server/data/`.

**Database:** SQLite via sql.js (in-memory with auto-save to `enstudy.db` every 30 seconds). Schema defined in `server/db/schema.js`. Query helpers (`queryAll`, `queryOne`, `run`, `queryScalar`) in `server/db/helpers.js`.

## Key Services

- **daily-session.js** — Orchestrates daily content: picks new words/phrases, selects SRS review items, generates dialogue sentences, persists to `daily_sentences` table.
- **mastery-service.js** — Spaced repetition with 6 levels (intervals: 1, 3, 7, 14, 30, 90 days). Wrong answer resets to level 0.
- **sentence-generator.js** — Example-based dialogue templates using `{word}`, `{meaning}`, `{example}` placeholders. `cleanMeaning()` strips semicolons from meanings.
- **round-service.js** — Learning rounds with customizable word/phrase pace.
- **word-service.js / phrase-service.js** — CRUD + selection of new/learned items, respecting round boundaries.

## Data Flow

1. Client calls `GET /api/daily` → `daily-session.js.getDailyContent(date)`
2. Service checks `learning_log` for existing day, or generates new content (words, phrases, reviews)
3. Dialogues are generated via `sentence-generator.js` and cached in `daily_sentences`
4. Quiz submissions (`POST /api/quiz/submit`) update `word_mastery` via mastery service

## Conventions

- All vocabulary data files are in `server/data/` (words.js, words1-18.js, phrases.js-phrases4.js, grammar.js, stories.js)
- Dialogue output format: `{ lines: [{speaker, text, zh}], highlightWords: [string] }` — do not change this shape, LearnPage depends on it
- Database saves are explicit via `saveDb()` after write operations
- Chinese meanings may contain semicolons (e.g. "輕的；光") — use `cleanMeaning()` when displaying
- Custom hooks: `useApi` (GET with loading state), `useTTS` (Web Speech API wrapper)
