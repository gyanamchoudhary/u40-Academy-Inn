import { createApp } from "./app";

// Entry used by @hono/vite-dev-server during local development.
// Production runs as a Cloudflare Worker (see api/worker.ts).
// Note: DB-backed API calls require a D1 binding — use `wrangler dev`
// for full-stack local development.
export default createApp();
