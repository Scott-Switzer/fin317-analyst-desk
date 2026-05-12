export interface MockFeedback {
  summary: string;
  what_went_right: string[];
  what_to_fix: string[];
  concept_misunderstandings: string[];
  next_step: string;
  senior_analyst_review: string;
  confidence: number;
  professor_review_recommended: boolean;
}

export function generateMockFeedback(
  score: number,
  flags: Record<string, boolean>
): MockFeedback {
  const incorrectFields = Object.entries(flags)
    .filter(([k, v]) => k !== "recommendation" && !v)
    .map(([k]) => k);

  const hasRecommendationError = !flags["recommendation"];

  if (score >= 85) {
    return {
      summary:
        "Strong quantitative foundation with clear reasoning. Minor refinements will elevate this to publishable quality.",
      what_went_right: [
        "WACC components were calculated accurately and weights summed to 1.0.",
        "Capital budgeting metrics (NPV, IRR, MIRR) were consistent with each other.",
        "Recommendation was explicitly tied to the NPV decision rule.",
      ],
      what_to_fix: [
        "Add sensitivity analysis commentary for future missions.",
        "Cite the specific WACC formula used for traceability.",
      ],
      concept_misunderstandings: [],
      next_step:
        "Proceed to the next mission. Consider mentoring peers on the WACC weighting step.",
      senior_analyst_review: "Approved with minor notes.",
      confidence: 0.92,
      professor_review_recommended: false,
    };
  }

  if (score >= 70) {
    return {
      summary:
        "Solid effort with good structural organization. Some numerical errors propagated into the recommendation.",
      what_went_right: [
        "The memo structure followed the standard analyst format.",
        "Most formulas were named correctly.",
      ],
      what_to_fix: [
        `Review these fields: ${incorrectFields.join(", ") || "none flagged"}.`,
        hasRecommendationError
          ? "The recommendation contradicts the NPV evidence. Reconcile the numbers with the conclusion."
          : "Ensure the recommendation explicitly references the dominant capital budgeting metric.",
      ],
      concept_misunderstandings: incorrectFields.length > 0 ? ["Review component cost calculations"] : [],
      next_step: "Retry the calculation worksheet before resubmitting.",
      senior_analyst_review: "Needs revision — see comments above.",
      confidence: 0.78,
      professor_review_recommended: incorrectFields.length > 2,
    };
  }

  return {
    summary:
      "This submission needs significant revision. Several core calculations are incorrect, and the recommendation lacks quantitative support.",
    what_went_right: [
      "The student attempted all required fields.",
      "The memo included a recommendation section.",
    ],
    what_to_fix: [
      `Incorrect fields: ${incorrectFields.join(", ") || "multiple"}.`,
      hasRecommendationError
        ? "Recommendation does not align with calculated metrics."
        : "Strengthen the link between metrics and recommendation.",
      "Review the WACC formula and ensure market-value weights are used.",
    ],
    concept_misunderstandings: [
      "Market value vs. book value weights",
      "After-tax cost of debt",
      "NPV decision rule",
    ],
    next_step:
      "Review the chapter 10 toolkit and retry the mission. Schedule office hours if needed.",
    senior_analyst_review: "Requires substantial rework.",
    confidence: 0.85,
    professor_review_recommended: true,
  };
}
