function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

const SYMPTOM_CASES = [
  {
    id: "pneumonia-like",
    match(input) {
      const source = `${input.symptoms} ${input.vitals} ${input.specialNotes}`.toLowerCase();
      return includesAny(source, ["cough", "fever", "shortness of breath", "dyspnea", "spO2".toLowerCase()]);
    },
    analysis: {
      possibleCondition: "Possible pneumonia or lower respiratory infection",
      confidenceLabel: "Medium",
      overview:
        "The symptom pattern is reasonably consistent with a possible lower respiratory infection such as pneumonia, though overlap with viral syndromes, bronchitis, heart failure, and pulmonary embolic disease is possible.",
      reasoningSummary:
        "Cough, fever, dyspnea, pleuritic discomfort, reduced oxygen saturation, or systemic illness together increase concern for a lung infection that may need in-person assessment.",
      keyFindings: [
        "Respiratory symptoms with infectious features may suggest lower airway or parenchymal involvement.",
        "Reported breathing difficulty or low oxygen readings raise urgency for prompt clinical evaluation.",
        "Older adults and medically vulnerable patients can present atypically with weakness or confusion."
      ],
      differentialConsiderations: [
        "Bronchitis or viral respiratory infection",
        "Heart failure exacerbation",
        "Asthma or COPD flare",
        "Pulmonary embolic disease when symptoms are sudden or severe"
      ],
      suggestedDiagnosticTests: [
        "Pulse oximetry and focused respiratory examination",
        "Chest X-ray or other imaging as clinically indicated",
        "CBC, inflammatory markers, and pathogen-directed tests depending on setting",
        "Additional sepsis or cardiac evaluation if instability is present"
      ],
      medicalManagement: [
        "Prompt medical evaluation to assess oxygenation, work of breathing, and dehydration risk.",
        "Supportive care decisions and likely pathogen-directed treatment should be clinician-guided.",
        "Escalate urgently if hypoxia, sepsis concerns, or rapid deterioration are present."
      ],
      nursingDiagnoses: [
        "Impaired gas exchange",
        "Ineffective airway clearance",
        "Activity intolerance related to infection burden"
      ],
      nursingInterventions: [
        {
          intervention: "Monitor respiratory effort, oxygen saturation, temperature, and mental status closely.",
          rationale:
            "Subtle deterioration can precede more serious respiratory compromise."
        },
        {
          intervention: "Promote rest, hydration, pulmonary hygiene, and safe positioning as tolerated.",
          rationale:
            "These measures may reduce work of breathing and support secretion clearance."
        },
        {
          intervention: "Reinforce urgent reassessment if breathing worsens or oral intake declines.",
          rationale:
            "Pneumonia-like illness can worsen quickly, especially in high-risk patients."
        }
      ],
      monitoringParameters: [
        "Respiratory rate, work of breathing, and pulse oximetry",
        "Temperature trend and hydration status",
        "Mental status, oral intake, and fatigue level"
      ],
      patientEducation: [
        "Explain that symptoms may fit a possible pneumonia pattern but require clinician review.",
        "Encourage hydration, rest, and close observation of breathing symptoms.",
        "Review return precautions for worsening cough, confusion, chest pain, or low oxygen readings."
      ],
      dietLifestyleAdvice: [
        "Use fluids and easy-to-tolerate meals if appetite is low.",
        "Avoid smoking, vaping, and respiratory irritants.",
        "Increase activity gradually as breathing improves and a clinician advises."
      ],
      redFlagWarnings: [
        "Worsening shortness of breath, cyanosis, confusion, or inability to speak full sentences.",
        "Persistent chest pain, severe weakness, or inability to maintain hydration."
      ]
    }
  },
  {
    id: "diabetes-like",
    match(input) {
      const source = `${input.symptoms} ${input.medicalHistory} ${input.specialNotes}`.toLowerCase();
      return includesAny(source, ["thirst", "polyuria", "frequent urination", "weight loss", "blurred vision", "high sugar"]);
    },
    analysis: {
      possibleCondition: "Possible diabetes mellitus or symptomatic hyperglycemia",
      confidenceLabel: "Medium",
      overview:
        "The symptom cluster is consistent with a possible diabetes-related presentation, but other endocrine, infectious, renal, and medication-related explanations remain possible.",
      reasoningSummary:
        "Polydipsia, polyuria, fatigue, weight change, blurred vision, and recurrent infections together raise concern for hyperglycemia that should be medically assessed.",
      keyFindings: [
        "Classic osmotic symptoms can align with elevated blood glucose states.",
        "Unintentional weight loss or recurrent infections may suggest prolonged poor glycemic control.",
        "Overlap exists with urinary disease, dehydration, medication effects, and endocrine disorders."
      ],
      differentialConsiderations: [
        "Urinary tract pathology or diuretic effect",
        "Thyroid disease or other endocrine disorders",
        "Diabetes insipidus or significant dehydration",
        "Medication-related hyperglycemia"
      ],
      suggestedDiagnosticTests: [
        "Capillary or laboratory blood glucose testing",
        "HbA1c measurement",
        "Urinalysis, renal function, and electrolyte review",
        "Ketone assessment if markedly unwell or vomiting"
      ],
      medicalManagement: [
        "Obtain clinician-guided glucose testing and assess for dehydration or acute metabolic complications.",
        "Treatment decisions should remain clinician-directed and may involve lifestyle, education, and medication review.",
        "Escalate quickly if vomiting, confusion, deep breathing, or severe weakness are present."
      ],
      nursingDiagnoses: [
        "Risk for unstable blood glucose level",
        "Deficient knowledge related to self-management needs",
        "Risk for fluid volume deficit"
      ],
      nursingInterventions: [
        {
          intervention: "Trend symptoms, hydration status, and glucose data if available.",
          rationale:
            "Early recognition of worsening hyperglycemia or dehydration supports safer escalation."
        },
        {
          intervention: "Reinforce symptom logging, follow-up planning, and foot-skin observation.",
          rationale:
            "Structured self-monitoring helps identify complications earlier."
        },
        {
          intervention: "Review sick-day warning signs and reasons to seek urgent care.",
          rationale:
            "Acute metabolic deterioration can become serious quickly."
        }
      ],
      monitoringParameters: [
        "Glucose readings if available",
        "Hydration status and urine output",
        "Visual changes, nausea, vomiting, and mental status"
      ],
      patientEducation: [
        "Explain that the pattern may suggest a possible diabetes-related issue but is not a final diagnosis.",
        "Encourage prompt lab review and follow-up with a licensed clinician.",
        "Teach warning signs of severe hyperglycemia and dehydration."
      ],
      dietLifestyleAdvice: [
        "Stay hydrated unless a clinician has given fluid restrictions.",
        "Avoid high-sugar beverages while awaiting medical review.",
        "Track meals, symptoms, and any glucose readings for follow-up."
      ],
      redFlagWarnings: [
        "Vomiting, confusion, deep rapid breathing, severe dehydration, or fainting.",
        "Very high glucose readings with worsening weakness or abdominal pain."
      ]
    }
  }
];

const DEFAULT_ANALYSIS = {
  possibleCondition: "Possible undifferentiated condition requiring clinical review",
  confidenceLabel: "Low",
  overview:
    "The provided symptoms suggest a possible medical issue that needs confirmation through history, examination, and appropriate testing. Symptom overlap across many conditions limits certainty.",
  reasoningSummary:
    "The available details are useful for a draft clinical-support note, but they are not specific enough to determine a final diagnosis.",
  keyFindings: [
    "Symptom analysis can suggest likely patterns but cannot replace examination or testing.",
    "Severity, duration, age, and comorbidities can substantially change urgency and interpretation.",
    "A clinician should review the full presentation before decisions are made."
  ],
  differentialConsiderations: [
    "Acute infection or inflammatory process",
    "Medication-related or metabolic problem",
    "Organ-system condition that needs focused examination"
  ],
  suggestedDiagnosticTests: [
    "Focused history and physical examination",
    "Basic vital-sign review and targeted laboratory testing",
    "Imaging or specialist assessment only as clinically indicated"
  ],
  medicalManagement: [
    "Use clinician-reviewed evaluation to confirm the most likely cause.",
    "Supportive care and escalation should depend on symptom severity and red flags.",
    "Avoid self-prescribing medications or dosing based on this draft."
  ],
  nursingDiagnoses: [
    "Knowledge deficit regarding symptom significance and escalation",
    "Risk for complications related to evolving illness",
    "Anxiety or impaired comfort related to symptom burden"
  ],
  nursingInterventions: [
    {
      intervention: "Perform ongoing symptom assessment and trend key changes over time.",
      rationale:
        "Trend data helps clinicians identify deterioration, triggers, and urgency."
    },
    {
      intervention: "Reinforce safety-net instructions and reasons to seek urgent evaluation.",
      rationale:
        "Patients may delay care when symptoms are nonspecific unless red flags are clearly explained."
    }
  ],
  monitoringParameters: [
    "Symptom intensity and duration",
    "Vital signs if known",
    "New red-flag features or rapid clinical change"
  ],
  patientEducation: [
    "Keep a clear symptom timeline for review with a licensed clinician.",
    "Do not treat this output as a final diagnosis.",
    "Seek earlier medical review if symptoms are worsening or unusual."
  ],
  dietLifestyleAdvice: [
    "Maintain hydration and rest as tolerated.",
    "Avoid known triggers and monitor for progression.",
    "Use clinician guidance before starting medicines or supplements."
  ],
  redFlagWarnings: [
    "Rapid worsening symptoms, severe pain, or new neurologic changes.",
    "Persistent vomiting, fainting, or signs of significant dehydration."
  ]
};

export async function analyzeSymptoms(input) {
  const matchedCase =
    SYMPTOM_CASES.find((entry) => entry.match(input)) || null;

  return {
    source: matchedCase ? `mock-symptom-${matchedCase.id}` : "mock-symptom-general",
    ...(matchedCase?.analysis || DEFAULT_ANALYSIS)
  };
}
