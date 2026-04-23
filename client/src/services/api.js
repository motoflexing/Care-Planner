const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  let response;
  const isFormData = options.body instanceof FormData;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: isFormData
        ? undefined
        : {
            "Content-Type": "application/json"
          },
      credentials: "include",
      ...options
    });
  } catch (error) {
    console.error("API request failed:", {
      url: `${API_BASE}${path}`,
      error
    });
    throw new Error(
      "Unable to connect to the Care Planner server. Please make sure the backend is running on http://localhost:4000."
    );
  }

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const payload = await response.json();
      message = payload.message || message;
    } catch (_error) {
      message = response.statusText || message;
    }

    console.error("API response error:", {
      url: `${API_BASE}${path}`,
      status: response.status,
      message
    });
    throw new Error(message);
  }

  return response.json();
}

export async function generatePlan(payload) {
  if (payload.intakeMode === "image") {
    return request("/plans/analyze-image", {
      method: "POST",
      body: JSON.stringify({
        imageBase64: payload.imageBase64,
        fileName: payload.imageName,
        mimeType: payload.imageMimeType,
        age: payload.age,
        gender: payload.gender,
        specialNotes: payload.specialNotes,
        contextNotes: payload.contextNotes,
        severityLevel: payload.severityLevel
      })
    });
  }

  if (payload.intakeMode === "symptom") {
    return request("/plans/analyze-symptoms", {
      method: "POST",
      body: JSON.stringify({
        symptoms: payload.symptoms,
        duration: payload.duration,
        severityLevel: payload.severityLevel,
        age: payload.age,
        gender: payload.gender,
        medicalHistory: payload.medicalHistory,
        allergies: payload.allergies,
        vitals: payload.vitals,
        specialNotes: payload.specialNotes
      })
    });
  }

  return request("/plans/generate", {
    method: "POST",
    body: JSON.stringify({
      condition: payload.condition,
      age: payload.age,
      gender: payload.gender,
      severityLevel: payload.severityLevel,
      symptoms: payload.symptoms,
      comorbidities: payload.comorbidities,
      allergies: payload.allergies,
      vitals: payload.vitals,
      labFindings: payload.labFindings,
      specialNotes: payload.specialNotes,
      basicMode: payload.basicMode
    })
  });
}

export async function fetchHistory() {
  const payload = await request("/plans/history");
  return payload.history;
}

export async function fetchFavorites() {
  const payload = await request("/plans/favorites");
  return payload.favorites;
}

export async function toggleFavoritePlan(id) {
  return request(`/plans/favorite/${id}`, {
    method: "POST"
  });
}

export async function fetchSamples() {
  const payload = await request("/plans/samples");
  return payload.samples;
}
