import { buildOpenAIPrompt } from "../utils/promptBuilder.js";
import { normalizeAIResponse } from "../utils/responseNormalizer.js";

export async function maybeGenerateWithOpenAI(input, baseSample) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: buildOpenAIPrompt(input, baseSample),
      text: {
        format: {
          type: "json_object"
        }
      }
    })
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("OpenAI request failed:", details);
    return null;
  }

  const payload = await response.json();
  const rawText = payload.output_text;

  if (!rawText) {
    return null;
  }

  try {
    return normalizeAIResponse(JSON.parse(rawText), input);
  } catch (error) {
    console.error("OpenAI response parse failed:", error);
    return null;
  }
}
