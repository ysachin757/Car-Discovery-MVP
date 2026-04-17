import { Car } from "./model";

export interface ImportanceWeights {
  price: number;
  mileage: number;
  bodyType: number;
  fuelType: number;
  safetyRating: number;
}

export interface RecommendationPreferences {
  budgetMin: number;
  budgetMax: number;
  preferredBodyTypes: string[];
  preferredFuelTypes: string[];
  minMileage: number;
  minSafetyRating: number;
  importanceWeights?: ImportanceWeights;
}

export interface RecommendationRequest {
  sessionId: string;
  preferences: RecommendationPreferences;
  maxResults?: number;
}

export interface ScoredRecommendation {
  rank: number;
  carId: string;
  name: string;
  price: number;
  mileage: number;
  bodyType: string;
  fuelType: string;
  rating: number;
  score: number;
  reasons: string[];
}

export interface RecommendationResponse {
  requestId: string;
  recommendations: ScoredRecommendation[];
}

export interface AppErrorShape {
  statusCode: number;
  errorCode: string;
  message: string;
  details?: unknown;
}

export interface ScoreBreakdown {
  total: number;
  price: number;
  mileage: number;
  bodyType: number;
  fuelType: number;
  safetyRating: number;
  reasons: string[];
}

export type CarWithScore = Car & { breakdown: ScoreBreakdown; score: number };
