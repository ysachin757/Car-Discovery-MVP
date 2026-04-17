import { useEffect, useState } from "react";
import { CarDetailPanel } from "../components/CarDetail/CarDetailPanel";
import { QuestionnaireForm } from "../components/Questionnaire/QuestionnaireForm";
import { RecommendationList } from "../components/RecommendationList/RecommendationList";
import { getCarDetail, getRecommendations } from "../services/apiClient";
import { loadShortlist, saveShortlist } from "../state/sessionStore";
import { CarDetail, RecommendationItem, RecommendationPayload } from "../types/api";

export function HomePage() {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existingShortlist = loadShortlist();
    if (existingShortlist.length) {
      setItems(existingShortlist);
    }
  }, []);

  const handleSubmit = async (values: RecommendationPayload["preferences"]) => {
    try {
      setError(null);
      const payload: RecommendationPayload = {
        sessionId: `sess_${Date.now()}`,
        preferences: values,
        maxResults: 5
      };

      const response = await getRecommendations(payload);
      setItems(response.recommendations);
      saveShortlist(response.recommendations);
      setSelectedCar(null);
    } catch {
      setError("Failed to generate recommendations. Please try again.");
    }
  };

  const handleSelectCar = async (carId: string) => {
    try {
      setError(null);
      const detail = await getCarDetail(carId);
      setSelectedCar(detail);
    } catch {
      setError("Unable to load car details.");
    }
  };

  return (
    <main className="layout">
      <section className="hero panel">
        <div className="hero-copy">
          <span className="eyebrow">AI-native car discovery</span>
          <h1>Find the right car without getting overwhelmed.</h1>
          <p className="muted">
            Answer a few preferences, get a ranked shortlist, and inspect the best matches in one session.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <strong>20+</strong>
            <span>mock cars</span>
          </div>
          <div className="stat-card">
            <strong>1</strong>
            <span>guided flow</span>
          </div>
          <div className="stat-card">
            <strong>0</strong>
            <span>login required</span>
          </div>
        </div>
      </section>
      {error && <p className="error">{error}</p>}
      <QuestionnaireForm onSubmit={handleSubmit} />
      <RecommendationList items={items} onSelect={handleSelectCar} />
      <CarDetailPanel car={selectedCar} />
    </main>
  );
}
