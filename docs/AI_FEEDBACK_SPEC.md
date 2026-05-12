# FIN 317 Analyst Desk — AI Feedback Specification

## Purpose

The AI feedback engine provides qualitative, educational feedback on student investment memos. It supplements the deterministic grading system by evaluating reasoning, structure, and conceptual understanding.

## Scope

- The AI **evaluates memo text**.
- The AI **compares the student's recommendation** (e.g., Buy/Hold/Sell) against the **deterministic calculation result**.
- The AI **identifies reasoning errors**, logical gaps, and conceptual misunderstandings.
- The AI **does NOT calculate the official score**. Scoring is strictly deterministic.

## Input

```json
{
  "scenarioId": "project-falcon",
  "studentMemo": {
    "recommendation": "Approve",
    "rationale": "The project has a positive NPV of $2.3M...",
    "riskAssessment": "...",
    "appendix": "..."
  },
  "deterministicResult": {
    "score": 78,
    "maxScore": 100,
    "expectedNPV": 2314567.89,
    "studentNPV": 2300000.00,
    "expectedIRR": 0.145,
    "studentIRR": 0.143,
    "recommendationMatch": true
  }
}
```

## Output Schema

The AI must return a JSON object with the following fields:

```json
{
  "summary": "string — 1-2 sentence overall assessment.",
  "what_went_right": ["string — specific strengths in the memo."],
  "what_to_fix": ["string — specific weaknesses or missing elements."],
  "concept_misunderstandings": ["string — identified conceptual errors (e.g., confusing operating cash flow with net income)."],
  "next_step": "string — concrete, actionable advice for the student to improve.",
  "senior_analyst_review": "string — tone of a senior analyst providing mentorship, 2-3 sentences.",
  "confidence": "number — 0.0 to 1.0 representing the AI's confidence in its feedback.",
  "professor_review_recommended": "boolean — true if the submission shows unusual patterns, possible cheating, or concepts so misunderstood that human intervention is needed."
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `summary` | string | Brief, encouraging but honest assessment. |
| `what_went_right` | string[] | Bullet points highlighting good reasoning, correct calculations, or strong structure. |
| `what_to_fix` | string[] | Bullet points on what is missing, incorrect, or poorly explained. |
| `concept_misunderstandings` | string[] | Specific finance concepts the student appears to misunderstand. Empty if none detected. |
| `next_step` | string | One concrete action the student should take before the next mission. |
| `senior_analyst_review` | string | Written in character as a senior analyst at the fictional bank. |
| `confidence` | number | AI's confidence. Low confidence (< 0.6) should trigger a flag for professor review. |
| `professor_review_recommended` | boolean | True if the AI detects anomalies or severe misunderstanding. |

## Prompt Engineering Guidelines

- The system prompt must instruct the AI to act as a senior investment analyst reviewing a junior's memo.
- The prompt must reference the deterministic result for numerical accuracy checks.
- The prompt must forbid the AI from assigning a numeric grade.
- The prompt must request the output in the exact JSON schema above.
- Temperature should be set low (0.2–0.4) for consistent formatting.

## Error Handling

If the AI returns malformed JSON or times out:
1. Log the error.
2. Return a fallback message: "Your memo has been received. Detailed feedback is being prepared. Please check back shortly."
3. Flag for backend review.
