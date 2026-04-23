import { Router } from "express";
import {
  generateCarePlan,
  generateImageCarePlan,
  generateSymptomCarePlan
} from "../services/carePlanService.js";
import {
  createPlanInputSchema,
  parseImageRequest,
  parsePlanRequest,
  parseSymptomRequest
} from "../validation/planValidation.js";
import { planStore } from "../store/planStore.js";
import { sampleConditions } from "../data/sampleConditions.js";

export function createPlanRouter() {
  const router = Router();

  router.get("/samples", (_req, res) => {
    res.json({
      samples: sampleConditions.map((item) => ({
        id: item.id,
        condition: item.condition,
        summary: item.summary
      }))
    });
  });

  router.get("/history", (_req, res) => {
    res.json({
      history: planStore.listHistory()
    });
  });

  router.get("/favorites", (_req, res) => {
    res.json({
      favorites: planStore.listFavorites()
    });
  });

  router.post("/generate", async (req, res, next) => {
    try {
      const input = parsePlanRequest(req.body);
      const plan = await generateCarePlan(input);
      const saved = planStore.savePlan(plan);
      res.json(saved);
    } catch (error) {
      next(error);
    }
  });

  router.post("/analyze-symptoms", async (req, res, next) => {
    try {
      const input = parseSymptomRequest(req.body);
      const plan = await generateSymptomCarePlan(input);
      const saved = planStore.savePlan(plan);
      res.json(saved);
    } catch (error) {
      next(error);
    }
  });

  router.post("/analyze-image", async (req, res, next) => {
    try {
      const input = parseImageRequest(req.body);
      const plan = await generateImageCarePlan(input);
      const saved = planStore.savePlan(plan);
      res.json(saved);
    } catch (error) {
      next(error);
    }
  });

  router.post("/favorite/:id", (req, res) => {
    const updated = planStore.toggleFavorite(req.params.id);
    if (!updated) {
      return res.status(404).json({ message: "Plan not found." });
    }

    return res.json(updated);
  });

  router.get("/schema/input", (_req, res) => {
    res.json(createPlanInputSchema());
  });

  router.get("/:id", (req, res) => {
    const plan = planStore.getById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    return res.json(plan);
  });

  return router;
}
