import { sampleConditions } from "../data/sampleConditions.js";
import { formatList, formatPatientContext, titleCase } from "../utils/formatters.js";
import { createPlanId, createReferenceText, todayLabel } from "../utils/meta.js";
import {
  getDisclaimer,
  mergeRedFlags,
  normalizeConfidence,
  softenConditionName
} from "./safetyFormatter.js";

function buildPatientSummary(input) {
  return {
    mode: input.intakeMode || (input.basicMode ? "condition-basic" : "condition-detailed"),
    age: input.age || "Not provided",
    gender: input.gender || "Not provided",
    severityLevel: input.severityLevel || "Not provided",
    symptoms: formatList(input.symptoms),
    duration: input.duration || "Not provided",
    comorbidities: formatList(input.comorbidities || input.medicalHistory),
    allergies: formatList(input.allergies),
    vitals: input.vitals || "Not provided",
    labFindings: input.labFindings || "Not provided",
    specialNotes: input.specialNotes || "Not provided",
    imageName: input.fileName || "Not provided",
    imageContext: input.contextNotes || "Not provided"
  };
}

function defaultMonitoring(input, conditionName) {
  return [
    `Track symptom progression for the likely condition pattern related to ${conditionName}.`,
    input.vitals
      ? `Review available vitals: ${input.vitals}.`
      : "Monitor vital signs and escalate if instability, severe pain, or respiratory compromise develops.",
    "Trend oral intake, hydration, function, and new red-flag symptoms."
  ];
}

function buildBasePlan({
  input,
  source,
  conditionName,
  confidenceLabel,
  overview,
  keyFindings,
  differentialConsiderations,
  suggestedDiagnosticTests,
  medicalManagement,
  nursingDiagnoses,
  nursingInterventions,
  monitoringParameters,
  patientEducation,
  dietLifestyleAdvice,
  redFlagWarnings,
  reasoningSummary,
  suggestedNextSteps,
  keyVisualFindings,
  pathophysiology,
  symptomsAndSigns,
  assessmentFindings,
  drugCategories,
  dischargePlanning
}) {
  const mergedRedFlags = mergeRedFlags(redFlagWarnings);

  return {
    id: createPlanId(),
    createdAt: new Date().toISOString(),
    intakeMode: input.intakeMode || "condition",
    condition: softenConditionName(conditionName),
    confidenceLabel: normalizeConfidence(confidenceLabel),
    overview,
    keyFindings,
    keyVisualFindings: keyVisualFindings || [],
    possibleConditions: [
      {
        name: softenConditionName(conditionName),
        likelihood: normalizeConfidence(confidenceLabel),
        summary: reasoningSummary || overview
      },
      ...differentialConsiderations.slice(0, 3).map((item) => ({
        name: item,
        likelihood: "Possible alternative",
        summary: "Consider during clinician evaluation because symptom and image overlap is common."
      }))
    ],
    differentialConsiderations,
    reasoningSummary:
      reasoningSummary ||
      "This result is a clinical-support draft that highlights a possible or likely condition pattern and should be reviewed by a licensed healthcare professional.",
    suggestedDiagnosticTests,
    suggestedNextSteps: suggestedNextSteps || [],
    patientSummary: buildPatientSummary(input),
    meta: {
      generatedOn: todayLabel(),
      source,
      note: "Outputs use cautious wording and should support, not replace, clinician assessment."
    },
    medicalCarePlan: {
      conditionOverview: overview,
      commonCausesPathophysiology:
        pathophysiology ||
        `${softenConditionName(conditionName)} should be clinically confirmed because symptoms and visible findings can overlap with multiple conditions.`,
      symptomsAndSigns: symptomsAndSigns || keyFindings,
      assessmentFindings: assessmentFindings || keyFindings,
      diagnosticInvestigations: suggestedDiagnosticTests,
      recommendedMedicalEvaluation: suggestedDiagnosticTests,
      medicalManagement,
      drugCategoriesCommonlyUsed:
        drugCategories ||
        [
          "Category-level treatment choices should be determined by a licensed clinician.",
          "Avoid patient-specific prescribing or dosing based on this draft alone."
        ],
      monitoringParameters:
        monitoringParameters?.length ? monitoringParameters : defaultMonitoring(input, conditionName),
      redFlagEmergencySigns: mergedRedFlags,
      dischargePlanning:
        dischargePlanning ||
        [
          "Ensure clinician-reviewed follow-up and reassessment based on severity and response.",
          "Reinforce red-flag instructions and reasons to seek emergency care promptly.",
          "Update the plan after examination, diagnostics, and formal diagnosis."
        ],
      referencesGuidelinePlaceholder: createReferenceText(conditionName)
    },
    nursingCarePlan: {
      nursingDiagnoses,
      nursingInterventions,
      patientEducation,
      dietAndLifestyleAdvice: dietLifestyleAdvice
    },
    patientEducationPlan: {
      patientEducation,
      dietAndLifestyleAdvice: dietLifestyleAdvice,
      monitoringAtHome:
        monitoringParameters?.length ? monitoringParameters : defaultMonitoring(input, conditionName),
      followUpAdvice:
        suggestedNextSteps?.length
          ? suggestedNextSteps
          : [
              "Seek clinician follow-up for confirmation, testing, and refined management.",
              "Return sooner if symptoms worsen, new red flags appear, or hydration or breathing becomes difficult."
            ]
    },
    disclaimer: getDisclaimer()
  };
}

export function buildMockPlan(input, baseSample) {
  const condition = titleCase(input.condition);
  const patientContext = formatPatientContext(input);
  const overview = baseSample?.overview
    ? `${baseSample.overview} ${patientContext}`
    : `${condition} is a possible clinical condition that requires confirmation, severity assessment, and individualized management. ${patientContext}`;

  const symptoms = baseSample?.symptoms || [
    "Presentation may vary and can include disease-specific symptoms plus general malaise.",
    "Severity and urgency depend on progression, comorbidities, and physiologic reserve."
  ];

  const investigations = baseSample?.diagnostics || [
    "Focused history and physical examination",
    "Baseline laboratory testing guided by symptoms and risks",
    "Condition-specific imaging or functional studies when clinically indicated"
  ];

  const medicalManagement = baseSample?.medicalManagement || [
    "Confirm the likely diagnosis and assess severity before escalating treatment.",
    "Address reversible triggers, stabilize urgent issues, and individualize clinician-reviewed therapy.",
    "Coordinate specialist input when the presentation is severe, atypical, or refractory."
  ];

  const nursingDiagnoses = baseSample?.nursingDiagnoses || [
    "Knowledge deficit related to disease process and self-management needs",
    "Risk for complications related to progression of illness and comorbid factors",
    "Activity intolerance or impaired comfort depending on symptom burden"
  ];

  const nursingInterventions = baseSample?.nursingInterventions || [
    {
      intervention: "Perform focused assessment and trend symptoms, vitals, and response to care.",
      rationale:
        "Trending clinical status helps identify deterioration early and supports timely escalation."
    },
    {
      intervention: "Provide condition-specific education using clear, repeatable instructions.",
      rationale:
        "Patient understanding improves adherence, safety, and confidence after discharge."
    },
    {
      intervention: "Reinforce medication safety, allergy review, and follow-up planning.",
      rationale:
        "Medication errors and missed follow-up can worsen outcomes and increase readmission risk."
    }
  ];

  const patientEducation = baseSample?.patientEducation || [
    "Explain that the result is an educational draft and must be reviewed by a qualified clinician.",
    "Teach warning signs that require urgent medical care.",
    "Encourage medication adherence, follow-up, and symptom tracking."
  ];

  const dietLifestyleAdvice = baseSample?.diet || baseSample?.lifestyle || [
    "Optimize hydration, nutrition, sleep, mobility, and stress management as tolerated.",
    "Avoid known triggers and review home safety or fall-risk concerns when relevant.",
    "Adapt activity level to current symptoms and clinician guidance."
  ];

  return buildBasePlan({
    input,
    source: baseSample ? "mock-sample-enhanced" : "mock-general",
    conditionName: condition,
    confidenceLabel: baseSample ? "Medium" : "Low",
    overview,
    keyFindings: symptoms,
    differentialConsiderations: [
      `Alternative causes of symptoms overlapping with ${condition}`,
      "Medication-related or metabolic contributors",
      "Condition mimics that require focused examination"
    ],
    suggestedDiagnosticTests: investigations,
    medicalManagement,
    nursingDiagnoses,
    nursingInterventions,
    monitoringParameters: defaultMonitoring(input, condition),
    patientEducation,
    dietLifestyleAdvice,
    redFlagWarnings: baseSample?.redFlags || [
      "Rapidly worsening breathing difficulty, chest pain, confusion, or syncope.",
      "New neurologic deficits, severe dehydration, uncontrolled bleeding, or marked weakness."
    ],
    reasoningSummary:
      input.basicMode
        ? `This draft is based mainly on the entered condition name and should be treated as a suggested care-planning match for ${condition}.`
        : `Patient context makes ${condition} a suggested match, but a clinician should verify the final diagnosis and priorities.`,
    pathophysiology: baseSample?.pathophysiology,
    symptomsAndSigns: symptoms,
    assessmentFindings: [
      `Assess symptom onset, progression, and severity.${input.symptoms ? ` Reported symptoms: ${input.symptoms}.` : ""}`,
      input.comorbidities
        ? `Review comorbidities that may alter management: ${input.comorbidities}.`
        : "Screen for comorbid illness, functional decline, and medication interactions.",
      input.allergies
        ? `Confirm allergies before treatment decisions: ${input.allergies}.`
        : "Confirm allergies and prior adverse reactions before medication use."
    ],
    drugCategories: baseSample?.drugCategories
  });
}

export function buildSymptomPlan(input, analysis) {
  return buildBasePlan({
    input,
    source: analysis.source,
    conditionName: analysis.possibleCondition,
    confidenceLabel: analysis.confidenceLabel,
    overview: analysis.overview,
    keyFindings: analysis.keyFindings,
    differentialConsiderations: analysis.differentialConsiderations,
    suggestedDiagnosticTests: analysis.suggestedDiagnosticTests,
    medicalManagement: analysis.medicalManagement,
    nursingDiagnoses: analysis.nursingDiagnoses,
    nursingInterventions: analysis.nursingInterventions,
    monitoringParameters: analysis.monitoringParameters,
    patientEducation: analysis.patientEducation,
    dietLifestyleAdvice: analysis.dietLifestyleAdvice,
    redFlagWarnings: analysis.redFlagWarnings,
    reasoningSummary: analysis.reasoningSummary,
    suggestedNextSteps: [
      "Review the symptom timeline with a licensed healthcare professional.",
      ...analysis.suggestedDiagnosticTests.slice(0, 2),
      "Use emergency services sooner if any red-flag symptoms develop."
    ]
  });
}

export function buildImagePlan(input, analysis) {
  return buildBasePlan({
    input,
    source: analysis.source,
    conditionName: analysis.possibleCondition,
    confidenceLabel: analysis.confidenceLabel,
    overview: analysis.overview,
    keyFindings: analysis.keyVisualFindings,
    keyVisualFindings: analysis.keyVisualFindings,
    differentialConsiderations: analysis.differentialConsiderations,
    suggestedDiagnosticTests: analysis.suggestedDiagnosticTests,
    medicalManagement: analysis.medicalManagement,
    nursingDiagnoses: analysis.nursingDiagnoses,
    nursingInterventions: analysis.nursingInterventions,
    monitoringParameters: analysis.monitoringParameters,
    patientEducation: analysis.patientEducation,
    dietLifestyleAdvice: analysis.dietLifestyleAdvice,
    redFlagWarnings: analysis.redFlagWarnings,
    reasoningSummary:
      "Image-only review can suggest a possible condition pattern, but many conditions look similar and a clinician should confirm the true diagnosis.",
    suggestedNextSteps: analysis.suggestedNextSteps
  });
}

export function findBaseSample(condition) {
  return (
    sampleConditions.find(
      (item) => item.condition.toLowerCase() === condition.toLowerCase().trim()
    ) ||
    sampleConditions.find((item) =>
      condition.toLowerCase().includes(item.condition.toLowerCase())
    ) ||
    null
  );
}
