export function validatePlanForm(formData) {
  const errors = {};

  if (formData.intakeMode === "condition" && !formData.condition.trim()) {
    errors.condition = "Condition name is required.";
  }

  if (formData.intakeMode === "symptom" && !formData.symptoms.trim()) {
    errors.symptoms = "Symptoms are required.";
  }

  if (formData.intakeMode === "image" && !formData.imageBase64) {
    errors.image = "An image is required for image analysis mode.";
  }

  if (formData.age && Number.isNaN(Number(formData.age))) {
    errors.age = "Age must be numeric.";
  }

  if (formData.age && (Number(formData.age) < 0 || Number(formData.age) > 120)) {
    errors.age = "Age must be between 0 and 120.";
  }

  return errors;
}
