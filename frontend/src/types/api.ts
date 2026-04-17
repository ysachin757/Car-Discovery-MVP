export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: "range" | "single-select" | "multi-select";
  label: string;
  min?: number;
  max?: number;
  options?: QuestionOption[];
}

export interface RecommendationPayload {
  sessionId: string;
  preferences: {
    budgetMin: number;
    budgetMax: number;
    preferredBodyTypes: string[];
    preferredFuelTypes: string[];
    minMileage: number;
    minSafetyRating: number;
  };
  maxResults: number;
}

export interface RecommendationItem {
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
  recommendations: RecommendationItem[];
}

export interface CarDetail {
  id: string;
  make: string;
  model: string;
  variant: string;
  price: number;
  mileage: number;
  bodyType: string;
  fuelType: string;
  transmission: string;
  safetyRating: number;
  userRating: number;
  reviewSummary: string;
  features: string[];
}
