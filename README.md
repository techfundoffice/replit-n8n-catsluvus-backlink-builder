# 🔗 Backlink Builder

**Automated SEO backlink generation across 3,000+ web directories & Whois sites**

A standalone web application that automatically submits your domain to whois lookups, website analyzers, DNS tools, and business directories to build organic backlinks at scale.

![Backlink Builder](https://img.shields.io/badge/Vue%203-Frontend-42b883) ![Express](https://img.shields.io/badge/Express-Backend-000000) ![TypeScript](https://img.shields.io/badge/TypeScript-Full%20Stack-3178c6)

## Features

- ⚡ **Automated submission** to 45+ directory & lookup sites per domain
- 🧪 **Dry run mode** — simulate builds without making real requests
- 📊 **Live activity log** with real-time progress tracking
- �� **Domain power gauge** and success rate metrics
- 🔄 **Smart deduplication** — skips already-submitted URLs (localStorage + server DB)
- ⚙️ **Configurable speed** — Safe / Balanced / Aggressive modes
- 📅 **Schedule toggles** for daily auto-build, weekly reports, retry failed
- 🗃️ **Optional PostgreSQL** persistence (works without DB via localStorage)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/techfundoffice/replit-n8n-catsluvus-backlink-builder.git
cd replit-n8n-catsluvus-backlink-builder

# Install all dependencies
npm run install:all

# Start development (server + client with hot reload)
npm run dev
```

Open **http://localhost:5173** in your browser.

## Production

```bash
# Build the Vue frontend
npm run build

# Start the Express server (serves built frontend + API)
npm start
```

The app will be available at **http://localhost:3001**.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | No | — | PostgreSQL connection string for server-side persistence |
| `PORT` | No | `3001` | Express server port |

Copy `.env.example` to `.env` and configure as needed. The app works **without any environment variables** — all history is stored in the browser's localStorage.

## Architecture

```
├── server/
│   ├── index.ts       # Express server with 3 API routes + static serving
│   ├── db.ts          # Optional PostgreSQL connection via Drizzle ORM
│   └── schema.ts      # backlink_submissions table definition
├── client/
│   ├── src/
│   │   ├── App.vue              # Minimal app shell
│   │   └── views/
│   │       └── BacklinkBuilder.vue  # Main UI component (1,369 lines)
│   ├── vite.config.ts           # Vite config with API proxy
│   └── index.html
├── package.json       # Root scripts: dev, build, start
└── .env.example
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/backlink-urls` | Returns the URL template database |
| `POST` | `/api/backlink-submit` | Proxies URL submission & saves to DB |
| `GET` | `/api/backlink-history/:domain` | Returns submission history for a domain |

## How It Works

1. Enter your target domain (e.g., `catsluvus.com`)
2. The builder replaces `DOMAIN` in 45+ URL templates with your domain
3. Each URL is visited server-side (avoiding CORS), creating a backlink
4. Results are logged in real-time with success/fail status
5. Successful submissions are saved to prevent duplicate submissions

## License

MIT
