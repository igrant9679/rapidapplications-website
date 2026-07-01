# Deploying to Railway

This app is a **single Node service**: in production the Express/tRPC server
also serves the built React frontend, so you deploy **one** Railway service.

## What's in this repo for Railway

| File | Purpose |
|------|---------|
| `railway.json` | Build/start commands, health check, restart policy |
| `.nvmrc` + `engines.node` in `package.json` | Pins Node 22 (required by Vite 7) |
| `.env.example` | Every environment variable you must set (with notes) |

Railway auto-detects **pnpm** from `packageManager` in `package.json` and the
committed `pnpm-lock.yaml`, and installs with a frozen lockfile.

## Prerequisites

1. A **database**. Either keep the existing TiDB Cloud instance or add a Railway
   **MySQL** plugin. Either way, **rotate the credentials** — the old DB password,
   `JWT_SECRET`, and AWS keys were sitting in plaintext in `.project-config.json`.
2. Decide the **auth/media story** (see "Manus coupling" below).

## Steps

1. **Create the project** — Railway → *New Project* → *Deploy from GitHub repo* →
   select `igrant9679/communityforce-website`.
2. **Set environment variables** — in the service's *Variables* tab, add every
   value from `.env.example`. Do **not** set `PORT` (Railway injects it).
   - Reminder: `VITE_*` vars are read at **build time**, so they must be present
     before the first build.
3. **Build & start** are already defined in `railway.json`:
   - Build: `pnpm run build`  → outputs `dist/` (client → `dist/public`, server → `dist/index.js`)
   - Start: `pnpm run start`  → `node dist/index.js`
4. **Run database migrations** once the DB is reachable:
   - Locally against the prod DB: `DATABASE_URL=... pnpm run db:push`, **or**
   - From a Railway one-off shell: `pnpm run db:push`
5. **Generate a domain** — service → *Settings* → *Networking* → *Generate Domain*
   (or attach a custom domain). Railway terminates HTTPS for you.
6. **Register the domain with Manus OAuth** — add the deployed URL as an allowed
   OAuth redirect URI, or admin login will fail (see below).

## Health check

`railway.json` points the health check at `/`, which serves the static frontend
and does not depend on the database — so a deploy is marked healthy as soon as the
process is up.

## ⚠️ Manus coupling (read before expecting full functionality)

The **public site and blog** run on Railway with just `DATABASE_URL` + `JWT_SECRET`.
These features depend on **external Manus services** and only work if those remain
reachable from Railway and are configured for your deployed domain:

- **Admin login** → Manus OAuth (`OAUTH_SERVER_URL`, `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`)
- **Media uploads / storage, LLM chat, image generation, maps, voice, notifications**
  → Manus "Forge" API (`BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_KEY`)

If you want the site to be fully independent of Manus, those pieces need to be
replaced (self-hosted auth such as Auth.js/Clerk, direct AWS S3 for storage, and
re-implemented or disabled AI features).

## Notes / gotchas

- **Native deps:** `sharp` ships prebuilt binaries and works on Nixpacks out of the
  box. `canvas` (OG-image generation) is not an installed dependency, so no Cairo
  system libraries are required; OG images are simply disabled.
- **Port binding:** the server prefers `$PORT` and binds to it. The
  `findAvailablePort` fallback only matters if that port is busy, which never
  happens on Railway (the injected port is dedicated).
- **Crons:** the process starts scheduled-publishing and email-digest cron jobs on
  boot. Keep this to a **single instance** (no horizontal scaling) unless you add
  leader election, or the jobs will run multiple times.
