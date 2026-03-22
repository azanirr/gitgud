# Let's Git Gud — Coffee & Board Games 🎲☕

A Nuxt 3 landing page + board game CRUD manager for your café in Bandung.

## Tech Stack
- **Nuxt 3** (Vue 3 + Nitro server)
- **Local JSON file** as the database (`server/data/games.json`) — zero config, no DB setup needed
- **Custom CSS** design system — no UI framework

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start dev server
```bash
npm run dev
```

### 3. Open in browser
```
http://localhost:3000
```

The app will auto-seed 6 example board games on first run.

---

## Features

### Landing Page (`/`)
- Hero section with animated hexagon grid
- About section
- Live game preview (pulls from your library)
- How It Works section
- Footer with IG link

### Game Library (`/games`)
- **Add** new board games with full details
- **Edit** existing games inline via modal
- **Delete** games (with confirmation)
- **Toggle availability** directly from the table row (click the status badge)
- **Search** by name or description
- **Filter** by category, availability, difficulty
- **Sort** by name, player count, or duration
- **View detail** by clicking any row
- **Pagination** (12 per page)
- Stats bar: total showing, available count, in-use count, category count

### Game Fields
| Field | Type | Notes |
|-------|------|-------|
| Name | text | Required |
| Category | select | Strategy, Party, Cooperative, RPG, Deck-Builder, etc. + custom |
| Min/Max Players | number | |
| Duration | number | In minutes |
| Difficulty | select | Easy, Medium, Hard, Expert |
| Description | textarea | Optional |
| Available | toggle | Available / In Use |

---

## Database
Games are stored in `server/data/games.json`.
This file is auto-created with 6 seed games on first run.
To reset: delete the file and restart the dev server.

---

## Deployment
For production (if needed later):
```bash
npm run build
npm run preview
```

For a real production database, replace `server/utils/db.ts` with a proper DB adapter (SQLite, PostgreSQL, etc.).
