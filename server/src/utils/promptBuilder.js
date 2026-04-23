export function buildOpenAIPrompt(input, baseSample) {
  return `
You are generating an educational healthcare draft care plan. Never present final medical advice, never claim certainty, and always include urgent care warnings for red-flag symptoms.

Return strict JSON with these keys:
- condition
- confidenceLabel
- overview
- keyFindings
- possibleConditions
- differentialConsiderations
- reasoningSummary
- suggestedDiagnosticTests
- suggestedNextSteps
- patientSummary
- meta
- medicalCarePlan
- nursingCarePlan
- patientEducationPlan
- disclaimer

Each plan must include:
- condition overview
- common causes / pathophysiology
- symptoms and signs
- assessment findings
- diagnostic investigations
- medical management
- drug categories commonly used
- nursing diagnoses
- nursing interventions with rationales
- monitoring parameters
- red-flag / emergency signs
- patient education
- diet and lifestyle advice
- discharge planning
- references / guideline placeholder
- disclaimer

Avoid patient-specific dosing. If mentioning drug examples, clearly label as example only and not patient-specific.

Patient input:
${JSON.stringify(input, null, 2)}

Base sample content:
${JSON.stringify(baseSample || {}, null, 2)}
`.trim();
}
