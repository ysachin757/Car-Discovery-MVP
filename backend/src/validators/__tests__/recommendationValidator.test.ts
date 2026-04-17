import { describe, expect, it } from "vitest";
import { recommendationRequestSchema } from "../recommendationValidator";

describe("recommendationRequestSchema", () => {
  it("applies defaults and parses a valid payload", () => {
    const parsed = recommendationRequestSchema.parse({
      sessionId: "sess_001",
      preferences: {
        budgetMin: 700000,
        budgetMax: 1500000,
        preferredBodyTypes: ["SUV"],
        preferredFuelTypes: ["Diesel"],
        minMileage: 16,
        minSafetyRating: 4
      }
    });

    expect(parsed.maxResults).toBe(5);
    expect(parsed.preferences.preferredFuelTypes).toEqual(["Diesel"]);
  });

  it("rejects payload when budgetMin is greater than budgetMax", () => {
    expect(() =>
      recommendationRequestSchema.parse({
        sessionId: "sess_001",
        preferences: {
          budgetMin: 1600000,
          budgetMax: 1500000,
          preferredBodyTypes: [],
          preferredFuelTypes: [],
          minMileage: 15,
          minSafetyRating: 3
        },
        maxResults: 5
      })
    ).toThrowError("budgetMin must be less than or equal to budgetMax");
  });
});
