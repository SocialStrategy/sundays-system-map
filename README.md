# Sunday's System Mapping Whiteboard

Interactive, collaborative whiteboard for mapping Sunday's Studios ecosystem (40 locations, ~1M visits/year, 8M promo emails, 2M SMS) and proposing new architecture.

Built with Next.js, React Flow, Liveblocks, and Tailwind.

## Features

- **Real‑time collaboration** – multiple users can edit simultaneously with presence indicators
- **Sunday’s‑specific node library** – studios, data stores, APIs, vendors, people
- **Layer toggling** – switch between current setup and proposed architecture
- **JSON import/export** – load from `architecture.json`, save updates
- **Comment pins** – attach threaded discussions to any node
- **Deployed on Vercel** – share via link, no login required

## Development

```bash
npm install
npm run dev
```

## Deployment

Auto‑deploys via Vercel on push to `main`. See `vercel.json` for build config.

## Data

Initial architecture extracted from PDF schematic: `architecture.json`.