export const sampleConditions = [
  {
    id: "diabetes-mellitus",
    condition: "Diabetes Mellitus",
    summary: "Chronic metabolic disorder with hyperglycemia requiring glycemic monitoring and complication prevention.",
    overview:
      "Diabetes Mellitus is a chronic metabolic disorder marked by persistent hyperglycemia that can affect vascular, renal, neurologic, and ophthalmic health over time.",
    pathophysiology:
      "It commonly involves impaired insulin secretion, insulin resistance, or both, leading to dysregulated glucose metabolism and long-term organ damage risk.",
    symptoms: [
      "Polyuria, polydipsia, fatigue, blurred vision, recurrent infections, and weight change",
      "In some patients, slow wound healing, neuropathic symptoms, or asymptomatic hyperglycemia"
    ],
    diagnostics: [
      "Capillary and laboratory blood glucose measurements",
      "HbA1c testing",
      "Renal function, urine albumin screening, lipid profile, and foot or eye assessments as indicated"
    ],
    medicalManagement: [
      "Assess glycemic status, hydration, and possible acute complications such as severe hyperglycemia or ketosis.",
      "Support individualized glucose-lowering therapy, lifestyle counseling, and cardiovascular risk reduction.",
      "Screen for chronic complications and optimize follow-up for eye, foot, kidney, and blood pressure care."
    ],
    drugCategories: [
      "Insulin preparations",
      "Biguanides and other oral antihyperglycemic classes",
      "Cardiometabolic agents used when clinically appropriate"
    ],
    nursingDiagnoses: [
      "Risk for unstable blood glucose level",
      "Knowledge deficit related to disease self-management",
      "Risk for impaired skin integrity related to neuropathy or poor healing"
    ],
    nursingInterventions: [
      {
        intervention: "Monitor blood glucose trends and observe for hypo- or hyperglycemia symptoms.",
        rationale:
          "Early recognition of abnormal glucose trends supports timely intervention and reduces complication risk."
      },
      {
        intervention: "Teach medication, meal planning, foot care, and self-monitoring routines.",
        rationale:
          "Structured education improves self-management, safety, and long-term adherence."
      },
      {
        intervention: "Assess skin, peripheral sensation, hydration status, and wound concerns.",
        rationale:
          "Diabetes can impair healing and sensation, increasing infection and ulcer risk."
      }
    ],
    redFlags: [
      "Confusion, vomiting, deep rapid breathing, severe dehydration, or suspected diabetic ketoacidosis",
      "Altered consciousness, seizures, or severe hypoglycemia symptoms",
      "Chest pain, stroke-like symptoms, or rapidly worsening infection"
    ],
    patientEducation: [
      "Reinforce that glucose goals and medicines should be reviewed by a qualified clinician.",
      "Teach hypoglycemia and hyperglycemia warning signs and when to seek urgent care.",
      "Encourage routine foot checks, medication adherence, and regular follow-up."
    ],
    lifestyle: [
      "Use a balanced, portion-aware meal pattern and regular physical activity as tolerated.",
      "Prioritize smoking cessation, weight optimization, and sleep quality.",
      "Monitor glucose as advised and keep a symptom or reading log."
    ],
    diet: [
      "Favor high-fiber foods, balanced carbohydrates, lean protein, and unsweetened fluids.",
      "Limit sugar-sweetened beverages and highly processed foods.",
      "Coordinate meal timing with clinician-advised monitoring and therapy."
    ]
  },
  {
    id: "pneumonia",
    condition: "Pneumonia",
    summary: "Lower respiratory infection that may cause cough, fever, dyspnea, and oxygenation issues.",
    overview:
      "Pneumonia is an infection or inflammatory process of the lung parenchyma that can impair gas exchange and lead to systemic illness.",
    pathophysiology:
      "Alveolar inflammation and exudate reduce ventilation and oxygen transfer, with severity influenced by the infectious cause, host factors, and comorbid disease.",
    symptoms: [
      "Cough, fever, shortness of breath, pleuritic chest discomfort, fatigue, and sputum production",
      "Older adults may present with confusion, weakness, or reduced intake rather than classic symptoms"
    ],
    diagnostics: [
      "Respiratory examination and oxygenation assessment",
      "Chest imaging when clinically indicated",
      "Blood tests, sputum studies, or cultures based on severity and setting"
    ],
    medicalManagement: [
      "Assess respiratory distress, oxygenation, hydration, and sepsis risk.",
      "Provide supportive care and likely pathogen-directed therapy based on clinical context and guidelines.",
      "Escalate care if hypoxia, hemodynamic instability, or rapid deterioration is present."
    ],
    drugCategories: [
      "Antimicrobial classes selected by suspected cause and care setting",
      "Antipyretic and symptom-relief medications",
      "Bronchodilator or adjunctive therapies when clinically appropriate"
    ],
    nursingDiagnoses: [
      "Impaired gas exchange",
      "Ineffective airway clearance",
      "Activity intolerance related to infection and reduced oxygenation"
    ],
    nursingInterventions: [
      {
        intervention: "Monitor respiratory rate, work of breathing, pulse oximetry, and mental status.",
        rationale:
          "Respiratory decline can become urgent quickly and may be signaled by subtle changes."
      },
      {
        intervention: "Promote pulmonary hygiene, positioning, hydration, and rest as tolerated.",
        rationale:
          "These measures can help mobilize secretions and reduce the work of breathing."
      },
      {
        intervention: "Administer and reinforce ordered therapies while observing for response or adverse effects.",
        rationale:
          "Close observation helps determine whether treatment is improving the infection and oxygenation."
      }
    ],
    redFlags: [
      "Severe shortness of breath, cyanosis, confusion, or low oxygen saturation",
      "Persistent chest pain, sepsis concerns, or inability to maintain hydration",
      "Rapid clinical worsening despite treatment"
    ],
    patientEducation: [
      "Teach medication adherence, hydration, rest, and when to return urgently.",
      "Encourage vaccination review, hand hygiene, and smoking avoidance.",
      "Explain that older adults and patients with comorbid illness may deteriorate faster."
    ],
    lifestyle: [
      "Rest and increase activity gradually as recovery allows.",
      "Avoid tobacco smoke and respiratory irritants.",
      "Maintain hydration and nutrition while monitoring breathing tolerance."
    ],
    diet: [
      "Use fluids and easy-to-tolerate meals to support hydration and energy needs.",
      "Choose soft or nutrient-dense foods if appetite is low.",
      "Seek review if oral intake is worsening or swallowing is difficult."
    ]
  },
  {
    id: "hypertension",
    condition: "Hypertension",
    summary: "Elevated blood pressure requiring risk assessment, monitoring, and long-term cardiovascular prevention.",
    overview:
      "Hypertension is persistent elevated blood pressure that increases long-term risk of stroke, heart disease, kidney disease, and other vascular complications.",
    pathophysiology:
      "It often results from multifactorial vascular, renal, endocrine, and lifestyle influences that increase systemic vascular resistance or fluid burden.",
    symptoms: [
      "Often asymptomatic",
      "Some patients may report headache, dizziness, or nonspecific symptoms, though these are not reliable indicators of severity"
    ],
    diagnostics: [
      "Repeated blood pressure measurement using correct technique",
      "Assessment for target-organ effects and cardiovascular risk",
      "Renal function, electrolytes, urine testing, and other studies based on context"
    ],
    medicalManagement: [
      "Confirm the blood pressure pattern and assess for hypertensive urgency or emergency features.",
      "Address lifestyle modification, cardiovascular risk reduction, and medication needs based on overall risk.",
      "Arrange follow-up to evaluate home readings, adherence, and treatment tolerance."
    ],
    drugCategories: [
      "Diuretics",
      "ACE inhibitors, ARBs, calcium channel blockers, or other antihypertensive classes",
      "Additional cardiovascular risk-reduction therapies when indicated"
    ],
    nursingDiagnoses: [
      "Risk for decreased cardiac output",
      "Deficient knowledge related to blood pressure control",
      "Ineffective health maintenance related to long-term adherence challenges"
    ],
    nursingInterventions: [
      {
        intervention: "Trend blood pressure carefully and assess for symptoms suggesting acute end-organ involvement.",
        rationale:
          "Severely elevated blood pressure can become a medical emergency if organ injury develops."
      },
      {
        intervention: "Teach home blood pressure monitoring technique and medication consistency.",
        rationale:
          "Reliable home readings and adherence improve treatment decisions and long-term control."
      },
      {
        intervention: "Counsel on diet, sodium awareness, activity, sleep, and alcohol moderation.",
        rationale:
          "Lifestyle factors strongly influence long-term blood pressure control and cardiovascular risk."
      }
    ],
    redFlags: [
      "Chest pain, severe shortness of breath, new neurologic symptoms, or severe headache with visual changes",
      "Confusion, syncope, or signs of acute kidney or heart failure",
      "Markedly elevated blood pressure with symptoms suggesting end-organ damage"
    ],
    patientEducation: [
      "Explain that blood pressure treatment is individualized and should be reviewed by a clinician.",
      "Reinforce home monitoring, follow-up, and adherence even when symptoms are absent.",
      "Teach emergency warning signs that require urgent medical evaluation."
    ],
    lifestyle: [
      "Limit sodium, stay active, maintain healthy weight, and moderate alcohol use.",
      "Support stress reduction, sleep health, and smoking cessation.",
      "Track blood pressure trends and bring logs to follow-up visits."
    ],
    diet: [
      "Use a DASH-style pattern with fruits, vegetables, whole grains, and lean protein.",
      "Reduce excess sodium and ultra-processed foods.",
      "Discuss individualized goals if kidney disease, heart failure, or other comorbidities are present."
    ]
  }
];
