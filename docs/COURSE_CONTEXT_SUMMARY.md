# FIN 317 Analyst Desk — Course Context Summary

This document provides a high-level summary of the FIN 317 course context as derived from course materials. It does **not** contain raw text or copyrighted material.

## Topic Map

FIN 317 covers the following major areas, which map directly to Analyst Desk missions:

### 1. Financial Statement Analysis
- Ratio analysis (liquidity, profitability, leverage, efficiency).
- Common-size statements and trend analysis.
- DuPont decomposition of ROE.

### 2. Time Value of Money & Valuation
- Present and future value of single sums and annuities.
- Bond valuation: yield to maturity, price sensitivity.
- Stock valuation: DDM, Gordon growth model, multi-stage models.

### 3. Capital Budgeting
- NPV, IRR, payback period, discounted payback.
- Profitability index and equivalent annual annuity.
- Replacement decisions and project interactions.
- Sensitivity and scenario analysis.

### 4. Cost of Capital
- Weighted average cost of capital (WACC).
- Cost of equity: CAPM, dividend growth model.
- Cost of debt and preferred stock.
- Divisional and project-specific costs of capital.

### 5. Risk & Return
- Portfolio theory: expected return, variance, diversification.
- Systematic vs. unsystematic risk.
- CAPM and security market line.

### 6. Working Capital Management
- Cash conversion cycle.
- Inventory, receivables, and payables management.
- Short-term financing.

### 7. Special Topics (Advanced)
- Real options in capital budgeting.
- International finance basics.
- M&A fundamentals (if covered).

## Key Formulas

The following standard finance formulas are used throughout the game:

- **NPV**: Σ(CFt / (1+r)^t)
- **IRR**: Rate where NPV = 0
- **WACC**: (E/V)×Re + (D/V)×Rd×(1-Tc)
- **CAPM**: Re = Rf + β(Rm - Rf)
- **Gordon Growth**: P0 = D1 / (r - g)
- **Current Ratio**: Current Assets / Current Liabilities
- **ROE**: Net Income / Shareholders' Equity

These are expressed in code within the grading library and in documentation as original formulations.

## Problem Patterns

Common problem structures encountered in the course:

1. **Standalone Project Evaluation**: Given cash flows and discount rate, decide whether to accept.
2. **Mutually Exclusive Projects**: Compare two or more projects using NPV or EAA.
3. **Replacement Chain / Common Life**: Adjust for unequal project lives.
4. **Capital Rationing**: Select optimal portfolio under a budget constraint.
5. **Sensitivity Tables**: Vary one input and observe NPV/IRR changes.
6. **Break-even Analysis**: Find the input value that makes NPV = 0.
7. **Leverage & Risk**: Incorporate changing capital structure or risk profiles.

## Professor Style

Based on derived understanding of the course delivery:

- **Rigorous and Detail-Oriented**: Expects precise calculations and correct application of formulas.
- **Emphasizes Logical Reasoning**: Values clear justification for recommendations over rote calculation.
- **Professional Communication**: Stresses the importance of presenting findings in a structured, professional format (memos, reports).
- **Real-World Application**: Prefers scenarios that mirror actual corporate finance decisions rather than abstract puzzles.
- **Incremental Complexity**: Builds from foundational concepts to multi-step integrated problems.

## Game Design Context

These observations inform the Analyst Desk experience:

- **Analyst Persona**: Students role-play as junior analysts at a boutique investment bank, mirroring the professional communication emphasis.
- **Memo Format**: The deliverable is an investment memo, directly practicing the structured reporting the professor values.
- **Progressive Difficulty**: Missions map to the course topic progression, starting with standalone NPV and advancing to integrated valuation.
- **Feedback Tone**: AI feedback is framed as a "senior analyst review," matching the mentorship model.
- **Precision Matters**: The deterministic grading engine enforces the professor's expectation of numerical accuracy.
