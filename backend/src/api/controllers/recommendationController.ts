import { Request, Response, NextFunction } from "express";
import { CarRepository } from "../../repositories/carRepository";
import { RecommendationService } from "../../services/recommendationService";
import { ScoringEngine } from "../../services/scoringEngine";
import { recommendationRequestSchema } from "../../validators/recommendationValidator";

const repository = new CarRepository();
const recommendationService = new RecommendationService(repository, new ScoringEngine());

export const recommendationController = {
  getHealth(_req: Request, res: Response) {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString()
    });
  },

  getQuestions(_req: Request, res: Response, next: NextFunction) {
    try {
      const questions = repository.getQuestions();
      res.status(200).json({ questions });
    } catch (error) {
      next(error);
    }
  },

  getCarById(req: Request, res: Response, next: NextFunction) {
    try {
      const car = repository.getCarById(req.params.carId);
      res.status(200).json(car);
    } catch (error) {
      next(error);
    }
  },

  postRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = recommendationRequestSchema.parse(req.body);
      const result = recommendationService.generateRecommendations(payload.preferences, payload.maxResults || 5);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
