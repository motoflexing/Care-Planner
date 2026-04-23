import { analyzeImage } from "./imageAnalysisService.js";
import { buildImagePlan, buildMockPlan, buildSymptomPlan, findBaseSample } from "./planBuilder.js";
import { maybeGenerateWithOpenAI } from "./openAIService.js";
import { analyzeSymptoms } from "./symptomAnalysisService.js";

export async function generateCarePlan(input) {
  const baseSample = findBaseSample(input.condition);

  const aiPlan = await maybeGenerateWithOpenAI(input, baseSample);

  if (aiPlan) {
    return aiPlan;
  }

  return buildMockPlan(input, baseSample);
}

export async function generateSymptomCarePlan(input) {
  const analysis = await analyzeSymptoms(input);
  return buildSymptomPlan(input, analysis);
}

export async function generateImageCarePlan(input) {
  const analysis = await analyzeImage(input);
  return buildImagePlan(input, analysis);
}
