import axios from "axios";
import { CarDetail, Question, RecommendationPayload, RecommendationResponse } from "../types/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000
});

export async function getQuestions(): Promise<Question[]> {
  const response = await api.get<{ questions: Question[] }>("/questions");
  return response.data.questions;
}

export async function getRecommendations(payload: RecommendationPayload): Promise<RecommendationResponse> {
  const response = await api.post<RecommendationResponse>("/recommendations", payload);
  return response.data;
}

export async function getCarDetail(carId: string): Promise<CarDetail> {
  const response = await api.get<CarDetail>(`/cars/${carId}`);
  return response.data;
}
