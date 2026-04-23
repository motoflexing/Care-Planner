export function normalizeAIResponse(payload, input) {
  return {
    id: payload.id || `plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    intakeMode: input.intakeMode || "condition",
    condition: payload.condition || input.condition,
    confidenceLabel: payload.confidenceLabel || "Low",
    overview:
      payload.overview ||
      payload.medicalCarePlan?.conditionOverview ||
      "Possible condition draft pending clinician review.",
    keyFindings: payload.keyFindings || payload.medicalCarePlan?.symptomsAndSigns || [],
    keyVisualFindings: payload.keyVisualFindings || [],
    possibleConditions: payload.possibleConditions || [],
    differentialConsiderations: payload.differentialConsiderations || [],
    reasoningSummary:
      payload.reasoningSummary ||
      "AI-generated clinical-support draft that should be verified by a licensed healthcare professional.",
    suggestedDiagnosticTests:
      payload.suggestedDiagnosticTests ||
      payload.medicalCarePlan?.diagnosticInvestigations ||
      [],
    suggestedNextSteps: payload.suggestedNextSteps || [],
    patientSummary: payload.patientSummary || {
      mode: input.basicMode ? "basic" : "personalized"
    },
    meta: payload.meta || {
      source: "gemini",
      note: "Output may vary depending on patient-specific factors and local protocols."
    },
    medicalCarePlan: payload.medicalCarePlan || {},
    nursingCarePlan: payload.nursingCarePlan || {},
    patientEducationPlan: payload.patientEducationPlan || {},
    disclaimer:
      payload.disclaimer ||
      "Educational and clinical-support drafting content only. Review with a licensed healthcare professional."
  };
}
