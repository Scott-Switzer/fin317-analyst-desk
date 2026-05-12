# FIN 317 Analyst Desk

A gamified financial analysis training platform for upper-division corporate finance students. Students step into the role of a junior investment analyst, tackle structured deal scenarios, write investment memos, and receive instant deterministic grading plus AI-powered qualitative feedback.

## Stack

- **Frontend**: Next.js 15+, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Testing**: Vitest, React Testing Library
- **AI**: OpenAI API (via Supabase Edge Functions)
- **Deployment**: Vercel + Supabase

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) (via `npm install -g pnpm` or `corepack enable`)
- [Docker](https://www.docker.com/) (for local Supabase)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/fin317-analyst-desk.git
cd fin317-analyst-desk

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and OpenAI credentials

# Start local Supabase stack
npx supabase start

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For detailed setup, see [docs/LOCAL_DEV.md](docs/LOCAL_DEV.md).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js development server |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server |
| `pnpm test` | Run unit and component tests |
| `pnpm lint` | Run ESLint |
| `pnpm check:raw-files` | Validate no raw course files are in the repo |

## Private Corpus

This public repository contains application code and synthetic data only. Raw FIN 317 course materials live in a separate private repository.

If you are an approved contributor, clone the private corpus adjacent to this repo and link it:

```bash
./scripts/link-private-corpus.sh
```

See [docs/TEAM_ONBOARDING.md](docs/TEAM_ONBOARDING.md) and [docs/DATA_BOUNDARY.md](docs/DATA_BOUNDARY.md) for details.

## Contributing

We welcome contributions! Please read:

- [docs/TEAM_ONBOARDING.md](docs/TEAM_ONBOARDING.md) — Branch workflow, PR expectations, test requirements
- [docs/DATA_BOUNDARY.md](docs/DATA_BOUNDARY.md) — Critical rules about what can and cannot be committed
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture and tech decisions

## License

[MIT](LICENSE) — © 2025 FIN 317 Analyst Desk Team
