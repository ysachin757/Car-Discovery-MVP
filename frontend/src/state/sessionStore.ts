import { RecommendationItem } from "../types/api";

const PREFERENCES_KEY = "recommendation_preferences";
const SHORTLIST_KEY = "recommendation_shortlist";

export function savePreferences(payload: unknown): void {
  sessionStorage.setItem(PREFERENCES_KEY, JSON.stringify(payload));
}

export function loadPreferences<T>(): T | null {
  const raw = sessionStorage.getItem(PREFERENCES_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function saveShortlist(shortlist: RecommendationItem[]): void {
  sessionStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlist));
}

export function loadShortlist(): RecommendationItem[] {
  const raw = sessionStorage.getItem(SHORTLIST_KEY);
  return raw ? (JSON.parse(raw) as RecommendationItem[]) : [];
}

export function clearSessionData(): void {
  sessionStorage.removeItem(PREFERENCES_KEY);
  sessionStorage.removeItem(SHORTLIST_KEY);
}
