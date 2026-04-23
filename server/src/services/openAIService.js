import { GoogleGenAI } from "@google/genai";
import { buildOpenAIPrompt } from "../utils/promptBuilder.js";
import { normalizeAIResponse } from "../utils/responseNormalizer.js";

function extractResponseText(response) {
  if (typeof response?.text === "string" && response.text.trim()) {
    return response.text;
  }

  const parts = response?.candidates?.[0]?.content?.parts || [];
  const text = parts
    .map((part) => part?.text || "")
    .join("")
    .trim();

  return text || "";
}

export async function maybeGenerateWithOpenAI(input, baseSample) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("Gemini generation skipped: GEMINI_API_KEY is not configured.");
    return null;
  }

  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: buildOpenAIPrompt(input, baseSample),
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 8192
      }
    });

    const rawText = extractResponseText(response);

    if (!rawText) {
      console.error("Gemini response did not include text output.", {
        model,
        response
      });
      return null;
    }

    try {
      return normalizeAIResponse(JSON.parse(rawText), input);
    } catch (error) {
      console.error("Gemini response parse failed.", {
        model,
        rawText,
        error
      });
      return null;
    }
  } catch (error) {
    console.error("Gemini request failed.", {
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause
    });
    return null;
  }
}
