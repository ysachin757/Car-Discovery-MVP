import { describe, expect, it } from "vitest";
import { CarRepository } from "../../repositories/carRepository";
import { RecommendationPreferences, ScoreBreakdown } from "../../types/dto";
import { Car } from "../../types/model";
import { RecommendationService } from "../recommendationService";

function makeCar(overrides: Partial<Car>): Car {
  return {
    id: "car_default",
    make: "Brand",
    model: "Model",
    variant: "Base",
    price: 1200000,
    mileage: 16,
    bodyType: "SUV",
    fuelType: "Petrol",
    transmission: "Manual",
    safetyRating: 4,
    userRating: 4.0,
    features: ["ABS"],
    reviewSummary: "Test",
    ...overrides
  };
}

const preferences: RecommendationPreferences = {
  budgetMin: 700000,
  budgetMax: 2000000,
  preferredBodyTypes: ["SUV"],
  preferredFuelTypes: [],
  minMileage: 14,
  minSafetyRating: 3
};

class ConstantScoringEngine {
  scoreCar(): ScoreBreakdown {
    return {
      total: 0.8,
      price: 1,
      mileage: 1,
      bodyType: 1,
      fuelType: 1,
      safetyRating: 1,
      reasons: ["Stable test score"]
    };
  }
}

describe("RecommendationService", () => {
  it("applies strict fuel pre-filter when preferredFuelTypes is provided", () => {
    const cars = [
      makeCar({ id: "petrol_1", fuelType: "Petrol", variant: "P1" }),
      makeCar({ id: "diesel_1", fuelType: "Diesel", variant: "D1" }),
      makeCar({ id: "diesel_2", fuelType: "Diesel", variant: "D2" })
    ];

    const repository = { getAllCars: () => cars } as CarRepository;
    const service = new RecommendationService(repository, new ConstantScoringEngine() as never);

    const result = service.generateRecommendations(
      {
        ...preferences,
        preferredFuelTypes: ["Diesel"]
      },
      5
    );

    expect(result.recommendations.length).toBe(2);
    expect(result.recommendations.every((item) => item.fuelType === "Diesel")).toBe(true);
  });

  it("uses tie-breakers: higher safety first, then lower price", () => {
    const cars = [
      makeCar({ id: "c1", safetyRating: 5, price: 1500000, variant: "Top" }),
      makeCar({ id: "c2", safetyRating: 4, price: 1100000, variant: "Mid" }),
      makeCar({ id: "c3", safetyRating: 5, price: 1300000, variant: "Value" })
    ];

    const repository = { getAllCars: () => cars } as CarRepository;
    const service = new RecommendationService(repository, new ConstantScoringEngine() as never);

    const result = service.generateRecommendations(preferences, 3);

    expect(result.recommendations.map((item) => item.carId)).toEqual(["c3", "c1", "c2"]);
    expect(result.recommendations[0].name).toContain("(Value)");
  });
});
