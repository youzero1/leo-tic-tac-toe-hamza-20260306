# Leo Tic Tac Toe

A social media-oriented tic-tac-toe game built with Next.js, TypeScript, and SQLite.

## Features

- 🎮 Fully functional 3x3 tic-tac-toe game
- 👥 Player management with persistent stats (wins, losses, draws)
- 🏆 Leaderboard ranked by wins
- 📜 Game history
- 📤 Social sharing of game results
- 🌙 Dark mode, modern UI

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker

```bash
docker-compose up --build
```

## Environment Variables

See `.env` for configuration options:

```
DATABASE_PATH=./database.sqlite
NEXT_PUBLIC_APP_NAME=Leo Tic Tac Toe
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite via better-sqlite3
- **ORM**: TypeORM
- **Styling**: CSS-in-JS with global CSS variables
