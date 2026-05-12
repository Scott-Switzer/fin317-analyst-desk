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

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/fin317-analyst-desk.git
cd fin317-analyst-desk
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables
Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your values:
- `NEXT_PUBLIC_SUPABASE_URL` and keys from `npx supabase status`
- `OPENAI_API_KEY` (optional for AI feedback testing)

### 4. Start Supabase Locally

```bash
npx supabase start
```

This starts the local Postgres, Auth, Storage, and Edge Functions. Note the API URL and anon key printed in the terminal.

Update `.env.local` with the local Supabase credentials.

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

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

## Troubleshooting

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
