import { v4 as uuid } from "uuid";
import { CarRepository } from "../repositories/carRepository";
import {
  CarWithScore,
  RecommendationPreferences,
  RecommendationResponse,
  ScoredRecommendation
} from "../types/dto";
import { ScoringEngine } from "./scoringEngine";

export class RecommendationService {
  constructor(
    private readonly repository: CarRepository,
    private readonly scoringEngine: ScoringEngine
  ) {}

  generateRecommendations(
    preferences: RecommendationPreferences,
    maxResults: number
  ): RecommendationResponse {
    const cars = this.repository.getAllCars();
    const carsByFuel = preferences.preferredFuelTypes.length
      ? cars.filter((car) => preferences.preferredFuelTypes.includes(car.fuelType))
      : cars;

    if (!carsByFuel.length) {
      return {
        requestId: uuid(),
        recommendations: []
      };
    }

    const scored: CarWithScore[] = carsByFuel.map((car) => {
      const breakdown = this.scoringEngine.scoreCar(car, preferences);
      return {
        ...car,
        breakdown,
        score: breakdown.total
      };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.safetyRating !== a.safetyRating) return b.safetyRating - a.safetyRating;
      return a.price - b.price;
    });

    const recommendations: ScoredRecommendation[] = scored.slice(0, maxResults).map((car, idx) => ({
      rank: idx + 1,
      carId: car.id,
      name: `${car.make} ${car.model} (${car.variant})`,
      price: car.price,
      mileage: car.mileage,
      bodyType: car.bodyType,
      fuelType: car.fuelType,
      rating: car.userRating,
      score: Number(car.score.toFixed(2)),
      reasons: car.breakdown.reasons.length ? car.breakdown.reasons : ["Overall best match"]
    }));

    return {
      requestId: uuid(),
      recommendations
    };
  }
}
