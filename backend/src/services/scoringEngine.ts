import { RecommendationPreferences, ScoreBreakdown } from "../types/dto";
import { Car } from "../types/model";

const DEFAULT_WEIGHTS = {
  price: 0.3,
  mileage: 0.2,
  bodyType: 0.15,
  fuelType: 0.15,
  safetyRating: 0.2
};

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export class ScoringEngine {
  scoreCar(car: Car, preferences: RecommendationPreferences): ScoreBreakdown {
    const weights = this.normalizeWeights(preferences.importanceWeights || DEFAULT_WEIGHTS);

    const price = this.scorePrice(car, preferences);
    const mileage = this.scoreMileage(car, preferences);
    const bodyType = this.scoreBodyType(car, preferences);
    const fuelType = this.scoreFuelType(car, preferences);
    const safetyRating = this.scoreSafety(car, preferences);

    const total =
      price * weights.price +
      mileage * weights.mileage +
      bodyType * weights.bodyType +
      fuelType * weights.fuelType +
      safetyRating * weights.safetyRating;

    const reasons: string[] = [];
    if (price >= 0.9) reasons.push("Within budget");
    if (bodyType === 1) reasons.push("Matches preferred body type");
    if (fuelType === 1) reasons.push("Matches preferred fuel type");
    if (safetyRating >= 0.9) reasons.push("Above safety threshold");
    if (mileage >= 0.85) reasons.push("Good mileage fit");

    return {
      total: clamp(total),
      price,
      mileage,
      bodyType,
      fuelType,
      safetyRating,
      reasons: reasons.slice(0, 4)
    };
  }

  private normalizeWeights(weights: typeof DEFAULT_WEIGHTS): typeof DEFAULT_WEIGHTS {
    const sum = Object.values(weights).reduce((acc, curr) => acc + curr, 0);
    if (sum === 0) {
      return DEFAULT_WEIGHTS;
    }

    return {
      price: weights.price / sum,
      mileage: weights.mileage / sum,
      bodyType: weights.bodyType / sum,
      fuelType: weights.fuelType / sum,
      safetyRating: weights.safetyRating / sum
    };
  }

  private scorePrice(car: Car, preferences: RecommendationPreferences): number {
    const { budgetMin, budgetMax } = preferences;
    if (car.price >= budgetMin && car.price <= budgetMax) {
      return 1;
    }

    const range = Math.max(1, budgetMax - budgetMin);
    if (car.price < budgetMin) {
      return clamp(1 - (budgetMin - car.price) / range);
    }

    return clamp(1 - (car.price - budgetMax) / range);
  }

  private scoreMileage(car: Car, preferences: RecommendationPreferences): number {
    if (car.mileage >= preferences.minMileage) {
      return 1;
    }

    return clamp(car.mileage / Math.max(1, preferences.minMileage));
  }

  private scoreBodyType(car: Car, preferences: RecommendationPreferences): number {
    if (!preferences.preferredBodyTypes.length) {
      return 0.7;
    }

    return preferences.preferredBodyTypes.includes(car.bodyType) ? 1 : 0;
  }

  private scoreFuelType(car: Car, preferences: RecommendationPreferences): number {
    if (!preferences.preferredFuelTypes.length) {
      return 0.7;
    }

    return preferences.preferredFuelTypes.includes(car.fuelType) ? 1 : 0;
  }

  private scoreSafety(car: Car, preferences: RecommendationPreferences): number {
    if (car.safetyRating >= preferences.minSafetyRating) {
      return 1;
    }

    return clamp(car.safetyRating / Math.max(1, preferences.minSafetyRating));
  }
}
