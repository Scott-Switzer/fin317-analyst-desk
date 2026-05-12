export interface FeedbackPromptParams {
  missionContext: string;
  learningObjectives: string[];
  deterministicGradingSummary: Record<string, boolean>;
  studentMemo: string;
  correctDecisionSummary: string;
}

export function createFeedbackPrompt(params: FeedbackPromptParams): string {
  return `You are a senior financial analyst reviewing a junior analyst's work on a finance mission.

## MISSION CONTEXT
${params.missionContext}

## LEARNING OBJECTIVES
${params.learningObjectives.map((o) => `- ${o}`).join("\n")}

## DETERMINISTIC GRADING SUMMARY (provided by automated grader)
The following numerical fields were graded deterministically:
${Object.entries(params.deterministicGradingSummary)
  .map(([field, correct]) => `- ${field}: ${correct ? "CORRECT" : "INCORRECT"}`)
  .join("\n")}

## CORRECT DECISION SUMMARY
${params.correctDecisionSummary}

## STUDENT MEMO
${params.studentMemo}

## YOUR ROLE
Evaluate the student's written reasoning ONLY. Do NOT calculate or override the numerical score. The automated grader owns all numerical evaluations.

Provide formative feedback in structured JSON:
{
  "summary": "string",
  "what_went_right": ["string"],
  "what_to_fix": ["string"],
  "concept_misunderstandings": ["string"],
  "next_step": "string",
  "senior_analyst_review": "string",
  "confidence": number (0-1),
  "professor_review_recommended": boolean
}

Tone: professional senior analyst. Be direct, encouraging, and reference course concepts by name. Do not reveal answer keys. Output ONLY valid JSON.`;
}
