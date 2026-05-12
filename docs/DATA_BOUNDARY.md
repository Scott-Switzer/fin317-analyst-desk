# FIN 317 Analyst Desk — Data Boundary

## Rule: No Raw FIN 317 Files in the Public Repo

The public repository (`fin317-analyst-desk`) **must never contain raw course materials** provided by the professor or sourced from copyrighted textbooks, lecture slides, or assignment documents.

## Why

- **Copyright compliance**: Raw lecture slides, PDFs, and problem sets may contain copyrighted material.
- **Academic integrity**: Publishing raw assignments could facilitate cheating.
- **Repository hygiene**: Keeps the public repo focused on application code and synthetic data.

## What Is Allowed in the Public Repo

The following content types are permitted and encouraged:

- **Synthetic data**: Fabricated financial scenarios, company profiles, and datasets created for the game.
- **Formulas and equations**: Standard finance formulas (e.g., NPV, IRR, WACC, CAPM) expressed in code or documentation.
- **Rubrics**: Scoring rubrics and grading criteria written from scratch.
- **High-level course map**: A summarized topic map showing what concepts are covered in which missions.
- **Derived summaries**: Original summaries of course concepts written in your own words.
- **AI prompt templates**: Prompts used to generate synthetic scenarios or feedback.
- **Application code**: Next.js, TypeScript, SQL, and configuration files.
- **Architecture and design docs**: Product specs, architecture decisions, and development guides.

## What Is NOT Allowed in the Public Repo

- Lecture slide decks (`.pptx`, `.pdf`)
- Assignment PDFs
- Exam or quiz documents
- Textbook excerpts
- Raw spreadsheets with professor-provided data (`.xlsx`, `.xls`, `.csv`)
- Scanned or photographed notes
- Any file that reproduces copyrighted material verbatim

## Where Raw Files Live

Raw course materials are stored in the **private corpus** repository (`fin317-course-corpus`), which is accessible only to approved team members. See `docs/TEAM_ONBOARDING.md` for linking instructions.

## Enforcement

- **Pre-commit check**: `scripts/check-no-raw-course-files.sh` scans for forbidden file types.
- **CI check**: The GitHub Actions workflow runs `pnpm check:raw-files` on every PR.
- **Code review**: PR reviewers must verify no raw files were added.

## If You Are Unsure

Ask yourself: "Did I create this data myself, or is it derived directly from a professor-provided file?" If it is directly from a professor file, it belongs in the private corpus. If you created it from scratch based on your understanding of the concepts, it can live in the public repo.
