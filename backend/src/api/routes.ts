import { Router } from "express";
import { recommendationController } from "./controllers/recommendationController";

export function createRoutes() {
  const router = Router();

  router.get("/health", recommendationController.getHealth);
  router.get("/questions", recommendationController.getQuestions);
  router.post("/recommendations", recommendationController.postRecommendations);
  router.get("/cars/:carId", recommendationController.getCarById);

  return router;
}
