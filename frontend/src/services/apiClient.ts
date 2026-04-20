import axios from "axios";
import { CarDetail, Question, RecommendationPayload, RecommendationResponse } from "../types/api";

function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!configured) {
    return "/api";
  }

  const cleaned = configured.replace(/\/+$/, "");

  // If a full URL is provided without a path, enforce /api to match backend routes.
  try {
    const url = new URL(cleaned);
    if (url.pathname === "" || url.pathname === "/") {
      return `${url.origin}/api`;
    }
    return cleaned;
  } catch {
    // Non-URL values (for example, relative paths) should still work.
    return cleaned;
  }
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
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
