import { z } from "zod";

const weightsSchema = z.object({
  price: z.number().min(0).max(1),
  mileage: z.number().min(0).max(1),
  bodyType: z.number().min(0).max(1),
  fuelType: z.number().min(0).max(1),
  safetyRating: z.number().min(0).max(1)
});

export const recommendationRequestSchema = z
  .object({
    sessionId: z.string().min(3),
    preferences: z.object({
      budgetMin: z.number().nonnegative(),
      budgetMax: z.number().nonnegative(),
      preferredBodyTypes: z.array(z.string()).default([]),
      preferredFuelTypes: z.array(z.string()).default([]),
      minMileage: z.number().nonnegative(),
      minSafetyRating: z.number().min(0).max(5),
      importanceWeights: weightsSchema.optional()
    }),
    maxResults: z.number().int().positive().max(10).default(5)
  })
  .refine((value) => value.preferences.budgetMin <= value.preferences.budgetMax, {
    message: "budgetMin must be less than or equal to budgetMax",
    path: ["preferences", "budgetMin"]
  });

export type RecommendationRequestInput = z.infer<typeof recommendationRequestSchema>;
