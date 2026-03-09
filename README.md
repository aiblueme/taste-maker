# taste-maker

Personal food logging and palate analysis system with Gemini AI flavor profiling.

## Live

https://taste-maker.shellnode.lol

## Stack

- Next.js 16 (App Router) with TypeScript
- SQLite via better-sqlite3 + drizzle-orm
- Gemini 1.5 Flash for flavor analysis and dish discovery
- node:20-alpine container
- Ghost VPS / Docker
- SSL via SWAG + Cloudflare DNS

## Run Locally

Copy `.env.example` to `.env.local` and add your `GEMINI_API_KEY`.

    npm install
    npm run dev

Or with Docker:

    docker build -t taste-maker .
    docker run -p 8989:8989 --env GEMINI_API_KEY=your_key taste-maker

## Deploy

    docker context use ghost
    docker compose up -d --build

## Data Sources

Personal meal logs stored in local SQLite. Flavor profiles analyzed by Gemini 1.5 Flash.
