const DEFAULT_DISCLAIMER =
  "Educational clinical-support draft only. This output describes possible or likely conditions and is not a final diagnosis, treatment plan, or substitute for examination by a licensed healthcare professional. Image findings and symptom patterns may overlap across many conditions, so clinician review is always required.";

const URGENT_RED_FLAGS = [
  "Seek urgent or emergency care now for severe breathing difficulty, blue lips, or rapidly worsening shortness of breath.",
  "Seek urgent or emergency care now for chest pain, fainting, seizures, new confusion, or altered mental status.",
  "Seek urgent or emergency care now for heavy bleeding, severe dehydration, inability to keep fluids down, or very low urine output.",
  "Seek urgent or emergency care now for rapidly spreading rash with facial swelling, airway symptoms, or signs of anaphylaxis.",
  "Seek urgent or emergency care now for very high fever in infants, frail older adults, pregnant patients, or immunocompromised patients."
];

export function getDisclaimer() {
  return DEFAULT_DISCLAIMER;
}

export function mergeRedFlags(redFlags = []) {
  return [...new Set([...redFlags, ...URGENT_RED_FLAGS])];
}

export function normalizeConfidence(label) {
  const normalized = String(label || "").trim().toLowerCase();

  if (["high", "medium", "low"].includes(normalized)) {
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  return "Low";
}

export function softenConditionName(value) {
  return value?.trim() || "Possible condition under review";
}
