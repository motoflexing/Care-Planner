export const DEFAULT_FORM = {
  intakeMode: "condition",
  condition: "",
  imageFile: null,
  imagePreviewUrl: "",
  imageName: "",
  imageMimeType: "",
  imageBase64: "",
  contextNotes: "",
  age: "",
  gender: "",
  severityLevel: "",
  symptoms: "",
  duration: "",
  medicalHistory: "",
  comorbidities: "",
  allergies: "",
  vitals: "",
  labFindings: "",
  specialNotes: "",
  basicMode: true
};

export const SAMPLE_PROMPTS = [
  "Diabetes Mellitus",
  "Pneumonia",
  "Hypertension"
];

export const STORAGE_KEYS = {
  currentPlan: "care-planner-current-plan",
  history: "care-planner-history",
  favorites: "care-planner-favorites",
  darkMode: "care-planner-dark-mode",
  authUsers: "care-planner-auth-users",
  authSession: "care-planner-auth-session"
};
