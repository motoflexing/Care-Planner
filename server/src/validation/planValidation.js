const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
];
const EXTENSION_MIME_MAP = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif"
};

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseAge(value) {
  const age = sanitizeText(value);

  if (!age) {
    return "";
  }

  if (Number.isNaN(Number(age))) {
    const error = new Error("Age must be a number if provided.");
    error.status = 400;
    throw error;
  }

  if (Number(age) < 0 || Number(age) > 120) {
    const error = new Error("Age must be between 0 and 120.");
    error.status = 400;
    throw error;
  }

  return age;
}

function parseBaseInput(payload = {}) {
  return {
    age: parseAge(payload.age),
    gender: sanitizeText(payload.gender),
    severityLevel: sanitizeText(payload.severityLevel),
    symptoms: sanitizeText(payload.symptoms),
    allergies: sanitizeText(payload.allergies),
    vitals: sanitizeText(payload.vitals),
    specialNotes: sanitizeText(payload.specialNotes)
  };
}

function createValidationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export function createPlanInputSchema() {
  return {
    routes: {
      generate: {
        required: ["condition"],
        optional: [
          "age",
          "gender",
          "severityLevel",
          "symptoms",
          "comorbidities",
          "allergies",
          "vitals",
          "labFindings",
          "specialNotes",
          "basicMode"
        ]
      },
      analyzeSymptoms: {
        required: ["symptoms"],
        optional: [
          "duration",
          "severityLevel",
          "age",
          "gender",
          "medicalHistory",
          "allergies",
          "vitals",
          "specialNotes"
        ]
      },
      analyzeImage: {
        required: ["imageBase64", "fileName", "mimeType"],
        optional: ["age", "gender", "severityLevel", "specialNotes", "contextNotes"]
      }
    }
  };
}

export function parsePlanRequest(payload = {}) {
  const input = {
    condition: sanitizeText(payload.condition),
    ...parseBaseInput(payload),
    comorbidities: sanitizeText(payload.comorbidities),
    labFindings: sanitizeText(payload.labFindings),
    basicMode: Boolean(payload.basicMode),
    intakeMode: "condition"
  };

  if (!input.condition) {
    throw createValidationError("Condition name is required.");
  }

  return input;
}

export function parseSymptomRequest(payload = {}) {
  const input = {
    ...parseBaseInput(payload),
    duration: sanitizeText(payload.duration),
    medicalHistory: sanitizeText(payload.medicalHistory),
    intakeMode: "symptom"
  };

  if (!input.symptoms) {
    throw createValidationError("Symptoms are required for symptom description mode.");
  }

  return input;
}

export function parseImageRequest(payload = {}) {
  const imageBase64 = sanitizeText(payload.imageBase64);
  const fileName = sanitizeText(payload.fileName);
  const mimeType =
    sanitizeText(payload.mimeType) || inferMimeTypeFromFileName(fileName);

  if (!imageBase64 || !fileName || !mimeType) {
    throw createValidationError("Image file, filename, and mime type are required.");
  }

  if (!mimeType.startsWith("image/") || !SUPPORTED_IMAGE_TYPES.includes(mimeType)) {
    throw createValidationError("Only supported image files such as JPG, PNG, WEBP, or HEIC can be analyzed.");
  }

  const imageSizeBytes = Buffer.byteLength(imageBase64, "base64");

  if (imageSizeBytes > MAX_IMAGE_SIZE_BYTES) {
    throw createValidationError("Image must be 5 MB or smaller.");
  }

  return {
    ...parseBaseInput(payload),
    imageBase64,
    fileName,
    mimeType,
    contextNotes: sanitizeText(payload.contextNotes),
    intakeMode: "image"
  };
}

function inferMimeTypeFromFileName(fileName) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  return EXTENSION_MIME_MAP[extension] || "";
}
