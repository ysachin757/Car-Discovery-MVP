export interface Car {
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
  features: string[];
  reviewSummary: string;
}

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: "range" | "single-select" | "multi-select";
  label: string;
  options?: QuestionOption[];
  min?: number;
  max?: number;
}
