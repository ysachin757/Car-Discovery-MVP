import { describe, expect, it } from "vitest";
import { ScoringEngine } from "../scoringEngine";
import { RecommendationPreferences } from "../../types/dto";
import { Car } from "../../types/model";

const baseCar: Car = {
  id: "car_1",
  make: "Test",
  model: "Model",
  variant: "ZX",
  price: 1200000,
  mileage: 18,
  bodyType: "SUV",
  fuelType: "Diesel",
  transmission: "Manual",
  safetyRating: 4,
  userRating: 4.2,
  features: ["ABS"],
  reviewSummary: "Test car"
};

const basePreferences: RecommendationPreferences = {
  budgetMin: 700000,
  budgetMax: 1500000,
  preferredBodyTypes: ["SUV"],
  preferredFuelTypes: ["Diesel"],
  minMileage: 16,
  minSafetyRating: 4
};

describe("ScoringEngine", () => {
  it("keeps score total normalized between 0 and 1", () => {
    const engine = new ScoringEngine();
    const result = engine.scoreCar(baseCar, {
      ...basePreferences,
      importanceWeights: {
        price: 10,
        mileage: 10,
        bodyType: 10,
        fuelType: 10,
        safetyRating: 10
      }
    });

    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(1);
  });

  it("uses fallback fuel/body scores when no preferences are provided", () => {
    const engine = new ScoringEngine();
    const result = engine.scoreCar(baseCar, {
      ...basePreferences,
      preferredBodyTypes: [],
      preferredFuelTypes: []
    });

    expect(result.bodyType).toBe(0.7);
    expect(result.fuelType).toBe(0.7);
  });
});
