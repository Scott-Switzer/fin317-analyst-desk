# FIN 317 Analyst Desk — Product Specification

## Concept

FIN 317 Analyst Desk is a gamified financial analysis training platform designed for students taking an upper-division corporate finance course. Students step into the role of a junior investment analyst at a fictional investment bank. They receive structured deal scenarios, perform financial analysis, write investment memos, submit their recommendations, and receive instant deterministic grading plus AI-powered qualitative feedback.

## Core Loop

1. **Receive Scenario**: Student opens a mission and reads the scenario narrative, financial data, and deliverable requirements.
2. **Analyze**: Student uses built-in spreadsheet tools or scratchpad to perform calculations (NPV, IRR, WACC, ratio analysis, etc.).
3. **Write Memo**: Student drafts a structured investment memo with recommendation (Buy/Hold/Sell), supporting calculations, and risk assessment.
4. **Submit**: Student submits the memo for grading.
5. **Get Score**: Deterministic grading engine evaluates numerical answers against answer keys and rubrics.
6. **Get Feedback**: AI feedback engine reviews the memo text, compares reasoning against the deterministic calculation, and identifies conceptual or logical errors.
7. **Iterate**: Student revises and resubmits, or advances to the next mission.

## Gamification Elements

- **XP & Levels**: Students earn experience points for correct calculations, well-structured memos, and streaks.
- **Badges**: Achievement badges for milestones (e.g., "First Perfect Score", "Speed Demon", "Capital Budgeting Master").
- **Streaks**: Consecutive daily missions.
- **Leaderboards**: Class-wide and cohort-wide rankings.
- **Rank Titles**: Progression from Analyst → Senior Analyst → Associate → Vice President.
- **Unlock System**: Advanced scenarios unlock after prerequisite missions are completed with minimum scores.

## MVP Mission: Project Falcon

Project Falcon is the first end-to-end mission designed for the MVP.

- **Topic**: Capital budgeting and investment decision analysis.
- **Scenario**: A mid-market manufacturing firm is considering a major capacity expansion. Students must calculate NPV, IRR, payback period, and recommend whether to approve the project.
- **Deliverable**: A two-page investment memo with quantitative appendix.
- **Difficulty**: Introductory (Tier 1).
- **Learning Objectives**:
  - Apply discounted cash flow techniques.
  - Incorporate terminal value and salvage correctly.
  - Assess project risk and sensitivity.
  - Communicate findings in professional memo format.

## Features

### MVP Features
- Scenario engine with JSON-defined scenarios and answer keys.
- Deterministic grading library for numerical answers.
- AI feedback edge function for qualitative memo review.
- Student dashboard showing missions, progress, and scores.
- Memo composition UI with rich text or markdown.
- Supabase authentication and user profiles.
- Professor dashboard to view class analytics and flagged submissions.

### Post-MVP Features
- Multi-step scenario chains (e.g., M&A deal from teaser to closing).
- Real-time collaborative spreadsheets.
- Peer review mode.
- Advanced analytics and learning path recommendations.
- Mobile-optimized experience.
- Integration with LMS (Canvas, Blackboard).
