export function titleCase(value = "") {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatList(value) {
  return value?.trim() ? value : "Not provided";
}

export function formatPatientContext(input) {
  const parts = [];

  if (input.age) {
    parts.push(`${input.age}-year-old`);
  }

  if (input.gender) {
    parts.push(input.gender.toLowerCase());
  }

  if (input.severityLevel) {
    parts.push(`with ${input.severityLevel.toLowerCase()} severity`);
  }

  if (!parts.length) {
    return "The final plan should always be interpreted in context of a full clinical evaluation.";
  }

  return `This draft was contextualized for a ${parts.join(" ")} patient, but it still requires clinician review before use.`;
}
