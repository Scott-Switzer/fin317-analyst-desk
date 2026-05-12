# FIN 317 Analyst Desk — Local Development Guide

## Prerequisites

### 1. Install pnpm
If you don't have pnpm installed:

```bash
npm install -g pnpm
```

Or use Corepack (comes with Node.js 16.10+):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### 2. Install Docker
Supabase local development requires Docker. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Mac/Windows) or Docker Engine (Linux).

Ensure Docker is running:

```bash
docker info
```

### 3. Node.js
Requires Node.js 20+. Check with:

```bash
node -v
```

## Setup

### 1. Navigate to the Project

```bash
cd ~/Desktop/FenriXFinance/fin317-analyst-desk
```

### 2. Quick Setup Checklist

Follow these steps in order:

- [ ] Open **Docker Desktop** and verify with:
  ```bash
  docker info
  ```
- [ ] Install dependencies:
  ```bash
  pnpm install
  ```
- [ ] Validate your local environment:
  ```bash
  pnpm check:local-env
  ```
- [ ] Start local Supabase:
  ```bash
  npx supabase start
  ```
- [ ] Reset and seed the local database:
  ```bash
  npx supabase db reset
  ```
- [ ] Get local credentials:
  ```bash
  npx supabase status -o env
  ```
- [ ] Create `.env.local` from the example:
  ```bash
  cp .env.example .env.local
  ```
- [ ] Add the local credentials to `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL` — from `npx supabase status -o env` output (`API URL`)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from `npx supabase status -o env` output (`anon key`)
  - `OPENAI_API_KEY` (optional, for AI feedback testing)
- [ ] Start the dev server:
  ```bash
  pnpm dev
  ```
- [ ] Open [http://localhost:3000](http://localhost:3000).

### 3. Environment Variables
Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your values:
- `NEXT_PUBLIC_SUPABASE_URL` and keys from `npx supabase status -o env`
- `OPENAI_API_KEY` (optional for AI feedback testing)

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm build` | Build production bundle |
| `pnpm lint` | Run ESLint |
| `pnpm check:raw-files` | Run data boundary check script |
| `npx supabase start` | Start local Supabase stack |
| `npx supabase stop` | Stop local Supabase stack |
| `npx supabase status` | Show local Supabase credentials |
| `npx supabase db reset` | Reset local database |

## Optional: Link Private Corpus

If you are an approved contributor with access to the private corpus:

```bash
./scripts/link-private-corpus.sh
```

This creates a symlink from `private_corpus` to the private course materials. The symlink is already ignored by `.gitignore`.

## Hosted Supabase Demo (No Docker Required)

If Docker is unavailable or broken, use the hosted Supabase project directly:

1. Go to **Supabase Dashboard** → [Project tgyxeawyihzhrzdwvyuy](https://supabase.com/dashboard/project/tgyxeawyihzhrzdwvyuy)
2. Open **SQL Editor** (left sidebar)
3. Run the migration file — copy and paste the contents of:
   ```
   supabase/migrations/20250512000001_init_schema.sql
   ```
4. Then run the seed data — copy and paste the contents of:
   ```
   supabase/seed.sql
   ```
5. Go to **Project Settings → API** (gear icon)
6. Copy:
   - **Project URL**: `https://tgyxeawyihzhrzdwvyuy.supabase.co`
   - **anon public** key
7. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tgyxeawyihzhrzdwvyuy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-dashboard>
   ```
8. Start the app:
   ```bash
   pnpm dev
   ```
9. Open:
   - http://localhost:3000
   - http://localhost:3000/missions/project-falcon
   - http://localhost:3000/professor

**Note**: The app runs in **fallback mode** if no `.env.local` is configured — it uses a local JSON scenario file and mock analytics. This is useful for UI demos without any database at all.

## Troubleshooting

### Docker Daemon Issues
If Docker commands hang or report I/O errors:
- Open Docker Desktop → **Troubleshoot** (bug icon) → **Clean / Purge data**
- Restart Docker Desktop
- As a workaround, use the [Hosted Supabase Demo](#hosted-supabase-demo-no-docker-required) path above

### Port Conflicts
If port 3000 is taken, Next.js will prompt you to use another port. Supabase uses ports 54321–54326 by default.

### Supabase Edge Functions
To serve edge functions locally:

```bash
npx supabase functions serve
```

### Database Migrations
Apply new migrations:

```bash
npx supabase migration up
```

## Testing

Run the full test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test -- --watch
```
