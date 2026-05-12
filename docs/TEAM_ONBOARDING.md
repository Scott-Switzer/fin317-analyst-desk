# FIN 317 Analyst Desk — Team Onboarding

Welcome to the FIN 317 Analyst Desk team. This guide will get you set up and productive.

## Repositories

We maintain **two repositories**:

1. **Public Repo** (`fin317-analyst-desk`): Application code, synthetic data, docs.
   - URL: `https://github.com/your-org/fin317-analyst-desk`
   - Visibility: Public (or internal to your org)

2. **Private Corpus** (`fin317-course-corpus`): Raw course materials, lecture notes, assignment PDFs.
   - URL: `https://github.com/your-org/fin317-course-corpus`
   - Visibility: Private
   - Access: Approved contributors only

## Step 1: Clone the Public Repo

Everyone starts here.

```bash
git clone https://github.com/your-org/fin317-analyst-desk.git
cd fin317-analyst-desk
pnpm install
```

Follow `docs/LOCAL_DEV.md` to complete setup.

## Step 2: Access the Private Corpus (Approved Contributors Only)

If you have been granted access:

```bash
# Clone the private corpus adjacent to the public repo
cd ..
git clone https://github.com/your-org/fin317-course-corpus.git
cd fin317-analyst-desk
```

## Step 3: Link the Private Corpus

Create a symlink so the public repo can reference private materials during development:

```bash
./scripts/link-private-corpus.sh
```

Verify:

```bash
ls -la private_corpus
```

**Never commit the `private_corpus` symlink contents.** It is already `.gitignore`d.

## Branch Workflow

We use a simple GitHub Flow:

1. **Main Branch**: `main` is always deployable.
2. **Feature Branches**: Create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit Frequently**: Write clear, atomic commits.
4. **Push and PR**: Push your branch and open a Pull Request against `main`.

### Naming Conventions

- `feature/...` — New features
- `fix/...` — Bug fixes
- `docs/...` — Documentation updates
- `chore/...` — Maintenance tasks

## PR Expectations

Every Pull Request must:

1. **Describe the change**: What problem does it solve? How does it solve it?
2. **Reference issues**: Link to related GitHub issues.
3. **Include tests**: New features and bug fixes need tests.
4. **Pass CI**: All GitHub Actions checks must be green.
5. **Data boundary check**: Ensure no raw course files were added (`pnpm check:raw-files`).
6. **Update docs**: If you changed architecture or setup, update the relevant docs.

### Review Process

- At least one approval required before merging.
- Address review comments promptly.
- Squash-merge if the commit history is noisy.

## Test Requirements

- **Unit tests**: All utility functions and grading logic must have unit tests (Vitest).
- **Component tests**: Critical UI components should have React Testing Library tests.
- **Integration tests**: E2E tests for critical user flows (optional for MVP, required post-MVP).
- **Coverage**: Aim for >70% coverage on `src/lib/` and `src/app/api/`.

Run tests before every PR:

```bash
pnpm test
```

## Data Boundary Rules

**This is critical. Violations can get us in legal and academic trouble.**

1. **No raw course files in the public repo.**
   - No PDFs, PPTX, DOCX, XLSX, XLS, CSV from the professor.
   - No scanned notes or textbook excerpts.
2. **Synthetic data only in public repo.**
   - All scenarios and datasets in the public repo must be fabricated by us.
3. **Private corpus for reference only.**
   - Use it to understand concepts, then write your own scenarios.
   - Do not copy problem text or numbers directly.

When in doubt, ask the tech lead or professor.

## Getting Help

- **Docs**: Check `docs/` first.
- **Issues**: Open a GitHub issue for bugs or feature requests.
- **Discussions**: Use GitHub Discussions for questions and ideas.
- **Slack/Discord**: [Your team channel link here]

## Your First Task

1. Get local dev running (`docs/LOCAL_DEV.md`).
2. Run the test suite (`pnpm test`).
3. Read `docs/PRODUCT_SPEC.md`.
4. Pick up a "good first issue" from GitHub.
