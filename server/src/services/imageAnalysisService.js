function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

const IMAGE_CASES = [
  {
    id: "dermatitis-like",
    match(input) {
      const source = `${input.fileName} ${input.contextNotes} ${input.specialNotes}`.toLowerCase();
      return includesAny(source, ["rash", "dermatitis", "eczema", "skin", "itch", "red"]);
    },
    analysis: {
      possibleCondition: "Possible dermatitis or eczema-like rash",
      confidenceLabel: "Medium",
      overview:
        "The visible pattern appears broadly consistent with a possible superficial inflammatory rash such as dermatitis or eczema, but image-only review is limited and cannot exclude infection, allergy, psoriasis, or other dermatoses.",
      keyVisualFindings: [
        "Patchy erythematous change with a superficial rash-like appearance",
        "Possible dry or irritated skin pattern without enough context to confirm cause",
        "Distribution, texture, warmth, pain, and full-body context remain uncertain from a single image"
      ],
      suggestedNextSteps: [
        "Arrange clinician review if the rash is spreading, painful, blistering, or associated with fever.",
        "Review recent triggers such as new soaps, topical products, medications, or exposures.",
        "Consider photo documentation over time and in-person skin examination if symptoms persist."
      ],
      differentialConsiderations: [
        "Allergic or irritant contact dermatitis",
        "Atopic eczema flare",
        "Fungal rash or superficial infection",
        "Psoriasis or other inflammatory dermatosis"
      ],
      suggestedDiagnosticTests: [
        "Clinical skin examination",
        "Patch testing or focused exposure history when relevant",
        "Skin scraping or swab only if infection or fungal disease is suspected"
      ],
      medicalManagement: [
        "Management should depend on clinician review of symptoms, distribution, chronicity, and signs of infection.",
        "Avoid assuming image-only certainty; worsening rash may require prompt in-person assessment.",
        "Do not begin prescription-strength treatments without licensed review."
      ],
      nursingDiagnoses: [
        "Impaired skin integrity",
        "Risk for secondary skin infection",
        "Knowledge deficit related to trigger avoidance and skin care"
      ],
      nursingInterventions: [
        {
          intervention: "Assess skin extent, drainage, pain, itch severity, and trigger history.",
          rationale:
            "Visible appearance alone can miss severity and associated complications."
        },
        {
          intervention: "Teach gentle skin care, trigger avoidance, and when to seek urgent review.",
          rationale:
            "Supportive education can reduce irritation and help identify complications early."
        }
      ],
      monitoringParameters: [
        "Spread, color change, swelling, drainage, or blistering",
        "Pain, itch severity, fever, or systemic symptoms",
        "Response to basic skin-protection measures"
      ],
      patientEducation: [
        "Explain that the image suggests a possible rash pattern but is not a diagnosis.",
        "Avoid scratching, harsh cleansers, and unreviewed medicated products.",
        "Seek prompt care if the rash rapidly spreads or signs of infection appear."
      ],
      dietLifestyleAdvice: [
        "Use fragrance-free skin products and avoid known irritants.",
        "Keep nails short and reduce scratching when possible.",
        "Track new exposures, foods, or medications if flare triggers are uncertain."
      ],
      redFlagWarnings: [
        "Facial swelling, breathing difficulty, widespread blistering, or rapidly spreading rash.",
        "Skin pain with fever, purulent drainage, or concern for cellulitis."
      ]
    }
  }
];

const DEFAULT_ANALYSIS = {
  possibleCondition: "Possible condition suggested by limited image review",
  confidenceLabel: "Low",
  overview:
    "The uploaded image may contain features that are consistent with a possible condition, but image-only interpretation is limited and should never be treated as a final diagnosis.",
  keyVisualFindings: [
    "Visible abnormalities may be present, but lighting, angle, focus, and missing clinical context limit interpretation.",
    "Many skin, eye, wound, or swelling-related conditions can look similar on images alone.",
    "A clinician may need examination, palpation, testing, or serial photos to clarify the picture."
  ],
  suggestedNextSteps: [
    "Arrange clinical review if symptoms are worsening, painful, or associated with fever or other systemic features.",
    "Document when the appearance started, what changed, and whether there were relevant exposures or injuries.",
    "Use the image as supportive context, not a stand-alone answer."
  ],
  differentialConsiderations: [
    "Inflammatory condition",
    "Infectious process",
    "Traumatic, vascular, or allergic change"
  ],
  suggestedDiagnosticTests: [
    "Focused examination and history review",
    "Targeted swab, scraping, or imaging only if clinically indicated",
    "Repeat images or specialist review if the appearance evolves"
  ],
  medicalManagement: [
    "A clinician should decide whether the appearance needs urgent evaluation, testing, or treatment.",
    "Avoid overinterpreting a single image without symptom context.",
    "Do not use this draft to self-prescribe medications."
  ],
  nursingDiagnoses: [
    "Risk for delayed evaluation related to uncertain presentation",
    "Knowledge deficit regarding warning signs and follow-up"
  ],
  nursingInterventions: [
    {
      intervention: "Document visible changes and associated symptoms clearly.",
      rationale:
        "Accurate descriptions can improve clinician interpretation and follow-up planning."
    }
  ],
  monitoringParameters: [
    "Change in size, redness, swelling, drainage, or pain",
    "Associated fever or systemic symptoms",
    "Time course and response to supportive care"
  ],
  patientEducation: [
    "Images can support triage but do not replace examination.",
    "Seek earlier care if symptoms worsen or urgent warning signs appear."
  ],
  dietLifestyleAdvice: [
    "Protect the affected area and avoid irritants until reviewed.",
    "Do not share topical medicines or use non-prescribed steroid or antibiotic products."
  ],
  redFlagWarnings: [
    "Rapid swelling, severe pain, fever, or spreading redness.",
    "Breathing difficulty, facial involvement, or signs of allergic emergency."
  ]
};

export async function analyzeImage(input) {
  const matchedCase = IMAGE_CASES.find((entry) => entry.match(input)) || null;

  return {
    source: matchedCase ? `mock-image-${matchedCase.id}` : "mock-image-general",
    ...(matchedCase?.analysis || DEFAULT_ANALYSIS)
  };
}
